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
          <Link href="/#recursos" className="nav-link">Recursos</Link>
          <Link href="/#como-funciona" className="nav-link">Como Funciona</Link>
          <Link href="/#precos" className="nav-link">Planos</Link>
          <Link href="/#faq" className="nav-link">FAQ</Link>
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
