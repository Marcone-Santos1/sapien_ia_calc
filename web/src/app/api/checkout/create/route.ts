import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { getOrCreateCustomer, getOrCreateProduct, createCheckoutSession } from '@/lib/abacatepay';

// Configuração dos planos disponíveis
const PLANS = {
  plan_50: {
    name: 'Sapienia - 50 Créditos',
    price: 1990, // R$ 19,90 em centavos
    credits: 50
  },
  plan_150: {
    name: 'Sapienia - 150 Créditos',
    price: 3990, // R$ 39,90 em centavos
    credits: 150
  },
  plan_500: {
    name: 'Sapienia - 500 Créditos',
    price: 9990, // R$ 99,90 em centavos
    credits: 500
  }
};

type PlanId = keyof typeof PLANS;

export async function POST(req: NextRequest) {
  try {
    // 1. Validar sessão do usuário
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { planId } = await req.json();
    if (!planId || !PLANS[planId as PlanId]) {
      return NextResponse.json({ error: 'Plano inválido selecionado.' }, { status: 400 });
    }

    const plan = PLANS[planId as PlanId];

    // Buscar dados completos do usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    // 2. Obter ou criar Cliente no AbacatePay
    const customerId = await getOrCreateCustomer(user.email, user.name);
    if (!customerId) {
      return NextResponse.json({ error: 'Falha ao sincronizar cliente com o gateway de pagamentos.' }, { status: 500 });
    }

    // 3. Obter ou criar Produto no AbacatePay
    const productId = await getOrCreateProduct(planId, plan.name, plan.price);
    if (!productId) {
      return NextResponse.json({ error: 'Falha ao configurar produto no gateway de pagamentos.' }, { status: 500 });
    }

    // 4. Criar transação temporária local no banco
    const tempCheckoutId = `TEMP_${user.id}_${Date.now()}`;
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: plan.price,
        status: 'PENDING',
        abacatePayCheckoutId: tempCheckoutId
      }
    });

    // 5. Criar checkout no AbacatePay
    const domain = req.headers.get('origin') || 'http://localhost:3001';
    const checkoutSession = await createCheckoutSession({
      customerId,
      productId,
      externalId: transaction.id, // ID local da transação para cruzar no webhook
      returnUrl: `${domain}/dashboard?checkout_status=cancelled`,
      completionUrl: `${domain}/dashboard?checkout_status=success`
    });

    if (!checkoutSession) {
      // Excluir a transação pendente se falhou
      await prisma.transaction.delete({ where: { id: transaction.id } });
      return NextResponse.json({ error: 'Falha ao iniciar sessão de pagamento.' }, { status: 500 });
    }

    // 6. Atualizar transação com o ID oficial do checkout do AbacatePay
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        abacatePayCheckoutId: checkoutSession.id
      }
    });

    // Retorna a URL de redirecionamento para o Pix/Cartão
    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url
    });

  } catch (error) {
    console.error('Erro na criação de checkout:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
