puts "Creando Imágenes..."

Imagen.create!([
  {
    imagen_url: "https://ejemplo.com/imagenes/casa_moderna_01.jpg",
  },
  {
    imagen_url: "https://ejemplo.com/imagenes/casa_moderna_02.jpg",
  },
  {
    imagen_url: "https://ejemplo.com/imagenes/centro_comercial_01.jpg",
  },
  {
    imagen_url: "https://ejemplo.com/imagenes/oficinas_remodeladas_01.jpg",
  },
  {
    imagen_url: "https://ejemplo.com/imagenes/edificio_historico_01.jpg",
  }
])

puts "Imágenes creadas."
