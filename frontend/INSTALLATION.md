# ArquiPro Frontend - Instalación y Configuración 🚀

## 📋 Requisitos Previos

- Node.js v18+ 
- npm v9+
- Backend REST API corriendo en `http://localhost:3000`
- Backend GraphQL corriendo en `http://localhost:8000`
- WebSocket server corriendo en `http://localhost:3006`

## 🔧 Instalación

### 1. Instalar dependencias

Si tienes problemas con PowerShell, abre PowerShell como administrador y ejecuta:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego instala las dependencias:
```bash
cd c:\Users\leoan\Desktop\arqui-pro\frontend
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:
```bash
copy .env.example .env
```

Edita `.env` con las URLs correctas de tus backends:
```env
VITE_REST_API_URL=http://localhost:3000/api/v1
VITE_GRAPHQL_URL=http://localhost:8000/graphql
VITE_WS_URL=http://localhost:3006
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🗂️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizables
│   │   │   ├── SearchBar.tsx
│   │   │   └── ArquitectoCard.tsx
│   │   └── layout/          # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── pages/               # Páginas principales
│   │   ├── Home.tsx         # Landing page con featured arquitectos
│   │   ├── FindArchitects.tsx  # Búsqueda completa con paginación
│   │   └── AboutUs.tsx      # About page
│   ├── services/
│   │   ├── api/             # REST API services
│   │   │   ├── axiosInstance.ts
│   │   │   └── arquitectosService.ts
│   │   └── graphql/         # GraphQL services
│   │       ├── apolloClient.ts
│   │       └── queries.ts
│   ├── config/
│   │   └── api.config.ts    # API configuration
│   ├── styles/              # CSS styles
│   │   ├── Home.css
│   │   ├── FindArchitects.css
│   │   ├── AboutUs.css
│   │   ├── Header.css
│   │   ├── Footer.css
│   │   ├── SearchBar.css
│   │   └── ArquitectoCard.css
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
└── package.json
```

## 🎯 Funcionalidades Implementadas

### ✅ Home Page (`/`)
- Hero section con título y búsqueda
- Featured architects (primeros 10 verificados del REST API)
- Botón "View All Architects" → redirige a `/architects`
- **Backend:** REST API - `GET /api/v1/arquitectos?verificado=true&per_page=10`

### ✅ Find Architects Page (`/architects`)
- Búsqueda completa de arquitectos con filtros:
  - Especialidad
  - Rating mínimo
- Paginación completa (navegación por páginas)
- Loading states
- Error handling con retry
- No results state con reset filters
- **Backend:** REST API - `GET /api/v1/arquitectos?page=1&per_page=20&especialidad=X&valoracion_minima=Y`

### ✅ About Us Page (`/about`)
- Descripción completa de ArquiPro
- Misión y valores
- Características del sistema
- Cómo funciona (4 pasos)
- Beneficios del servicio
- CTAs para registro y búsqueda

### ✅ Componentes
- **Header**: Navegación con active state
- **Footer**: Logo y copyright
- **SearchBar**: Filtros de búsqueda (especialidad, location, rating)
- **ArquitectoCard**: Tarjeta con avatar, nombre, especialidad, rating

### ✅ Servicios
- **axiosInstance**: HTTP client con interceptors para auth
- **arquitectosService**: CRUD completo de arquitectos
  - `getAll(filters)` - Lista con paginación
  - `getById(id)` - Detalle de arquitecto
  - `getVerificados()` - Solo verificados
  - `search(query)` - Búsqueda por texto
- **apolloClient**: GraphQL client con auth
- **queries**: GraphQL queries para datos complejos
  - `BUSCAR_ARQUITECTOS`
  - `ESTADISTICAS_ARQUITECTO`
  - `PERFIL_COMPLETO_ARQUITECTO`

## 🔌 Integración con Backend

### REST API Endpoints Usados

| Endpoint | Método | Descripción | Usado en |
|----------|--------|-------------|----------|
| `/api/v1/arquitectos` | GET | Lista de arquitectos con filtros | Home, FindArchitects |
| `/api/v1/arquitectos/:id` | GET | Detalle de arquitecto | (Próximamente) |
| `/api/v1/arquitectos/search` | GET | Búsqueda por texto | (Próximamente) |

### GraphQL Queries Disponibles

```graphql
# Buscar arquitectos con filtros avanzados
query BuscarArquitectos($especialidad, $verificado, $valoracionMinima, $limite)

# Estadísticas completas de un arquitecto
query EstadisticasArquitecto($arquitectoId)

# Perfil completo con proyectos y valoraciones
query PerfilCompletoArquitecto($arquitectoId)
```

## 🎨 Diseño y Estilos

- **Color primario**: `#ff8c42` (Naranja)
- **Background**: Gradiente beige claro
- **Tipografía**: System fonts (San Francisco, Segoe UI, Roboto)
- **Responsive**: Mobile-first design
  - Desktop: 5 columnas
  - Tablet: 3-4 columnas
  - Mobile: 1-2 columnas

## 🚦 Estados de la Aplicación

### Loading State
```tsx
{loading && (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading architects...</p>
  </div>
)}
```

### Error State
```tsx
{error && (
  <div className="error-message">
    <p>⚠️ {error}</p>
    <button onClick={retry}>Try Again</button>
  </div>
)}
```

### No Results State
```tsx
{arquitectos.length === 0 && (
  <div className="no-results">
    <h2>No architects found</h2>
    <button onClick={resetFilters}>Reset Filters</button>
  </div>
)}
```

## 📝 Próximos Pasos

### Pendientes de Implementar

1. **Perfil de Arquitecto** (`/architects/:id`)
   - Detalles completos
   - Portafolio de proyectos
   - Valoraciones y comentarios
   - Botón "Contact" (enviar solicitud)

2. **Autenticación**
   - Login page
   - Register (Cliente/Arquitecto)
   - Protected routes
   - AuthContext

3. **Proyectos**
   - Lista de proyectos por arquitecto
   - Detalle de proyecto
   - Galería de imágenes

4. **Mensajería (WebSocket)**
   - Chat en tiempo real
   - Notificaciones push
   - Indicadores de "escribiendo..."

5. **Dashboard Cliente**
   - Mis proyectos
   - Solicitudes enviadas
   - Conversaciones activas

6. **Dashboard Arquitecto**
   - Mi portafolio
   - Solicitudes recibidas
   - Estadísticas (GraphQL)

## 🐛 Troubleshooting

### Error: "Cannot find module 'react-router-dom'"
```bash
npm install
```

### Error: "Network Error" al cargar arquitectos
1. Verifica que el backend REST esté corriendo en `http://localhost:3000`
2. Revisa el archivo `.env` y confirma las URLs
3. Abre DevTools → Network para ver el error específico

### Error de CORS
El backend Rails debe tener CORS habilitado:
```ruby
# backend/APIREST/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

## 📚 Recursos

- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Vite Documentation](https://vitejs.dev/)

---

**Desarrollado con ❤️ para ArquiPro**
