# 🗄️ Configuración de Base de Datos - Payment Service

Este documento explica cómo configurar la base de datos para el Payment Service.

## 📋 Opciones de Configuración

El Payment Service soporta **dos modos de configuración**:

### 1️⃣ Base de Datos Compartida (Desarrollo)

Todos los microservicios comparten la misma base de datos PostgreSQL, pero cada uno tiene sus propias tablas.

**Configuración en `.env`:**

```env
DB_HOST=aws-1-us-east-2.pooler.supabase.com
DB_PORT=5432
DB_USER=postgres.aovwqqmvotdfhxfiofqo
DB_PASS=tu_password
DB_NAME=postgres
DB_SSL=true
```

**Ventajas:**
- ✅ Simple para desarrollo
- ✅ No requiere crear nueva base de datos
- ✅ Mismo host que otros servicios (Supabase)

**Desventajas:**
- ⚠️ Menos aislamiento
- ⚠️ No ideal para producción

**Tablas creadas:**
- `partners` - Partners B2B registrados
- `payments` - Pagos procesados
- `webhook_events` - Historial de webhooks

### 2️⃣ Base de Datos Propia (Producción - Recomendado)

Cada microservicio tiene su propia base de datos PostgreSQL.

**Configuración en `.env`:**

```env
PAYMENT_DB_HOST=aws-1-us-east-2.pooler.supabase.com
PAYMENT_DB_PORT=5432
PAYMENT_DB_USER=postgres.aovwqqmvotdfhxfiofqo
PAYMENT_DB_PASS=tu_password
PAYMENT_DB_NAME=payment_service_db
PAYMENT_DB_SSL=true
```

**Ventajas:**
- ✅ Aislamiento completo de datos
- ✅ Escalabilidad independiente
- ✅ Mejor para producción
- ✅ Cumple principio de microservicios

**Desventajas:**
- ⚠️ Requiere crear nueva base de datos
- ⚠️ Más configuración inicial

## 🔧 Crear Base de Datos Propia en Supabase

Si decides usar una base de datos propia, sigue estos pasos:

### Paso 1: Crear Base de Datos en Supabase

1. Accede a tu proyecto en [Supabase](https://app.supabase.com)
2. Ve a **SQL Editor**
3. Ejecuta el siguiente SQL:

```sql
-- Crear base de datos (si tienes permisos)
-- Nota: En Supabase, normalmente solo puedes crear esquemas, no bases de datos completas
-- Por lo tanto, crearemos un esquema dedicado

CREATE SCHEMA IF NOT EXISTS payment_service;

-- O si prefieres usar la base de datos por defecto con un prefijo en las tablas,
-- simplemente configura PAYMENT_DB_NAME=postgres y las tablas se crearán automáticamente
```

### Paso 2: Configurar Variables de Entorno

```env
# Usar base de datos propia
PAYMENT_DB_HOST=aws-1-us-east-2.pooler.supabase.com
PAYMENT_DB_PORT=5432
PAYMENT_DB_USER=postgres.aovwqqmvotdfhxfiofqo
PAYMENT_DB_PASS=tu_password
PAYMENT_DB_NAME=postgres  # O el nombre de tu nueva BD
PAYMENT_DB_SSL=true
```

### Paso 3: Verificar Conexión

Al iniciar el servicio, verás en los logs:

```
[Payment Service] ✅ Usando base de datos propia (PAYMENT_DB_*)
```

O si está usando compartida:

```
[Payment Service] ⚠️  Usando base de datos compartida (DB_*)
```

## 🔄 Migración de Compartida a Propia

Si ya tienes datos en una base de datos compartida y quieres migrar a una propia:

### Opción 1: Exportar e Importar Datos

```bash
# 1. Exportar datos de la BD compartida
pg_dump -h aws-1-us-east-2.pooler.supabase.com \
  -U postgres.aovwqqmvotdfhxfiofqo \
  -d postgres \
  -t partners \
  -t payments \
  -t webhook_events \
  > payment_service_backup.sql

# 2. Importar a la nueva BD
psql -h aws-1-us-east-2.pooler.supabase.com \
  -U postgres.aovwqqmvotdfhxfiofqo \
  -d payment_service_db \
  < payment_service_backup.sql
```

### Opción 2: Usar TypeORM Migrations

```bash
# 1. Generar migración
npm run typeorm migration:generate -- -n InitialPaymentService

# 2. Ejecutar migración en nueva BD
npm run typeorm migration:run
```

## 📊 Estructura de Tablas

Independientemente de la opción elegida, el servicio creará estas tablas:

### `partners`
```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  webhook_url TEXT NOT NULL,
  secret TEXT NOT NULL,
  subscribed_events TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  provider VARCHAR(255) NOT NULL,
  provider_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  user_id UUID,
  project_id UUID,
  metadata JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `webhook_events`
```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES partners(id),
  event_type VARCHAR(100) NOT NULL,
  direction VARCHAR(20) NOT NULL,
  payload TEXT NOT NULL,
  signature VARCHAR(255),
  retry_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  response TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### Verificar Conexión

```bash
# Iniciar el servicio
npm run start:dev

# Verificar en logs que se conectó correctamente
# Buscar: "TypeORM successfully connected"
```

### Verificar Tablas Creadas

```sql
-- En Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('partners', 'payments', 'webhook_events');
```

## ⚠️ Notas Importantes

1. **Synchronize Mode**: Actualmente está en `synchronize: true` para desarrollo. En producción, deberías:
   - Cambiar a `synchronize: false`
   - Usar migraciones de TypeORM

2. **Backups**: Asegúrate de hacer backups regulares de la base de datos.

3. **Credenciales**: Nunca commitees el archivo `.env` con credenciales reales.

4. **SSL**: Supabase requiere SSL, así que siempre usa `DB_SSL=true` o `PAYMENT_DB_SSL=true`.

## 🐛 Troubleshooting

### Error: "relation does not exist"

**Causa:** Las tablas no se han creado aún.

**Solución:**
```bash
# Reiniciar el servicio (synchronize: true creará las tablas)
npm run start:dev
```

### Error: "password authentication failed"

**Causa:** Credenciales incorrectas.

**Solución:** Verifica las variables de entorno en `.env`.

### Error: "database does not exist"

**Causa:** La base de datos especificada no existe.

**Solución:** Crea la base de datos o usa una existente.

## 📚 Referencias

- [TypeORM Documentation](https://typeorm.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
