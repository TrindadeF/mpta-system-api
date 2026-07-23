# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_07_23_170053) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "members", force: :cascade do |t|
    t.string "full_name"
    t.date "birth_date"
    t.string "email"
    t.string "phone"
    t.string "cpf"
    t.string "address"
    t.integer "ministerial_role"
    t.integer "membership_status"
    t.date "joined_at"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "registration_links", force: :cascade do |t|
    t.string "token"
    t.integer "status"
    t.datetime "expires_at"
    t.datetime "used_at"
    t.bigint "created_by_id", null: false
    t.bigint "member_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_registration_links_on_created_by_id"
    t.index ["member_id"], name: "index_registration_links_on_member_id"
    t.index ["token"], name: "index_registration_links_on_token", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "name"
    t.integer "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "registration_links", "members"
  add_foreign_key "registration_links", "users", column: "created_by_id"
end
