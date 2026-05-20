import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    // Gerar novo token seguro de alta entropia
    const newToken = `sk_ext_${crypto.randomBytes(24).toString('hex')}`;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { token: newToken },
      select: { token: true }
    });

    return NextResponse.json({
      success: true,
      token: updatedUser.token
    });
  } catch (error) {
    console.error('Erro ao revogar token:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
