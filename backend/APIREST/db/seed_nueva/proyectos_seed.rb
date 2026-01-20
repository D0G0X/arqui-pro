puts "Creando Proyectos..."

Proyecto.create!([
  {
    titulo_proyecto: "Casa Moderna en Quito",
    descripcion: "Diseño de vivienda unifamiliar con enfoque sustentable",
    tipo_proyecto: "contratado",
    valoracion_promedio: 4.5,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000006").id,
    cliente_id: Cliente.find_by(cedula: "4200000001").id,
    conversacion_id: Conversacion.find_by(cliente_id: Cliente.find_by(cedula: "4200000001").id).id,
    solicitud_proyecto_id: SolicitudProyecto.find_by(cliente_id: Cliente.find_by(cedula: "4200000001").id).id,
  },
  {
    titulo_proyecto: "Centro Comercial Guayaquil",
    descripcion: "Diseño de complejo comercial de 5 pisos",
    tipo_proyecto: "portafolio",
    valoracion_promedio: 4.7,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000007").id,
    cliente_id: Cliente.find_by(cedula: "4200000002").id,
    conversacion_id: Conversacion.find_by(cliente_id: Cliente.find_by(cedula: "4200000002").id).id,
    solicitud_proyecto_id: SolicitudProyecto.find_by(cliente_id: Cliente.find_by(cedula: "4200000002").id).id,
  },
  {
    titulo_proyecto: "Remodelación de Oficinas Cuenca",
    descripcion: "Modernización de espacio de oficina existente",
    tipo_proyecto: "contratado",
    valoracion_promedio: 4.3,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000008").id,
    cliente_id: Cliente.find_by(cedula: "4200000003").id,
    conversacion_id: Conversacion.find_by(cliente_id: Cliente.find_by(cedula: "4200000003").id).id,
    solicitud_proyecto_id: SolicitudProyecto.find_by(cliente_id: Cliente.find_by(cedula: "4200000003").id).id,
  },
  {
    titulo_proyecto: "Restauración Histórica Ambato",
    descripcion: "Restauración de edificio patrimonial del siglo XIX",
    tipo_proyecto: "portafolio",
    valoracion_promedio: 4.6,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000009").id,
    cliente_id: Cliente.find_by(cedula: "4200000004").id,
    conversacion_id: Conversacion.find_by(cliente_id: Cliente.find_by(cedula: "4200000004").id).id,
    solicitud_proyecto_id: SolicitudProyecto.find_by(cliente_id: Cliente.find_by(cedula: "4200000004").id).id,
  },
  {
    titulo_proyecto: "Complejo Residencial Sostenible Loja",
    descripcion: "Desarrollo inmobiliario con certificación ambiental",
    tipo_proyecto: "contratado",
    valoracion_promedio: 4.8,
    arquitecto_id: Arquitecto.find_by(cedula: "4200000010").id,
    cliente_id: Cliente.find_by(cedula: "4200000005").id,
    conversacion_id: Conversacion.find_by(cliente_id: Cliente.find_by(cedula: "4200000005").id).id,
    solicitud_proyecto_id: SolicitudProyecto.find_by(cliente_id: Cliente.find_by(cedula: "4200000005").id).id,
  }
])

puts "Proyectos creados."
