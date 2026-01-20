puts "Creando Verificaciones..."

Verificacion.create!([
  {
    estado: "pendiente",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000006").id,
    moderador_id: Moderador.first.id,
  },
  {
    estado: "verificado",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000007").id,
    moderador_id: Moderador.second.id,
  },
  {
    estado: "rechazado",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000008").id,
    moderador_id: Moderador.third.id,
  },
  {
    estado: "pendiente",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000009").id,
    moderador_id: Moderador.fourth.id,
  },
  {
    estado: "verificado",
    arquitecto_id: Arquitecto.find_by(cedula: "4200000010").id,
    moderador_id: Moderador.last.id,
  }
])

puts "Verificaciones creadas."
