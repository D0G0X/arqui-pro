# Testing - Creación de Conversaciones

## Problema Actual
Error 422 (Unprocessable Content) al crear conversación desde frontend.

## Pasos de Diagnóstico

### 1. Verificar que Rails esté corriendo
```bash
# En terminal, ir a backend/APIREST
cd backend/APIREST
rails server
```

Debería estar corriendo en `http://localhost:3000`

### 2. Probar endpoint directo con curl

**Primero, obtén un token de autenticación:**
```bash
# Login como cliente
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@example.com", "password": "tu-password"}'
```

Copia el `token` de la respuesta.

**Luego, prueba crear conversación:**
```bash
curl -X POST http://localhost:3000/api/v1/conversaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "conversacion": {
      "cliente_id": 1,
      "arquitecto_id": 2,
      "fecha": "2025-11-10"
    }
  }'
```

### 3. Verificar IDs válidos

**Listar clientes:**
```bash
curl http://localhost:3000/api/v1/clientes
```

**Listar arquitectos:**
```bash
curl http://localhost:3000/api/v1/arquitectos
```

Asegúrate de usar IDs que existan en la base de datos.

### 4. Revisar logs de Rails

```bash
tail -f backend/APIREST/log/development.log
```

Busca líneas que contengan:
- Error de validación
- "Unpermitted parameters"
- Errores de ActiveRecord

### 5. Probar desde Rails Console

```bash
cd backend/APIREST
rails console
```

```ruby
# Verificar que existen cliente y arquitecto
cliente = Cliente.find(1)  # Cambia 1 por un ID válido
arquitecto = Arquitecto.find(2)  # Cambia 2 por un ID válido

# Intentar crear conversación
conversacion = Conversacion.new(
  cliente_id: cliente.id,
  arquitecto_id: arquitecto.id,
  fecha: Date.today
)

# Ver si es válida
conversacion.valid?

# Ver errores de validación
conversacion.errors.full_messages

# Intentar guardar
conversacion.save
```

## Errores Comunes y Soluciones

### Error: "Cliente must exist"
**Causa**: El `cliente_id` no existe en la tabla `clientes`

**Solución**: 
- Verifica que el usuario sea realmente un cliente
- Usa el ID correcto de la tabla `clientes`, no de `usuarios`

### Error: "Arquitecto must exist"
**Causa**: El `arquitecto_id` no existe en la tabla `arquitectos`

**Solución**:
- Verifica que el arquitecto exista
- Usa el ID correcto de la tabla `arquitectos`, no de `usuarios`

### Error: "Unpermitted parameters"
**Causa**: El controlador no permite ciertos parámetros

**Solución**: Verificar en `conversaciones_controller.rb`:
```ruby
def conversacion_params
  params.require(:conversacion).permit(:fecha, :cliente_id, :arquitecto_id)
end
```

## Cambios Recientes Implementados

### Backend Rails

1. **`app/services/websocket_notifier.rb`**
   - ✅ Agregado método `notify_conversation_created`
   - Notifica tanto al cliente como al arquitecto

2. **`app/controllers/api/v1/conversaciones_controller.rb`**
   - ✅ Ya llama a `WebsocketNotifier.notify_conversation_created`

### Frontend

1. **`services/api/conversacionesService.ts`**
   - ✅ Convierte IDs a números: `Number(params.cliente_id)`
   - ✅ Envía datos en formato correcto:
     ```json
     {
       "conversacion": {
         "cliente_id": 1,
         "arquitecto_id": 2,
         "fecha": "2025-11-10"
       }
     }
     ```

2. **`services/websocket/notificationService.ts`**
   - ✅ Escucha evento `conversacion:creada`
   - ✅ Crea notificación cuando se crea conversación

3. **`pages/Arquitecto/ArquitectoProfile.tsx`**
   - ✅ Mejores logs de error para debugging
   - Muestra `error.response.data` en consola

## Qué Verificar Ahora

1. **Abre la consola del navegador** (F12)
2. **Intenta crear una conversación**
3. **Revisa los logs en consola:**
   - ¿Qué dice "Datos a enviar"?
   - ¿Qué dice "Response data"?
   - ¿Qué dice "Response status"?

4. **Revisa los logs de Rails:**
   ```bash
   tail -f backend/APIREST/log/development.log
   ```
   
   Deberías ver:
   - `Processing by Api::V1::ConversacionesController#create`
   - Los parámetros recibidos
   - El error exacto si falla

## Notificaciones de Mensajes

### Backend WebSocket (NestJS)

El `mensaje.gateway.ts` ya está configurado para:
1. Emitir `message:new` al namespace `/mensajes`
2. **NUEVO**: Enviar notificación al namespace `/notificacion` vía HTTP

```typescript
// Después de crear mensaje
await firstValueFrom(
  this.httpService.post('http://localhost:3006/api/notificaciones/emit', {
    evento: 'message:new',
    data: mensajeCreado,
  })
);
```

### Frontend

El `notificationService.ts` escucha:
- ✅ `message:new` - Cuando llega un mensaje
- ✅ `conversacion:creada` - Cuando se crea conversación
- ✅ `proyecto:creado` - Cuando arquitecto crea proyecto
- ✅ `arquitecto:verificado` - Cuando moderador verifica
- ✅ `arquitecto:rechazado` - Cuando moderador rechaza

Todas estas notificaciones aparecen en el dropdown de notificaciones 🔔

## Próximo Paso

Ejecuta el test de curl arriba y comparte:
1. La respuesta que obtienes
2. Los logs de Rails console
3. Los logs del navegador (console.log)

Esto nos dirá exactamente qué está fallando.
