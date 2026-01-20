puts "Creando Mensajes..."

# IMPORTANTE: Los remitente_id deben ser UUIDs de auth-microservicio
# Mapeo de correos a usuarios:
# juan@gmail.com, maria@gmail.com, luis@gmail.com, sofia@gmail.com, diego@gmail.com

Mensaje.create!([
  {
    contenido: "Hola, me interesa tu trabajo en arquitectura residencial",
    remitente_id: "bf4ee8f3-3600-4915-a4bb-7b6d5765179b", # Reemplazar con UUID de juan@gmail.com
    conversacion_id: Conversacion.first.id,
    leido: true,
  },
  {
    contenido: "Excelente, cuéntame más sobre tu proyecto",
    remitente_id: "965da078-b598-42de-8a66-ddd67458932e", # Reemplazar con UUID de luis@gmail.com
    conversacion_id: Conversacion.first.id,
    leido: true,
  },
  {
    contenido: "Necesito un diseño comercial moderno",
    remitente_id: "f6497cb8-86a0-4600-b053-379191b634e0", # Reemplazar con UUID de maria@gmail.com
    conversacion_id: Conversacion.second.id,
    leido: false,
  },
  {
    contenido: "Te puedo ayudar con eso, soy especialista en retail design",
    remitente_id: "66dcc9f6-6023-44c4-805b-1de7c79acfe1", # Reemplazar con UUID de sofia@gmail.com
    conversacion_id: Conversacion.second.id,
    leido: false,
  },
  {
    contenido: "¿Cuál es tu presupuesto aproximado?",
    remitente_id: "f7ea97ae-5c31-4df9-a6e5-be1154af68ca", # Reemplazar con UUID de diego@gmail.com
    conversacion_id: Conversacion.third.id,
    leido: true,
  }
])

puts "Mensajes creados."
