class User < ApplicationRecord
  has_secure_password

  enum :role, { staff: 0, admin: 1 }, default: :staff

  has_many :registration_links, foreign_key: :created_by_id, inverse_of: :created_by

  validates :email, presence: true, uniqueness: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :password, length: { minimum: 8 }, allow_nil: true

  normalizes :email, with: ->(email) { email.strip.downcase }
end
