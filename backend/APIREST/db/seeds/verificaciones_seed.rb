puts "Creando verificaciones..."

Verificacion.create!([
  {
    id: "6a1d0da6-a014-4976-87c5-ca5cb82fcd06",
    estado: "verificado",
    fecha_verificacion: "2025-10-12",
    arquitecto_id: "2f2a0e35-7d47-4bc8-b1fb-5a31b1de64a1",
    moderador_id: "0f3f4cdc-ef7f-45d7-ae82-1900ecf227c7"
  },
  {
    id: "9951196c-497f-49b6-b96f-f1944986e45c",
    estado: "pendiente",
    fecha_verificacion: "2025-10-12",
    arquitecto_id: "b78ade33-f566-47e8-9266-85b1f97c72ea",
    moderador_id: "0f3f4cdc-ef7f-45d7-ae82-1900ecf227c7"
  }
])

puts "Verificaciones creadas."