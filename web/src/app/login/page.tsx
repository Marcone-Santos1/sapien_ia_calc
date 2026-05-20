import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import AuthFormClient from "@/components/AuthFormClient";

export default async function AuthPage() {
  const session = await getServerSession();

  // Se já estiver logado, redireciona para o dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="auth-page">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>
      
      {/* Header Fixo de Navegação Simplificado */}
      <nav className="navbar" style={{ background: "transparent", border: "none" }}>
        <div className="container navbar-container">
          <Link href="/" className="logo">
            <span className="logo-symbol">⚡</span> Sapienia
          </Link>
        </div>
      </nav>

      {/* Suspense Boundary para useSearchParams dentro do Client Component */}
      <Suspense fallback={<div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><div className="spinner"></div></div>}>
        <AuthFormClient />
      </Suspense>
    </div>
  );
}

