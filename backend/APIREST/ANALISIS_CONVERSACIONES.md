# 📋 Análisis: Problemas en API REST - Conversaciones

**Fecha:** 2025-01-27

---

## 🔍 Problema Identificado

### Error en los Logs

```
Started POST "/api/v1/conversaciones" for ::1
Parameters: {
  "mensaje" => {
    "contenido" => "hola", 
    "remitente_id" => "5af9923c-27c9-4fdc-9221-d7b8e416e487", 
    "conversacion_id" => "79f484bb-ea90-464e-8666-4cc69c3fe3b4", 
    "leido" => false
  }, 
  "conversacion" => {}  ← VACÍO
}

ActionController::ParameterMissing (param is missing or the value is empty or invalid: conversacion)
```

---

## 🔎 Análisis del Código

### 1. ConversacionesController

**Ubicación:** `app/controllers/api/v1/conversaciones_controller.rb`

**Estado:** ⚠️ **Funcional pero limitado**

#### Métodos Disponibles:
- ✅ `index` - Lista todas las conversaciones
- ✅ `create` - Crea nueva conversación (requiere `cliente_id` y `arquitecto_id`)
- ✅ `show` - Muestra una conversación
- ✅ `update` - Actualiza conversación
- ✅ `destroy` - Elimina conversación

#### Parámetros Requeridos para `create`:
```ruby
params.require(:conversacion).permit(:fecha, :cliente_id, :arquitecto_id)
```

**Problema:** El error muestra que se está intentando crear una conversación con parámetros de mensaje.

---

### 2. Modelo Conversacion

**Ubicación:** `app/models/conversacion.rb`

**Relaciones:**
- `belongs_to :cliente` (obligatorio)
- `belongs_to :arquitecto` (obligatorio)
- `has_many :mensajes, dependent: :destroy`

**Campos Requeridos:**
- `cliente_id` (UUID, obligatorio)
- `arquitecto_id` (UUID, obligatorio)
- `fecha` (date, tiene default: CURRENT_DATE)

---

### 3. Rutas Disponibles

**Ubicación:** `config/routes.rb`

```ruby
resources :conversaciones
resources :mensajes
```

**Rutas Generadas:**
- `GET    /api/v1/conversaciones` - Lista conversaciones
- `POST   /api/v1/conversaciones` - Crea conversación
- `GET    /api/v1/conversaciones/:id` - Muestra conversación
- `PUT    /api/v1/conversaciones/:id` - Actualiza conversación
- `DELETE /api/v1/conversaciones/:id` - Elimina conversación

**⚠️ Problema:** No hay ruta anidada para obtener mensajes de una conversación:
- ❌ No existe: `GET /api/v1/conversaciones/:id/mensajes`

**El WebSocket intenta llamar a:**
```typescript
GET /api/v1/conversaciones/${conversacionId}/mensajes
```

**Pero esta ruta NO existe en Rails**, por lo que probablemente está redirigiendo o causando el error.

---

### 4. MensajesController

**Ubicación:** `app/controllers/api/v1/mensajes_controller.rb`

**Estado:** ✅ **Funcional**

**Rutas Disponibles:**
- `GET    /api/v1/mensajes` - Lista todos los mensajes
- `POST   /api/v1/mensajes` - Crea mensaje ✅ (Este es el correcto)
- `GET    /api/v1/mensajes/:id` - Muestra mensaje
- `PUT    /api/v1/mensajes/:id` - Actualiza mensaje
- `DELETE /api/v1/mensajes/:id` - Elimina mensaje

**Parámetros para `create`:**
```ruby
params.require(:mensaje).permit(:contenido, :fecha_envio, :leido, :remitente_id, :conversacion_id)
```

---

## 🚨 Problemas Encontrados

### Problema #1: Ruta Faltante para Mensajes de Conversación

**Descripción:** El WebSocket intenta obtener mensajes de una conversación usando:
```
GET /api/v1/conversaciones/:id/mensajes
```

**Pero esta ruta NO existe** en `routes.rb`.

**Solución Necesaria:**
Agregar ruta anidada en `routes.rb`:
```ruby
resources :conversaciones do
  resources :mensajes, only: [:index]
end
```

O crear un método en `ConversacionesController`:
```ruby
def mensajes
  @conversacion = Conversacion.find(params[:id])
  @mensajes = @conversacion.mensajes
  render json: @mensajes
end
```

Y agregar la ruta:
```ruby
resources :conversaciones do
  member do
    get :mensajes
  end
end
```

---

### Problema #2: Endpoint Incorrecto en el Error

**Descripción:** El error muestra que se está llamando a `/api/v1/conversaciones` con parámetros de mensaje.

**Posibles Causas:**
1. El WebSocket está llamando al endpoint incorrecto (pero el código muestra que llama a `/mensajes`)
2. Hay una redirección en Rails
3. El error viene de otra parte del código

**Verificación:** El código del WebSocket está correcto:
- `MensajeService.crearMensaje()` → `POST /api/v1/mensajes` ✅
- `ChatService.createMessage()` → `POST /api/v1/mensajes` ✅

**Conclusión:** El error podría venir de:
- Una llamada directa desde el frontend (no a través del WebSocket)
- Un problema de redirección en Rails
- Un error en el manejo de rutas

---

### Problema #3: Falta Ruta para Marcar Mensajes como Leídos

**Descripción:** El WebSocket intenta llamar a:
```
PUT /api/v1/conversaciones/:id/mensajes/marcar_leidos
```

**Pero esta ruta NO existe** en `routes.rb`.

**Solución Necesaria:**
Agregar ruta en `routes.rb`:
```ruby
resources :conversaciones do
  member do
    put :marcar_mensajes_leidos
  end
end
```

Y crear método en `ConversacionesController`:
```ruby
def marcar_mensajes_leidos
  @conversacion = Conversacion.find(params[:id])
  usuario_id = params[:usuario_id]
  
  @conversacion.mensajes.where(leido: false)
                .update_all(leido: true)
  
  render json: { success: true, mensajes_actualizados: @conversacion.mensajes.count }
end
```

---

## ✅ Correcciones Aplicadas en WebSocket

### 1. Autenticación Agregada

**Antes:**
- `MensajeService` no pasaba token de autenticación

**Después:**
- ✅ Todos los métodos ahora aceptan `authorization` como parámetro
- ✅ El gateway extrae el token del cliente y lo pasa al servicio

### 2. Manejo de Errores Mejorado

**Antes:**
- Errores genéricos sin detalles

**Después:**
- ✅ Extrae mensajes de error de la respuesta HTTP
- ✅ Proporciona mensajes más descriptivos

---

## 📝 Resumen de Problemas

| # | Problema | Severidad | Estado |
|---|----------|-----------|--------|
| 1 | Ruta faltante: `GET /conversaciones/:id/mensajes` | 🔴 CRÍTICO | ⚠️ Pendiente en Rails |
| 2 | Ruta faltante: `PUT /conversaciones/:id/mensajes/marcar_leidos` | 🔴 CRÍTICO | ⚠️ Pendiente en Rails |
| 3 | Error muestra llamada a `/conversaciones` con datos de mensaje | 🟡 MEDIO | ✅ WebSocket corregido |
| 4 | Falta autenticación en servicios | 🔴 CRÍTICO | ✅ Corregido |
| 5 | Manejo de errores básico | 🟡 MEDIO | ✅ Mejorado |

---

## 🔧 Acciones Requeridas en Rails

### 1. Agregar Ruta para Obtener Mensajes de Conversación

**En `config/routes.rb`:**
```ruby
resources :conversaciones do
  member do
    get :mensajes
  end
end
```

**En `app/controllers/api/v1/conversaciones_controller.rb`:**
```ruby
def mensajes
  @conversacion = Conversacion.find_by(id: params[:id])
  if @conversacion
    @mensajes = @conversacion.mensajes.order(fecha_envio: :asc)
    render json: @mensajes
  else
    render json: { error: "Conversación no encontrada" }, status: :not_found
  end
end
```

### 2. Agregar Ruta para Marcar Mensajes como Leídos

**En `config/routes.rb`:**
```ruby
resources :conversaciones do
  member do
    get :mensajes
    put :marcar_mensajes_leidos
  end
end
```

**En `app/controllers/api/v1/conversaciones_controller.rb`:**
```ruby
def marcar_mensajes_leidos
  @conversacion = Conversacion.find_by(id: params[:id])
  if @conversacion
    usuario_id = params[:usuario_id]
    mensajes_actualizados = @conversacion.mensajes
                                         .where.not(remitente_id: usuario_id)
                                         .where(leido: false)
                                         .update_all(leido: true)
    
    render json: { 
      success: true, 
      mensajes_actualizados: mensajes_actualizados 
    }
  else
    render json: { error: "Conversación no encontrada" }, status: :not_found
  end
end
```

---

## ✅ Estado Actual

### WebSocket (NestJS)
- ✅ Autenticación implementada
- ✅ Manejo de errores mejorado
- ✅ Endpoints correctos configurados

### API REST (Rails)
- ⚠️ Falta ruta para obtener mensajes de conversación
- ⚠️ Falta ruta para marcar mensajes como leídos
- ✅ Controlador de mensajes funcional
- ✅ Controlador de conversaciones funcional (pero limitado)

---

**Generado por:** Auto (AI Assistant)  
**Fecha:** 2025-01-27

