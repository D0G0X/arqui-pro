puts "Creando Conversaciones..."

Conversacion.create!([
  {
    id: "79f484bb-ea90-464e-8666-4cc69c3fe3b4",
    fecha: "2025-10-12",
    cliente_id: "4d65811a-774c-4143-9852-a30ef0d555a4",
    arquitecto_id: "b78ade33-f566-47e8-9266-85b1f97c72ea"
  },
  {
    id: "a1c5f8e2-3b6e-4f9d-9c3e-2f4b5d6e7f8a",
    fecha: "2025-10-12",
    cliente_id: "b1e8f3e2-2f4c-4d6a-9f7e-3c9e8f0b6a2c",
    arquitecto_id: "2f2a0e35-7d47-4bc8-b1fb-5a31b1de64a1"
  }
])

puts "Conversaciones creadas."