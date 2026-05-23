import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getServerSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Central de Ajuda - Sapienia",
  description: "Tire suas dúvidas sobre instalação da extensão, compra de créditos com AbacatePay, conexões de token e resolução de questões por inteligência artificial no Sapienia.",
  keywords: ["central de ajuda", "suporte sapienia", "ajuda extensão chrome", "como instalar sapienia", "faq sapienia"],
};

export default async function HelpCenterPage() {
  const user = await getServerSession();

  const helpTopics = [
    {
      category: "🚀 Instalação e Configuração",
      items: [
        {
          q: "Como instalar a extensão no meu navegador?",
          a: (
            <>
              A extensão funciona no Google Chrome e em qualquer navegador baseado em Chromium (como Brave, Edge, Opera e Vivaldi). Você pode instalá-la em segundos diretamente na{" "}
              <a
                href="https://chromewebstore.google.com/detail/eacoblodcakhhomdekjoakcngdbiijkk"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--primary-color)", textDecoration: "underline", fontWeight: "500" }}
              >
                Chrome Web Store oficial
              </a>{" "}
              clicando em &quot;Usar no Chrome&quot;.
            </>
          )
        },
        {
          q: "O que é o Token de Conexão e onde encontrá-lo?",
          a: "O Token é a chave de segurança que vincula a extensão do seu navegador à sua conta do site, permitindo que você consuma seus créditos. Você pode visualizá-lo e copiá-lo diretamente na caixa 'Token de Acesso' no seu Painel de Usuário (Dashboard) após realizar o login."
        },
        {
          q: "Como conectar a extensão?",
          a: "Abra a extensão clicando no ícone do raio (ou no menu de extensões 🧩) no canto superior direito do seu navegador. Cole o token de acesso que você copiou no painel e clique em 'Conectar Agora'. Seus créditos serão atualizados e o status mudará para 'Conectado'."
        }
      ]
    },
    {
      category: "📸 Uso do Resolutor de Questões",
      items: [
        {
          q: "Como funciona a resolução por print (seleção de tela)?",
          a: "Abra o painel lateral da extensão, clique no botão 'Selecionar Questão'. A tela ficará levemente escurecida. Clique com o botão esquerdo do mouse, arraste criando um retângulo vermelho sobre a questão (seja ela imagem, gráfico ou fórmula) e solte. A IA começará a processar e responderá em segundos."
        },
        {
          q: "O que é o Resolutor de Texto?",
          a: "Caso a questão seja puramente textual ou você não queira usar o print, digite ou cole o enunciado do problema na caixa de texto na parte inferior do painel lateral da extensão e clique em 'Resolver Texto'."
        },
        {
          q: "Que tipo de questões a IA consegue resolver?",
          a: "Nosso modelo é alimentado pelo Gemini 2.5 Flash, capaz de processar imagens complexas de exatas (fórmulas, gráficos, diagramas geométricos de física ou matemática) bem como textos de humanas, linguagens e códigos de programação."
        }
      ]
    },
    {
      category: "💳 Créditos e Faturamento",
      items: [
        {
          q: "Como funciona o sistema de créditos do Sapienia?",
          a: "Cada questão resolvida pela IA (seja por print ou por texto) consome 1 crédito. Ao se cadastrar, você ganha 3 créditos grátis. Para obter mais, você pode comprar pacotes pré-pagos únicos diretamente no seu dashboard. Não há assinaturas obrigatórias e seus créditos nunca expiram!"
        },
        {
          q: "Quais são as formas de pagamento?",
          a: "Processamos todas as transações de forma 100% segura usando a API oficial do AbacatePay. Você pode pagar via Pix (compensação instantânea) ou Cartão de Crédito."
        },
        {
          q: "Comprei créditos mas eles não apareceram, o que fazer?",
          a: "A maioria das compras via Pix compensa em menos de 1 minuto. Se demorar um pouco, basta clicar no botão de recarregar (ícone de círculo de setas) ao lado dos seus créditos na extensão ou no dashboard para forçar a sincronização. Se o problema persistir, fale com o suporte."
        }
      ]
    },
    {
      category: "🔧 Solução de Problemas",
      items: [
        {
          q: "A extensão diz 'Não foi possível conectar ao servidor', o que fazer?",
          a: "Isso ocorre quando a extensão não consegue se comunicar com nossa API. Verifique se o seu computador está conectado à internet e se o site oficial do Sapienia está online. Tente desconectar o token nas configurações da extensão e reconectá-lo."
        },
        {
          q: "Por que devo revogar o meu token de acesso?",
          a: "Se você suspeitar que alguém teve acesso ao seu token ou se perdeu o controle dele, vá ao Dashboard e clique em 'Revogar Token'. Um novo token seguro será gerado e a extensão antiga será desconectada imediatamente, protegendo seu saldo de créditos."
        }
      ]
    }
  ];

  return (
    <>
      <Navbar user={user} />
      
      <main className="section-padding" style={{ marginTop: "60px", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div className="hero-badge" style={{ display: "inline-block", margin: "0 auto 15px auto" }}>
              🛠️ Suporte e Documentação
            </div>
            <h1 className="hero-title" style={{ fontSize: "3rem", marginBottom: "15px" }}>
              Central de <span>Ajuda</span>
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: "600px", margin: "0 auto" }}>
              Tudo o que você precisa saber sobre a instalação da extensão, compra de créditos e resolução de dúvidas com inteligência artificial.
            </p>
          </div>

          {/* Listagem de Tópicos */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {helpTopics.map((topic, catIdx) => (
              <section key={catIdx} className="card" style={{ padding: "30px", border: "1px solid var(--border-light)" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--foreground)", marginBottom: "25px", borderBottom: "1px solid var(--border-light)", paddingBottom: "10px" }}>
                  {topic.category}
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                  {topic.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "var(--foreground)" }}>
                        {item.q}
                      </h3>
                      <p style={{ color: "var(--foreground-muted)", lineHeight: "1.7", fontSize: "0.98rem" }}>
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Chamada para Suporte Adicional */}
          <div className="card" style={{ marginTop: "50px", textAlign: "center", padding: "40px", background: "linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.05) 100%)", border: "1px solid var(--border-light)" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "600", marginBottom: "12px" }}>Ainda com dúvidas?</h2>
            <p style={{ color: "var(--foreground-muted)", maxWidth: "500px", margin: "0 auto 25px auto", lineHeight: "1.6" }}>
              Se você não encontrou a resposta que procurava ou teve algum problema com seus pagamentos, nossa equipe de suporte está pronta para ajudar.
            </p>
            <a href="mailto:suporte@calculadoraunivesp.com.br" className="btn btn-primary">
              Entrar em Contato por E-mail
            </a>
          </div>

        </div>
      </main>

      <footer className="footer" style={{ marginTop: "80px" }}>
        <div className="container footer-container" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <div className="logo" style={{ cursor: "default" }}>
            <span className="logo-symbol">⚡</span> Sapienia
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/central-de-ajuda" style={{ color: "var(--foreground-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
              Central de Ajuda
            </Link>
            <Link href="/privacy" style={{ color: "var(--foreground-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
              Política de Privacidade
            </Link>
          </div>
          <div className="footer-text">
            © {new Date().getFullYear()} Sapienia. Desenvolvido com AbacatePay e Gemini AI.
          </div>
        </div>
      </footer>
    </>
  );
}
