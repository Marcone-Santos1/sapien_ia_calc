import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession();

  // Se não estiver logado, redireciona para o login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="dashboard-page">
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      
      {/* Navbar simplificada para o dashboard */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/" className="logo">
            <span className="logo-symbol">⚡</span> Sapienia
          </Link>
        </div>
      </nav>

      <Suspense fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div className="spinner" />
        </div>
      }>
        {/* Passamos os dados básicos da sessão para o cliente para evitar o primeiro fetch se possível */}
        <DashboardClient initialUser={session} />
      </Suspense>
    </div>
  );
}
