# 🏛️ ArquiPro - Plataforma de Conexión Arquitectónica

**ArquiPro** es una plataforma web completa que conecta clientes con arquitectos profesionales para la gestión de proyectos arquitectónicos, desde la solicitud hasta la entrega final.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

---

## 📋 Tabla de Contenidos

- [Características Principales](#características-principales)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guías de Instalación](#guías-de-instalación)
- [Servicios y Puertos](#servicios-y-puertos)
- [Documentación Detallada](#documentación-detallada)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Contribución](#contribución)

---

## ✨ Características Principales

### Para Clientes 👤
- 🔍 **Búsqueda avanzada** de arquitectos por especialidad, ubicación y rating (1-5 ⭐)
- 📝 **Solicitud de proyectos** con descripción, presupuesto y plazo
- 💬 **Chat en tiempo real** con arquitectos
- 📊 **Seguimiento de proyectos** con avances, incidencias y valoraciones
- 🔔 **Notificaciones push** para actualizaciones importantes
- ⭐ **Sistema de valoraciones** para calificar proyectos completados

### Para Arquitectos 🏗️
- 📱 **Perfil profesional** verificado con portafolio
- 📬 **Gestión de solicitudes** de proyectos
- 📈 **Dashboard analítico** con KPIs y estadísticas
- 🖼️ **Publicación de avances** con imágenes
- 💼 **Gestión de múltiples proyectos** simultáneos
- 📊 **Métricas de desempeño** y valoraciones

### Para Moderadores 🛡️
- 👥 **Gestión de usuarios** y verificaciones
- 📋 **Moderación de contenido** y reportes
- 📊 **Estadísticas de la plataforma** con KPIs en tiempo real
- ⚠️ **Manejo de incidencias** y conflictos
- 🔒 **Suspensión/activación de usuarios** desde incidencias
- 📱 **Dashboard responsive** optimizado para móviles

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│          http://localhost:5173 (Vite Dev Server)            │
└──────┬───────────────────────┬───────────────────┬──────────┘
       │                       │                   │
       │ REST API              │ GraphQL           │ WebSocket
       │ (CRUD básico)         │ (Queries complejas)│ (Tiempo real)
       ▼                       ▼                   ▼
┌──────────────┐      ┌──────────────┐    ┌──────────────┐
│   Rails API  │      │   GraphQL    │    │  WebSocket   │
│ :3000/api/v1 │      │   Gateway    │    │   Server     │
│              │◄─────│   :8000      │    │   :3006      │
│ (PostgreSQL) │ HTTP │   (Python)   │    │  (NestJS)    │
└──────────────┘      └──────────────┘    └──────────────┘
       │                                           │
       │           Database: Supabase             │
       │           (PostgreSQL Cloud)              │
       └───────────────────────────────────────────┘
```

### Flujo de Datos

1. **Frontend** envía peticiones según el caso de uso:
   - **REST API** → CRUD básico (crear, actualizar, eliminar)
   - **GraphQL** → Consultas complejas y agregadas
   - **WebSocket** → Chat y notificaciones en tiempo real

2. **GraphQL Gateway** actúa como agregador:
   - Consume múltiples endpoints REST
   - Combina datos de diferentes recursos
   - Reduce el over-fetching/under-fetching

3. **WebSocket Server** maneja comunicación bidireccional:
   - Chat en tiempo real entre usuarios
   - Notificaciones push instantáneas
   - Presencia online/offline

---

## 🛠️ Stack Tecnológico

### Frontend
- **React** 19.1.1 + **TypeScript** 5.8.3
- **Vite** 7.1.12 (Build tool)
- **React Router** 7.1.0 (Enrutamiento)
- **Apollo Client** 3.11.8 (GraphQL)
- **Axios** 1.7.9 (HTTP REST)
- **Socket.io Client** 5.1.0 (WebSocket)
- **CSS Modules** + **Tailwind** (Estilos)

### Backend - REST API
- **Ruby** 3.4.6
- **Rails** 8.0.3
- **PostgreSQL** (Supabase Cloud)
- **Devise** + **JWT** (Autenticación)
- **Active Storage** (Archivos)
- **Puma** (Servidor web)

### Backend - GraphQL
- **Python** 3.11+
- **FastAPI** 0.115+
- **Strawberry GraphQL** 0.249+
- **httpx** (Cliente HTTP asíncrono)
- **Uvicorn** (Servidor ASGI)

### Backend - WebSocket
- **Node.js** 20+
- **NestJS** 11.0.1
- **Socket.io** 4.7.5
- **TypeScript** 5.6+

### Base de Datos
- **PostgreSQL** 15+ (Supabase)
- **UUID** como primary keys
- **Migrations** gestionadas por Rails

### DevOps
- **Docker** + **Docker Compose**
- **Kamal** (Deployment)
- **n8n** (Event Bus - Tareas Programadas)
- **Git** (Control de versiones)

---

## 📁 Estructura del Proyecto

```
arqui-pro/
│
├── frontend/                      # 🎨 Aplicación React
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── common/          # Botones, cards, inputs
│   │   │   └── layout/          # Header, Footer, Navbar
│   │   ├── pages/               # Páginas/vistas
│   │   │   ├── Home.tsx         # Landing page
│   │   │   └── FindArchitects.tsx # Búsqueda de arquitectos
│   │   ├── services/            # Servicios API
│   │   │   ├── api/             # REST API (Axios)
│   │   │   └── graphql/         # GraphQL (Apollo)
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useCachedData.ts # Hook genérico de caché
│   │   │   └── useApiWithCache.ts # Hooks específicos
│   │   ├── utils/               # Utilidades
│   │   │   └── cacheService.ts  # Sistema de caché localStorage
│   │   ├── contexts/            # Context API
│   │   ├── types/               # TypeScript types
│   │   └── styles/              # CSS/SCSS
│   ├── public/                  # Archivos estáticos
│   ├── package.json             # Dependencias Node
│   ├── vite.config.ts           # Configuración Vite
│   └── README.md                # Documentación frontend
│
├── backend/
│   ├── APIREST/                 # 🚂 Rails REST API
│   │   ├── app/
│   │   │   ├── controllers/    # Controladores API
│   │   │   ├── models/         # 15 modelos ActiveRecord
│   │   │   ├── serializers/    # Serializadores JSON
│   │   │   └── jobs/           # Background jobs
│   │   ├── config/
│   │   │   ├── routes.rb       # Rutas API
│   │   │   ├── database.yml    # Config PostgreSQL
│   │   │   └── initializers/   # CORS, Devise, etc.
│   │   ├── db/
│   │   │   ├── migrate/        # Migraciones
│   │   │   ├── seeds/          # Datos de prueba
│   │   │   └── schema.rb       # Esquema actual
│   │   ├── Gemfile             # Dependencias Ruby
│   │   ├── Dockerfile          # Docker build
│   │   └── README.md           # Documentación Rails
│   │
│   ├── graphql/                # 🐍 GraphQL Gateway (Python)
│   │   ├── adapters/           # Adaptadores y resolvers
│   │   │   ├── resolvers/     # Lógica de resolución
│   │   │   └── schemas/       # Esquemas GraphQL
│   │   ├── graphql_types/     # Tipos Strawberry
│   │   │   ├── arquitecto_busqueda.py
│   │   │   ├── dashboard_proyecto.py
│   │   │   └── perfil_completo_arquitecto.py
│   │   ├── queries/           # Queries GraphQL
│   │   │   ├── busqueda/     # Búsquedas complejas
│   │   │   ├── metricas/     # Estadísticas
│   │   │   └── agregacion/   # Agregación de datos
│   │   ├── infrastructure/    # Cliente REST
│   │   ├── main.py           # Servidor FastAPI
│   │   ├── requirements.txt  # Dependencias Python
│   │   └── README.md         # Documentación GraphQL
│   │
│   ├── gateway/              # 🌐 API Gateway (NestJS)
│   │   ├── src/
│   │   │   ├── auth-proxy/   # Proxy de autenticación
│   │   │   └── middleware/   # Validación de tokens
│   │   └── package.json      # Dependencias Node
│   │
│   ├── auth-microservicio/   # 🔐 Auth Service (NestJS)
│   │   ├── src/
│   │   │   ├── auth/         # Controladores y servicios
│   │   │   └── entities/     # Entidades TypeORM
│   │   └── package.json      # Dependencias Node
│   │
│   └── wedsocket/            # 🔌 WebSocket Server (NestJS)
│       ├── src/
│       │   ├── chat/         # Gateway de chat
│       │   └── notificacion/ # Gateway de notificaciones
│       ├── test/             # Tests
│       ├── package.json      # Dependencias Node
│       ├── test-client.js    # Cliente de prueba
│       └── README.md         # Documentación WebSocket
│
├── docs/                     # 📚 Documentación general
│   ├── APIREST.md           # Guía completa REST API
│   ├── graphql.md           # Guía completa GraphQL
│   ├── WEBSOCKET.md         # Configuración WebSocket
│   ├── N8N_EVENT_BUS.md     # Guía completa n8n Event Bus
│   ├── N8N_QUICK_START.md   # Guía rápida n8n
│   └── n8n-workflow-cleanup-tokens.json # Workflow exportado
│
├── .gitignore               # Archivos ignorados por Git
├── .ruby-version            # Versión de Ruby
└── README.md                # Este archivo
```

---

## 🚀 Guías de Instalación

### Prerrequisitos Generales

1. **Git** → [Descargar](https://git-scm.com/downloads)
2. **Node.js** 20+ → [Descargar](https://nodejs.org/)
3. **Python** 3.11+ → [Descargar](https://www.python.org/downloads/)
4. **Ruby** 3.4.6 → [Descargar RubyInstaller](https://rubyinstaller.org/downloads/)
5. **PostgreSQL Client** → [Descargar](https://www.postgresql.org/download/)

### Instalación Rápida (Desarrollo Local)

#### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/D0G0X/arqui-pro.git
cd arqui-pro
```

#### 2️⃣ Backend - Rails REST API

```bash
cd backend/APIREST

# Instalar dependencias
bundle install

# Configurar base de datos
# Crear archivo .env con credenciales de Supabase
cp .env.example .env

# Ejecutar migraciones
rails db:migrate

# Cargar datos de prueba (opcional)
rails db:seed

# Iniciar servidor
rails server -p 3000
```

**Servidor disponible en:** `http://localhost:3000`

#### 3️⃣ Backend - GraphQL Gateway

```bash
cd backend/graphql

# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate

# Activar entorno (Mac/Linux)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
python main.py
```

**Servidor disponible en:** `http://localhost:8000`  
**GraphQL Playground:** `http://localhost:8000/graphql`

#### 4️⃣ Backend - WebSocket Server

```bash
cd backend/wedsocket

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run start:dev
```

**Servidor disponible en:** `http://localhost:3006`  
**Namespaces:** `/chat` y `/notificaciones`

#### 5️⃣ Frontend - React App

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con las URLs de los backends:
# VITE_API_BASE_URL=http://localhost:3000/api/v1
# VITE_GRAPHQL_URL=http://localhost:8000/graphql
# VITE_WS_URL=http://localhost:3006

# Iniciar en modo desarrollo
npm run dev
```

**Aplicación disponible en:** `http://localhost:5173`

---

## 🌐 Servicios y Puertos

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **Frontend** | 5173 | http://localhost:5173 | React App (Vite) |
| **REST API** | 3000 | http://localhost:3000/api/v1 | Rails backend |
| **API Gateway** | 3000 | http://localhost:3000 | Gateway NestJS |
| **GraphQL** | 8000 | http://localhost:8000/graphql | Gateway de consultas |
| **WebSocket** | 3006 | http://localhost:3006 | Chat y notificaciones |
| **n8n** | 5678 | http://localhost:5678 | Event Bus - Tareas programadas |
| **PostgreSQL** | 5432 | Supabase Cloud | Base de datos |

### Estado de Salud (Health Checks)

```bash
# REST API
curl http://localhost:3000/health

# GraphQL
curl http://localhost:8000/health

# WebSocket
# Conectar cliente Socket.io en http://localhost:3006
```

---

## 📚 Documentación Detallada

### Documentación por Servicio

- **[REST API](./docs/APIREST.md)** - Endpoints, modelos, autenticación
- **[GraphQL Gateway](./docs/graphql.md)** - Queries, tipos, ejemplos
- **[WebSocket Server](./docs/WEBSOCKET.md)** - Eventos, namespaces, integración
- **[n8n Event Bus](./docs/N8N_EVENT_BUS.md)** - Tareas programadas, workflows, cron jobs
- **[Frontend Implementation](./docs/FRONTEND_IMPLEMENTATION.md)** - REST, GraphQL y WebSocket en React
- **[Frontend](./docs/FRONTEND.md)** - Componentes, routing, estado

### Guías Técnicas Especiales

- **[Frontend Implementation Guide](./docs/FRONTEND_IMPLEMENTATION.md)** - Cómo se implementaron REST, GraphQL y WebSocket
- **[Sistema de Caché](./docs/CACHE_IMPLEMENTATION_SUMMARY.md)** - localStorage, hooks, servicios
- **[Hooks con Caché](./docs/src/hooks/HOOKS_WITH_CACHE.md)** - Ejemplos de uso
- **[Guía Rápida de Caché](./docs/QUICK_CACHE_GUIDE.md)** - Plantillas para nuevos servicios

### Documentación de APIs

#### REST API - Endpoints Principales

```bash
# Autenticación
POST   /usuarios/sign_in          # Login
POST   /usuarios                  # Registro
DELETE /usuarios/sign_out         # Logout

# Arquitectos
GET    /api/v1/arquitectos        # Lista de arquitectos
GET    /api/v1/arquitectos/:id    # Detalle de arquitecto
POST   /api/v1/arquitectos        # Crear arquitecto (requiere auth)

# Proyectos
GET    /api/v1/proyectos          # Lista de proyectos
GET    /api/v1/proyectos/:id      # Detalle de proyecto
POST   /api/v1/proyectos          # Crear proyecto (requiere auth)
PATCH  /api/v1/proyectos/:id      # Actualizar proyecto

# Conversaciones
GET    /api/v1/conversaciones     # Lista de conversaciones
POST   /api/v1/conversaciones     # Crear conversación

# Notificaciones
GET    /api/v1/notificaciones     # Lista de notificaciones
PATCH  /api/v1/notificaciones/:id # Marcar como leída
```

#### GraphQL - Queries Disponibles

```graphql
# Búsqueda de arquitectos con filtros
query BuscarArquitectos {
  buscarArquitectos(
    especialidad: "Arquitectura Residencial"
    valoracionMinima: 4
    limite: 20
  ) {
    id
    cedula
    especialidades
    valoracionPromedioProyecto
    usuario {
      nombre
      apellido
      fotoPerfil
    }
    proyectos {
      tituloProyecto
      valoracionPromedio
    }
  }
}

# Dashboard completo de proyecto
query DashboardProyecto {
  dashboardProyecto(proyectoId: "uuid-here") {
    proyecto {
      titulo
      estado
      presupuesto
    }
    avancesRecientes {
      descripcion
      fecha
    }
    incidencias {
      tipo
      estado
    }
    valoraciones {
      puntuacion
      comentario
    }
  }
}

# Perfil completo de arquitecto
query PerfilArquitecto {
  perfilCompletoArquitecto(arquitectoId: "uuid-here") {
    arquitecto {
      cedula
      especialidades
    }
    usuario {
      nombre
      email
    }
    proyectos {
      titulo
      estado
    }
    estadisticas {
      totalProyectos
      valoracionPromedio
    }
  }
}
```

#### WebSocket - Eventos

**Chat (`/chat` namespace):**
```javascript
// Cliente → Servidor
socket.emit('join_conversation', { conversacion_id: 1 })
socket.emit('message:create', { contenido: '...', remitente_id: 1 })
socket.emit('message:typing', { usuario_id: 1, typing: true })

// Servidor → Cliente
socket.on('message:new', (mensaje) => { /* ... */ })
socket.on('message:typing', ({ usuario_id, typing }) => { /* ... */ })
```

**Notificaciones (`/notificaciones` namespace):**
```javascript
// Cliente → Servidor
socket.emit('usuario:conectar', { usuario_id: 'uuid' })
socket.emit('notificacion:marcar_leida', { notificacion_id: 'uuid' })

// Servidor → Cliente
socket.on('notificacion:nueva', (notificacion) => { /* ... */ })
socket.on('usuario:online', ({ usuario_id, estado }) => { /* ... */ })
```

---

## 🔄 Flujo de Trabajo

### Caso de Uso Completo: Cliente Busca Arquitecto

```
1. Cliente entra a FindArchitects
   └─> Frontend hace query GraphQL: buscarArquitectos()
       └─> GraphQL Gateway consume REST API
           └─> Retorna lista con caché localStorage (5 min)

2. Cliente selecciona arquitecto
   └─> Frontend navega a /architects/:id
       └─> REST API: GET /api/v1/arquitectos/:id

3. Cliente crea solicitud de proyecto
   └─> REST API: POST /api/v1/solicitud_proyectos
       └─> Se crea notificación para el arquitecto
           └─> WebSocket envía push notification

4. Arquitecto acepta solicitud
   └─> REST API: PATCH /api/v1/solicitud_proyectos/:id
       └─> Se crea proyecto
           └─> WebSocket notifica al cliente

5. Chat en tiempo real
   └─> WebSocket namespace /chat
       ├─> join_conversation
       ├─> message:create
       └─> message:new (broadcast)

6. Arquitecto publica avances
   └─> REST API: POST /api/v1/avances
       └─> WebSocket notifica al cliente

7. Proyecto completa
   └─> REST API: PATCH /api/v1/proyectos/:id
       └─> Cliente puede dejar valoración
           └─> REST API: POST /api/v1/valoraciones
```

---

## 📦 Sistema de Caché (localStorage)

El frontend implementa un **sistema de caché automático** que reduce las llamadas al backend:

### Características

- ✅ **Caché automático** en `localStorage`
- ✅ **Expiración temporal** (5 minutos default)
- ✅ **Validación de parámetros** (filtros, variables)
- ✅ **Soporte REST + GraphQL**

### Servicios con Caché

```typescript
// GraphQL - Búsqueda de arquitectos
const { data, loading, refetch } = useBuscarArquitectos({
  especialidad: 'moderno',
  limite: 20
})

// REST API - Proyectos
const { data, loading } = useProyectos({ estado: 'activo' })

// REST API - Perfil
const { data } = useUsuarioPerfil(userId)
```

### Beneficios

- **50% menos queries** en navegación típica
- **Carga instantánea** (0ms) en visitas repetidas
- **Mejor UX** sin flashes de loading

📖 **Documentación completa:** [CACHE_IMPLEMENTATION_SUMMARY.md](./docs/CACHE_IMPLEMENTATION_SUMMARY.md)

---

## 🧪 Testing

### Backend - Rails

```bash
cd backend/APIREST

# Ejecutar todos los tests
rails test

# Test específico
rails test test/controllers/arquitectos_controller_test.rb
```

### Frontend - React

```bash
cd frontend

# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### WebSocket - Cliente de Prueba

```bash
cd backend/wedsocket

# Ejecutar cliente de prueba
node test-client.js
```

---

## 🚢 Deployment

### Opción 1: Docker Compose (Recomendado)

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### Opción 2: Kamal (Rails)

```bash
cd backend/APIREST

# Setup inicial
kamal setup

# Deploy
kamal deploy

# Ver estado
kamal app details
```

### Opción 3: Servicios Separados

- **Frontend** → Vercel, Netlify, GitHub Pages
- **Rails API** → Heroku, Render, Railway
- **GraphQL** → Railway, Render, AWS Lambda
- **WebSocket** → Render, Railway
- **PostgreSQL** → Supabase (actual), RDS, Neon

---

## 🤝 Contribución

### Flujo de Trabajo Git

```bash
# Crear rama feature
git checkout -b feature/nueva-funcionalidad

# Hacer commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push y crear PR
git push origin feature/nueva-funcionalidad
```

### Convenciones de Commits

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Formato, linting
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.

---

## 👥 Equipo

**ArquiPro Team** © 2025

- **Desarrolladores**: Equipo de desarrollo
- **Arquitectura**: Sistema multi-servicio con React, Rails, Python, NestJS
- **Base de datos**: PostgreSQL en Supabase

---

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/D0G0X/arqui-pro/issues)
- **Documentación**: Ver carpeta `/docs`
- **Email**: soporte@arquipro.com

---

## 🗺️ Roadmap

### Versión 1.0 (Actual)
- ✅ Sistema de autenticación
- ✅ Búsqueda de arquitectos con filtros
- ✅ Chat en tiempo real
- ✅ Sistema de notificaciones
- ✅ Gestión de proyectos
- ✅ Sistema de caché
- ✅ Módulo de administrador responsive
- ✅ Gestión de incidencias con suspensión de usuarios
- ✅ Sección de valoraciones en landing page
- ✅ Proyectos contratados en landing page
- ✅ n8n Event Bus para tareas programadas
- ✅ Limpieza automática de tokens expirados

### Versión 1.1 (Próximo)
- ⏳ Pagos integrados (Stripe/PayPal)
- ⏳ Videollamadas (WebRTC)
- ⏳ App móvil (React Native)
- ⏳ Dashboard avanzado con BI
- ⏳ Sistema de recomendaciones ML

### Versión 2.0 (Futuro)
- 📋 Marketplace de servicios
- 📋 Integraciones con herramientas CAD
- 📋 Tour virtual 3D de proyectos
- 📋 Blockchain para contratos

---

**Hecho con ❤️ por el equipo de ArquiPro**

🏛️ **Conectando visiones arquitectónicas con realidad**
