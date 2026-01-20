# 💳 Payment Service - Microservicio de Pagos

Microservicio independiente para gestión de pagos y webhooks bidireccionales con integración B2B.

## 📋 Características

- ✅ **Patrón Adapter** para proveedores de pago (Mock, Stripe, etc.)
- ✅ **Registro de Partners B2B** con suscripción a eventos
- ✅ **Seguridad HMAC** para firmar y verificar webhooks
- ✅ **Webhooks Bidireccionales** (salientes e entrantes)
- ✅ **Integración con API Gateway** y **n8n Event Bus**

## 🏗️ Arquitectura

```
┌─────────────────┐
│   API Gateway   │───▶ /payments/* → Payment Service
│   (Puerto 4000) │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Payment Service │───▶ Partners (Webhooks salientes)
│  (Puerto 4002)  │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   n8n Event Bus │───▶ Procesamiento de eventos
│  (Puerto 5678)  │
└─────────────────┘
```

## 🚀 Instalación

### 1. Instalar dependencias

```bash
cd backend/payment-service
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales.

#### Opción A: Base de Datos Compartida (Desarrollo)

Para desarrollo, puedes compartir la misma base de datos que otros servicios:

```env
# Base de datos compartida (usa las mismas variables que otros servicios)
DB_HOST=tu_host_supabase
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password
DB_NAME=postgres
DB_SSL=true

PORT=4002
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

**Ventajas:**
- ✅ Más simple para desarrollo
- ✅ No requiere crear nueva base de datos
- ✅ Mismo host y credenciales que otros servicios

**Desventajas:**
- ⚠️ Menos aislamiento entre servicios
- ⚠️ No ideal para producción

#### Opción B: Base de Datos Propia (Producción - Recomendado)

Para producción, cada microservicio debería tener su propia base de datos:

```env
# Base de datos propia del Payment Service
PAYMENT_DB_HOST=tu_host_supabase
PAYMENT_DB_PORT=5432
PAYMENT_DB_USER=postgres
PAYMENT_DB_PASS=tu_password
PAYMENT_DB_NAME=payment_service_db
PAYMENT_DB_SSL=true

PORT=4002
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

**Ventajas:**
- ✅ Aislamiento completo de datos
- ✅ Escalabilidad independiente
- ✅ Mejor para producción
- ✅ Cumple principio de microservicios

**Desventajas:**
- ⚠️ Requiere crear nueva base de datos
- ⚠️ Más configuración inicial

**Nota:** Si configuras `PAYMENT_DB_*`, el servicio usará esas variables. Si no, usará `DB_*` (compartida).

### 3. Ejecutar el servicio

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servicio estará disponible en: `http://localhost:4002`

## 📚 Documentación API

Una vez iniciado el servicio, accede a la documentación Swagger en:

**http://localhost:4002/api/docs**

## 🔧 Uso

### 1. Registrar un Partner B2B

```bash
POST http://localhost:4002/partners/register
Content-Type: application/json

{
  "name": "Cursor Online",
  "webhookUrl": "https://cursor-online.com/api/webhooks",
  "subscribedEvents": [
    "service.purchased",
    "appointment.confirmed"
  ],
  "description": "Sistema de gestión de citas online"
}
```

**Respuesta:**
```json
{
  "id": "uuid-del-partner",
  "name": "Cursor Online",
  "webhookUrl": "https://cursor-online.com/api/webhooks",
  "secret": "secret-generado-automaticamente",
  "subscribedEvents": ["service.purchased", "appointment.confirmed"],
  "isActive": true,
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

⚠️ **Importante:** Guarda el `secret` generado, lo necesitarás para verificar webhooks entrantes.

### 2. Procesar un Pago

```bash
POST http://localhost:4002/payments
Content-Type: application/json

{
  "provider": "mock",
  "amount": 100.50,
  "currency": "USD",
  "serviceType": "asesoria_tecnica",
  "userId": "uuid-del-usuario",
  "projectId": "uuid-del-proyecto"
}
```

Cuando el pago se complete exitosamente, se enviará automáticamente un webhook a todos los partners suscritos al evento `service.purchased`.

### 3. Recibir Webhook Entrante

Cuando un partner externo (ej: "Cursor Online") quiera notificar un evento a Arquipro:

```bash
POST http://localhost:4002/webhooks/incoming/{partnerId}
Content-Type: application/json
X-Webhook-Signature: firma-hmac-del-payload
X-Webhook-Event: appointment.confirmed

{
  "data": {
    "appointmentId": "123",
    "status": "confirmed",
    "date": "2025-01-20T14:00:00Z"
  }
}
```

El servicio verificará la firma HMAC antes de procesar el evento.

## 🔐 Seguridad HMAC

Todos los webhooks se firman usando **HMAC-SHA256**:

### Firma de Webhook Saliente

```typescript
const payload = {
  event: 'service.purchased',
  timestamp: '2025-01-15T10:00:00.000Z',
  data: { ... }
};

const signature = hmac.sign(payload, partner.secret);
// Enviar en header: X-Webhook-Signature
```

### Verificación de Webhook Entrante

```typescript
const isValid = hmac.verify(
  payload,
  signatureRecibida,
  partner.secret
);
```

## 📡 Eventos Disponibles

Los partners pueden suscribirse a los siguientes eventos:

- `service.purchased` - Cuando se completa un pago de servicio
- `service.refunded` - Cuando se procesa un reembolso
- `appointment.confirmed` - Cuando se confirma una cita (entrante)
- `appointment.cancelled` - Cuando se cancela una cita (entrante)
- `project.completed` - Cuando se completa un proyecto (entrante)
- `project.updated` - Cuando se actualiza un proyecto (entrante)

## 🔄 Flujo de Webhooks Bidireccionales

### Escenario: Cliente paga servicio en Arquipro

1. **Cliente realiza pago** → `POST /payments`
2. **Payment Service procesa pago** → MockAdapter o StripeAdapter
3. **Pago exitoso** → Se dispara evento `service.purchased`
4. **WebhookService notifica a partners** → Envía webhook firmado a "Cursor Online"
5. **Evento enviado a n8n** → Para procesamiento adicional

### Escenario: "Cursor Online" confirma diseño

1. **"Cursor Online" envía webhook** → `POST /webhooks/incoming/{partnerId}`
2. **Payment Service verifica firma HMAC**
3. **Evento procesado** → Se guarda en base de datos
4. **Evento enviado a n8n** → Para actualizar estado del proyecto en Arquipro

## 🧪 Testing

### Probar con MockAdapter (desarrollo)

```bash
# Procesar pago de prueba
curl -X POST http://localhost:4002/payments \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "mock",
    "amount": 50.00,
    "currency": "USD",
    "serviceType": "asesoria_tecnica"
  }'
```

### Probar con StripeAdapter (producción)

1. Configura `STRIPE_SECRET_KEY` en `.env`
2. Usa `"provider": "stripe"` en las peticiones

## 🔗 Integración con API Gateway

El API Gateway ya está configurado para enrutar peticiones a `/payments/*` al Payment Service.

**Configuración en Gateway:**
```env
PAYMENT_SERVICE_URL=http://localhost:4002
```

**Uso desde Frontend:**
```typescript
// En lugar de llamar directamente al payment-service
fetch('http://localhost:4002/payments', ...)

// Usa el API Gateway
fetch('http://localhost:4000/payments', ...)
```

## 📊 Monitoreo

### Ver historial de webhooks

```bash
GET http://localhost:4002/webhooks/history?partnerId={uuid}&direction=outgoing
```

### Ver partners registrados

```bash
GET http://localhost:4002/partners
```

## 🛠️ Estructura del Proyecto

```
payment-service/
├── src/
│   ├── entities/              # Entidades TypeORM
│   │   ├── partner.entity.ts
│   │   ├── payment.entity.ts
│   │   └── webhook-event.entity.ts
│   ├── payment/               # Módulo de pagos
│   │   ├── adapters/         # Adaptadores (Mock, Stripe)
│   │   ├── interfaces/        # PaymentProvider interface
│   │   ├── payment.controller.ts
│   │   ├── payment.service.ts
│   │   └── payment.module.ts
│   ├── partner/              # Módulo de partners
│   │   ├── partner.controller.ts
│   │   ├── partner.service.ts
│   │   └── partner.module.ts
│   ├── webhook/              # Módulo de webhooks
│   │   ├── webhook.controller.ts
│   │   ├── webhook.service.ts
│   │   └── webhook.module.ts
│   ├── common/               # Servicios comunes
│   │   └── services/
│   │       └── hmac.service.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
└── README.md
```

## 📝 Notas

- El **MockAdapter** es obligatorio para desarrollo y testing
- El **StripeAdapter** requiere configuración de API keys de Stripe
- Los webhooks tienen un timeout de 10 segundos
- Los eventos fallidos se registran pero no se reintentan automáticamente (TODO: implementar cola de reintentos)
- El servicio se integra automáticamente con n8n Event Bus si está disponible

## 🐛 Troubleshooting

### Error: "Proveedor de pago no soportado"
- Verifica que el provider sea `mock` o `stripe`
- Si usas Stripe, verifica que `STRIPE_SECRET_KEY` esté configurada

### Error: "Firma HMAC inválida"
- Verifica que el `secret` del partner sea correcto
- Asegúrate de firmar el payload completo (no solo el campo `data`)

### Webhooks no se envían
- Verifica que el partner esté activo (`isActive: true`)
- Verifica que el partner esté suscrito al evento
- Revisa los logs del servicio para ver errores de conexión

## 📄 Licencia

MIT
