import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, ApiError, resolvePhotoUrl } from "../api/client";
import {
  MEMBERSHIP_STATUS_LABELS,
  MINISTERIAL_ROLE_LABELS,
  type Member,
} from "../types";

export function MembersListPage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function loadMembers() {
    apiRequest<Member[]>("/api/v1/members")
      .then(setMembers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Erro ao carregar membros"));
  }

  useEffect(loadMembers, []);

  async function handleDelete(member: Member) {
    if (!confirm(`Remover ${member.full_name} do cadastro?`)) return;
    try {
      await apiRequest(`/api/v1/members/${member.id}`, { method: "DELETE" });
      loadMembers();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erro ao remover membro");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Membros</h1>
        <Link className="button" to="/membros/novo">
          + Novo membro
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {members === null && !error && <p>Carregando...</p>}

      {members && members.length === 0 && <p>Nenhum membro cadastrado ainda.</p>}

      {members && members.length > 0 && (
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th />
                <th>Nome</th>
                <th>Nascimento</th>
                <th>Função</th>
                <th>Situação</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    {member.photo_url ? (
                      <img src={resolvePhotoUrl(member.photo_url) ?? undefined} alt="" className="avatar-thumb" />
                    ) : (
                      <span className="avatar-thumb avatar-thumb-placeholder" />
                    )}
                  </td>
                  <td>{member.full_name}</td>
                  <td>{new Date(member.birth_date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
                  <td>{MINISTERIAL_ROLE_LABELS[member.ministerial_role]}</td>
                  <td>{MEMBERSHIP_STATUS_LABELS[member.membership_status]}</td>
                  <td className="table-actions">
                    <Link to={`/membros/${member.id}/editar`}>Editar</Link>
                    <button className="link-button" onClick={() => handleDelete(member)}>
                      Remover
                    </button>
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
