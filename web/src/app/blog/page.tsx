import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { articles } from "@/data/articles";
import { getServerSession } from "@/lib/auth";

export const metadata = {
  title: "Blog Sapienia - Dicas de Estudo e Inteligência Artificial",
  description: "Aprenda a otimizar sua rotina de estudos, gabaritar vestibulares e concursos estudando por questões com Inteligência Artificial.",
  keywords: ["blog de estudos", "IA na educação", "como estudar para enem", "gabaritar exatas", "sapienia blog"],
};

export default async function BlogPage() {
  const user = await getServerSession();

  return (
    <>
      <Navbar user={user} />
      
      <main className="section-padding" style={{ marginTop: "60px", minHeight: "80vh" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <div className="hero-badge" style={{ display: "inline-block", margin: "0 auto 15px auto" }}>
              📚 Blog Oficial Sapienia
            </div>
            <h1 className="hero-title" style={{ fontSize: "3rem", marginBottom: "15px" }}>
              Estude de Forma <span>Inteligente</span>
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: "600px", margin: "0 auto" }}>
              Artigos, guias práticos e novidades sobre inteligência artificial, vestibular, ENEM e técnicas de estudos de alto rendimento.
            </p>
          </div>

          <div className="features-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px", marginTop: "40px" }}>
            {articles.map((article) => (
              <article key={article.slug} className="card feature-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", padding: "24px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "var(--foreground-muted)", marginBottom: "12px" }}>
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime} de leitura</span>
                  </div>
                  
                  <h3 style={{ fontSize: "1.3rem", fontWeight: "600", color: "var(--foreground)", marginBottom: "12px", lineHeight: "1.4" }}>
                    <Link href={`/blog/${article.slug}`} style={{ color: "inherit", textDecoration: "none" }} className="hover-underline">
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p style={{ fontSize: "0.95rem", color: "var(--foreground-muted)", marginBottom: "20px", lineHeight: "1.6" }}>
                    {article.description}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                    Por <strong>{article.author}</strong>
                  </div>
                  <Link href={`/blog/${article.slug}`} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                    Ler Artigo ➔
                  </Link>
                </div>
              </article>
            ))}
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
