import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiRequest, ApiError } from "../api/client";
import type { Ministry } from "../types";

export function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[] | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function loadMinistries() {
    apiRequest<Ministry[]>("/api/v1/ministries")
      .then(setMinistries)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Erro ao carregar ministérios"));
  }

  useEffect(loadMinistries, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiRequest("/api/v1/ministries", { method: "POST", body: { ministry: { name } } });
      setName("");
      loadMinistries();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao criar ministério");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Ministérios</h1>
      </div>

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          placeholder="Nome do ministério (ex: Louvor)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Criando..." : "+ Novo ministério"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {ministries && ministries.length === 0 && <p>Nenhum ministério cadastrado ainda.</p>}

      {ministries && ministries.length > 0 && (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Membros</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {ministries.map((ministry) => (
                <tr key={ministry.id}>
                  <td>{ministry.name}</td>
                  <td>{ministry.members.length}</td>
                  <td className="table-actions">
                    <Link to={`/ministerios/${ministry.id}`}>Gerenciar membros</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
