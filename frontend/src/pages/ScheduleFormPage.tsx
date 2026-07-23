import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest, ApiError } from "../api/client";
import type { Ministry, Schedule, SetlistItem } from "../types";

function toDatetimeLocal(isoString: string): string {
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function ScheduleFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [ministryId, setMinistryId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [memberIds, setMemberIds] = useState<Set<number>>(new Set());
  const [setlistItems, setSetlistItems] = useState<SetlistItem[]>([{ title: "", link: "", position: 1 }]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest<Ministry[]>("/api/v1/ministries").then(async (ministriesData) => {
      setMinistries(ministriesData);

      if (isEditing) {
        const schedule = await apiRequest<Schedule>(`/api/v1/schedules/${id}`);
        setMinistryId(schedule.ministry_id);
        setTitle(schedule.title ?? "");
        setServiceDate(toDatetimeLocal(schedule.service_date));
        setMemberIds(new Set(schedule.members.map((m) => m.id)));
        setSetlistItems(
          schedule.setlist_items.length > 0
            ? schedule.setlist_items
            : [{ title: "", link: "", position: 1 }],
        );
      } else if (ministriesData.length > 0) {
        setMinistryId(ministriesData[0].id);
      }
      setLoading(false);
    });
  }, [id, isEditing]);

  const selectedMinistry = ministries.find((m) => m.id === ministryId);

  function toggleMember(memberId: number) {
    setMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  }

  function updateSetlistItem(index: number, field: "title" | "link", value: string) {
    setSetlistItems((items) => items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addSetlistItem() {
    setSetlistItems((items) => [...items, { title: "", link: "", position: items.length + 1 }]);
  }

  function removeSetlistItem(index: number) {
    setSetlistItems((items) => {
      const item = items[index];
      if (item.id) {
        return items.map((it, i) => (i === index ? { ...it, _destroy: true } : it));
      }
      return items.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const setlistItemsAttributes = setlistItems
      .filter((item) => item._destroy || item.title.trim() !== "")
      .map((item, index) => ({ ...item, position: index + 1 }));

    try {
      const path = isEditing ? `/api/v1/schedules/${id}` : "/api/v1/schedules";
      await apiRequest(path, {
        method: isEditing ? "PATCH" : "POST",
        body: {
          schedule: {
            ministry_id: ministryId,
            title,
            service_date: new Date(serviceDate).toISOString(),
            member_ids: Array.from(memberIds),
            setlist_items_attributes: setlistItemsAttributes,
          },
        },
      });
      navigate("/escalas");
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === "object" && "errors" in err.body) {
        const fieldErrors = (err.body as { errors: Record<string, string[]> }).errors;
        setErrors(Object.values(fieldErrors).flat());
      } else {
        setErrors(["Erro ao salvar escala"]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{isEditing ? "Editar escala" : "Nova escala"}</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Ministério
          <select
            value={ministryId}
            onChange={(e) => {
              setMinistryId(Number(e.target.value));
              setMemberIds(new Set());
            }}
            required
          >
            {ministries.map((ministry) => (
              <option key={ministry.id} value={ministry.id}>
                {ministry.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Título
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Culto de Domingo Noite"
          />
        </label>

        <label>
          Data e hora do culto
          <input
            type="datetime-local"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            required
          />
        </label>

        <div>
          <p className="field-label">Membros escalados</p>
          {selectedMinistry && selectedMinistry.members.length === 0 && (
            <p className="subtitle">Este ministério ainda não tem membros vinculados.</p>
          )}
          <div className="checklist">
            {selectedMinistry?.members.map((member) => (
              <label key={member.id} className="checklist-item">
                <input
                  type="checkbox"
                  checked={memberIds.has(member.id)}
                  onChange={() => toggleMember(member.id)}
                />
                {member.full_name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="field-label">Setlist</p>
          {setlistItems.map((item, index) =>
            item._destroy ? null : (
              <div key={item.id ?? index} className="setlist-row">
                <input
                  placeholder="Nome da música"
                  value={item.title}
                  onChange={(e) => updateSetlistItem(index, "title", e.target.value)}
                />
                <input
                  placeholder="Link (YouTube, Spotify...)"
                  value={item.link}
                  onChange={(e) => updateSetlistItem(index, "link", e.target.value)}
                />
                <button type="button" className="link-button" onClick={() => removeSetlistItem(index)}>
                  Remover
                </button>
              </div>
            ),
          )}
          <button type="button" className="link-button" onClick={addSetlistItem}>
            + Adicionar música
          </button>
        </div>

        {errors.length > 0 && (
          <ul className="error-text">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar escala"}
        </button>
      </form>
    </div>
  );
}
