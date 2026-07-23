class CreateRegistrationLinks < ActiveRecord::Migration[8.0]
  def change
    create_table :registration_links do |t|
      t.string :token
      t.integer :status
      t.datetime :expires_at
      t.datetime :used_at
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.references :member, null: true, foreign_key: true

      t.timestamps
    end
    add_index :registration_links, :token, unique: true
  end
end
