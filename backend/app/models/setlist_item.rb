class SetlistItem < ApplicationRecord
  belongs_to :schedule

  validates :title, presence: true
  validates :link, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) }, allow_blank: true
end
