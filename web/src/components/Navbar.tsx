import Link from "next/link";

interface NavbarProps {
  user: { name: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="logo">
          <span className="logo-symbol">⚡</span> Sapienia
        </Link>
        <div className="nav-links">
          <a href="#recursos" className="nav-link">Recursos</a>
          <a href="#como-funciona" className="nav-link">Como Funciona</a>
          <a href="#precos" className="nav-link">Planos</a>
          <a href="#faq" className="nav-link">FAQ</a>
          <Link href="/blog" className="nav-link">Blog</Link>
          
          {user ? (
            <Link href="/dashboard" className="btn btn-primary">
              Ir para o Painel
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">
                Entrar
              </Link>
              <Link href="/login" className="btn btn-primary">
                Cadastrar Grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
