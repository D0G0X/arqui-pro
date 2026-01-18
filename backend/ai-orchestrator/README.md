# ====================================
# AI Orchestrator - Pilar 3: MCP Chatbot
# ====================================

## 🤖 Descripción

Microservicio de **Inteligencia Artificial Conversacional** que implementa el Pilar 3 del proyecto universitario. Proporciona un chatbot multimodal con capacidades de:

- 🗣️ **Chat en lenguaje natural** con LLMs (Gemini/OpenAI)
- 🔧 **MCP Tools** para ejecutar acciones de negocio
- 🎨 **Procesamiento multimodal**: texto, imágenes (OCR), PDFs
- 🔌 **WebSocket** para chat en tiempo real
- 🏗️ **Patrón Strategy** para intercambiar proveedores LLM

---

## 📋 Requisitos

### Sistema Operativo
- Windows 10/11, Linux o macOS

### Software
- **Python** 3.11 o superior
- **Tesseract OCR** (para procesamiento de imágenes)
  - Windows: [Descargar aquí](https://github.com/UB-Mannheim/tesseract/wiki)
  - Linux: `sudo apt-get install tesseract-ocr tesseract-ocr-spa`
  - macOS: `brew install tesseract tesseract-lang`

### API Keys
- **Gemini API Key** (recomendado - gratis): https://aistudio.google.com/app/apikey
- **OpenAI API Key** (opcional): https://platform.openai.com/api-keys

---

## 🚀 Instalación

### 1. Navegar al directorio
```powershell
cd backend/ai-orchestrator
```

### 2. Crear entorno virtual
```powershell
# Crear entorno virtual
python -m venv venv

# Activar (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activar (Linux/Mac)
source venv/bin/activate
```

### 3. Instalar dependencias
```powershell
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
```powershell
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env y agregar tu API key
# GEMINI_API_KEY=AIzaSy...
# O OPENAI_API_KEY=sk-proj-...
```

### 5. Instalar Tesseract (Windows)
1. Descargar instalador: https://github.com/UB-Mannheim/tesseract/wiki
2. Instalar en `C:\Program Files\Tesseract-OCR\`
3. Verificar en `.env`: `TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe`

---

## ▶️ Ejecución

### Modo Desarrollo
```powershell
python main.py
```

**Servidor disponible en:** `http://localhost:8001`

### Verificar salud del servicio
```powershell
curl http://localhost:8001/health
```

---

## 🏗️ Arquitectura

### Componentes Principales

```
ai-orchestrator/
├── app/
│   ├── adapters/
│   │   └── llm/              # Patrón Strategy para LLMs
│   │       ├── base.py       # Interface abstracta
│   │       ├── gemini_adapter.py
│   │       ├── openai_adapter.py
│   │       └── factory.py    # Factory pattern
│   │
│   ├── mcp/
│   │   ├── mcp_server.py     # MCP Server principal
│   │   └── tools/            # 5 MCP Tools
│   │       ├── base.py       # Tool abstracta
│   │       ├── buscar_arquitectos.py    # Consulta
│   │       ├── obtener_proyecto.py      # Consulta
│   │       ├── crear_solicitud.py       # Acción
│   │       ├── publicar_avance.py       # Acción
│   │       └── estadisticas_arquitecto.py # Reporte
│   │
│   ├── multimodal/
│   │   └── processors.py     # OCR, PDF, Audio
│   │
│   ├── orchestrator/
│   │   └── ai_orchestrator.py # Orquestador principal
│   │
│   ├── websocket/
│   │   └── connection_manager.py # WebSocket real-time
│   │
│   ├── models/
│   │   └── schemas.py        # Pydantic schemas
│   │
│   └── config.py             # Settings con Pydantic
│
├── main.py                   # FastAPI app
├── requirements.txt
└── .env
```

### Patrón Strategy (LLM Adapters)

```
LLMAdapter (ABC)
    ├── generate_text()
    ├── generate_with_tools()
    └── analyze_image()
         ↑
         ├── GeminiAdapter
         ├── OpenAIAdapter
         └── ClaudeAdapter (TODO)

LLMFactory.create_adapter() → Retorna instancia según config
```

---

## 🔧 MCP Tools

### 1. buscar_arquitectos (Consulta)
Busca arquitectos con filtros avanzados.

**Endpoint:** `GET /api/v1/arquitectos`

**Parámetros:**
- `especialidad` (opcional): "moderno", "clásico", etc.
- `ubicacion` (opcional): "Bogotá", "Medellín"
- `rating_min` (opcional): 1-5
- `verificado` (opcional): true/false

**Ejemplo de uso:**
```
Usuario: "Busca arquitectos especializados en diseño moderno en Bogotá"
→ AI invoca: buscar_arquitectos(especialidad="moderno", ubicacion="Bogotá")
```

---

### 2. obtener_proyecto (Consulta)
Obtiene detalles completos de un proyecto.

**Endpoint:** `GET /api/v1/proyectos/:id`

**Parámetros:**
- `proyecto_id` (requerido): UUID del proyecto

**Ejemplo:**
```
Usuario: "Muéstrame el proyecto abc-123"
→ AI invoca: obtener_proyecto(proyecto_id="abc-123")
```

---

### 3. crear_solicitud (Acción)
Crea una solicitud de proyecto.

**Endpoint:** `POST /api/v1/solicitudes_proyecto`

**Parámetros:**
- `cliente_id` (requerido)
- `arquitecto_id` (requerido)
- `descripcion` (requerido)
- `presupuesto` (requerido): número
- `plazo_dias` (requerido): entero

**Permisos:** cliente, moderador

**Ejemplo:**
```
Usuario: "Quiero solicitar un proyecto de remodelación al arquitecto xyz-456, 
          presupuesto 50 millones, plazo 90 días"
→ AI invoca: crear_solicitud(cliente_id=..., arquitecto_id="xyz-456", ...)
```

---

### 4. publicar_avance (Acción)
Publica un avance en un proyecto.

**Endpoint:** `POST /api/v1/avances`

**Parámetros:**
- `proyecto_id` (requerido)
- `arquitecto_id` (requerido)
- `descripcion` (requerido)
- `porcentaje` (requerido): 0-100

**Permisos:** arquitecto, moderador

---

### 5. estadisticas_arquitecto (Reporte)
Obtiene KPIs de un arquitecto.

**Endpoint:** `GET /api/v1/arquitectos/:id` + agregación

**Parámetros:**
- `arquitecto_id` (requerido)

**Retorna:**
```json
{
  "kpis": {
    "proyectos_completados": 25,
    "proyectos_activos": 3,
    "rating_promedio": 4.7,
    "ingresos_totales": 150000000
  }
}
```

---

## 🎨 Procesamiento Multimodal

### 1. Imágenes (OCR)
Extrae texto de imágenes usando Tesseract.

**Formatos soportados:** JPG, PNG, WebP

**Endpoint:** `POST /api/v1/chat/multimodal`

**Ejemplo:**
```
Usuario: [Sube foto de plano] "¿Este plano cumple normas?"
→ OCR extrae texto → AI analiza
```

---

### 2. PDFs
Extrae texto y tablas de documentos PDF.

**Endpoint:** `POST /api/v1/chat/multimodal`

**Ejemplo:**
```
Usuario: [Sube contrato.pdf] "Extrae datos del contrato"
→ PDF → texto → AI procesa
```

---

### 3. Audio (BONUS - no implementado)
Transcripción de audio a texto.

**Status:** Placeholder (requiere OpenAI Whisper)

---

## 📡 API Endpoints

### Health Check
```http
GET /health

Response:
{
  "status": "healthy",
  "service": "ai-orchestrator",
  "version": "1.0.0",
  "llm_provider": "gemini",
  "environment": "development"
}
```

---

### Chat (solo texto)
```http
POST /api/v1/chat

Body:
{
  "message": "Busca arquitectos en Bogotá",
  "user_id": "uuid",
  "conversation_id": "uuid",
  "context": {"rol": "cliente"}
}

Response:
{
  "content": "Encontré 5 arquitectos...",
  "user_id": "uuid",
  "tools_executed": [
    {
      "tool_name": "buscar_arquitectos",
      "params": {...},
      "result": {...},
      "success": true,
      "execution_time_ms": 245.5
    }
  ],
  "llm_provider": "gemini",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

### Chat Multimodal (texto + archivo)
```http
POST /api/v1/chat/multimodal
Content-Type: multipart/form-data

Form Data:
- message: "Analiza este plano"
- user_id: "uuid"
- conversation_id: "uuid"
- file: [archivo.jpg/pdf]

Response: (igual que /chat)
```

---

### Listar Tools
```http
GET /api/v1/tools

Response:
[
  {
    "name": "buscar_arquitectos",
    "description": "...",
    "parameters": {...}
  },
  ...
]
```

---

### Ejecutar Tool Directamente (testing)
```http
POST /api/v1/tools/{tool_name}/execute

Body:
{
  "especialidad": "moderno",
  "ubicacion": "Bogotá"
}

Response:
{
  "tool": "buscar_arquitectos",
  "success": true,
  "result": {...},
  "error": null
}
```

---

### WebSocket Chat
```
WS /ws/chat/{user_id}

Client envía:
{
  "type": "message",
  "content": "Hola",
  "conversation_id": "uuid"
}

Server responde:
{
  "type": "response",
  "content": "¿En qué puedo ayudarte?",
  "tools_executed": [],
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

## 🧪 Testing

### Test manual con curl
```powershell
# Health check
curl http://localhost:8001/health

# Chat
curl -X POST http://localhost:8001/api/v1/chat `
  -H "Content-Type: application/json" `
  -d '{
    "message": "Busca arquitectos en Bogotá",
    "user_id": "test-user"
  }'

# Listar tools
curl http://localhost:8001/api/v1/tools
```

### Test de tool específica
```powershell
curl -X POST http://localhost:8001/api/v1/tools/buscar_arquitectos/execute `
  -H "Content-Type: application/json" `
  -d '{
    "ubicacion": "Bogotá"
  }'
```

---

## 🔒 Seguridad

### Control de Permisos
Cada tool define roles permitidos:

```python
def get_required_permissions(self) -> List[str]:
    return ["cliente", "moderador"]  # Solo estos roles
```

### Rate Limiting
Configurado en `.env`:
```
MAX_REQUESTS_PER_USER_PER_MINUTE=10
MAX_TOOL_EXECUTIONS_PER_REQUEST=5
```

### Validación de Entradas
- Pydantic valida todos los requests
- Tools validan parámetros requeridos
- Manejo de errores con try/except

---

## 🔗 Integración con otros servicios

### Rails API (Puerto 3000)
- URL: `http://localhost:3000/api/v1`
- Usado por todas las MCP Tools
- Autenticación: Bearer token (opcional)

### GraphQL Gateway (Puerto 8000)
- URL: `http://localhost:8000/graphql`
- Usado por `estadisticas_arquitecto`
- Consultas complejas agregadas

### WebSocket Server (Puerto 3006)
- URL: `http://localhost:3006`
- Notificaciones en tiempo real
- (Integración futura: notificar vía NestJS WebSocket)

---

## 📊 Logging

Logs en consola con colores (Loguru):
```
2026-01-15 10:30:00 | INFO     | Procesando mensaje de user-123
2026-01-15 10:30:01 | INFO     | Ejecutando tool: buscar_arquitectos
2026-01-15 10:30:01 | INFO     | Tool ejecutada: buscar_arquitectos (245ms)
```

Logs en archivo (opcional):
```
LOG_FILE=logs/ai-orchestrator.log
```

---

## ⚙️ Configuración Avanzada

### Cambiar proveedor LLM
En `.env`:
```
ACTIVE_LLM_PROVIDER=openai  # gemini | openai | claude
```

### Deshabilitar tools
En `.env`:
```
ENABLED_TOOLS=buscar_arquitectos,obtener_proyecto  # Solo estas
```

### Configurar OCR
```
OCR_ENGINE=tesseract          # tesseract | google_vision
TESSERACT_CMD=/path/to/tesseract
```

---

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY no configurada"
→ Agrega tu API key en `.env`

### Error: "Tesseract not found"
→ Instala Tesseract y configura ruta en `.env`

### Error: "Connection refused to Rails API"
→ Verifica que Rails esté corriendo en puerto 3000

### Error: "Rate limit exceeded"
→ Ajusta `MAX_REQUESTS_PER_USER_PER_MINUTE` en `.env`

---

## 📚 Referencias

- **Gemini API**: https://ai.google.dev/docs
- **OpenAI API**: https://platform.openai.com/docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **Tesseract OCR**: https://github.com/tesseract-ocr/tesseract
- **Patrón Strategy**: https://refactoring.guru/design-patterns/strategy

---

## 👥 Equipo

Este microservicio fue desarrollado como parte del **Pilar 3** del proyecto universitario ArquiPro.

**Características implementadas:**
- ✅ AI Orchestrator
- ✅ LLM Adapter con patrón Strategy (Gemini + OpenAI)
- ✅ MCP Server con 5 tools (2 consulta + 2 acción + 1 reporte)
- ✅ Procesamiento multimodal (texto, imagen OCR, PDF)
- ✅ WebSocket para chat en tiempo real
- ✅ Integración con Rails API REST
- ✅ Documentación completa

---

## 📄 Licencia

Proyecto universitario - ArquiPro © 2026
