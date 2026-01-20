# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Orden de carga respetando dependencias entre modelos

puts "\n========== EJECUTANDO SEEDS DESDE seed_nueva =========="
puts "Los usuarios se deben crear primero en auth-microservicio\n"

# # 1. Clientes (dependen de usuarios existentes en auth-microservicio)
# load Rails.root.join("db/seed_nueva/clientes_seed.rb")

# # 2. Arquitectos (dependen de usuarios existentes en auth-microservicio)
# load Rails.root.join("db/seed_nueva/arquitectos_seed.rb")

# # 3. Moderadores (dependen de usuarios existentes en auth-microservicio)
# load Rails.root.join("db/seed_nueva/moderadores_seed.rb")

# # 4. Conversaciones (dependen de clientes y arquitectos)
# load Rails.root.join("db/seed_nueva/conversaciones_seed.rb")

# # 5. Notificaciones (dependen de usuarios)
# load Rails.root.join("db/seed_nueva/notificaciones_seed.rb")

# # 6. Verificaciones (dependen de arquitectos y moderadores)
# load Rails.root.join("db/seed_nueva/verificaciones_seed.rb")

# # 7. Solicitudes de Proyecto (dependen de arquitectos y clientes)
# load Rails.root.join("db/seed_nueva/solicitudes_proyecto_seed.rb")

# # 8. Proyectos (dependen de arquitectos, clientes, conversaciones y solicitudes)
# load Rails.root.join("db/seed_nueva/proyectos_seed.rb")

# # 9. Mensajes (dependen de conversaciones y usuarios)
# load Rails.root.join("db/seed_nueva/mensajes_seed.rb")

# # 10. Avances (dependen de proyectos)
# load Rails.root.join("db/seed_nueva/avances_seed.rb")

# # 11. Valoraciones (dependen de clientes y proyectos)
# load Rails.root.join("db/seed_nueva/valoraciones_seed.rb")

# 12. Incidencias (dependen de usuarios y moderadores)
load Rails.root.join("db/seed_nueva/incidencias_seed.rb")

# 13. Imágenes (entidad independiente)
load Rails.root.join("db/seed_nueva/imagenes_seed.rb")

# 14. Imagen Asociaciones (dependen de imágenes y entidades asociables)
load Rails.root.join("db/seed_nueva/imagen_asociaciones_seed.rb")

puts "\n========== SEEDS COMPLETADAS EXITOSAMENTE =========="