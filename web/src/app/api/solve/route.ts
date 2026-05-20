import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import prisma from '@/lib/db';

// Inicializar o cliente Gemini (lê GEMINI_API_KEY ou GOOGLE_API_KEY do .env)
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Prompt de instruções estruturado para o tutor acadêmico
const TUTOR_PROMPT = `
Você é o Sapienia, um tutor acadêmico de Inteligência Artificial de alta performance. Seu objetivo é resolver a questão fornecida e apresentar uma resposta extremamente didática, estruturada e detalhada em português (PT-BR).

Siga rigorosamente esta estrutura para organizar sua resposta:

# 📌 Assunto da Questão
[Identifique a disciplina principal e o assunto específico da questão, ex: Física - Eletrodinâmica]

# 💡 Resolução Passo a Passo
[Explique detalhadamente cada etapa matemática ou conceitual para chegar à resposta correta, demonstrando as fórmulas utilizadas de forma legível]

# 🎯 Resposta Correta
[Declare explicitamente a alternativa ou valor final correto]

# 🔍 Justificativa e Dicas
[Explique brevemente por que a resposta está certa e por que as outras alternativas (se houver) estão erradas. Adicione uma dica rápida para o aluno se lembrar deste conceito no futuro]

Mantenha um tom encorajador, didático e profissional. Use formatação Markdown padrão para organizar o texto (títulos com #, listas com -, negrito, etc.).
`;

// Helper para validar o token no Header de Autorização
async function authenticateExtension(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  return prisma.user.findUnique({
    where: { token }
  });
}

// 1. GET /api/solve - Validar token da extensão e buscar créditos atuais
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateExtension(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Token inválido ou desconectado.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: user.credits
    });
  } catch (error) {
    console.error('Erro na validação do token:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}

// 2. POST /api/solve - Resolver questão (Texto ou Imagem)
export async function POST(req: NextRequest) {
  try {
    // A. Autenticação do usuário da extensão
    const user = await authenticateExtension(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Chave de acesso inválida ou não autorizada.' },
        { status: 401 }
      );
    }

    // B. Verificação de Créditos
    if (user.credits <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Você não tem créditos de resolução restantes. Acesse o seu painel web para comprar mais.'
      }, { status: 403 });
    }

    // C. Parser dos parâmetros
    const { text, image } = await req.json();

    if (!text && !image) {
      return NextResponse.json(
        { success: false, error: 'Envie um texto ou uma captura de imagem da questão.' },
        { status: 400 }
      );
    }

    let geminiResponseText = '';

    // D. Chamada para a API do Gemini
    if (image) {
      // Remover cabeçalhos de Data URL (ex: "data:image/png;base64,") para enviar apenas a string base64 pura
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const mimeTypeMatch = image.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/png';

      // Chamar Gemini com Imagem (Vision/Multimodal)
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${TUTOR_PROMPT}\n\nPor favor, resolva a questão contida na imagem abaixo.` },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ]
      });

      geminiResponseText = response.text || 'Não foi possível obter uma resposta do modelo.';
    } else {
      // Chamar Gemini apenas com Texto
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${TUTOR_PROMPT}\n\nQuestão:\n${text}` }
            ]
          }
        ]
      });

      geminiResponseText = response.text || 'Não foi possível obter uma resposta do modelo.';
    }

    // E. Decrementar créditos e registrar no Histórico (Transação do banco)
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } }
      }),
      prisma.history.create({
        data: {
          userId: user.id,
          questionText: text || 'Resolução via imagem',
          imageUrl: image ? '[Imagem salva]' : null, // Não salvamos base64 enorme para economizar espaço
          resolution: geminiResponseText
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      resolution: geminiResponseText,
      credits: updatedUser.credits
    });

  } catch (error) {
    console.error('Erro ao resolver questão com Gemini:', error);
    return NextResponse.json(
      { success: false, error: 'Ocorreu um erro ao processar a questão com a Inteligência Artificial. Tente novamente.' },
      { status: 500 }
    );
  }
}
