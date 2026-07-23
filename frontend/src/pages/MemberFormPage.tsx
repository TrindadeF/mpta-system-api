import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest, ApiError } from "../api/client";
import {
  MEMBERSHIP_STATUS_LABELS,
  MINISTERIAL_ROLE_LABELS,
  type Member,
  type MembershipStatus,
  type MinisterialRole,
} from "../types";

const emptyForm = {
  full_name: "",
  birth_date: "",
  email: "",
  phone: "",
  cpf: "",
  address: "",
  ministerial_role: "member" as MinisterialRole,
  membership_status: "active" as MembershipStatus,
  joined_at: "",
  notes: "",
};

export function MemberFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    apiRequest<Member>(`/api/v1/members/${id}`)
      .then((member) =>
        setForm({
          full_name: member.full_name,
          birth_date: member.birth_date,
          email: member.email ?? "",
          phone: member.phone ?? "",
          cpf: member.cpf ?? "",
          address: member.address ?? "",
          ministerial_role: member.ministerial_role,
          membership_status: member.membership_status,
          joined_at: member.joined_at ?? "",
          notes: member.notes ?? "",
        }),
      )
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      const path = isEditing ? `/api/v1/members/${id}` : "/api/v1/members";
      await apiRequest(path, { method: isEditing ? "PATCH" : "POST", body: { member: form } });
      navigate("/membros");
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === "object" && "errors" in err.body) {
        const fieldErrors = (err.body as { errors: Record<string, string[]> }).errors;
        setErrors(Object.values(fieldErrors).flat());
      } else {
        setErrors(["Erro ao salvar membro"]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h1>{isEditing ? "Editar membro" : "Novo membro"}</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Nome completo
          <input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
        </label>

        <label>
          Data de nascimento
          <input
            type="date"
            value={form.birth_date}
            onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            required
          />
        </label>

        <label>
          Função eclesiástica / ministerial
          <select
            value={form.ministerial_role}
            onChange={(e) => setForm({ ...form, ministerial_role: e.target.value as MinisterialRole })}
          >
            {Object.entries(MINISTERIAL_ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Situação de membresia
          <select
            value={form.membership_status}
            onChange={(e) => setForm({ ...form, membership_status: e.target.value as MembershipStatus })}
          >
            {Object.entries(MEMBERSHIP_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label>
          Telefone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        <label>
          CPF
          <input
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          />
        </label>

        <label>
          Endereço
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>

        <label>
          Data de admissão / membresia
          <input
            type="date"
            value={form.joined_at}
            onChange={(e) => setForm({ ...form, joined_at: e.target.value })}
          />
        </label>

        <label>
          Observações
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />
        </label>

        {errors.length > 0 && (
          <ul className="error-text">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
