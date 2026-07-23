class Ministry < ApplicationRecord
  has_many :ministry_memberships, dependent: :destroy
  has_many :members, through: :ministry_memberships
  has_many :schedules, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
