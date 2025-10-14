puts "Creando clientes..."

Cliente.create!([
  {
    id: "4d65811a-774c-4143-9852-a30ef0d555a4",
    cedula: "1300987654",
    usuario_id: "5af9923c-27c9-4fdc-9221-d7b8e416e487"
  },
  {
    id: "b1e8f3e2-2f4c-4d6a-9f7e-3c9e8f0b6a2c",
    cedula: "1101234567",
    usuario_id: "384fe367-90c2-4a70-b63f-8e64e9bb1d80"
  }
])

puts "Clientes creados."