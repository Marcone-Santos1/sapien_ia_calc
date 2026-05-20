import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/api/auth/callback/google`;

  if (!clientId || clientId === 'seu-google-client-id') {
    return NextResponse.json(
      { error: 'Chave de cliente Google OAuth (GOOGLE_CLIENT_ID) não configurada no servidor .env.' },
      { status: 500 }
    );
  }

  // Monta a URL de autenticação do Google
  const googleAuthUrl = 
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent('openid email profile')}` +
    `&access_type=offline` +
    `&prompt=consent`;

  // Redireciona o usuário para o Google
  return NextResponse.redirect(googleAuthUrl);
}
