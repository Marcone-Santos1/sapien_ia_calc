import { NextRequest, NextResponse } from 'next/server';
import { deleteDatabaseSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const sid = req.cookies.get('sapienia_session')?.value;
  if (sid) {
    await deleteDatabaseSession(sid);
  }

  const response = NextResponse.json({ success: true });
  
  // Limpar cookie de sessão
  response.cookies.set('sapienia_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
