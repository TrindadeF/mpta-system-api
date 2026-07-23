import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { apiRequest, ApiError } from "../api/client";
import { MINISTERIAL_ROLE_LABELS, type MinisterialRole } from "../types";

type LinkState = "checking" | "valid" | "invalid" | "submitted";

const emptyForm = {
  full_name: "",
  birth_date: "",
  email: "",
  phone: "",
  cpf: "",
  address: "",
  ministerial_role: "member" as MinisterialRole,
};

export function PublicRegistrationPage() {
  const { token } = useParams();
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest(`/api/v1/registrations/${token}`, { auth: false })
      .then(() => setLinkState("valid"))
      .catch((err) => {
        setLinkState("invalid");
        setLinkError(err instanceof ApiError ? err.message : "Link inválido");
      });
  }, [token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      await apiRequest(`/api/v1/registrations/${token}`, {
        method: "POST",
        body: { member: form },
        auth: false,
      });
      setLinkState("submitted");
    } catch (err) {
      if (err instanceof ApiError && err.body && typeof err.body === "object" && "errors" in err.body) {
        const fieldErrors = (err.body as { errors: Record<string, string[]> }).errors;
        setErrors(Object.values(fieldErrors).flat());
      } else {
        setErrors([err instanceof ApiError ? err.message : "Erro ao enviar cadastro"]);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (linkState === "checking") {
    return (
      <div className="centered-page">
        <p>Verificando link...</p>
      </div>
    );
  }

  if (linkState === "invalid") {
    return (
      <div className="centered-page">
        <div className="card">
          <h1>Link indisponível</h1>
          <p>{linkError}</p>
          <p>Entre em contato com a secretaria da igreja para receber um novo link.</p>
        </div>
      </div>
    );
  }

  if (linkState === "submitted") {
    return (
      <div className="centered-page">
        <div className="card">
          <h1>Cadastro recebido!</h1>
          <p>Obrigado por preencher seus dados. Seu cadastro foi enviado com sucesso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="centered-page">
      <form className="card form" onSubmit={handleSubmit}>
        <h1>Cadastro de Membro</h1>
        <p className="subtitle">Preencha seus dados pessoais abaixo.</p>

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

        {errors.length > 0 && (
          <ul className="error-text">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar cadastro"}
        </button>
      </form>
    </div>
  );
}
