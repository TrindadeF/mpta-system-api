class CreateSetlistItems < ActiveRecord::Migration[8.0]
  def change
    create_table :setlist_items do |t|
      t.references :schedule, null: false, foreign_key: true
      t.string :title
      t.string :link
      t.integer :position

      t.timestamps
    end
  end
end
