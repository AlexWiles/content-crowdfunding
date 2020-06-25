# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_19_030649) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

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
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "beta_users", force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "follows", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "aasm_state"
    t.index ["project_id"], name: "index_follows_on_project_id"
    t.index ["user_id", "project_id"], name: "index_follows_on_user_id_and_project_id", unique: true
    t.index ["user_id"], name: "index_follows_on_user_id"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "paywalls", force: :cascade do |t|
    t.string "funding_type"
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "amount_cents", default: 0, null: false
    t.string "amount_currency", default: "USD", null: false
    t.string "aasm_state"
    t.datetime "published_at"
    t.datetime "expires_at"
    t.integer "duration"
    t.integer "minimum_cents"
    t.string "minimum_currency", default: "USD", null: false
    t.index ["project_id"], name: "index_paywalls_on_project_id"
  end

  create_table "pledges", force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "state"
    t.bigint "paywall_id", null: false
    t.integer "amount_cents", default: 0, null: false
    t.string "amount_currency", default: "USD", null: false
    t.bigint "user_id", null: false
    t.bigint "stripe_source_id", null: false
    t.index ["paywall_id"], name: "index_pledges_on_paywall_id"
    t.index ["stripe_source_id"], name: "index_pledges_on_stripe_source_id"
    t.index ["user_id"], name: "index_pledges_on_user_id"
  end

  create_table "post_notifications", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.bigint "follow_id", null: false
    t.datetime "sent_at"
    t.string "aasm_state"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["follow_id"], name: "index_post_notifications_on_follow_id"
    t.index ["post_id", "follow_id"], name: "index_post_notifications_on_post_id_and_follow_id", unique: true
    t.index ["post_id"], name: "index_post_notifications_on_post_id"
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.string "state"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "title"
    t.datetime "published_at"
    t.string "description"
    t.string "slug"
    t.json "body"
    t.boolean "public", default: false, null: false
    t.datetime "notifications_created_at"
    t.string "color"
    t.index ["project_id"], name: "index_posts_on_project_id"
    t.index ["slug"], name: "index_posts_on_slug", unique: true
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "goal"
    t.string "slug"
    t.string "aasm_state"
    t.string "description"
    t.string "project_type"
    t.datetime "published_at"
    t.json "body"
    t.string "special_id"
    t.integer "platform_fee_override"
    t.string "color"
    t.string "post_order"
    t.index ["slug"], name: "index_projects_on_slug", unique: true
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "stripe_accounts", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_stripe_accounts_on_user_id"
  end

  create_table "stripe_charges", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "stripe_source_id", null: false
    t.bigint "stripe_account_id", null: false
    t.bigint "pledge_id", null: false
    t.integer "total_cents", default: 0, null: false
    t.string "total_currency", default: "USD", null: false
    t.integer "paid_cents", default: 0, null: false
    t.string "paid_currency", default: "USD", null: false
    t.integer "stripe_fee_cents", default: 0, null: false
    t.string "stripe_fee_currency", default: "USD", null: false
    t.integer "platform_fee_cents", default: 0, null: false
    t.string "platform_fee_currency", default: "USD", null: false
    t.string "aasm_state"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["pledge_id"], name: "index_stripe_charges_on_pledge_id"
    t.index ["stripe_account_id"], name: "index_stripe_charges_on_stripe_account_id"
    t.index ["stripe_source_id"], name: "index_stripe_charges_on_stripe_source_id"
  end

  create_table "stripe_customers", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_stripe_customers_on_user_id"
  end

  create_table "stripe_sources", force: :cascade do |t|
    t.string "stripe_id"
    t.bigint "stripe_customer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "object"
    t.string "brand"
    t.string "country"
    t.integer "exp_month"
    t.integer "exp_year"
    t.string "last4"
    t.index ["stripe_customer_id"], name: "index_stripe_sources_on_stripe_customer_id"
  end

  create_table "unconfirmed_follows", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id", null: false
    t.string "aasm_state"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_unconfirmed_follows_on_project_id"
    t.index ["user_id", "project_id"], name: "index_unconfirmed_follows_on_user_id_and_project_id", unique: true
    t.index ["user_id"], name: "index_unconfirmed_follows_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "username"
    t.string "slug"
    t.string "display_name"
    t.string "color"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "follows", "projects"
  add_foreign_key "follows", "users"
  add_foreign_key "paywalls", "projects"
  add_foreign_key "pledges", "paywalls"
  add_foreign_key "pledges", "stripe_sources"
  add_foreign_key "pledges", "users"
  add_foreign_key "post_notifications", "follows"
  add_foreign_key "post_notifications", "posts"
  add_foreign_key "posts", "projects"
  add_foreign_key "stripe_accounts", "users"
  add_foreign_key "stripe_charges", "pledges"
  add_foreign_key "stripe_charges", "stripe_accounts"
  add_foreign_key "stripe_charges", "stripe_sources"
  add_foreign_key "stripe_customers", "users"
  add_foreign_key "stripe_sources", "stripe_customers"
  add_foreign_key "unconfirmed_follows", "projects"
  add_foreign_key "unconfirmed_follows", "users"
end
