import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

// Hashing de Senhas
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Token da Extensão (Gera uma chave única e segura para a extensão)
export function generateExtensionToken(): string {
  const randomBytes = Array.from({ length: 24 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return `sk_ext_${randomBytes}`;
}

// Criar Sessão no Banco de Dados
export async function createDatabaseSession(userId: string): Promise<string> {
  const sid = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // Validade de 7 dias

  await prisma.session.create({
    data: {
      userId,
      sid,
      expiresAt
    }
  });

  return sid;
}

// Remover Sessão do Banco de Dados (Logout)
export async function deleteDatabaseSession(sid: string): Promise<void> {
  try {
    await prisma.session.delete({
      where: { sid }
    });
  } catch (error) {
    // Ignora erro caso a sessão já tenha sido deletada
  }
}

// Obter Usuário da Requisição Next.js de forma assíncrona (via Cookie no Banco de Dados)
export async function getUserFromRequest(req: NextRequest): Promise<{ userId: string; email: string } | null> {
  const sid = req.cookies.get('sapienia_session')?.value;
  if (!sid) return null;

  return getSessionFromSid(sid);
}

// Nova função para uso em Server Components
export async function getServerSession(): Promise<{ userId: string; email: string; name: string } | null> {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sapienia_session')?.value;
  if (!sid) return null;

  const session = await prisma.session.findUnique({
    where: { sid },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await deleteDatabaseSession(sid);
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name
  };
}

// Helper interno
async function getSessionFromSid(sid: string): Promise<{ userId: string; email: string } | null> {
  const session = await prisma.session.findUnique({
    where: { sid },
    include: {
      user: {
        select: {
          id: true,
          email: true
        }
      }
    }
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await deleteDatabaseSession(sid);
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email
  };
}

