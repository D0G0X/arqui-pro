puts "Creando Avances..."

Avance.create!([
  {
    descripcion: "Planos arquitectónicos iniciales completados",
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Casa Moderna en Quito").id,
  },
  {
    descripcion: "Renderizado 3D del proyecto",
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Casa Moderna en Quito").id,
  },
  {
    descripcion: "Especificaciones técnicas y materiales",
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Centro Comercial Guayaquil").id,
  },
  {
    descripcion: "Planos de distribución comercial",
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Centro Comercial Guayaquil").id,
  },
  {
    descripcion: "Propuesta de remodelación por sectores",
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Remodelación de Oficinas Cuenca").id,
  }
])

puts "Avances creados."
