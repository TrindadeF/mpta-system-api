import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, ApiError } from "../api/client";
import type { Schedule } from "../types";

export function SchedulesListPage() {
  const [schedules, setSchedules] = useState<Schedule[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function loadSchedules() {
    apiRequest<Schedule[]>("/api/v1/schedules")
      .then(setSchedules)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Erro ao carregar escalas"));
  }

  useEffect(loadSchedules, []);

  async function handleDelete(schedule: Schedule) {
    if (!confirm(`Remover a escala "${schedule.title ?? "sem título"}"?`)) return;
    try {
      await apiRequest(`/api/v1/schedules/${schedule.id}`, { method: "DELETE" });
      loadSchedules();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erro ao remover escala");
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Escalas</h1>
        <Link className="button" to="/escalas/nova">
          + Nova escala
        </Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {schedules && schedules.length === 0 && <p>Nenhuma escala cadastrada ainda.</p>}

      {schedules && schedules.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Ministério</th>
              <th>Título</th>
              <th>Data</th>
              <th>Escalados</th>
              <th>Setlist</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.ministry.name}</td>
                <td>{schedule.title ?? "—"}</td>
                <td>{new Date(schedule.service_date).toLocaleString("pt-BR")}</td>
                <td>{schedule.members.length}</td>
                <td>{schedule.setlist_items.length} música(s)</td>
                <td className="table-actions">
                  <Link to={`/escalas/${schedule.id}/editar`}>Editar</Link>
                  <button className="link-button" onClick={() => handleDelete(schedule)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
