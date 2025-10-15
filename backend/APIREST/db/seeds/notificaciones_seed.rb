puts "Creando Notificaciones..."

Notificacion.create!([
  {
    id: "8a2f6c1d-cff9-4f6e-bca8-927fd651a2d6",
    mensaje: "Esta es una notificacion para otro usuario",
    fecha: "2025-10-12",
    leido: false,
    usuario_id: "6954e4dd-f142-402c-9351-44b28a3526e6"
  },
  {
    id: "03f637b4-d3a5-4a6a-bea0-e7b9ba109113",
    mensaje: "Esta es una notificacion para otro usuario",
    fecha: "2025-10-12",
    leido: true,
    usuario_id: "6954e4dd-f142-402c-9351-44b28a3526e6"
  },
  {
    id: "d0ab1297-bf7a-4561-b630-b6b89a95514e",
    mensaje: "Esta es una notificacion actualizada",
    fecha: "2025-10-12",
    leido: false,
    usuario_id: "6954e4dd-f142-402c-9351-44b28a3526e6"
  }
])

puts "Notificaciones creadas."