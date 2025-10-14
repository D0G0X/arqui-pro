puts "Creando Arquitectos..."

Arquitecto.create!([
  {
    id: "b78ade33-f566-47e8-9266-85b1f97c72ea",
    cedula: "1309817462",
    valoracion_prom_proyecto: 20.4,
    descripcion: "Soy una arquitecta que le gusta hacer casas",
    especialidades: "Hacer Casas, Hacer jardines",
    ubicacion: "Manta-Manabí-Ecuador",
    verificado: false,
    vistas_perfil: 37,
    usuario_id: "6954e4dd-f142-402c-9351-44b28a3526e6",
  },
  {
    id: "2f2a0e35-7d47-4bc8-b1fb-5a31b1de64a1",
    cedula: "1309817461",
    valoracion_prom_proyecto: 20.4,
    descripcion: "Solo soy un arquitecto, nada mas que decir",
    especialidades: "Ninguna en especial",
    ubicacion: "Manta-Manabí-Ecuador",
    verificado: true,
    vistas_perfil: 42,
    usuario_id: "91edb463-17d0-4ab9-9e3d-6e83a4c31de4",
  }
])

puts "Arquitectos creados."