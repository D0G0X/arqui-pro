#!/usr/bin/env ruby

# Script para obtener los UUIDs de los usuarios creados en auth-microservicio
# y actualizar las semillas de APIREST correspondientes

puts "=========================================="
puts "SCRIPT DE MAPEO DE USUARIOS"
puts "=========================================="
puts ""

# Mapeo de usuarios por rol
usuarios_clientes = [
  { nombre: "Juan", apellido: "García", email: "juan@gmail.com", cedula: "4200000001" },
  { nombre: "María", apellido: "López", email: "maria@gmail.com", cedula: "4200000002" },
  { nombre: "Carlos", apellido: "Rodríguez", email: "carlos@gmail.com", cedula: "4200000003" },
  { nombre: "Ana", apellido: "Martínez", email: "ana@gmail.com", cedula: "4200000004" },
  { nombre: "Pedro", apellido: "Fernández", email: "pedro@gmail.com", cedula: "4200000005" }
]

usuarios_arquitectos = [
  { nombre: "Luis", apellido: "Sánchez", email: "luis@gmail.com", cedula: "4200000006" },
  { nombre: "Sofía", apellido: "Díaz", email: "sofia@gmail.com", cedula: "4200000007" },
  { nombre: "Diego", apellido: "Morales", email: "diego@gmail.com", cedula: "4200000008" },
  { nombre: "Valentina", apellido: "Torres", email: "valentina@gmail.com", cedula: "4200000009" },
  { nombre: "Fernando", apellido: "Ruiz", email: "fernando@gmail.com", cedula: "4200000010" },
  { nombre: "Isabel", apellido: "Vargas", email: "isabel@gmail.com", cedula: "4200000011" },
  { nombre: "Andrés", apellido: "Castro", email: "andres@gmail.com", cedula: "4200000012" },
  { nombre: "Gabriela", apellido: "Reyes", email: "gabriela@gmail.com", cedula: "4200000013" },
  { nombre: "Raúl", apellido: "Guerrero", email: "raul@gmail.com", cedula: "4200000014" },
  { nombre: "Catalina", apellido: "Mendoza", email: "catalina@gmail.com", cedula: "4200000015" }
]

usuarios_moderadores = [
  { nombre: "Roberto", apellido: "Silva", email: "roberto@gmail.com", cedula: "N/A" },
  { nombre: "Patricia", apellido: "Guzmán", email: "patricia@gmail.com", cedula: "N/A" },
  { nombre: "Javier", apellido: "Flores", email: "javier@gmail.com", cedula: "N/A" },
  { nombre: "Marta", apellido: "Jiménez", email: "marta@gmail.com", cedula: "N/A" },
  { nombre: "Francisco", apellido: "Herrera", email: "francisco@gmail.com", cedula: "N/A" }
]

puts "CLIENTES (5 total):"
usuarios_clientes.each_with_index do |usuario, index|
  puts "#{index + 1}. #{usuario[:nombre]} #{usuario[:apellido]} - #{usuario[:email]} - Cédula: #{usuario[:cedula]}"
  puts "   Reemplazar: usuario_uuid_#{index + 1} → [Obtén el UUID de auth-microservicio]"
end

puts "\nARQUITECTOS (10 total):"
usuarios_arquitectos.each_with_index do |usuario, index|
  puts "#{index + 1}. #{usuario[:nombre]} #{usuario[:apellido]} - #{usuario[:email]} - Cédula: #{usuario[:cedula]}"
  puts "   Reemplazar: usuario_uuid_#{index + 6} → [Obtén el UUID de auth-microservicio]"
end

puts "\nMODERADORES (5 total):"
usuarios_moderadores.each_with_index do |usuario, index|
  puts "#{index + 1}. #{usuario[:nombre]} #{usuario[:apellido]} - #{usuario[:email]}"
  puts "   Reemplazar: usuario_uuid_#{index + 16} → [Obtén el UUID de auth-microservicio]"
end

puts "\n=========================================="
puts "INSTRUCCIONES:"
puts "=========================================="
puts <<-INSTRUCTIONS
1. Ejecuta la semilla de auth-microservicio:
   cd backend/auth-microservicio
   npm run seed

2. Obtén los UUIDs de los usuarios creados ejecutando esta consulta en PostgreSQL:
   SELECT id, email, nombre, rol FROM usuario ORDER BY created_at DESC;

3. Reemplaza los valores de usuario_uuid_N en los archivos:
   - db/seed_nueva/notificaciones_seed.rb
   - db/seed_nueva/mensajes_seed.rb
   - db/seed_nueva/incidencias_seed.rb
   - db/seed_nueva/clientes_seed.rb
   - db/seed_nueva/arquitectos_seed.rb
   - db/seed_nueva/moderadores_seed.rb

4. Ejecuta la semilla de APIREST:
   cd backend/APIREST
   rails db:seed

INSTRUCTIONS

puts ""
