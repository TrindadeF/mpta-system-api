import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { apiRequest, apiUpload, ApiError } from "../api/client";
import { MINISTERIAL_ROLE_LABELS, type MinisterialRole } from "../types";
import { BrandLogo } from "../components/BrandLogo";

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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setPhoto(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

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

    if (!photo) {
      setErrors(["Envie uma foto para concluir o cadastro."]);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(`member[${key}]`, value));
      formData.append("member[photo]", photo);

      await apiUpload(`/api/v1/registrations/${token}`, formData, { auth: false });
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
          <div className="brand-header">
            <BrandLogo size={64} />
            <p className="brand-name">Ministério Profético Tabernáculo da Adoração</p>
          </div>
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
          <div className="brand-header">
            <BrandLogo size={64} />
            <p className="brand-name">Ministério Profético Tabernáculo da Adoração</p>
          </div>
          <h1>Cadastro recebido!</h1>
          <p>Obrigado por preencher seus dados. Seu cadastro foi enviado com sucesso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="centered-page">
      <form className="card form" onSubmit={handleSubmit}>
        <div className="brand-header">
          <BrandLogo size={64} />
          <p className="brand-name">Ministério Profético Tabernáculo da Adoração</p>
        </div>
        <h1>Cadastro de Membro</h1>
        <p className="subtitle">Preencha seus dados pessoais abaixo.</p>

        <label>
          Foto (obrigatória)
          <div className="photo-upload">
            {photoPreview && <img src={photoPreview} alt="Prévia da foto" className="photo-preview" />}
            <input type="file" accept="image/*" capture="user" onChange={handlePhotoChange} required />
          </div>
        </label>

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
