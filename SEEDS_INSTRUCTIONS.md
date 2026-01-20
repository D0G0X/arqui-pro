# INSTRUCCIONES PARA EJECUTAR LAS SEMILLAS

## Resumen de lo que se creará

### Auth-Microservicio (20 usuarios totales)
- **5 Clientes**: Juan, María, Carlos, Ana, Pedro (correos con patrón nombre@gmail.com)
- **10 Arquitectos**: Luis, Sofía, Diego, Valentina, Fernando, Isabel, Andrés, Gabriela, Raúl, Catalina
- **5 Moderadores**: Roberto, Patricia, Javier, Marta, Francisco

**Contraseña para todos**: `123456` (encriptada con bcrypt)

### APIREST (Modelos relacionados)
Todas las semillas están ubicadas en `backend/APIREST/db/seed_nueva/`:
- `clientes_seed.rb` - 5 clientes (cédulas 4200000001-4200000005)
- `arquitectos_seed.rb` - 10 arquitectos (cédulas 4200000006-4200000015)
- `moderadores_seed.rb` - 5 moderadores
- `conversaciones_seed.rb` - 5 conversaciones
- `solicitudes_proyecto_seed.rb` - 5 solicitudes de proyecto
- `proyectos_seed.rb` - 5 proyectos
- `avances_seed.rb` - 5 avances de proyecto
- `valoraciones_seed.rb` - 5 valoraciones
- `verificaciones_seed.rb` - 5 verificaciones
- `mensajes_seed.rb` - 5 mensajes
- `notificaciones_seed.rb` - 5 notificaciones
- `incidencias_seed.rb` - 5 incidencias
- `imagenes_seed.rb` - 5 imágenes
- `imagen_asociaciones_seed.rb` - 5 asociaciones de imágenes

---

## PASO 1: Ejecutar semilla de Auth-Microservicio

```bash
cd backend/auth-microservicio
npm run seed
```

**Salida esperada**:
```
========== CREANDO USUARIOS EN AUTH-MICROSERVICIO ==========

✓ Usuario creado: juan@gmail.com (cliente)
✓ Usuario creado: maria@gmail.com (cliente)
✓ Usuario creado: carlos@gmail.com (cliente)
✓ Usuario creado: ana@gmail.com (cliente)
✓ Usuario creado: pedro@gmail.com (cliente)
✓ Usuario creado: luis@gmail.com (arquitecto)
✓ Usuario creado: sofia@gmail.com (arquitecto)
... (más usuarios)
========== SEED COMPLETADA EXITOSAMENTE ==========
```

---

## PASO 2: Obtener UUIDs de los usuarios creados

Conecta a la base de datos de auth-microservicio (PostgreSQL) y ejecuta:

```sql
SELECT id, email, nombre, rol FROM usuario ORDER BY created_at ASC;
```

**Guarda los UUIDs** en un archivo de texto. Necesitarás estos para actualizar las semillas de APIREST.

---

## PASO 3: Actualizar UUIDs en las semillas de APIREST

Reemplaza los placeholders `usuario_uuid_N` en estos archivos con los UUIDs reales obtenidos:

### Archivo: `backend/APIREST/db/seed_nueva/clientes_seed.rb`
- `usuario_uuid_1` → UUID de juan@gmail.com
- `usuario_uuid_2` → UUID de maria@gmail.com
- `usuario_uuid_3` → UUID de carlos@gmail.com
- `usuario_uuid_4` → UUID de ana@gmail.com
- `usuario_uuid_5` → UUID de pedro@gmail.com

### Archivo: `backend/APIREST/db/seed_nueva/arquitectos_seed.rb`
- `usuario_uuid_6` → UUID de luis@gmail.com
- `usuario_uuid_7` → UUID de sofia@gmail.com
- `usuario_uuid_8` → UUID de diego@gmail.com
- `usuario_uuid_9` → UUID de valentina@gmail.com
- `usuario_uuid_10` → UUID de fernando@gmail.com
- `usuario_uuid_11` → UUID de isabel@gmail.com
- `usuario_uuid_12` → UUID de andres@gmail.com
- `usuario_uuid_13` → UUID de gabriela@gmail.com
- `usuario_uuid_14` → UUID de raul@gmail.com
- `usuario_uuid_15` → UUID de catalina@gmail.com

### Archivo: `backend/APIREST/db/seed_nueva/moderadores_seed.rb`
- `usuario_uuid_16` → UUID de roberto@gmail.com
- `usuario_uuid_17` → UUID de patricia@gmail.com
- `usuario_uuid_18` → UUID de javier@gmail.com
- `usuario_uuid_19` → UUID de marta@gmail.com
- `usuario_uuid_20` → UUID de francisco@gmail.com

### Archivos que usan usuario_id (UUIDs de auth):
- `backend/APIREST/db/seed_nueva/notificaciones_seed.rb`
- `backend/APIREST/db/seed_nueva/mensajes_seed.rb`
- `backend/APIREST/db/seed_nueva/incidencias_seed.rb`

---

## PASO 4: Ejecutar semillas de APIREST

```bash
cd backend/APIREST
rails db:seed
```

**Salida esperada**:
```
========== EJECUTANDO SEEDS DESDE seed_nueva ==========
Los usuarios se deben crear primero en auth-microservicio

Creando Clientes...
Clientes creados.

Creando Arquitectos...
Arquitectos creados.

Creando Moderadores...
Moderadores creados.

... (más modelos)

========== SEEDS COMPLETADAS EXITOSAMENTE ==========
```

---

## Información importante

### Cédulas
- **Clientes**: 4200000001 a 4200000005
- **Arquitectos**: 4200000006 a 4200000015
- **Moderadores**: Sin cédulas asignadas

Todas las cédulas comienzan obligatoriamente con **42** como se solicitó.

### Contraseña
- **Contraseña de todos los usuarios**: `123456`
- Se encripta automáticamente con bcrypt (10 rounds) en el auth-microservicio

### Campos opcionales
- Algunos campos como `usuario_id` en clientes, arquitectos y moderadores pueden estar en `nil` inicialmente
- Otros campos están completamente poblados: emails, cédulas, descripciones, ubicaciones, etc.

---

## Verificación

Después de ejecutar ambas semillas, verifica que todo se haya creado correctamente:

### En auth-microservicio:
```sql
SELECT COUNT(*) as total, rol, COUNT(CASE WHEN estado_cuenta = 'activo' THEN 1 END) as activos 
FROM usuario 
GROUP BY rol;
```

### En APIREST:
```sql
SELECT 'Clientes' as tipo, COUNT(*) as cantidad FROM cliente
UNION ALL
SELECT 'Arquitectos', COUNT(*) FROM arquitecto
UNION ALL
SELECT 'Moderadores', COUNT(*) FROM moderador
UNION ALL
SELECT 'Proyectos', COUNT(*) FROM proyecto
UNION ALL
SELECT 'Conversaciones', COUNT(*) FROM conversacion
UNION ALL
SELECT 'Mensajes', COUNT(*) FROM mensaje
UNION ALL
SELECT 'Notificaciones', COUNT(*) FROM notificacion
UNION ALL
SELECT 'Incidencias', COUNT(*) FROM incidencia
UNION ALL
SELECT 'Verificaciones', COUNT(*) FROM verificacion;
```

---

## Notas

- Las semillas están diseñadas para ser idempotentes (se pueden ejecutar múltiples veces)
- Cada entidad se crea manualmente sin loops (como se solicitó)
- Las cédulas comienzan con 42 como se requirió
- Los emails siguen el formato `<nombre>@gmail.com`
