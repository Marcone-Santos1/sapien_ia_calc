"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthFormClient() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "oauth_failed") {
      setError("Falha ao autenticar com o Google. Por favor, tente novamente.");
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setError("");
    setLoading(true);
    // Redireciona o navegador para a rota que inicia o OAuth da Google
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="auth-card card" style={{ textAlign: "center", padding: "40px 32px" }}>
      <div className="auth-header" style={{ marginBottom: "28px" }}>
        <h1>Acesse o Sapienia</h1>
        <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: "1.5" }}>
          Estude de forma inteligente. Conecte sua conta Google para começar a resolver questões com IA instantaneamente.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="btn btn-google"
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "14px 20px",
          fontSize: "15px",
          marginTop: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? (
          <span>Redirecionando...</span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.87 2.69-6.57z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.91-2.24c-.8.54-1.84.87-3.05.87-2.34 0-4.33-1.58-5.03-3.7H.95v2.3C2.43 15.89 5.5 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V5H.95C.35 6.2 0 7.57 0 9s.35 2.8 1.95 4l3.02-2.3z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4C13.46.99 11.43 0 9 0 5.5 0 2.43 2.11.95 5.04l3.02 2.3c.7-2.12 2.69-3.76 5.03-3.76z"
              />
            </svg>
            <span>Entrar com o Google</span>
          </>
        )}
      </button>

      <div style={{ marginTop: "24px", fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.4" }}>
        Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        Suas resoluções de questões e créditos serão vinculados à sua conta Google.
      </div>
    </div>
  );
}
