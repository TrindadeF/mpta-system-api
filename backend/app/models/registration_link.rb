class RegistrationLink < ApplicationRecord
  DEFAULT_VALIDITY = 7.days

  enum :status, { pending: 0, used: 1, revoked: 2 }, default: :pending

  belongs_to :created_by, class_name: "User"
  belongs_to :member, optional: true

  before_validation :generate_token, on: :create
  before_validation :set_default_expiration, on: :create

  validates :token, presence: true, uniqueness: true

  scope :active, -> { where(status: :pending).where("expires_at > ?", Time.current) }

  def expired?
    expires_at.present? && expires_at <= Time.current
  end

  def usable?
    pending? && !expired?
  end

  def mark_used!(member)
    update!(status: :used, used_at: Time.current, member: member)
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(24)
  end

  def set_default_expiration
    self.expires_at ||= DEFAULT_VALIDITY.from_now
  end
end
