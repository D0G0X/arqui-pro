# 🔧 SOLUCIÓN COMPLETA - Problemas Resueltos

## ✅ CAMBIOS REALIZADOS EN EL CÓDIGO

### 1. WebSocket ahora se gestiona globalmente

**Problema**: WebSocket se conectaba/desconectaba en cada navegación entre páginas

**Solución**: Movido a `App.tsx` para mantener una sola conexión persistente

**Archivos modificados**:
- ✅ `App.tsx` - Agregado `WebSocketManager` component
- ✅ `Dashboard.tsx` - Removida lógica de conexión/desconexión

**Resultado**: Una sola conexión WebSocket durante toda la sesión del moderador

---

### 2. Endpoints faltantes en el backend

**Problema**: Error 404 al intentar resolver/rechazar incidencias y aprobar/rechazar verificaciones

**Causa**: Los endpoints POST no existen en el backend Rails

**Solución requerida**: Ver archivo `BACKEND_ENDPOINTS_REQUIRED.md` para instrucciones completas

---

## 📋 ACCIÓN REQUERIDA POR TI

### 🔴 PASO 1: Agregar rutas en Rails (OBLIGATORIO)

Abre: `backend/APIREST/config/routes.rb`

Busca estas líneas y actualízalas:

```ruby
# BUSCA:
resources :incidencias
resources :verificaciones

# REEMPLAZA CON:
resources :incidencias do
  member do
    post :resolver
    post :rechazar
  end
end

resources :verificaciones do
  member do
    post :aprobar
    post :rechazar
  end
end
```

---

### 🔴 PASO 2: Agregar métodos al controlador de Incidencias

Abre: `backend/APIREST/app/controllers/api/v1/incidencias_controller.rb`

**AGREGA estos métodos ANTES del último `end`**:

```ruby
  # Resolver incidencia
  def resolver
    @incidencia = Incidencia.find(params[:id])
    
    if @incidencia.update(
      estado: 'resuelto',
      moderador_id: params[:moderador_id],
      resolucion: params[:resolucion],
      fecha_resolucion: DateTime.now
    )
      render json: { 
        status: 'success', 
        message: 'Incidencia resuelta correctamente',
        incidencia: @incidencia 
      }, status: :ok
    else
      render json: { 
        status: 'error', 
        errors: @incidencia.errors.full_messages 
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { 
      status: 'error', 
      message: 'Incidencia no encontrada' 
    }, status: :not_found
  end

  # Rechazar incidencia
  def rechazar
    @incidencia = Incidencia.find(params[:id])
    
    if @incidencia.update(
      estado: 'rechazado',
      moderador_id: params[:moderador_id],
      resolucion: params[:resolucion],
      fecha_resolucion: DateTime.now
    )
      render json: { 
        status: 'success', 
        message: 'Incidencia rechazada',
        incidencia: @incidencia 
      }, status: :ok
    else
      render json: { 
        status: 'error', 
        errors: @incidencia.errors.full_messages 
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { 
      status: 'error', 
      message: 'Incidencia no encontrada' 
    }, status: :not_found
  end
```

**ACTUALIZA el método `incidencia_params`**:

```ruby
  private

  def incidencia_params
    params.permit(
      :descripcion, 
      :estado, 
      :emisor_id, 
      :infractor_id, 
      :moderador_id,
      :resolucion,
      :fecha_resolucion
    )
  end
```

---

### 🔴 PASO 3: Agregar métodos al controlador de Verificaciones

Abre: `backend/APIREST/app/controllers/api/v1/verificaciones_controller.rb`

**AGREGA estos métodos ANTES del último `end`**:

```ruby
  # Aprobar verificación
  def aprobar
    @verificacion = Verificacion.find(params[:id])
    
    if @verificacion.update(
      estado: 'aprobado',
      moderador_id: params[:moderador_id],
      comentarios: params[:comentarios],
      fecha_resolucion: DateTime.now
    )
      render json: { 
        status: 'success', 
        message: 'Verificación aprobada correctamente',
        verificacion: @verificacion 
      }, status: :ok
    else
      render json: { 
        status: 'error', 
        errors: @verificacion.errors.full_messages 
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { 
      status: 'error', 
      message: 'Verificación no encontrada' 
    }, status: :not_found
  end

  # Rechazar verificación
  def rechazar
    @verificacion = Verificacion.find(params[:id])
    
    if @verificacion.update(
      estado: 'rechazado',
      moderador_id: params[:moderador_id],
      comentarios: params[:comentarios],
      fecha_resolucion: DateTime.now
    )
      render json: { 
        status: 'success', 
        message: 'Verificación rechazada',
        verificacion: @verificacion 
      }, status: :ok
    else
      render json: { 
        status: 'error', 
        errors: @verificacion.errors.full_messages 
      }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { 
      status: 'error', 
      message: 'Verificación no encontrada' 
    }, status: :not_found
  end
```

**ACTUALIZA el método `verificacion_params`**:

```ruby
  private

  def verificacion_params
    params.permit(
      :estado, 
      :fecha_verificacion, 
      :arquitecto_id, 
      :moderador_id,
      :comentarios,
      :fecha_resolucion
    )
  end
```

---

### 🔴 PASO 4: Reiniciar servidor Rails

```bash
# Detén el servidor (Ctrl+C)
cd backend/APIREST
rails s
```

---

## 🧪 PROBAR QUE TODO FUNCIONA

1. **Reinicia ambos servidores**:
   ```bash
   # Terminal 1: Rails
   cd backend/APIREST
   rails s

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

2. **Login como moderador**: `pepe@gmail.com` / `1234`

3. **Verifica Dashboard**:
   - ✅ WebSocket debe conectarse UNA SOLA VEZ
   - ✅ No debe desconectarse al navegar

4. **Verifica Incidencias**:
   - ✅ Click en "Resolver" debe funcionar (sin error 404)
   - ✅ Click en "Rechazar" debe funcionar

5. **Verifica Verificaciones**:
   - ✅ Click en "Aprobar" debe funcionar (sin error 404)
   - ✅ Click en "Rechazar" debe funcionar

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### ❌ Aún sale error 404

**Verifica las rutas**:
```bash
cd backend/APIREST
rails routes | grep -E "resolver|rechazar|aprobar"
```

Debes ver:
```
resolver_api_v1_incidencia POST /api/v1/incidencias/:id/resolver
rechazar_api_v1_incidencia POST /api/v1/incidencias/:id/rechazar
aprobar_api_v1_verificacion POST /api/v1/verificaciones/:id/aprobar
rechazar_api_v1_verificacion POST /api/v1/verificaciones/:id/rechazar
```

Si NO aparecen, revisa que hayas guardado `routes.rb` correctamente.

---

### ❌ Error "column does not exist"

Significa que la tabla no tiene la columna `resolucion` o `fecha_resolucion`.

**Crear migración**:
```bash
cd backend/APIREST
rails generate migration AddResolucionToIncidencias resolucion:text fecha_resolucion:datetime
rails generate migration AddFechaResolucionToVerificaciones fecha_resolucion:datetime
rails db:migrate
```

---

### ❌ WebSocket sigue desconectándose

Verifica que `App.tsx` tenga el componente `<WebSocketManager />` dentro del `<Router>`:

```tsx
<Router>
  <WebSocketManager />  {/* ← Debe estar aquí */}
  <Routes>
    ...
  </Routes>
</Router>
```

---

## 📚 DOCUMENTACIÓN ADICIONAL

Ver archivos completos de referencia:
- `BACKEND_ENDPOINTS_REQUIRED.md` - Detalles completos de los endpoints
- `INSTRUCCIONES_MODERADOR.md` - Guía completa del módulo
- `RESUMEN_MODERADOR.md` - Resumen ejecutivo

---

## ✨ RESULTADO FINAL

Después de seguir estos pasos:

✅ WebSocket conectado globalmente (una sola vez)
✅ Notificaciones en tiempo real funcionando
✅ Incidencias: Resolver/Rechazar funcionando
✅ Verificaciones: Aprobar/Rechazar funcionando
✅ Sin errores 404 en consola
✅ Navegación fluida sin reconexiones
