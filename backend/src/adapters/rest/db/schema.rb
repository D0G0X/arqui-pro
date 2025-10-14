# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, bin/rails db:schema:load tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_10_12_170735) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

create_table "arquitectos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "cedula", null: false
    t.float "valoracion_prom_proyecto", null: false, default: 0.0
    t.text "descripcion", null: false
    t.string "especialidades", null: false
    t.string "ubicacion", null: false
    t.boolean "verificado", null: false, default: false
    t.integer "vistas_perfil", null: false, default: 0
    t.uuid "usuario_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cedula"], name: "index_arquitectos_on_cedula", unique: true
    t.index ["usuario_id"], name: "index_arquitectos_on_usuario_id"
  end

  create_table "clientes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "cedula", null: false
    t.uuid "usuario_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cedula"], name: "index_clientes_on_cedula", unique: true
    t.index ["usuario_id"], name: "index_clientes_on_usuario_id"
  end

  create_table "conversaciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "fecha", null: false
    t.uuid "cliente_id", null: false
    t.uuid "arquitecto_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["arquitecto_id"], name: "index_conversaciones_on_arquitecto_id"
    t.index ["cliente_id"], name: "index_conversaciones_on_cliente_id"
  end

  create_table "moderadores", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "usuario_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["usuario_id"], name: "index_moderadores_on_usuario_id"
  end

  create_table "notificaciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "mensaje", null: false
    t.date "fecha", null: false
    t.boolean "leido", null: false, default: false
    t.uuid "usuario_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["usuario_id"], name: "index_notificaciones_on_usuario_id"
  end

  create_table "usuarios", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "nombre", null: false
    t.string "apellido", null: false
    t.string "email", null: false
    t.string "estado_cuenta", null: false
    t.string "password", null: false
    t.string "rol", null: false
    t.date "fecha_registro", null: false
    t.string "foto_perfil", null: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_usuarios_on_email", unique: true
    t.check_constraint "estado_cuenta::text = ANY (ARRAY['suspendido'::character varying, 'activo'::character varying]::text[])", name: "estado_check"
    t.check_constraint "rol::text = ANY (ARRAY['cliente'::character varying, 'arquitecto'::character varying, 'moderador'::character varying]::text[])", name: "rol_check"
  end

  create_table "verificaciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "estado", null: false
    t.date "fecha_verificacion", null: false
    t.uuid "arquitecto_id", null: false
    t.uuid "moderador_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["arquitecto_id"], name: "index_verificaciones_on_arquitecto_id", unique: true
    t.index ["moderador_id"], name: "index_verificaciones_on_moderador_id"
    t.check_constraint "estado::text = ANY (ARRAY['pendiente'::character varying, 'verificado'::character varying, 'rechazado'::character varying]::text[])", name: "estado_check"
    
  end

  add_foreign_key "arquitectos", "usuarios"
  add_foreign_key "clientes", "usuarios"
  add_foreign_key "conversaciones", "arquitectos"
  add_foreign_key "conversaciones", "clientes"
  add_foreign_key "moderadores", "usuarios"
  add_foreign_key "notificaciones", "usuarios"
  add_foreign_key "verificaciones", "arquitectos"
  add_foreign_key "verificaciones", "moderadores"

end