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

ActiveRecord::Schema[8.0].define(version: 2025_10_17_160144) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "extensions.pg_stat_statements"
  enable_extension "extensions.pgcrypto"
  enable_extension "extensions.uuid-ossp"
  enable_extension "graphql.pg_graphql"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "vault.supabase_vault"

  create_table "arquitectos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "cedula", null: false
    t.float "valoracion_prom_proyecto", default: 0.0, null: false
    t.text "descripcion", null: false
    t.string "especialidades", null: false
    t.string "ubicacion", null: false
    t.boolean "verificado", default: false, null: false
    t.integer "vistas_perfil", default: 0, null: false
    t.uuid "usuario_id", null: false
    t.index ["cedula"], name: "index_arquitectos_on_cedula", unique: true
    t.index ["usuario_id"], name: "index_arquitectos_on_usuario_id"
  end

  create_table "avances", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "descripcion", null: false
    t.date "fecha", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.uuid "proyecto_id", null: false
    t.index ["proyecto_id"], name: "index_avances_on_proyecto_id"
  end

  create_table "clientes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "cedula", null: false
    t.uuid "usuario_id", null: false
    t.index ["cedula"], name: "index_clientes_on_cedula", unique: true
    t.index ["usuario_id"], name: "index_clientes_on_usuario_id"
  end

  create_table "conversaciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "fecha", null: false
    t.uuid "cliente_id", null: false
    t.uuid "arquitecto_id", null: false
    t.index ["arquitecto_id"], name: "index_conversaciones_on_arquitecto_id"
    t.index ["cliente_id"], name: "index_conversaciones_on_cliente_id"
  end

  create_table "imagen_asociaciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "asociable_type", null: false
    t.string "asociable_id", null: false
    t.uuid "imagen_id", null: false
    t.index ["asociable_type", "asociable_id"], name: "index_imagen_asociaciones_on_asociable_type_and_asociable_id"
    t.index ["imagen_id"], name: "index_imagen_asociaciones_on_imagen_id"
    t.check_constraint "asociable_type::text = ANY (ARRAY['Proyecto'::character varying, 'Mensaje'::character varying, 'Incidencia'::character varying, 'Avance'::character varying]::text[])", name: "asociable_type_imagen_asociacion_check"
  end

  create_table "imagenes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "imagen_url", null: false
    t.date "fecha", default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "incidencias", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "descripcion", null: false
    t.string "estado", null: false
    t.date "fecha", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.uuid "usuario_emisor_id", null: false
    t.uuid "usuario_infractor_id", null: false
    t.uuid "moderador_id", null: false
    t.index ["moderador_id"], name: "index_incidencias_on_moderador_id"
    t.index ["usuario_emisor_id"], name: "index_incidencias_on_usuario_emisor_id"
    t.index ["usuario_infractor_id"], name: "index_incidencias_on_usuario_infractor_id"
    t.check_constraint "estado::text = ANY (ARRAY['pendiente'::character varying, 'resuelto'::character varying, 'en revision'::character varying]::text[])", name: "estado_incidencia_check"
  end

  create_table "mensajes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "contenido", null: false
    t.date "fecha_envio", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.boolean "leido", default: false, null: false
    t.uuid "conversacion_id", null: false
    t.uuid "remitente_id", null: false
    t.index ["conversacion_id"], name: "index_mensajes_on_conversacion_id"
    t.index ["remitente_id"], name: "index_mensajes_on_remitente_id"
  end

  create_table "moderadores", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "usuario_id", null: false
    t.index ["usuario_id"], name: "index_moderadores_on_usuario_id"
  end

  create_table "notificaciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "mensaje", null: false
    t.date "fecha", null: false
    t.boolean "leido", default: false, null: false
    t.uuid "usuario_id", null: false
    t.index ["usuario_id"], name: "index_notificaciones_on_usuario_id"
  end

  create_table "proyectos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "titulo_proyecto", null: false
    t.float "valoracion_promedio", default: 0.0, null: false
    t.text "descripcion", null: false
    t.string "tipo_proyecto", null: false
    t.date "fecha_publicacion", null: false
    t.uuid "arquitecto_id", null: false
    t.uuid "conversacion_id"
    t.uuid "cliente_id"
    t.uuid "solicitud_proyecto_id"
    t.index ["arquitecto_id"], name: "index_proyectos_on_arquitecto_id"
    t.index ["cliente_id"], name: "index_proyectos_on_cliente_id"
    t.index ["conversacion_id"], name: "index_proyectos_on_conversacion_id"
    t.index ["solicitud_proyecto_id"], name: "index_proyectos_on_solicitud_proyecto_id"
    t.check_constraint "tipo_proyecto::text = ANY (ARRAY['portafolio'::character varying, 'contratado'::character varying]::text[])", name: "tipo_proyecto_check"
  end

  create_table "solicitudes_proyecto", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "estado", default: "pendiente", null: false
    t.date "fecha", null: false
    t.uuid "arquitecto_id", null: false
    t.uuid "cliente_id", null: false
    t.index ["arquitecto_id"], name: "index_solicitudes_proyecto_on_arquitecto_id"
    t.index ["cliente_id"], name: "index_solicitudes_proyecto_on_cliente_id"
    t.check_constraint "estado::text = ANY (ARRAY['pendiente'::character varying, 'aceptado'::character varying, 'rechazado'::character varying]::text[])", name: "estado_solicitud_proyecto_check"
  end

  create_table "usuarios", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "nombre", null: false
    t.string "apellido", null: false
    t.string "email", null: false
    t.string "estado_cuenta", null: false
    t.string "password", null: false
    t.string "rol", null: false
    t.date "fecha_registro", default: -> { "now()" }, null: false
    t.string "foto_perfil"
    t.index ["email"], name: "index_usuarios_on_email", unique: true
    t.check_constraint "estado_cuenta::text = ANY (ARRAY['suspendido'::character varying::text, 'activo'::character varying::text])", name: "estado_check"
    t.check_constraint "rol::text = ANY (ARRAY['cliente'::character varying::text, 'arquitecto'::character varying::text, 'moderador'::character varying::text])", name: "rol_check"
  end

  create_table "valoraciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.float "calificacion", null: false
    t.text "comentario", null: false
    t.date "fecha", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.uuid "cliente_id", null: false
    t.uuid "proyecto_id", null: false
    t.index ["cliente_id"], name: "index_valoraciones_on_cliente_id"
    t.index ["proyecto_id"], name: "index_valoraciones_on_proyecto_id"
  end

  create_table "verificaciones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "estado", null: false
    t.date "fecha_verificacion", null: false
    t.uuid "arquitecto_id", null: false
    t.uuid "moderador_id", null: false
    t.index ["arquitecto_id"], name: "index_verificaciones_on_arquitecto_id", unique: true
    t.index ["moderador_id"], name: "index_verificaciones_on_moderador_id"
    t.check_constraint "estado::text = ANY (ARRAY['pendiente'::character varying::text, 'verificado'::character varying::text, 'rechazado'::character varying::text])", name: "estado_check"
  end

  add_foreign_key "arquitectos", "usuarios"
  add_foreign_key "avances", "proyectos"
  add_foreign_key "clientes", "usuarios"
  add_foreign_key "conversaciones", "arquitectos"
  add_foreign_key "conversaciones", "clientes"
  add_foreign_key "imagen_asociaciones", "imagenes"
  add_foreign_key "incidencias", "moderadores"
  add_foreign_key "incidencias", "usuarios", column: "usuario_emisor_id"
  add_foreign_key "incidencias", "usuarios", column: "usuario_infractor_id"
  add_foreign_key "mensajes", "conversaciones"
  add_foreign_key "mensajes", "usuarios", column: "remitente_id"
  add_foreign_key "moderadores", "usuarios"
  add_foreign_key "notificaciones", "usuarios"
  add_foreign_key "proyectos", "arquitectos"
  add_foreign_key "proyectos", "clientes"
  add_foreign_key "proyectos", "conversaciones"
  add_foreign_key "proyectos", "solicitudes_proyecto"
  add_foreign_key "solicitudes_proyecto", "arquitectos"
  add_foreign_key "solicitudes_proyecto", "clientes"
  add_foreign_key "valoraciones", "clientes"
  add_foreign_key "valoraciones", "proyectos"
  add_foreign_key "verificaciones", "arquitectos"
  add_foreign_key "verificaciones", "moderadores"
end
