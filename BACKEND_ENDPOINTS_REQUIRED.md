# ENDPOINTS FALTANTES - Backend Rails

## ❌ PROBLEMA: Error 404 al resolver/rechazar

El frontend llama a estos endpoints pero NO existen en el backend:

- `POST /api/v1/incidencias/:id/resolver` → 404
- `POST /api/v1/incidencias/:id/rechazar` → 404
- `POST /api/v1/verificaciones/:id/aprobar` → 404
- `POST /api/v1/verificaciones/:id/rechazar` → 404

---

## ✅ SOLUCIÓN: Agregar métodos a los controladores

### PASO 1: Editar routes.rb

Abre: `backend/APIREST/config/routes.rb`

Busca la línea con `resources :incidencias` y reemplázala:

```ruby
# ANTES
resources :incidencias

# DESPUÉS
resources :incidencias do
  member do
    post :resolver
    post :rechazar
  end
end
```

Busca la línea con `resources :verificaciones` y reemplázala:

```ruby
# ANTES
resources :verificaciones

# DESPUÉS
resources :verificaciones do
  member do
    post :aprobar
    post :rechazar
  end
end
```

---

### PASO 2: Editar incidencias_controller.rb

Abre: `backend/APIREST/app/controllers/api/v1/incidencias_controller.rb`

**Agrega estos métodos AL FINAL del controlador** (antes del último `end`):

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

**También actualiza el `incidencia_params` method** para permitir los nuevos campos:

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

### PASO 3: Editar verificaciones_controller.rb

Abre: `backend/APIREST/app/controllers/api/v1/verificaciones_controller.rb`

**Agrega estos métodos AL FINAL del controlador** (antes del último `end`):

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

**También actualiza el `verificacion_params` method**:

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

### PASO 4: Verificar que las tablas tienen las columnas necesarias

Abre una consola de Rails:

```bash
cd backend/APIREST
rails console
```

Ejecuta:

```ruby
# Verificar columnas de Incidencia
Incidencia.column_names
# Debe incluir: "resolucion", "fecha_resolucion", "moderador_id"

# Verificar columnas de Verificacion
Verificacion.column_names
# Debe incluir: "comentarios", "fecha_resolucion", "moderador_id"
```

**Si falta alguna columna**, crear migraciones:

```bash
# Para Incidencias
rails generate migration AddResolucionToIncidencias resolucion:text fecha_resolucion:datetime

# Para Verificaciones (si falta fecha_resolucion)
rails generate migration AddFechaResolucionToVerificaciones fecha_resolucion:datetime

# Ejecutar migraciones
rails db:migrate
```

---

### PASO 5: Reiniciar el servidor Rails

```bash
# Ctrl+C para detener el servidor
# Luego reiniciarlo:
rails s
```

---

## 🧪 CÓMO PROBAR

1. Reinicia el servidor Rails
2. Ve a `http://localhost:5173/moderador/incidencias`
3. Haz clic en "Resolver" en una incidencia pendiente
4. Debe funcionar sin error 404

**Si sigue dando 404**:
- Verifica que guardaste todos los archivos
- Verifica que reiniciaste el servidor
- Ejecuta `rails routes | grep incidencias` para ver las rutas disponibles

---

## 📝 VERIFICAR RUTAS

Para verificar que las rutas están correctamente creadas:

```bash
cd backend/APIREST
rails routes | grep -E "resolver|rechazar|aprobar"
```

Deberías ver:

```
resolver_api_v1_incidencia POST /api/v1/incidencias/:id/resolver
rechazar_api_v1_incidencia POST /api/v1/incidencias/:id/rechazar
aprobar_api_v1_verificacion POST /api/v1/verificaciones/:id/aprobar
rechazar_api_v1_verificacion POST /api/v1/verificaciones/:id/rechazar
```

Si NO aparecen estas rutas, verifica que editaste correctamente `routes.rb`.
