class CreateMinistryMemberships < ActiveRecord::Migration[8.0]
  def change
    create_table :ministry_memberships do |t|
      t.references :ministry, null: false, foreign_key: true
      t.references :member, null: false, foreign_key: true

      t.timestamps
    end
    add_index :ministry_memberships, [:ministry_id, :member_id], unique: true
  end
end
