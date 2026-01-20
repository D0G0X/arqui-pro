puts "Creando Valoraciones..."

Valoracion.create!([
  {
    calificacion: 4.5,
    comentario: "Excelente trabajo, el arquitecto fue muy profesional y atentivo",
    cliente_id: Cliente.find_by(cedula: "4200000001").id,
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Casa Moderna en Quito").id,
  },
  {
    calificacion: 4.7,
    comentario: "Superó mis expectativas, muy creativo en el diseño",
    cliente_id: Cliente.find_by(cedula: "4200000002").id,
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Centro Comercial Guayaquil").id,
  },
  {
    calificacion: 4.3,
    comentario: "Buen trabajo en la remodelación, pequeños detalles a mejorar",
    cliente_id: Cliente.find_by(cedula: "4200000003").id,
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Remodelación de Oficinas Cuenca").id,
  },
  {
    calificacion: 4.6,
    comentario: "Restauración impecable, respetó la historia del edificio",
    cliente_id: Cliente.find_by(cedula: "4200000004").id,
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Restauración Histórica Ambato").id,
  },
  {
    calificacion: 4.8,
    comentario: "Proyecto sostenible y bien ejecutado, muy recomendado",
    cliente_id: Cliente.find_by(cedula: "4200000005").id,
    proyecto_id: Proyecto.find_by(titulo_proyecto: "Complejo Residencial Sostenible Loja").id,
  }
])

puts "Valoraciones creadas."
