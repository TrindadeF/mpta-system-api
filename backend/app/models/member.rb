class Member < ApplicationRecord
  enum :ministerial_role, {
    member: 0,               # membro
    deacon: 1,               # diácono/diaconisa
    presbyter: 2,            # presbítero
    evangelist: 3,           # evangelista
    pastor: 4,               # pastor
    missionary: 5,           # missionário
    worship_leader: 6,       # líder de louvor
    sunday_school_teacher: 7, # professor de EBD
    secretary: 8,            # secretaria
    treasurer: 9              # tesouraria
  }, prefix: true, default: :member

  enum :membership_status, {
    active: 0,
    inactive: 1,
    visitor: 2,
    transferred: 3,
    deceased: 4
  }, default: :active

  has_one :registration_link, dependent: :nullify

  has_many :ministry_memberships, dependent: :destroy
  has_many :ministries, through: :ministry_memberships
  has_many :schedule_assignments, dependent: :destroy
  has_many :schedules, through: :schedule_assignments

  validates :full_name, presence: true
  validates :birth_date, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :cpf, uniqueness: true, allow_blank: true

  normalizes :email, with: ->(email) { email.strip.downcase }
  normalizes :cpf, with: ->(cpf) { cpf.gsub(/\D/, "").presence }

  validate :birth_date_cannot_be_in_the_future

  private

  def birth_date_cannot_be_in_the_future
    return if birth_date.blank?

    errors.add(:birth_date, "não pode ser uma data futura") if birth_date > Date.current
  end
end
