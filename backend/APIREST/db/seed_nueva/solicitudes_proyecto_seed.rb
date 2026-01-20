puts "Creando Solicitudes de Proyecto..."

SolicitudProyecto.create!([
  {
    estado: "pendiente",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000006").id,
    cliente_id: Cliente.find_by(cedula: "4200000001").id,
  },
  {
    estado: "aceptado",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000007").id,
    cliente_id: Cliente.find_by(cedula: "4200000002").id,
  },
  {
    estado: "rechazado",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000008").id,
    cliente_id: Cliente.find_by(cedula: "4200000003").id,
  },
  {
    estado: "pendiente",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000009").id,
    cliente_id: Cliente.find_by(cedula: "4200000004").id,
  },
  {
    estado: "aceptado",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000010").id,
    cliente_id: Cliente.find_by(cedula: "4200000005").id,
  }
])

puts "Solicitudes de Proyecto creadas."
