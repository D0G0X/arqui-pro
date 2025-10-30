# Config

Archivos de **configuración** de la aplicación.

---

## 📋 Propósito

- Centralizar configuración
- Facilitar cambios de entorno (desarrollo, producción)
- Separar configuración de código
- Mantener constantes en un solo lugar

---

## 📁 Estructura

```
config/
├── api.config.ts      # URLs de APIs
├── routes.config.ts   # Rutas de la app
├── app.config.ts      # Configuración general
└── env.ts             # Variables de entorno (wrapper)
```

---

## 🔧 Configuración de API

### `api.config.ts`

```typescript
// URLs base de APIs
export const API_CONFIG = {
  // REST API (Rails)
  REST_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // GraphQL API (Python/NestJS)
  GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql',
  
  // WebSocket (opcional)
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  
  // Timeouts
  TIMEOUT: 30000, // 30 segundos
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Endpoints REST API
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/registro',
  ME: '/me',
  
  // Usuarios
  USUARIOS: '/usuarios',
  USUARIO: (id: string) => `/usuarios/${id}`,
  
  // Arquitectos
  ARQUITECTOS: '/arquitectos',
  ARQUITECTO: (id: string) => `/arquitectos/${id}`,
  
  // Proyectos
  PROYECTOS: '/proyectos',
  PROYECTO: (id: string) => `/proyectos/${id}`,
  PROYECTO_AVANCES: (id: string) => `/proyectos/${id}/avances`,
  
  // Conversaciones
  CONVERSACIONES: '/conversaciones',
  CONVERSACION: (id: string) => `/conversaciones/${id}`,
  CONVERSACION_MENSAJES: (id: string) => `/conversaciones/${id}/mensajes`,
  
  // Solicitudes
  SOLICITUDES: '/solicitudes_proyecto',
  SOLICITUD: (id: string) => `/solicitudes_proyecto/${id}`,
  
  // Valoraciones
  VALORACIONES: '/valoraciones',
  VALORACION: (id: string) => `/valoraciones/${id}`,
  
  // Notificaciones
  NOTIFICACIONES: '/notificaciones',
  NOTIFICACION: (id: string) => `/notificaciones/${id}`,
} as const;
```

### Uso

```typescript
import { API_CONFIG, API_ENDPOINTS } from '@/config/api.config';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.REST_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Usar endpoints
const getProyectos = () => axiosInstance.get(API_ENDPOINTS.PROYECTOS);
const getProyecto = (id: string) => axiosInstance.get(API_ENDPOINTS.PROYECTO(id));
```

---

## 🔧 Configuración de Rutas

### `routes.config.ts`

```typescript
// Definición de rutas de la app
export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  ABOUT: '/acerca',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  
  // Proyectos
  PROYECTOS: '/proyectos',
  PROYECTOS_NEW: '/proyectos/nuevo',
  PROYECTO_DETAIL: (id: string) => `/proyectos/${id}`,
  PROYECTO_EDIT: (id: string) => `/proyectos/${id}/editar`,
  
  // Arquitectos
  ARQUITECTOS: '/arquitectos',
  ARQUITECTO_DETAIL: (id: string) => `/arquitectos/${id}`,
  
  // Conversaciones
  CONVERSACIONES: '/conversaciones',
  CONVERSACION_DETAIL: (id: string) => `/conversaciones/${id}`,
  
  // Perfil
  PERFIL: '/perfil',
  PERFIL_EDITAR: '/perfil/editar',
  
  // Admin (moderadores)
  ADMIN: '/admin',
  ADMIN_USUARIOS: '/admin/usuarios',
  ADMIN_REPORTES: '/admin/reportes',
  
  // Error
  NOT_FOUND: '/404',
} as const;

// Labels de rutas para breadcrumbs
export const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.HOME]: 'Inicio',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.PROYECTOS]: 'Proyectos',
  [ROUTES.ARQUITECTOS]: 'Arquitectos',
  [ROUTES.CONVERSACIONES]: 'Conversaciones',
  [ROUTES.PERFIL]: 'Mi Perfil',
  [ROUTES.ADMIN]: 'Administración',
};

// Rutas protegidas (requieren autenticación)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROYECTOS,
  ROUTES.CONVERSACIONES,
  ROUTES.PERFIL,
] as const;

// Rutas solo para moderadores
export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_USUARIOS,
  ROUTES.ADMIN_REPORTES,
] as const;
```

### Uso

```tsx
import { ROUTES } from '@/config/routes.config';
import { useNavigate } from 'react-router-dom';

const ProyectosPage = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <button onClick={() => navigate(ROUTES.PROYECTOS_NEW)}>
        Nuevo Proyecto
      </button>
      
      {proyectos.map(p => (
        <Link to={ROUTES.PROYECTO_DETAIL(p.id)}>
          {p.titulo}
        </Link>
      ))}
    </div>
  );
};
```

---

## 🔧 Configuración General

### `app.config.ts`

```typescript
// Configuración general de la app
export const APP_CONFIG = {
  // Información de la app
  APP_NAME: 'ArquiPro',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Plataforma para conectar arquitectos con clientes',
  
  // Paginación
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Formato de fecha
  DATE_FORMAT: 'DD/MM/YYYY',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  
  // Locale
  DEFAULT_LOCALE: 'es-MX',
  DEFAULT_CURRENCY: 'MXN',
  
  // Límites de archivos
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
  
  // Validaciones
  MIN_PASSWORD_LENGTH: 8,
  MAX_DESCRIPTION_LENGTH: 500,
  
  // Intervalos de actualización (ms)
  NOTIFICATION_POLL_INTERVAL: 30000, // 30 segundos
  MESSAGE_POLL_INTERVAL: 5000, // 5 segundos
  
  // Debounce
  SEARCH_DEBOUNCE_MS: 500,
  
  // Feature flags
  FEATURES: {
    ENABLE_CHAT: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_DARK_MODE: true,
    ENABLE_GRAPHQL: true,
  },
} as const;

// Estados de entidades
export const ENTITY_STATUS = {
  PROYECTO: {
    BORRADOR: 'borrador',
    PUBLICADO: 'publicado',
    EN_PROGRESO: 'en_progreso',
    COMPLETADO: 'completado',
    CANCELADO: 'cancelado',
  },
  SOLICITUD: {
    PENDIENTE: 'pendiente',
    ACEPTADA: 'aceptada',
    RECHAZADA: 'rechazada',
    RETIRADA: 'retirada',
  },
} as const;

// Roles de usuario
export const USER_ROLES = {
  ARQUITECTO: 'arquitecto',
  CLIENTE: 'cliente',
  MODERADOR: 'moderador',
} as const;
```

---

## 🔧 Variables de Entorno

### `.env` (en la raíz del frontend)

```env
# API URLs
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_GRAPHQL_URL=http://localhost:8000/graphql
VITE_WS_URL=ws://localhost:3001

# Environment
VITE_ENV=development

# Features
VITE_ENABLE_GRAPHQL=true
VITE_ENABLE_CHAT=true
```

### `.env.production`

```env
VITE_API_BASE_URL=https://api.arquipro.com/api/v1
VITE_GRAPHQL_URL=https://graphql.arquipro.com/graphql
VITE_WS_URL=wss://ws.arquipro.com
VITE_ENV=production
```

### `env.ts` (Wrapper de variables de entorno)

```typescript
// Wrapper para acceder a variables de entorno de forma segura
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  
  ENVIRONMENT: import.meta.env.VITE_ENV || 'development',
  
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  
  // Feature flags desde .env
  ENABLE_GRAPHQL: import.meta.env.VITE_ENABLE_GRAPHQL === 'true',
  ENABLE_CHAT: import.meta.env.VITE_ENABLE_CHAT === 'true',
} as const;

// Validar que las variables críticas existan
if (!ENV.API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL no está definida');
}

console.log('🚀 Environment:', ENV.ENVIRONMENT);
console.log('🔗 API Base URL:', ENV.API_BASE_URL);
```

---

## 💡 Mejores Prácticas

### 1. **No hardcodear valores**
Siempre usa configuración en lugar de valores literales.

```tsx
// ❌ MAL
const data = await axios.get('http://localhost:3000/api/v1/proyectos');

// ✅ BIEN
import { API_CONFIG, API_ENDPOINTS } from '@/config/api.config';
const data = await axios.get(`${API_CONFIG.REST_BASE_URL}${API_ENDPOINTS.PROYECTOS}`);
```

### 2. **Usar `as const`**
Para que TypeScript infiera tipos literales.

```typescript
export const ROUTES = {
  HOME: '/',
  // ...
} as const;
```

### 3. **Funciones para rutas dinámicas**
Para rutas con parámetros.

```typescript
PROYECTO_DETAIL: (id: string) => `/proyectos/${id}`,
```

### 4. **Feature flags**
Habilita/deshabilita funcionalidades fácilmente.

```typescript
if (APP_CONFIG.FEATURES.ENABLE_CHAT) {
  // Mostrar chat
}
```

---

## 📚 Recursos

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
