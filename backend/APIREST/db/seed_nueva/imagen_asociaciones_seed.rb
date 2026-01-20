puts "Creando Asociaciones de Imágenes..."

ImagenAsociacion.create!([
  {
    imagen_id: Imagen.first.id,
    asociable_type: "Proyecto",
    asociable_id: Proyecto.find_by(titulo_proyecto: "Casa Moderna en Quito").id,
  },
  {
    imagen_id: Imagen.second.id,
    asociable_type: "Proyecto",
    asociable_id: Proyecto.find_by(titulo_proyecto: "Casa Moderna en Quito").id,
  },
  {
    imagen_id: Imagen.third.id,
    asociable_type: "Proyecto",
    asociable_id: Proyecto.find_by(titulo_proyecto: "Centro Comercial Guayaquil").id,
  },
  {
    imagen_id: Imagen.fourth.id,
    asociable_type: "Proyecto",
    asociable_id: Proyecto.find_by(titulo_proyecto: "Remodelación de Oficinas Cuenca").id,
  },
  {
    imagen_id: Imagen.fifth.id,
    asociable_type: "Proyecto",
    asociable_id: Proyecto.find_by(titulo_proyecto: "Restauración Histórica Ambato").id,
  }
])

puts "Asociaciones de Imágenes creadas."
