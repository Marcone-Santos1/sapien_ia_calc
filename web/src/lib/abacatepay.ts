const ABACATEPAY_API_KEY = process.env.ABACATEPAY_API_KEY || '';
const BASE_URL = 'https://api.abacatepay.com/v2';

interface HeadersInit {
  [key: string]: string;
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ABACATEPAY_API_KEY}`
  };
}

// 1. Criar ou Obter Cliente no AbacatePay
export async function getOrCreateCustomer(email: string, name: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/customers/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email,
        name
      })
    });

    const data = await response.json();

    if (response.ok && data.data) {
      return data.data.id; // Retorna o cust_id do AbacatePay
    } else {
      console.error('Erro ao obter/criar cliente no AbacatePay:', data);
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição AbacatePay Customer:', error);
    return null;
  }
}

// 2. Criar ou Obter Produto no AbacatePay
export async function getOrCreateProduct(
  externalId: string,
  name: string,
  priceInCents: number
): Promise<string | null> {
  try {
    // Tenta criar o produto. Se já existir, a API normalmente retorna o existente ou erro.
    const response = await fetch(`${BASE_URL}/products/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        externalId,
        name,
        price: priceInCents,
        currency: 'BRL'
      })
    });

    const data = await response.json();

    if (response.ok && data.data) {
      return data.data.id; // Retorna o prod_id do AbacatePay
    } else {
      // Se deu erro porque o externalId já existe, podemos listar os produtos e achar o ID,
      // mas a API do AbacatePay na versão 2 normalmente trata e retorna ou podemos fazer um fallback
      console.warn('Alerta ao criar produto (pode ser que já exista):', data);
      
      // Fallback: tentar listar e achar o ID ou retornar o data.data.id se retornado no erro
      if (data.error && data.error.includes('exists') || !response.ok) {
        // Se a API falhou por já existir, tentamos listar os produtos para encontrar
        return await findProductByExternalId(externalId);
      }
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição AbacatePay Product:', error);
    return null;
  }
}

// Auxiliar para achar produto por ID Externo
async function findProductByExternalId(externalId: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/products/list`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    const data = await response.json();
    if (response.ok && data.data && Array.isArray(data.data)) {
      const product = data.data.find((p: any) => p.externalId === externalId);
      return product ? product.id : null;
    }
    return null;
  } catch (error) {
    console.error('Erro ao listar produtos no AbacatePay:', error);
    return null;
  }
}

// 3. Criar Sessão de Checkout
export async function createCheckoutSession({
  customerId,
  productId,
  externalId,
  returnUrl,
  completionUrl
}: {
  customerId: string;
  productId: string;
  externalId: string;
  returnUrl: string;
  completionUrl: string;
}): Promise<{ id: string; url: string } | null> {
  try {
    const response = await fetch(`${BASE_URL}/checkouts/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        items: [
          {
            id: productId,
            quantity: 1
          }
        ],
        customerId,
        externalId, // Vincula com a transação local do nosso banco
        returnUrl,
        completionUrl,
        methods: ['PIX', 'CARD'],
        frequency: 'ONE_TIME'
      })
    });

    const data = await response.json();

    if (response.ok && data.data) {
      return {
        id: data.data.id, // ID do checkout
        url: data.data.url // Link para onde redirecionar o usuário
      };
    } else {
      console.error('Erro ao criar checkout no AbacatePay:', data);
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição AbacatePay Checkout:', error);
    return null;
  }
}
