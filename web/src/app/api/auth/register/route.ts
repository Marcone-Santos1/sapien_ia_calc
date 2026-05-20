import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'O cadastro por e-mail e senha foi desativado. Por favor, utilize o botão "Entrar com o Google".' },
    { status: 400 }
  );
}
