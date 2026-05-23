import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { articles } from "@/data/articles";
import { getServerSession } from "@/lib/auth";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// Gerar metadados de SEO altamente específicos para cada post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Artigo Não Encontrado - Sapienia",
    };
  }

  const url = `https://sapienia.calculadoraunivesp.com.br/blog/${article.slug}`;

  return {
    title: `${article.title} - Blog Sapienia`,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: url,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      tags: article.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

// Prerenderização estática das rotas para velocidade máxima
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const user = await getServerSession();

  // JSON-LD estruturado no padrão schema.org para artigos de Blog (Rich Snippets)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.description,
    "datePublished": article.date,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sapienia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sapienia.calculadoraunivesp.com.br/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sapienia.calculadoraunivesp.com.br/blog/${article.slug}`
    }
  };

  return (
    <>
      {/* Dados Estruturados JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar user={user} />
      
      <main className="section-padding" style={{ marginTop: "60px", minHeight: "80vh" }}>
        <article className="container" style={{ maxWidth: "800px" }}>
          
          {/* Cabeçalho do Artigo */}
          <header style={{ marginBottom: "35px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "0.9rem", color: "var(--foreground-muted)", marginBottom: "15px" }}>
              <span>{article.category}</span>
              <span>•</span>
              <span>{article.readTime} de leitura</span>
            </div>
            
            <h1 className="hero-title" style={{ fontSize: "2.8rem", textAlign: "left", lineHeight: "1.2", marginBottom: "20px" }}>
              <span>{article.title}</span>
            </h1>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: "1px solid var(--border-light)", color: "var(--foreground-muted)", fontSize: "0.9rem" }}>
              <div>
                Por <strong>{article.author}</strong>
              </div>
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </time>
            </div>
          </header>

          {/* Corpo do Artigo */}
          <div 
            className="article-body" 
            style={{ 
              lineHeight: "1.8", 
              fontSize: "1.1rem", 
              color: "var(--foreground)",
              marginBottom: "50px"
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Rodapé Interno do Artigo */}
          <footer style={{ borderTop: "1px solid var(--border-light)", paddingTop: "30px", marginBottom: "50px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "30px" }}>
              {article.keywords.map((kw) => (
                <span key={kw} style={{ fontSize: "0.8rem", padding: "4px 10px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.05)", color: "var(--foreground-muted)" }}>
                  #{kw}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Link href="/blog" className="btn btn-secondary">
                ➔ Voltar para o Blog
              </Link>
              
              <Link href={user ? "/dashboard" : "/login"} className="btn btn-primary">
                Testar Sapienia Grátis
              </Link>
            </div>
          </footer>

        </article>
      </main>

      <footer className="footer">
        <div className="container footer-container" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <div className="logo" style={{ cursor: "default" }}>
            <span className="logo-symbol">⚡</span> Sapienia
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
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
