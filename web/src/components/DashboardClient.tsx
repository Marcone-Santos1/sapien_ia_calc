"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  credits: number;
  token: string;
  createdAt: string;
}

interface HistoryItem {
  id: string;
  questionText: string | null;
  imageUrl: string | null;
  resolution: string;
  createdAt: string;
}

interface DashboardClientProps {
  initialUser: { userId: string; email: string; name: string };
}

/* ── SVG Icons ── */
const Icons = {
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Zap: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Key: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  Puzzle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM16 8L2 22M17.5 15H9"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  ChevronUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  Image: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  Sparkles: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm7 10l.75 2.25L22 15l-2.25.75L19 18l-.75-2.25L16 15l2.25-.75L19 12zm-14 0l.75 2.25L8 15l-2.25.75L5 18l-.75-2.25L2 15l2.25-.75L5 12z"/>
    </svg>
  ),
};

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showToken, setShowToken] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);
  const [revokingToken, setRevokingToken] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch("/api/auth/me");
        if (!userRes.ok) { router.push("/login"); return; }
        const userData = await userRes.json();
        setUser(userData.user);

        const historyRes = await fetch("/api/history");
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.history);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  useEffect(() => {
    const status = searchParams.get("checkout_status");
    if (status === "success") {
      alert("🎉 Pagamento compensado! Seus créditos foram adicionados com sucesso.");
      router.replace("/dashboard");
    } else if (status === "cancelled") {
      alert("⚠️ O checkout foi cancelado.");
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const copyToClipboard = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.token).then(() => {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    });
  };

  const handleRevokeToken = async () => {
    if (!confirm("Atenção: ao revogar o token, a extensão será desconectada e você precisará colar o novo token nela. Continuar?")) return;
    setRevokingToken(true);
    try {
      const res = await fetch("/api/auth/revoke-token", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(prev => prev ? { ...prev, token: data.token } : prev);
        setShowToken(true);
        alert("✅ Token revogado! Um novo token seguro foi gerado. Cole-o na extensão para reconectar.");
      } else {
        alert(data.error || "Erro ao revogar o token.");
      }
    } catch {
      alert("Erro de comunicação ao revogar o token.");
    } finally {
      setRevokingToken(false);
    }
  };

  const handleBuyCredits = async (planId: string) => {
    setBuyingPlan(planId);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });
      const data = await response.json();
      if (response.ok && data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Erro ao gerar sessão de pagamento.");
      }
    } catch {
      alert("Erro ao conectar com o gateway de pagamentos.");
    } finally {
      setBuyingPlan(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="container">

      {/* ── Header ── */}
      <div className="dash-header">
        <div className="dash-user-info">
          <div className="dash-avatar">{initials}</div>
          <div>
            <h1 className="dash-greeting">Olá, {user.name.split(" ")[0]} 👋</h1>
            <p className="dash-sub">{user.email} · Membro desde {memberSince}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost">
          <Icons.LogOut /> Sair
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dash-stats-row">
        <div className="dash-stat-card dash-stat-primary">
          <div className="dash-stat-icon" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
            <Icons.Zap />
          </div>
          <div>
            <div className="dash-stat-number" style={{ color: "#10b981" }}>{user.credits}</div>
            <div className="dash-stat-label">Créditos disponíveis</div>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-icon" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
            <Icons.BookOpen />
          </div>
          <div>
            <div className="dash-stat-number">{history.length}</div>
            <div className="dash-stat-label">Questões resolvidas</div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="dashboard-grid">

        {/* Coluna Esquerda */}
        <div className="dash-left-col">

          {/* Token Card */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-icon" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                <Icons.Key />
              </div>
              <div>
                <h2 className="dash-section-title">Token de Acesso</h2>
                <p className="dash-section-desc">Use este token para conectar a extensão ao seu painel</p>
              </div>
            </div>

            <div className="token-display">
              <div className="token-value">
                <span className="token-prefix">sk_ext_</span>
                <span className="token-body">
                  {showToken
                    ? user.token.replace("sk_ext_", "")
                    : "••••••••••••••••••••••••••••••••••••••••••••••"}
                </span>
              </div>
              <div className="token-actions">
                <button
                  className="token-btn"
                  onClick={() => setShowToken(v => !v)}
                  title={showToken ? "Ocultar" : "Mostrar token"}
                >
                  {showToken ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
                <button
                  className="token-btn"
                  onClick={copyToClipboard}
                  title="Copiar token"
                  style={copiedToken ? { color: "#10b981" } : {}}
                >
                  {copiedToken ? <Icons.Check /> : <Icons.Copy />}
                </button>
              </div>
            </div>

            {copiedToken && (
              <p className="token-copied-msg">✓ Token copiado para a área de transferência!</p>
            )}

            <div className="token-danger-zone">
              <div className="token-danger-info">
                <Icons.AlertTriangle />
                <span>Revogar gera um novo token e desconecta a extensão imediatamente.</span>
              </div>
              <button
                onClick={handleRevokeToken}
                disabled={revokingToken}
                className="btn-revoke"
              >
                {revokingToken
                  ? <><span className="btn-spinner" />Revogando...</>
                  : <><Icons.RefreshCw /> Revogar Token</>
                }
              </button>
            </div>
          </div>

          {/* Histórico */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-icon" style={{ background: "rgba(99,102,241,0.12)", color: "#818cf8" }}>
                <Icons.BookOpen />
              </div>
              <div>
                <h2 className="dash-section-title">Histórico de Questões</h2>
                <p className="dash-section-desc">Suas últimas resoluções geradas pela IA</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="dash-empty-state">
                <Icons.Sparkles />
                <p>Nenhuma questão resolvida ainda. Use a extensão para começar!</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`history-card ${expandedHistory === item.id ? "expanded" : ""}`}
                    onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                  >
                    <div className="history-header">
                      <div className="history-type-badge">
                        {item.imageUrl ? <Icons.Image /> : <Icons.Sparkles />}
                        <span>{item.imageUrl ? "Via imagem" : "Via texto"}</span>
                      </div>
                      <div className="history-meta">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                        <span className="history-chevron">
                          {expandedHistory === item.id ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                        </span>
                      </div>
                    </div>
                    <div className="history-snippet">
                      {item.questionText && item.questionText !== "Resolução via imagem"
                        ? item.questionText
                        : "Questão resolvida via captura de tela"}
                    </div>
                    {expandedHistory === item.id && (
                      <div className="history-content">
                        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "13px", lineHeight: "1.7", color: "var(--text-sub)" }}>
                          {item.resolution}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="dash-right-col">

          {/* Comprar Créditos */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                <Icons.CreditCard />
              </div>
              <div>
                <h2 className="dash-section-title">Comprar Créditos</h2>
                <p className="dash-section-desc">Pagamento único, sem assinatura</p>
              </div>
            </div>

            <div className="plans-list">
              {[
                { id: "plan_50", credits: 50, price: "R$ 19,90", popular: false, pricePerUnit: "R$ 0,40/crédito" },
                { id: "plan_150", credits: 150, price: "R$ 39,90", popular: true, pricePerUnit: "R$ 0,27/crédito" },
                { id: "plan_500", credits: 500, price: "R$ 99,90", popular: false, pricePerUnit: "R$ 0,20/crédito" },
              ].map((plan) => (
                <div key={plan.id} className={`plan-item ${plan.popular ? "plan-popular" : ""}`}>
                  {plan.popular && <span className="plan-badge">Mais popular</span>}
                  <div className="plan-info">
                    <div className="plan-credits">
                      <span className="plan-credit-num">{plan.credits}</span>
                      <span className="plan-credit-label"> créditos</span>
                    </div>
                    <div className="plan-per-unit">{plan.pricePerUnit}</div>
                  </div>
                  <div className="plan-purchase">
                    <div className="plan-price">{plan.price}</div>
                    <button
                      onClick={() => handleBuyCredits(plan.id)}
                      disabled={buyingPlan !== null}
                      className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"} btn-small`}
                    >
                      {buyingPlan === plan.id ? "..." : "Comprar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guia de instalação */}
          <div className="dash-section-card">
            <div className="dash-section-header">
              <div className="dash-section-icon" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                <Icons.Puzzle />
              </div>
              <div>
                <h2 className="dash-section-title">Instalar a Extensão</h2>
                <p className="dash-section-desc">Configure em menos de 1 minuto</p>
              </div>
            </div>

            <div className="extension-steps" style={{ marginBottom: "20px" }}>
              {[
                {
                  n: 1,
                  text: (
                    <>
                      Adicione a extensão ao seu navegador diretamente da{" "}
                      <a
                        href="https://chromewebstore.google.com/detail/eacoblodcakhhomdekjoakcngdbiijkk"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#fbbf24", textDecoration: "underline", fontWeight: "600" }}
                      >
                        Chrome Web Store
                      </a>.
                    </>
                  ),
                },
                {
                  n: 2,
                  text: <>Clique no ícone da extensão (ou no menu de extensões 🧩) no topo do seu navegador.</>,
                },
                {
                  n: 3,
                  text: <>Abra a extensão, cole seu token de acesso acima e clique em <strong>Conectar Conta</strong>.</>,
                },
              ].map(({ n, text }) => (
                <div className="step-item" key={n}>
                  <span className="step-badge">{n}</span>
                  <span className="step-desc">{text}</span>
                </div>
              ))}
            </div>

            <a
              href="https://chromewebstore.google.com/detail/eacoblodcakhhomdekjoakcngdbiijkk"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: "100%", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
            >
              <Icons.Puzzle />
              Instalar da Chrome Web Store
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
