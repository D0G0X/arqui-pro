puts "Creando Incidencias..."

# IMPORTANTE: Los usuario_id deben ser UUIDs de auth-microservicio
# usuario_emisor_id: quien reporta la incidencia
# usuario_infractor_id: quien ha incurrido en la infracción

Incidencia.create!([
  {
    descripcion: "Usuario reporta lenguaje inapropiado en conversación",
    estado: "pendiente",
    usuario_emisor_id: "bf4ee8f3-3600-4915-a4bb-7b6d5765179b", # Reemplazar con UUID de juan@gmail.com
    usuario_infractor_id: "965da078-b598-42de-8a66-ddd67458932e", # Reemplazar con UUID de luis@gmail.com
    moderador_id: Moderador.first.id,
  },
  {
    descripcion: "Posible plagio en diseño de proyecto",
    estado: "en revision",
    usuario_emisor_id: "f6497cb8-86a0-4600-b053-379191b634e0", # Reemplazar con UUID de maria@gmail.com
    usuario_infractor_id: "66dcc9f6-6023-44c4-805b-1de7c79acfe1", # Reemplazar con UUID de sofia@gmail.com
    moderador_id: Moderador.second.id,
  },
  {
    descripcion: "Falta de pago acordado para proyecto",
    estado: "resuelto",
    usuario_emisor_id: "965da078-b598-42de-8a66-ddd67458932e", # Reemplazar con UUID de luis@gmail.com
    usuario_infractor_id: "b29a7bf0-40dd-4f32-9d30-b443cd76f604", # Reemplazar con UUID de carlos@gmail.com
    moderador_id: Moderador.third.id,
  },
  {
    descripcion: "Incumplimiento en cronograma del proyecto",
    estado: "pendiente",
    usuario_emisor_id: "f7ea97ae-5c31-4df9-a6e5-be1154af68ca", # Reemplazar con UUID de diego@gmail.com
    usuario_infractor_id: "34e43f17-c9ba-4ff8-b909-ee926b4efaa0", # Reemplazar con UUID de ana@gmail.com
    moderador_id: Moderador.fourth.id,
  },
  {
    descripcion: "Perfil con información falsa",
    estado: "pendiente",
    usuario_emisor_id: "ccb95121-42ae-4b5a-a15b-6bb6a1a2278b", # Reemplazar con UUID de valentina@gmail.com
    usuario_infractor_id: "5ec7bdf2-35f8-4401-b5d8-965fd0a5d8cf", # Reemplazar con UUID de fernando@gmail.com
    moderador_id: Moderador.last.id,
  }
])

puts "Incidencias creadas."
