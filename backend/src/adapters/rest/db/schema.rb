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

ActiveRecord::Schema[8.0].define(version: 2025_10_10_021826) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "arquitectos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "cedula"
    t.float "valoracion_prom_proyecto"
    t.text "descripcion"
    t.string "especialidades"
    t.string "ubicacion"
    t.boolean "verificado"
    t.integer "vistas_perfil"
    t.uuid "usuario_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cedula"], name: "index_arquitectos_on_cedula", unique: true
    t.index ["usuario_id"], name: "index_arquitectos_on_usuario_id"
  end

  create_table "clientes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "cedula"
    t.uuid "usuario_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["usuario_id"], name: "index_clientes_on_usuario_id"
  end

  create_table "usuarios", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "nombre"
    t.string "apellido"
    t.string "email"
    t.string "estado"
    t.string "password"
    t.string "rol"
    t.date "fecha_registro"
    t.string "foto_perfil"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_usuarios_on_email", unique: true
  end

  add_foreign_key "arquitectos", "usuarios"
  add_foreign_key "clientes", "usuarios"
end
