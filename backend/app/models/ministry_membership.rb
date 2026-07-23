class MinistryMembership < ApplicationRecord
  belongs_to :ministry
  belongs_to :member

  validates :member_id, uniqueness: { scope: :ministry_id }
end
