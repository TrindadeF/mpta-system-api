import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest, ApiError } from "../api/client";
import type { Member, Ministry } from "../types";

export function MinistryDetailPage() {
  const { id } = useParams();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    Promise.all([
      apiRequest<Ministry>(`/api/v1/ministries/${id}`),
      apiRequest<Member[]>("/api/v1/members"),
    ])
      .then(([ministryData, membersData]) => {
        setMinistry(ministryData);
        setMembers(membersData);
        setSelectedIds(new Set(ministryData.members.map((m) => m.id)));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Erro ao carregar dados"));
  }, [id]);

  function toggleMember(memberId: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSavedMessage(false);
    try {
      const updated = await apiRequest<Ministry>(`/api/v1/ministries/${id}`, {
        method: "PATCH",
        body: { ministry: { member_ids: Array.from(selectedIds) } },
      });
      setMinistry(updated);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar membros");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="error-text">{error}</p>;
  if (!ministry || !members) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{ministry.name}</h1>
      <p className="subtitle">Selecione os membros que fazem parte deste ministério.</p>

      <div className="card">
        <div className="checklist">
          {members.map((member) => (
            <label key={member.id} className="checklist-item">
              <input
                type="checkbox"
                checked={selectedIds.has(member.id)}
                onChange={() => toggleMember(member.id)}
              />
              {member.full_name}
            </label>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : savedMessage ? "Salvo!" : "Salvar membros"}
        </button>
      </div>
    </div>
  );
}
