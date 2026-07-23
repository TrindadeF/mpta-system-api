class CreateMinistries < ActiveRecord::Migration[8.0]
  def change
    create_table :ministries do |t|
      t.string :name

      t.timestamps
    end
    add_index :ministries, :name, unique: true
  end
end
