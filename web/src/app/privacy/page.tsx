import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getServerSession } from "@/lib/auth";

export default async function PrivacyPolicy() {
  const user = await getServerSession();

  return (
    <>
      <Navbar user={user} />
      
      <main className="section-padding" style={{ marginTop: "60px", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "800px", lineHeight: "1.7", color: "var(--foreground)" }}>
          <h1 className="hero-title" style={{ fontSize: "2.5rem", marginBottom: "20px", textAlign: "left" }}>
            <span>Política de Privacidade</span>
          </h1>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "30px" }}>
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section style={{ marginBottom: "24px" }}>
            <h2>1. Apresentação e Escopo</h2>
            <p>
              Esta Política de Privacidade descreve como a plataforma <strong>Sapienia</strong> coletada, processa e protege as informações dos usuários ao utilizar nosso site e nossa extensão para o navegador Google Chrome (<strong>Sapienia - Resolutor de Questões IA</strong>).
            </p>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2>2. Dados Coletados e Sua Finalidade</h2>
            <p>
              Nossa extensão funciona com base no princípio da finalidade única: ajudar você a resolver questões escolares ou acadêmicas. Coletamos apenas os seguintes dados:
            </p>
            <ul>
              <li>
                <strong>Recortes de Tela (Imagens):</strong> Quando você utiliza a ferramenta de captura de tela (crop), a imagem da área selecionada é processada em memória e enviada de forma criptografada para a nossa API para que a Inteligência Artificial faça a leitura visual e a resolução da questão. Essas imagens temporárias não são vendidas e nem compartilhadas para fins publicitários.
              </li>
              <li>
                <strong>Entradas de Texto:</strong> O texto da questão digitado por você na caixa correspondente da extensão é enviado de forma segura para gerar a resposta didática.
              </li>
              <li>
                <strong>Dados de Autenticação (Tokens):</strong> Armazenamos o token gerado no painel da sua conta localmente no seu navegador através da API <code>chrome.storage</code> para manter a sua extensão conectada ao seu saldo de créditos de forma segura.
              </li>
              <li>
                <strong>Dados de Cadastro:</strong> Coletamos seu nome, e-mail e foto de perfil públicos fornecidos de forma segura pelo Google OAuth durante o seu login para identificar sua conta e gerenciar seus créditos.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2>3. Compartilhamento de Dados</h2>
            <p>
              Toda a comunicação entre a extensão e o servidor é criptografada via protocolo HTTPS. O Sapienia <strong>não compartilha, não vende e não aluga</strong> nenhum dado pessoal ou de uso dos usuários a terceiros. As imagens e textos de questões enviadas são processadas por meio de integrações de API seguras da IA do Google (Gemini API) com a finalidade exclusiva de retornar a explicação e resolução didática da questão.
            </p>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2>4. Segurança e Armazenamento</h2>
            <p>
              Os dados de histórico de questões e seus saldos de créditos são guardados em nosso banco de dados relacional seguro. Você pode a qualquer momento revogar o seu token de conexão ou solicitar a exclusão total da sua conta e de todo o seu histórico por meio do Painel do Usuário (Dashboard).
            </p>
          </section>

          <section style={{ marginBottom: "24px" }}>
            <h2>5. Alterações nesta Política</h2>
            <p>
              Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento para refletir mudanças regulatórias ou melhorias na extensão. Informaremos as mudanças publicando a nova política nesta página.
            </p>
          </section>

          <section style={{ marginBottom: "40px", paddingTop: "20px", borderTop: "1px solid var(--border-light)" }}>
            <p>
              Caso tenha dúvidas sobre a privacidade dos seus dados ou queira exercer seus direitos de exclusão, entre em contato através de nossa página oficial ou suporte.
            </p>
            <div style={{ marginTop: "20px" }}>
              <Link href="/" className="btn btn-secondary">
                Voltar para a Página Inicial
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
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
            © {new Date().getFullYear()} Sapienia. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
