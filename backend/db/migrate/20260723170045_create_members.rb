class CreateMembers < ActiveRecord::Migration[8.0]
  def change
    create_table :members do |t|
      t.string :full_name
      t.date :birth_date
      t.string :email
      t.string :phone
      t.string :cpf
      t.string :address
      t.integer :ministerial_role
      t.integer :membership_status
      t.date :joined_at
      t.text :notes

      t.timestamps
    end
  end
end
