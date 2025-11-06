# INSTRUCCIONES PARA COMPLETAR EL MÓDULO DE MODERADOR

## ✅ Problemas Identificados

### 1. Error al resolver incidencias - Estados incorrectos
- **Problema**: Estados eran 'resuelta', 'escalado' pero deberían ser 'resuelto', 'en_revision', 'pendiente'
- **Solución**: ✅ CORREGIDO en Incidencias.tsx

### 2. Notificaciones en tiempo real con WebSocket
- **Problema**: Las notificaciones son estáticas
- **Solución**: ✅ Servicio creado en `notificationService.ts`
- **Acción requerida**: Instalar socket.io-client

### 3. Verificaciones no muestra datos
- **Problema**: Query de GraphQL no existe en el backend
- **Solución**: ✅ Cambiado a REST API completo
- **Acción requerida**: Verificar que el backend tenga los endpoints

---

## 📋 PASOS A SEGUIR

### PASO 1: Instalar socket.io-client

```cmd
cd frontend
npm install socket.io-client
```

### PASO 2: Reemplazar archivo de Verificaciones

El archivo `Verificaciones.tsx` tiene código duplicado y corrupto.

**Acción manual**:
1. Abre `frontend\src\pages\Moderator\Verificaciones_NEW.tsx`
2. Copia todo el contenido
3. Abre `frontend\src\pages\Moderator\Verificaciones.tsx`
4. Reemplaza TODO el contenido con lo copiado
5. Guarda el archivo
6. Elimina `Verificaciones_NEW.tsx`

### PASO 3: Verificar el backend REST tiene los endpoints necesarios

#### 3.1 Verificar endpoint de Incidencias

Abre `backend\APIREST\config\routes.rb` y verifica que exista:

```ruby
namespace :api do
  namespace :v1 do
    resources :incidencias do
      member do
        post :resolver
        post :rechazar
      end
    end
  end
end
```

Si NO existe, agrégalo después de la línea de `resources :incidencias`.

#### 3.2 Verificar controlador de Incidencias

Abre `backend\APIREST\app\controllers\api\v1\incidencias_controller.rb` y verifica que tenga:

```ruby
def resolver
  # Lógica para resolver
end

def rechazar
  # Lógica para rechazar
end
```

Si NO existen estos métodos, créalos:

```ruby
# Resolver incidencia
def resolver
  incidencia = Incidencia.find(params[:id])
  
  if incidencia.update(
    estado: 'resuelto',
    moderador_id: params[:moderador_id],
    resolucion: params[:resolucion],
    fecha_resolucion: DateTime.now
  )
    render json: { status: 'success', incidencia: incidencia }, status: :ok
  else
    render json: { status: 'error', errors: incidencia.errors }, status: :unprocessable_entity
  end
end

# Rechazar incidencia
def rechazar
  incidencia = Incidencia.find(params[:id])
  
  if incidencia.update(
    estado: 'rechazado',
    moderador_id: params[:moderador_id],
    resolucion: params[:resolucion],
    fecha_resolucion: DateTime.now
  )
    render json: { status: 'success', incidencia: incidencia }, status: :ok
  else
    render json: { status: 'error', errors: incidencia.errors }, status: :unprocessable_entity
  end
end
```

#### 3.3 Verificar endpoint de Verificaciones

Abre `backend\APIREST\config\routes.rb` y verifica que exista:

```ruby
resources :verificaciones do
  member do
    post :aprobar
    post :rechazar
  end
end
```

Si NO existe, agrégalo.

#### 3.4 Verificar controlador de Verificaciones

Abre `backend\APIREST\app\controllers\api\v1\verificaciones_controller.rb` y agrega estos métodos si no existen:

```ruby
# Aprobar verificación
def aprobar
  verificacion = Verificacion.find(params[:id])
  
  if verificacion.update(
    estado: 'aprobado',
    moderador_id: params[:moderador_id],
    comentarios: params[:comentarios],
    fecha_resolucion: DateTime.now
  )
    render json: { status: 'success', verificacion: verificacion }, status: :ok
  else
    render json: { status: 'error', errors: verificacion.errors }, status: :unprocessable_entity
  end
end

# Rechazar verificación
def rechazar
  verificacion = Verificacion.find(params[:id])
  
  if verificacion.update(
    estado: 'rechazado',
    moderador_id: params[:moderador_id],
    comentarios: params[:comentarios],
    fecha_resolucion: DateTime.now
  )
    render json: { status: 'success', verificacion: verificacion }, status: :ok
  else
    render json: { status: 'error', errors: verificacion.errors }, status: :unprocessable_entity
  end
end
```

### PASO 4: Verificar estados en la base de datos

#### 4.1 Verificar estados de Incidencias

Abre una consola de Rails:

```cmd
cd backend\APIREST
rails console
```

Ejecuta:

```ruby
# Ver constraint de estados
ActiveRecord::Base.connection.execute("SELECT constraint_name, check_clause FROM information_schema.check_constraints WHERE constraint_name LIKE '%incidencia%'").to_a
```

Si el estado tiene 'pendiente', 'resuelta', 'escalado', necesitas crear una migración:

```ruby
rails generate migration UpdateIncidenciaEstados
```

Edita el archivo de migración:

```ruby
class UpdateIncidenciaEstados < ActiveRecord::Migration[8.0]
  def up
    # Remover constraint anterior
    execute "ALTER TABLE incidencias DROP CONSTRAINT IF EXISTS estado_check"
    
    # Agregar nuevo constraint
    execute "ALTER TABLE incidencias ADD CONSTRAINT estado_check CHECK (estado IN ('pendiente', 'en_revision', 'resuelto', 'rechazado'))"
  end

  def down
    execute "ALTER TABLE incidencias DROP CONSTRAINT IF EXISTS estado_check"
    execute "ALTER TABLE incidencias ADD CONSTRAINT estado_check CHECK (estado IN ('pendiente', 'resuelta', 'escalado'))"
  end
end
```

Ejecuta:

```cmd
rails db:migrate
```

#### 4.2 Verificar estados de Verificaciones

En la consola de Rails:

```ruby
ActiveRecord::Base.connection.execute("SELECT constraint_name, check_clause FROM information_schema.check_constraints WHERE constraint_name LIKE '%verificacion%'").to_a
```

Si dice 'verificado' en lugar de 'aprobado', crear migración:

```ruby
rails generate migration UpdateVerificacionEstados
```

```ruby
class UpdateVerificacionEstados < ActiveRecord::Migration[8.0]
  def up
    execute "ALTER TABLE verificaciones DROP CONSTRAINT IF EXISTS estado_check"
    execute "ALTER TABLE verificaciones ADD CONSTRAINT estado_check CHECK (estado IN ('pendiente', 'aprobado', 'rechazado'))"
  end

  def down
    execute "ALTER TABLE verificaciones DROP CONSTRAINT IF EXISTS estado_check"
    execute "ALTER TABLE verificaciones ADD CONSTRAINT estado_check CHECK (estado IN ('pendiente', 'verificado', 'rechazado'))"
  end
end
```

```cmd
rails db:migrate
```

### PASO 5: Configurar WebSocket en el backend (si no está)

#### 5.1 Verificar servidor WebSocket

Verifica que existe el archivo `backend\wedsocket\src\main.ts` o similar con:

```typescript
// Sala para moderadores
io.on('connection', (socket) => {
  socket.on('joinModeratorRoom', ({ userId }) => {
    socket.join('moderators');
  });
});

// Emitir notificación cuando se crea una incidencia
io.to('moderators').emit('moderator:newIncident', incidenciaData);

// Emitir notificación cuando se crea una verificación
io.to('moderators').emit('moderator:newVerification', verificacionData);
```

Si no existe, necesitas implementar este servidor WebSocket.

### PASO 6: Probar todo el flujo

1. **Iniciar servidores**:
   ```cmd
   # Terminal 1: Rails API
   cd backend\APIREST
   rails s

   # Terminal 2: Frontend
   cd frontend
   npm run dev

   # Terminal 3: WebSocket (si existe)
   cd backend\wedsocket
   npm run start:dev
   ```

2. **Login como moderador**:
   - Usuario: `pepe@gmail.com`
   - Contraseña: `1234`

3. **Verificar Dashboard**:
   - ✅ Los KPIs deben cargar desde GraphQL
   - ✅ Las notificaciones deben actualizarse en tiempo real

4. **Verificar Verificaciones**:
   - ✅ Debe mostrar lista de verificaciones
   - ✅ Botones de Aprobar/Rechazar deben funcionar
   - ✅ Filtro de estados debe funcionar

5. **Verificar Incidencias**:
   - ✅ Debe mostrar lista de incidencias
   - ✅ Botones de Resolver/Rechazar deben funcionar
   - ✅ Estados correctos: pendiente, en_revision, resuelto

---

## 🔧 Solución de Problemas

### Error 404 en /api/v1/api/v1/incidencias
✅ **SOLUCIONADO**: Removida la duplicación de `/api/v1` en `moderadorService.ts`

### Verificaciones no muestra datos
- Verificar que el endpoint GET `/api/v1/verificaciones` devuelva datos
- Verificar que tenga relaciones con `arquitecto` y `usuario`
- Probar endpoint en Postman/curl

### Notificaciones no funcionan
- Verificar que el servidor WebSocket esté corriendo
- Verificar la URL en `VITE_WS_URL` (`.env`)
- Abrir DevTools > Network > WS para ver conexión

### Estados no coinciden
- Verificar constraints en la base de datos
- Ejecutar migraciones si es necesario
- Actualizar seeds si es necesario

---

## 📝 Archivos Modificados

### ✅ Completados
- `frontend/src/pages/Moderator/Incidencias.tsx` - Estados corregidos
- `frontend/src/pages/Moderator/Dashboard.tsx` - WebSocket integrado
- `frontend/src/services/api/moderador/moderadorService.ts` - URL corregida
- `frontend/src/services/websocket/notificationService.ts` - Servicio creado
- `frontend/src/pages/Moderator/Verificaciones_NEW.tsx` - Versión limpia creada

### ⚠️ Requieren acción manual
- `frontend/src/pages/Moderator/Verificaciones.tsx` - Reemplazar con NEW
- `backend/APIREST/app/controllers/api/v1/incidencias_controller.rb` - Agregar métodos
- `backend/APIREST/app/controllers/api/v1/verificaciones_controller.rb` - Agregar métodos
- `backend/APIREST/config/routes.rb` - Agregar rutas
- Base de datos - Migraciones de estados

---

## ✨ Resultado Final Esperado

Después de seguir todos los pasos:

1. ✅ Dashboard muestra KPIs en tiempo real
2. ✅ Notificaciones aparecen automáticamente vía WebSocket
3. ✅ Verificaciones carga lista y permite aprobar/rechazar
4. ✅ Incidencias carga lista y permite resolver/rechazar con estados correctos
5. ✅ Filtros funcionan en ambas páginas
6. ✅ Paginación funciona correctamente
7. ✅ No hay errores 404 en la consola

---

## 🚀 Próximos Pasos (Mejoras Futuras)

- [ ] Reemplazar `moderador_id: 1` con AuthContext user.id
- [ ] Reemplazar prompt() con modales personalizados
- [ ] Agregar búsqueda por nombre de arquitecto
- [ ] Implementar exportación a CSV/PDF
- [ ] Agregar gráficos en el dashboard
- [ ] Implementar notificaciones push del navegador
