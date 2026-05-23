import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateExtensionToken, createDatabaseSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorização Google OAuth ausente.' },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const redirectUri = `${appUrl}/api/auth/callback/google`;

    if (!clientId || !clientSecret || clientId === 'seu-google-client-id') {
      return NextResponse.json(
        { error: 'Credenciais do Google OAuth não configuradas.' },
        { status: 500 }
      );
    }

    // 1. Trocar o código de autorização por tokens de acesso
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Erro ao trocar código por token no Google:', tokenData);
      return NextResponse.json(
        { error: 'Falha ao validar credenciais do Google.' },
        { status: 400 }
      );
    }

    // 2. Buscar o perfil do usuário utilizando o access_token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok || !userInfo.email) {
      console.error('Erro ao buscar dados do usuário no Google:', userInfo);
      return NextResponse.json(
        { error: 'Falha ao buscar dados cadastrais no Google.' },
        { status: 400 }
      );
    }

    const email = userInfo.email.toLowerCase();
    const name = userInfo.name || userInfo.given_name || 'Estudante Sapienia';

    // 3. Buscar ou criar o usuário localmente
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Usuário não existe, cadastra automaticamente com 3 créditos
      user = await prisma.user.create({
        data: {
          name,
          email,
          token: generateExtensionToken(),
          credits: 3 // Créditos gratuitos de cadastro
        }
      });
      console.log(`Novo usuário cadastrado automaticamente via Google OAuth: ${email}`);
    } else {
      console.log(`Usuário logado via Google OAuth: ${email}`);
    }

    // 4. Criar a sessão persistida no Banco de Dados
    const sessionToken = await createDatabaseSession(user.id);

    // Redireciona o usuário para o dashboard do SaaS
    const response = NextResponse.redirect(`${appUrl}/dashboard`);

    // Configurar o Cookie de Sessão HTTP-Only com o token da sessão
    response.cookies.set('sapienia_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Erro crítico no callback Google OAuth:', error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    return NextResponse.redirect(`${appUrl}/login?error=oauth_failed`);
  }
}
