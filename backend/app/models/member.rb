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
  has_one_attached :photo

  has_many :ministry_memberships, dependent: :destroy
  has_many :ministries, through: :ministry_memberships
  has_many :schedule_assignments, dependent: :destroy
  has_many :schedules, through: :schedule_assignments

  ALLOWED_PHOTO_TYPES = %w[image/jpeg image/png image/webp image/heic image/heif].freeze
  MAX_PHOTO_SIZE = 5.megabytes

  validates :full_name, presence: true
  validates :birth_date, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :cpf, uniqueness: true, allow_blank: true
  validates :photo, presence: true, on: :self_registration

  normalizes :email, with: ->(email) { email.strip.downcase }
  normalizes :cpf, with: ->(cpf) { cpf.gsub(/\D/, "").presence }

  validate :birth_date_cannot_be_in_the_future
  validate :photo_must_be_a_valid_image, if: -> { photo.attached? }

  def photo_url
    Rails.application.routes.url_helpers.rails_blob_path(photo, only_path: true) if photo.attached?
  end

  def as_json(options = {})
    super(options).merge("photo_url" => photo_url)
  end

  private

  def birth_date_cannot_be_in_the_future
    return if birth_date.blank?

    errors.add(:birth_date, "não pode ser uma data futura") if birth_date > Date.current
  end

  def photo_must_be_a_valid_image
    unless ALLOWED_PHOTO_TYPES.include?(photo.content_type)
      errors.add(:photo, "deve ser uma imagem (JPEG, PNG, WEBP ou HEIC)")
    end

    if photo.byte_size > MAX_PHOTO_SIZE
      errors.add(:photo, "não pode passar de 5MB")
    end
  end
end
