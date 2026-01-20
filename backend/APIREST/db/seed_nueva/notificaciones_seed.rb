puts "Creando Notificaciones..."

Notificacion.create!([
  {
    usuario_id: "bf4ee8f3-3600-4915-a4bb-7b6d5765179b",
    mensaje: "Tu proyecto ha sido asignado a un arquitecto",
    leido: false,
  },
  {
    usuario_id: "f6497cb8-86a0-4600-b053-379191b634e0",
    mensaje: "Nuevo mensaje de tu cliente",
    leido: false,
  },
  {
    usuario_id: "965da078-b598-42de-8a66-ddd67458932e",
    mensaje: "Tu solicitud de verificación ha sido recibida",
    leido: true,
  },
  {
    usuario_id: "66dcc9f6-6023-44c4-805b-1de7c79acfe1",
    mensaje: "Tu proyecto ha recibido una valoración",
    leido: false,
  },
  {
    usuario_id: "b29a7bf0-40dd-4f32-9d30-b443cd76f604",
    mensaje: "Se ha registrado una incidencia en tu perfil",
    leido: false,
  }
])

puts "Notificaciones creadas."
