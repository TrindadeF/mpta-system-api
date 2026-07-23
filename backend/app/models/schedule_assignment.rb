class ScheduleAssignment < ApplicationRecord
  belongs_to :schedule
  belongs_to :member

  validates :member_id, uniqueness: { scope: :schedule_id }
end
