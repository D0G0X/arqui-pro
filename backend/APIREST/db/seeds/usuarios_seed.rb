puts "Creando usuarios..."

Usuario.create!([
    {
      id: "5af9923c-27c9-4fdc-9221-d7b8e416e487",
      nombre: "Marcos",
      apellido: "Garcia",
      email: "marcos@gmail.com",
      estado_cuenta: "activo",
      password: "1234",
      rol: "cliente",
      fecha_registro: "2025-10-09",
      foto_perfil: "url"
  },
  {
      id: "6954e4dd-f142-402c-9351-44b28a3526e6",
      nombre: "Maria",
      apellido: "Garcia",
      email: "maria@gmail.com",
      estado_cuenta: "activo",
      password: "1234",
      rol: "arquitecto",
      fecha_registro: "2025-10-09",
      foto_perfil: "url"
  },
  {
      id: "91edb463-17d0-4ab9-9e3d-6e83a4c31de4",
      nombre: "Joaquin",
      apellido: "Palacios",
      email: "joaquin@gmail.com",
      estado_cuenta: "activo",
      password: "1234",
      rol: "arquitecto",
      fecha_registro: "2025-10-11",
      foto_perfil: "url"
  },
  {
      id: "384fe367-90c2-4a70-b63f-8e64e9bb1d80",
      nombre: "Juan",
      apellido: "Macias",
      email: "juan@gmail.com",
      estado_cuenta: "activo",
      password: "1234",
      rol: "cliente",
      fecha_registro: "2025-10-08",
      foto_perfil: "url"
  },
  {
      id: "464e2a37-2df2-40b3-b213-f4f976e972b8",
      nombre: "Mateo",
      apellido: "Velez",
      email: "mateo@gmail.com",
      estado_cuenta: "activo",
      password: "1234",
      rol: "moderador",
      fecha_registro: "2025-10-11",
      foto_perfil: "url"
  },
  {
      id: "8188c049-b43b-43a5-b048-4efedfe2536f",
      nombre: "Pepe",
      apellido: "Velez",
      email: "pepe@gmail.com",
      estado_cuenta: "activo",
      password: "1234",
      rol: "moderador",
      fecha_registro: "2025-10-11",
      foto_perfil: "url"
  }
])

puts "Usuarios creados."