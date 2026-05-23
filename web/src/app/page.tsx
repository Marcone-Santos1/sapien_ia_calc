import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeClient from "@/components/HomeClient";
import { getServerSession } from "@/lib/auth";

export default async function Home() {
  const user = await getServerSession();

  const faqData = [
    {
      question: "Como funciona a extensão do Sapienia?",
      answer: "É simples! Após instalar a extensão no Chrome, você pode abrir o painel lateral com um clique. A partir daí, você pode tirar um print (selecionar uma área) de qualquer questão na sua tela ou colar o enunciado textual. Nossa IA lê a questão e gera a resolução detalhada passo a passo em segundos."
    },
    {
      question: "Quais disciplinas a Inteligência Artificial resolve?",
      answer: "O Sapienia é treinado para resolver questões de todas as áreas acadêmicas, incluindo exatas (Matemática, Física, Química), biológicas, humanas, códigos de programação, e até questões de lógica complexa de concursos públicos."
    },
    {
      question: "Como funciona a integração de pagamentos com o AbacatePay?",
      answer: "Utilizamos o AbacatePay para processar pagamentos rápidos e seguros via Pix ou Cartão de Crédito. Ao comprar um plano de créditos no seu painel de usuário, você é redirecionado ao ambiente de checkout oficial e, assim que o pagamento é compensado, os créditos de resoluções são adicionados instantaneamente à sua conta."
    },
    {
      question: "Posso testar de graça?",
      answer: "Sim! Ao realizar o cadastro no Sapienia, você ganha 3 créditos de resolução de forma 100% gratuita para testar o poder da nossa IA com suas próprias questões."
    },
    {
      question: "A extensão é segura?",
      answer: "Totalmente. Nossa extensão funciona nos padrões exigidos pela Google Chrome Web Store (Manifest V3), não armazena seu histórico de navegação nem executa scripts maliciosos. A conexão com nossa IA é intermediada de forma criptografada pelo nosso próprio servidor seguro."
    }
  ];

  const authPath = user ? "/dashboard" : "/login";
  const primaryBtnText = user ? "Meu Painel de Estudos" : "Começar Grátis (3 Créditos)";

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Sapienia - Resolutor de Questões IA",
    "operatingSystem": "Windows, macOS, Linux, ChromeOS",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "featureList": "Resolução de questões por imagem/print, Leitura visual matemática avançada, Explicação passo a passo, Histórico de estudos na nuvem"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* Dados Estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navbar */}
      <Navbar user={user} />

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            🚀 Resolva questões acadêmicas instantaneamente
          </div>
          <h1 className="hero-title">
            Domine Seus Estudos com <br />
            <span>Tutor de Inteligência Artificial</span>
          </h1>
          <p className="hero-subtitle">
            Selecione qualquer parte da tela ou cole o enunciado e receba explicações passo a passo, fórmulas e gabaritos comentados em segundos através da nossa extensão para o Google Chrome.
          </p>
          <div className="hero-actions">
            <Link href={authPath} className="btn btn-primary btn-large">
              {primaryBtnText}
            </Link>
            <a href="#como-funciona" className="btn btn-secondary btn-large">
              Ver Como Funciona ↓
            </a>
          </div>
        </div>
      </header>

      {/* Recursos (Features) */}
      <section id="recursos" className="section-padding">
        <div className="container">
          <h2 className="section-title">Tecnologia Feita Para Estudantes</h2>
          <p className="section-desc">
            Uma suíte de ferramentas modernas para ajudar você a gabaritar exames, vestibulares, concursos ou trabalhos universitários.
          </p>
          <div className="features-grid">
            <div className="card feature-card">
              <div className="feature-icon">📸</div>
              <h3>Resolução por Print</h3>
              <p>Use o cursor do mouse para selecionar uma imagem ou tabela da sua tela. Nossa IA faz a leitura visual (OCR/Vision) e resolve.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">✍️</div>
              <h3>Resolução por Texto</h3>
              <p>Cole ou digite enunciados complexos com texto simples para receber explicações matemáticas e didáticas impecáveis.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">📚</div>
              <h3>Tutor Acadêmico 24/7</h3>
              <p>Nossa IA atua como um tutor especializado que te explica o porquê de cada etapa em vez de apenas te entregar uma resposta fria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona (Steps) */}
      <section id="como-funciona" className="section-padding" style={{ backgroundColor: "rgba(255,255,255,0.01)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <h2 className="section-title">Como Funciona o Sapienia?</h2>
          <p className="section-desc">
            Instale a extensão em menos de 1 minuto e mude sua rotina de estudos para sempre.
          </p>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3>Crie sua Conta</h3>
              <p>Cadastre-se na nossa plataforma e pegue seu token de acesso no painel.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3>Baixe a Extensão</h3>
              <p>Conecte a extensão inserindo o seu token com apenas um clique.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3>Capture e Aprenda</h3>
              <p>Selecione a questão em qualquer site e assista à IA detalhar a resolução.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preços (Pricing) */}
      <section id="precos" className="section-padding">
        <div className="container">
          <h2 className="section-title">Escolha seu Pacote de Créditos</h2>
          <p className="section-desc">
            Adquira créditos pré-pagos sem assinaturas recorrentes e obrigatórias. Pague apenas pelo que usar via AbacatePay.
          </p>
          <div className="pricing-grid">
            {/* Plano 50 */}
            <div className="card price-card">
              <div className="price-name">Pacote Universitário</div>
              <div className="price-val">R$ 19,90<span> / único</span></div>
              <div className="price-credits">50 Créditos de IA</div>
              <ul className="price-features">
                <li>Resolução por Print</li>
                <li>Leitura Avançada de Imagens</li>
                <li>Gabarito e Justificativa</li>
                <li>Sem expiração de créditos</li>
              </ul>
              <Link href={authPath} className="btn btn-secondary" style={{ width: "100%" }}>
                Comprar Créditos
              </Link>
            </div>

            {/* Plano 150 */}
            <div className="card price-card popular">
              <div className="popular-badge">Mais Vendido</div>
              <div className="price-name">Pacote Vestibulando</div>
              <div className="price-val">R$ 39,90<span> / único</span></div>
              <div className="price-credits">150 Créditos de IA</div>
              <ul className="price-features">
                <li>Tudo do plano anterior</li>
                <li>Resoluções mais rápidas</li>
                <li>Explicações de Fórmulas</li>
                <li>Suporte Prioritário</li>
              </ul>
              <Link href={authPath} className="btn btn-primary" style={{ width: "100%" }}>
                Comprar Créditos
              </Link>
            </div>

            {/* Plano 500 */}
            <div className="card price-card">
              <div className="price-name">Pacote Concurseiro</div>
              <div className="price-val">R$ 99,90<span> / único</span></div>
              <div className="price-credits">500 Créditos de IA</div>
              <ul className="price-features">
                <li>Ideal para alta demanda</li>
                <li>Melhor custo por questão</li>
                <li>Suporte a fórmulas complexas</li>
                <li>Histórico Completo na Nuvem</li>
              </ul>
              <Link href={authPath} className="btn btn-secondary" style={{ width: "100%" }}>
                Comprar Créditos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (Dúvidas frequentes) */}
      <section id="faq" className="section-padding" style={{ borderTop: "1px solid var(--border-light)" }}>
        <div className="container">
          <h2 className="section-title">Perguntas Frequentes</h2>
          <p className="section-desc">
            Ficou com alguma dúvida? Confira as respostas para as principais dúvidas de nossos estudantes.
          </p>
          <HomeClient faqData={faqData} />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <div className="logo" style={{ cursor: "default" }}>
            <span className="logo-symbol">⚡</span> Sapienia
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/blog" style={{ color: "var(--foreground-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
              Blog/Artigos
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
