import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

const WEBHOOK_SECRET = process.env.ABACATEPAY_WEBHOOK_SECRET;
const ABACATEPAY_PUBLIC_KEY = "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";


// Mapeamento de valores pagos para créditos
const AMOUNT_TO_CREDITS = {
  1990: 50,  // R$ 19,90 -> 50 créditos
  3990: 150, // R$ 39,90 -> 150 créditos
  9990: 500  // R$ 99,90 -> 500 créditos
};

type AmountKey = keyof typeof AMOUNT_TO_CREDITS;

/**
 * Verifies if the webhook signature matches the expected HMAC.
 * Uses ABACATEPAY_WEBHOOK_SECRET from environment variables.
 * @param rawBody Raw request body string.
 * @param signatureFromHeader The signature received from `X-Webhook-Signature`.
 * @param secret The webhook secret from environment variables.
 * @returns true if the signature is valid, false otherwise.
 */
function verifySignature(rawBody: string, signatureFromHeader: string, secret?: string) {
    const key = secret ?? process.env.ABACATEPAY_WEBHOOK_SECRET;
    if (!key) return false;

    const bodyBuffer = Buffer.from(rawBody, "utf8");

    const expectedSig = crypto
        .createHmac("sha256", ABACATEPAY_PUBLIC_KEY)
        .update(bodyBuffer)
        .digest("base64");

    const A = Buffer.from(expectedSig);
    const B = Buffer.from(signatureFromHeader);

    return A.length === B.length && crypto.timingSafeEqual(A, B);
}


export async function POST(req: NextRequest) {
  try {
    // 1. Obter o corpo bruto da requisição para verificar a assinatura
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');

    // 2. Verificar Assinatura de Segurança (se o secret estiver configurado)
    if (WEBHOOK_SECRET && WEBHOOK_SECRET !== 'abc_wh_secret_placeholder') {
      if (!signature) {
        return NextResponse.json({ error: 'Assinatura ausente.' }, { status: 400 });
      }
      const isValid = verifySignature(rawBody, signature);
      if (!isValid) {
        return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 400 });
      }
    } else {
      console.warn('Alerta de Segurança: Assinatura do webhook AbacatePay não foi verificada porque ABACATEPAY_WEBHOOK_SECRET não está configurado.');
    }

    // 3. Processar o payload
    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    console.log(`Evento Webhook Recebido de AbacatePay: ${event}`, data);

    // Nós nos importamos apenas com o evento checkout.completed
    if (event !== 'checkout.completed') {
      return NextResponse.json({ received: true });
    }

    // Obter IDs importantes da transação no AbacatePay
    const transactionId = data.checkout.externalId; // Nosso ID de transação local
    const checkoutId = data.checkout.id;
    const checkoutStatus = data.checkout.status; // Espera-se "PAID" ou "completed"

    if (!transactionId) {
      return NextResponse.json({ error: 'externalId não fornecido na transação.' }, { status: 400 });
    }

    // 4. Buscar a transação pendente no nosso banco
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true }
    });

    if (!transaction) {
      console.error(`Transação não encontrada para ID: ${transactionId}`);
      return NextResponse.json({ error: 'Transação não encontrada.' }, { status: 404 });
    }

    // Evitar processar transações já pagas (idempotência)
    if (transaction.status === 'PAID') {
      return NextResponse.json({ success: true, message: 'Transação já processada.' });
    }

    // 5. Atualizar transação e conceder créditos
    const amount = transaction.amount as AmountKey;
    const creditsToAdd = AMOUNT_TO_CREDITS[amount] || 0;

    if (creditsToAdd === 0) {
      console.error(`Nenhum mapeamento de crédito encontrado para o valor: ${amount} centavos`);
    }

    // Executa em uma transação do Prisma
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'PAID' }
      }),
      prisma.user.update({
        where: { id: transaction.userId },
        data: {
          credits: {
            increment: creditsToAdd
          }
        }
      })
    ]);

    console.log(`Sucesso: Adicionados ${creditsToAdd} créditos ao usuário ${transaction.user.email}`);

    return NextResponse.json({
      success: true,
      message: `Sucesso. Foram adicionados ${creditsToAdd} créditos.`
    });

  } catch (error) {
    console.error('Erro no processamento do webhook AbacatePay:', error);
    return NextResponse.json({ error: 'Erro interno no webhook.' }, { status: 500 });
  }
}
