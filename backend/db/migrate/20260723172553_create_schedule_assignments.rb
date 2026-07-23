class CreateScheduleAssignments < ActiveRecord::Migration[8.0]
  def change
    create_table :schedule_assignments do |t|
      t.references :schedule, null: false, foreign_key: true
      t.references :member, null: false, foreign_key: true
      t.datetime :notified_at

      t.timestamps
    end
    add_index :schedule_assignments, [:schedule_id, :member_id], unique: true
  end
end
