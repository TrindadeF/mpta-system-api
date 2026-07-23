import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="brand">Gestão de Membros</span>
        <nav>
          <Link to="/membros">Membros</Link>
          <Link to="/links-cadastro">Links de Cadastro</Link>
        </nav>
        <div className="user-info">
          <span>{user?.name}</span>
          <button className="link-button" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
