class Schedule < ApplicationRecord
  belongs_to :ministry
  belongs_to :created_by, class_name: "User"

  has_many :schedule_assignments, dependent: :destroy
  has_many :members, through: :schedule_assignments
  has_many :setlist_items, -> { order(:position) }, dependent: :destroy

  accepts_nested_attributes_for :setlist_items, allow_destroy: true, reject_if: :all_blank

  validates :service_date, presence: true
end
