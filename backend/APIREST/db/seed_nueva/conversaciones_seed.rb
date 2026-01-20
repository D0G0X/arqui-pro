puts "Creando Conversaciones..."

Conversacion.create!([
  {
    cliente_id: Cliente.find_by(cedula: "4200000001").id,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000006").id,
  },
  {
    cliente_id: Cliente.find_by(cedula: "4200000002").id,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000007").id,
  },
  {
    cliente_id: Cliente.find_by(cedula: "4200000003").id,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000008").id,
  },
  {
    cliente_id: Cliente.find_by(cedula: "4200000004").id,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000009").id,
  },
  {
    cliente_id: Cliente.find_by(cedula: "4200000005").id,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000010").id,
  }
])

puts "Conversaciones creadas."
