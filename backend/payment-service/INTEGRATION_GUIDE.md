# 🔗 Guía de Integración - Payment Service

Esta guía explica cómo integrar el Payment Service con el resto del sistema Arquipro.

## 📋 Requisitos Previos

1. ✅ Payment Service corriendo en `http://localhost:4002`
2. ✅ API Gateway corriendo en `http://localhost:4000`
3. ✅ n8n Event Bus corriendo en `http://localhost:5678` (opcional)
4. ✅ Base de datos PostgreSQL configurada

## 🔧 Configuración del API Gateway

El API Gateway ya está configurado para enrutar peticiones a `/payments/*` al Payment Service.

### Variables de Entorno del Gateway

Agrega en `backend/gateway/.env`:

```env
PAYMENT_SERVICE_URL=http://localhost:4002
```

### Verificar Integración

```bash
# Desde el frontend o cualquier cliente
curl http://localhost:4000/payments
# Debe redirigir a http://localhost:4002/payments
```

## 🔄 Flujo de Integración Completo

### 1. Registrar Partner B2B ("Cursor Online")

```bash
POST http://localhost:4000/payments/partners/register
Content-Type: application/json

{
  "name": "Cursor Online",
  "webhookUrl": "https://cursor-online.com/api/webhooks",
  "subscribedEvents": [
    "service.purchased",
    "appointment.confirmed"
  ]
}
```

**Respuesta:**
```json
{
  "id": "partner-uuid",
  "secret": "secret-generado-64-chars",
  ...
}
```

⚠️ **Importante:** Comparte el `secret` con "Cursor Online" para que puedan firmar webhooks entrantes.

### 2. Cliente Paga Servicio en Arquipro

Cuando un cliente paga un servicio (ej: asesoría técnica):

```bash
POST http://localhost:4000/payments/payments
Content-Type: application/json

{
  "provider": "mock",
  "amount": 100.50,
  "currency": "USD",
  "serviceType": "asesoria_tecnica",
  "userId": "user-uuid",
  "projectId": "project-uuid"
}
```

**Lo que sucede automáticamente:**

1. ✅ Payment Service procesa el pago
2. ✅ Si el pago es exitoso, se dispara el evento `service.purchased`
3. ✅ Se envía webhook firmado a "Cursor Online" (si está suscrito)
4. ✅ Se envía evento a n8n Event Bus para procesamiento adicional

### 3. "Cursor Online" Recibe Webhook

"Cursor Online" recibirá un POST en su `webhookUrl`:

```json
{
  "event": "service.purchased",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "data": {
    "paymentId": "payment-uuid",
    "amount": 100.50,
    "currency": "USD",
    "serviceType": "asesoria_tecnica",
    "userId": "user-uuid",
    "projectId": "project-uuid"
  }
}
```

**Headers:**
```
X-Webhook-Signature: firma-hmac-sha256
X-Webhook-Event: service.purchased
```

"Cursor Online" debe verificar la firma antes de procesar:

```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)
```

### 4. "Cursor Online" Notifica Evento a Arquipro

Cuando "Cursor Online" confirma un diseño o cita:

```bash
POST http://localhost:4000/payments/webhooks/incoming/{partnerId}
Content-Type: application/json
X-Webhook-Signature: firma-hmac-del-payload
X-Webhook-Event: appointment.confirmed

{
  "data": {
    "appointmentId": "123",
    "status": "confirmed",
    "date": "2025-01-20T14:00:00Z",
    "projectId": "project-uuid"
  }
}
```

**Lo que sucede automáticamente:**

1. ✅ Payment Service verifica la firma HMAC
2. ✅ Si es válida, guarda el evento en base de datos
3. ✅ Envía evento validado a n8n Event Bus
4. ✅ n8n puede actualizar el estado del proyecto en Arquipro

## 🔐 Seguridad

### Firma de Webhooks Salientes

El Payment Service firma todos los webhooks salientes usando HMAC-SHA256:

```typescript
const signature = hmac.sign(payload, partner.secret);
// Se envía en header: X-Webhook-Signature
```

### Verificación de Webhooks Entrantes

El Payment Service verifica la firma antes de procesar:

```typescript
const isValid = hmac.verify(payload, signature, partner.secret);
if (!isValid) {
  throw new Error('Firma inválida');
}
```

## 📡 Integración con n8n Event Bus

El Payment Service envía automáticamente todos los eventos (salientes y entrantes) a n8n:

```typescript
POST http://localhost:5678/webhook
Content-Type: application/json

{
  "event": "service.purchased",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "data": { ... },
  "source": "payment-service"
}
```

### Configurar Workflow en n8n

1. Crea un workflow en n8n con un nodo **Webhook**
2. Configura la URL: `http://localhost:5678/webhook`
3. Agrega lógica para procesar eventos:
   - `service.purchased` → Actualizar estado del proyecto
   - `appointment.confirmed` → Notificar al cliente
   - etc.

## 🧪 Testing

### Probar Flujo Completo

1. **Registrar Partner:**
```bash
curl -X POST http://localhost:4000/payments/partners/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Partner",
    "webhookUrl": "https://webhook.site/unique-id",
    "subscribedEvents": ["service.purchased"]
  }'
```

2. **Procesar Pago:**
```bash
curl -X POST http://localhost:4000/payments/payments \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "mock",
    "amount": 50.00,
    "currency": "USD",
    "serviceType": "test"
  }'
```

3. **Verificar Webhook en webhook.site**

### Probar Webhook Entrante

```bash
# Obtener secret del partner
PARTNER_ID="uuid-del-partner"
SECRET="secret-del-partner"

# Crear payload
PAYLOAD='{"data":{"test":"value"}}'

# Generar firma (en Linux/Mac)
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)

# Enviar webhook
curl -X POST http://localhost:4000/payments/webhooks/incoming/$PARTNER_ID \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -H "X-Webhook-Event: test.event" \
  -d "$PAYLOAD"
```

## 📊 Monitoreo

### Ver Historial de Webhooks

```bash
GET http://localhost:4000/payments/webhooks/history?partnerId={uuid}
```

### Ver Partners Registrados

```bash
GET http://localhost:4000/payments/partners
```

### Ver Pagos

```bash
GET http://localhost:4000/payments/payments?userId={uuid}
```

## 🐛 Troubleshooting

### Webhooks no se envían

1. Verifica que el partner esté activo: `GET /partners/{id}`
2. Verifica que el partner esté suscrito al evento
3. Revisa logs del Payment Service
4. Verifica conectividad con la URL del webhook

### Firma HMAC inválida

1. Verifica que el `secret` sea correcto
2. Asegúrate de firmar el payload completo (no solo `data`)
3. Verifica que el formato de la firma sea hexadecimal

### Eventos no llegan a n8n

1. Verifica que `N8N_WEBHOOK_URL` esté configurado
2. Verifica que n8n esté corriendo
3. Revisa logs del Payment Service (warnings no son críticos)

## 📝 Próximos Pasos

- [ ] Implementar sistema de reintentos para webhooks fallidos (RabbitMQ/Bull)
- [ ] Agregar autenticación JWT a endpoints protegidos
- [ ] Implementar rate limiting
- [ ] Agregar métricas y monitoreo (Prometheus/Grafana)
- [ ] Implementar webhooks asíncronos con cola de mensajes
