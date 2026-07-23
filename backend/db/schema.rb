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

ActiveRecord::Schema[8.0].define(version: 2026_07_23_194132) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

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

  create_table "ministries", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_ministries_on_name", unique: true
  end

  create_table "ministry_memberships", force: :cascade do |t|
    t.bigint "ministry_id", null: false
    t.bigint "member_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["member_id"], name: "index_ministry_memberships_on_member_id"
    t.index ["ministry_id", "member_id"], name: "index_ministry_memberships_on_ministry_id_and_member_id", unique: true
    t.index ["ministry_id"], name: "index_ministry_memberships_on_ministry_id"
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

  create_table "schedule_assignments", force: :cascade do |t|
    t.bigint "schedule_id", null: false
    t.bigint "member_id", null: false
    t.datetime "notified_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["member_id"], name: "index_schedule_assignments_on_member_id"
    t.index ["schedule_id", "member_id"], name: "index_schedule_assignments_on_schedule_id_and_member_id", unique: true
    t.index ["schedule_id"], name: "index_schedule_assignments_on_schedule_id"
  end

  create_table "schedules", force: :cascade do |t|
    t.bigint "ministry_id", null: false
    t.datetime "service_date", null: false
    t.string "title"
    t.bigint "created_by_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_id"], name: "index_schedules_on_created_by_id"
    t.index ["ministry_id"], name: "index_schedules_on_ministry_id"
  end

  create_table "setlist_items", force: :cascade do |t|
    t.bigint "schedule_id", null: false
    t.string "title"
    t.string "link"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["schedule_id"], name: "index_setlist_items_on_schedule_id"
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

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "ministry_memberships", "members"
  add_foreign_key "ministry_memberships", "ministries"
  add_foreign_key "registration_links", "members"
  add_foreign_key "registration_links", "users", column: "created_by_id"
  add_foreign_key "schedule_assignments", "members"
  add_foreign_key "schedule_assignments", "schedules"
  add_foreign_key "schedules", "ministries"
  add_foreign_key "schedules", "users", column: "created_by_id"
  add_foreign_key "setlist_items", "schedules"
end
