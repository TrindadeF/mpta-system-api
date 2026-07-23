import { useEffect, useState } from "react";
import { apiRequest, ApiError } from "../api/client";
import type { RegistrationLink } from "../types";

const STATUS_LABELS: Record<RegistrationLink["status"], string> = {
  pending: "Aguardando preenchimento",
  used: "Preenchido",
  revoked: "Revogado",
};

export function RegistrationLinksPage() {
  const [links, setLinks] = useState<RegistrationLink[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  function loadLinks() {
    apiRequest<RegistrationLink[]>("/api/v1/registration_links")
      .then(setLinks)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Erro ao carregar links"));
  }

  useEffect(loadLinks, []);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      await apiRequest("/api/v1/registration_links", { method: "POST" });
      loadLinks();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao gerar link");
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke(link: RegistrationLink) {
    if (!confirm("Revogar este link? Ele deixará de funcionar.")) return;
    try {
      await apiRequest(`/api/v1/registration_links/${link.id}`, { method: "DELETE" });
      loadLinks();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erro ao revogar link");
    }
  }

  async function handleCopy(link: RegistrationLink) {
    const url = link.registration_url ?? `${window.location.origin}/cadastro/${link.token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Links de Cadastro</h1>
        <button className="button" onClick={handleGenerate} disabled={generating}>
          {generating ? "Gerando..." : "+ Gerar novo link"}
        </button>
      </div>

      <p className="subtitle">
        Gere um link único e envie para a pessoa preencher seus próprios dados. O link expira em 7 dias
        ou assim que for utilizado.
      </p>

      {error && <p className="error-text">{error}</p>}

      {links && links.length === 0 && <p>Nenhum link gerado ainda.</p>}

      {links && links.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Expira em</th>
              <th>Preenchido por</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td>{STATUS_LABELS[link.status]}</td>
                <td>{new Date(link.expires_at).toLocaleString("pt-BR")}</td>
                <td>{link.member?.full_name ?? "—"}</td>
                <td className="table-actions">
                  {link.status === "pending" && (
                    <>
                      <button className="link-button" onClick={() => handleCopy(link)}>
                        {copiedId === link.id ? "Copiado!" : "Copiar link"}
                      </button>
                      <button className="link-button" onClick={() => handleRevoke(link)}>
                        Revogar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
