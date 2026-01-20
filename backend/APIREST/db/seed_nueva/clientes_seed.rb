puts "Creando Clientes..."

# IMPORTANTE: Los usuarios deben estar creados previamente en auth-microservicio
# Esta semilla asume que los usuarios existen en la BD de APIREST con usuario_id NULL
# Después de crear los clientes, debes actualizar los usuario_id con los UUIDs de auth-microservicio

Cliente.create!([
  {
    cedula: "4200000001",
    usuario_id: "bf4ee8f3-3600-4915-a4bb-7b6d5765179b",
  },
  {
    cedula: "4200000002",
    usuario_id: "f6497cb8-86a0-4600-b053-379191b634e0",
  },
  {
    cedula: "4200000003",
    usuario_id: "b29a7bf0-40dd-4f32-9d30-b443cd76f604",
  },
  {
    cedula: "4200000004",
    usuario_id: "34e43f17-c9ba-4ff8-b909-ee926b4efaa0",
  },
  {
    cedula: "4200000005",
    usuario_id: "f832c436-2b4f-4370-9837-92074d1374f5",
  }
])

puts "Clientes creados."
