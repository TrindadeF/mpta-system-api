export type UserRole = "staff" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type MinisterialRole =
  | "member"
  | "deacon"
  | "presbyter"
  | "evangelist"
  | "pastor"
  | "missionary"
  | "worship_leader"
  | "sunday_school_teacher"
  | "secretary"
  | "treasurer";

export type MembershipStatus =
  | "active"
  | "inactive"
  | "visitor"
  | "transferred"
  | "deceased";

export interface Member {
  id: number;
  full_name: string;
  birth_date: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  address: string | null;
  ministerial_role: MinisterialRole;
  membership_status: MembershipStatus;
  joined_at: string | null;
  notes: string | null;
  photo_url: string | null;
}

export type MemberInput = Omit<Member, "id">;

export interface RegistrationLink {
  id: number;
  token: string;
  status: "pending" | "used" | "revoked";
  expires_at: string;
  used_at: string | null;
  created_by_id: number;
  member_id: number | null;
  member?: Member | null;
  registration_url?: string;
}

export interface MemberSummary {
  id: number;
  full_name: string;
  phone?: string | null;
  photo_url?: string | null;
}

export interface Ministry {
  id: number;
  name: string;
  members: MemberSummary[];
}

export interface SetlistItem {
  id?: number;
  title: string;
  link: string;
  position: number;
  _destroy?: boolean;
}

export interface Schedule {
  id: number;
  ministry_id: number;
  service_date: string;
  title: string | null;
  ministry: { id: number; name: string };
  members: MemberSummary[];
  setlist_items: SetlistItem[];
}

export const MINISTERIAL_ROLE_LABELS: Record<MinisterialRole, string> = {
  member: "Membro",
  deacon: "Diácono(isa)",
  presbyter: "Presbítero",
  evangelist: "Evangelista",
  pastor: "Pastor(a)",
  missionary: "Missionário(a)",
  worship_leader: "Líder de Louvor",
  sunday_school_teacher: "Professor(a) de EBD",
  secretary: "Secretaria",
  treasurer: "Tesouraria",
};

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
  visitor: "Visitante",
  transferred: "Transferido",
  deceased: "Falecido",
};
