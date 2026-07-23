import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-bar">
          <span className="brand">Gestão de Membros</span>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={`dashboard-header-collapsible ${menuOpen ? "is-open" : ""}`}>
          <nav>
            <Link to="/membros">Membros</Link>
            <Link to="/links-cadastro">Links de Cadastro</Link>
            <Link to="/ministerios">Ministérios</Link>
            <Link to="/escalas">Escalas</Link>
          </nav>
          <div className="user-info">
            <span>{user?.name}</span>
            <button className="link-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
