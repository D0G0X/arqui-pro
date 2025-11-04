# Módulo Moderador - Implementación Completa

## Resumen de Implementación

Se ha creado el módulo completo de Moderador con panel de control, gestión de verificaciones e incidencias, siguiendo la arquitectura existente del proyecto y las especificaciones proporcionadas en las capturas de pantalla.

---

## 📁 Archivos Creados

### 1. Types (Tipos TypeScript)
- **`frontend/src/types/moderator.types.ts`**
  - Interfaces: `Moderador`, `Usuario`, `Reporte`, `Incidencia`, `Verificacion`
  - `ModeratorStats` - Estadísticas del dashboard
  - `NotificacionModerador` - Sistema de notificaciones
  - `AccionModeracion` - Log de acciones

### 2. GraphQL Queries
- **Modificado: `frontend/src/services/graphql/queries.ts`**
  - `GET_MODERATOR_STATS` - Obtiene estadísticas del dashboard (usa `kpisPlataforma`)
  - `GET_VERIFICACIONES` - Lista verificaciones con filtros y paginación
  - `GET_INCIDENCIAS` - Lista incidencias con filtros y paginación

### 3. Custom Hooks
- **`frontend/src/hooks/useModeratorData.ts`**
  - Hook para obtener estadísticas del moderador
  - Maneja loading, error y refetch
  - Transforma datos de `kpisPlataforma` a `ModeratorStats`
  - Calcula tasa de verificación automáticamente

### 4. Páginas (Components)

#### a) Dashboard
- **`frontend/src/pages/Moderator/Dashboard.tsx`**
- **`frontend/src/styles/Moderator/Dashboard.css`**

**Características:**
- 4 tarjetas de estadísticas principales:
  - Total Usuarios (azul)
  - Total Proyectos (morado)
  - Incidencias (naranja)
  - Arquitectos Verificados (verde) con porcentaje
- Sección de "Acciones Rápidas" con 4 enlaces:
  - Verificaciones
  - Incidencias
  - Usuarios
  - Reportes
- Diseño responsivo con grid adaptativo
- Estados de loading y error manejados
- Iconos SVG inline para mejor rendimiento

#### b) Verificaciones
- **`frontend/src/pages/Moderator/Verificaciones.tsx`**
- **`frontend/src/styles/Moderator/Verificaciones.css`**

**Características:**
- Tabla completa con columnas: Estado, Fecha, Arquitecto, Cédula, Moderador, Comentarios, Acciones
- Filtro por estado: Todos, Pendiente, Aprobado, Rechazado
- Paginación con 10 items por página
- Botón de actualizar (refresh)
- Badges de colores según estado:
  - Pendiente: amarillo
  - Aprobado: verde
  - Rechazado: rojo
- Botones de acción (Aprobar/Rechazar) solo para estados pendientes
- Formato de fecha localizado (es-ES)
- Responsive con scroll horizontal en móviles

#### c) Incidencias
- **`frontend/src/pages/Moderator/Incidencias.tsx`**
- **`frontend/src/styles/Moderator/Incidencias.css`**

**Características:**
- Tabla con columnas: Estado, Fecha, Descripción, Emisor, Infractor, Moderador, Acciones
- Filtro por estado: Todos, Pendiente, En Revisión, Resuelto, Rechazado
- Descripción con "Ver más/Ver menos" para textos largos (>60 caracteres)
- Paginación y actualización
- Estados con badges:
  - Pendiente: amarillo
  - En Revisión: azul claro
  - Resuelto: verde
  - Rechazado: rojo
- Botones Resolver/Rechazar para pendientes
- Fecha con hora incluida
- Responsive design

---

## 🎨 Diseño y Estilos

### Paleta de Colores
- **Principal**: Naranja/Rojo gradiente (#ff6b35 → #f7931e)
- **Usuarios**: Azul (#1976d2 con fondo #e3f2fd)
- **Proyectos**: Morado (#7b1fa2 con fondo #f3e5f5)
- **Incidencias**: Naranja (#f57c00 con fondo #fff3e0)
- **Verificados**: Verde (#388e3c con fondo #e8f5e9)

### Componentes Reutilizables
Todos los estilos incluyen:
- `.btn` - Botones con variantes: primary, secondary, success, danger
- `.badge` - Etiquetas de estado: warning, success, danger, info, default
- `.stat-card` - Tarjetas de estadísticas
- `.quick-action-card` - Tarjetas de acciones rápidas
- Animaciones hover con transform y shadow
- Border radius consistente (12px para cards, 6px para inputs)

### Responsive Breakpoints
- **Desktop**: > 768px (grid completo)
- **Tablet**: 768px (grids ajustados)
- **Mobile**: < 480px (columna única, tamaños reducidos)

---

## 🔌 Integración con Backend

### GraphQL Queries (Puerto 8000)

#### 1. GET_MODERATOR_STATS
```graphql
query GetModeratorStats {
  kpisPlataforma {
    totalUsuarios
    totalProyectos
    arquitectosVerificados
    totalIncidencias
  }
}
```

#### 2. GET_VERIFICACIONES
```graphql
query GetVerificaciones(
  $estado: String
  $limite: Int
  $offset: Int
) {
  verificaciones(estado: $estado, limite: $limite, offset: $offset) {
    id
    arquitectoId
    estado
    fechaSolicitud
    fechaResolucion
    moderadorId
    comentarios
    arquitecto { id, cedula, usuario { nombre, apellido, email } }
    moderador { nombre, apellido }
  }
}
```

#### 3. GET_INCIDENCIAS
```graphql
query GetIncidencias(
  $estado: String
  $limite: Int
  $offset: Int
) {
  incidencias(estado: $estado, limite: $limite, offset: $offset) {
    id
    descripcion
    estado
    fechaCreacion
    fechaResolucion
    emisorId
    infractorId
    moderadorId
    emisor { nombre, apellido }
    infractor { nombre, apellido }
    moderador { nombre, apellido }
  }
}
```

### REST API (Puerto 3000) - Pendiente de Implementar
Las funciones de acción están preparadas pero requieren endpoints REST:

**Verificaciones:**
- `POST /api/verificaciones/:id/aprobar`
- `POST /api/verificaciones/:id/rechazar`

**Incidencias:**
- `POST /api/incidencias/:id/resolver`
- `POST /api/incidencias/:id/rechazar`

---

## 🚀 Próximos Pasos

### 1. Backend GraphQL (URGENTE)
Crear resolvers en `backend/graphql/`:
- `queries/moderador/get_verificaciones.py`
- `queries/moderador/get_incidencias.py`
- Registrar en `adapters/resolvers/query_resolver.py`

### 2. Backend REST (ALTA PRIORIDAD)
Crear controllers en `backend/APIREST/app/controllers/`:
- `verificaciones_controller.rb` con acciones aprobar/rechazar
- `incidencias_controller.rb` con acciones resolver/rechazar
- Agregar rutas en `config/routes.rb`

### 3. Rutas Frontend
Modificar `frontend/src/App.tsx` para agregar rutas:
```tsx
<Route path="/moderador/dashboard" element={<ModeratorDashboard />} />
<Route path="/moderador/verificaciones" element={<Verificaciones />} />
<Route path="/moderador/incidencias" element={<Incidencias />} />
```

### 4. Protección de Rutas
Implementar middleware para verificar rol `moderador`:
- Crear `ProtectedRoute` component con validación de rol
- Verificar token JWT incluye `role: "moderador"`
- Redirigir a `/login` si no autorizado

### 5. Componentes Adicionales (OPCIONAL)

#### a) Usuarios
- Página para buscar y administrar usuarios
- Botones: Ver perfil, Suspender, Banear
- Filtros por rol y estado

#### b) Reportes
- Página de reportes del sistema
- Gráficos con Chart.js o Recharts
- Exportar a PDF/Excel

#### c) Notificaciones
- Componente de notificaciones en tiempo real
- Integración con WebSocket (puerto 3006)
- Badge con contador de no leídas

### 6. Mejoras de UX
- Modals de confirmación para acciones destructivas
- Toast notifications para feedback de acciones
- Búsqueda en tablas (filtro por texto)
- Ordenamiento de columnas (ASC/DESC)
- Exportar tablas a CSV

---

## ✅ Testing Checklist

### Funcionalidad
- [ ] Dashboard carga estadísticas correctamente
- [ ] Filtros de Verificaciones funcionan
- [ ] Filtros de Incidencias funcionan
- [ ] Paginación avanza/retrocede correctamente
- [ ] Botones de acción muestran feedback (aunque en desarrollo)
- [ ] Loading spinner aparece durante cargas
- [ ] Error message aparece con botón retry

### Diseño Responsivo
- [ ] Desktop: grids de 2-4 columnas
- [ ] Tablet: grids ajustados
- [ ] Mobile: columna única, scroll horizontal en tablas
- [ ] Iconos y botones tienen tamaño adecuado en mobile

### Integración
- [ ] Apollo Client conecta con GraphQL puerto 8000
- [ ] Queries retornan datos esperados
- [ ] Estados de error se manejan correctamente
- [ ] Refetch funciona al hacer click en "Actualizar"

---

## 📊 Estructura de Datos Esperada

### Backend GraphQL Response - kpisPlataforma
```json
{
  "kpisPlataforma": {
    "totalUsuarios": 1580,
    "totalProyectos": 892,
    "arquitectosVerificados": 156,
    "totalIncidencias": 23
  }
}
```

### Backend GraphQL Response - verificaciones
```json
{
  "verificaciones": [
    {
      "id": 1,
      "arquitectoId": 123,
      "estado": "pendiente",
      "fechaSolicitud": "2024-01-15T10:30:00Z",
      "fechaResolucion": null,
      "moderadorId": null,
      "comentarios": "Solicitud de verificación inicial",
      "arquitecto": {
        "id": 123,
        "cedula": "1234567890",
        "usuario": {
          "nombre": "Juan",
          "apellido": "Pérez",
          "email": "juan@example.com"
        }
      },
      "moderador": null
    }
  ]
}
```

### Backend GraphQL Response - incidencias
```json
{
  "incidencias": [
    {
      "id": 1,
      "descripcion": "Contenido inapropiado en proyecto",
      "estado": "pendiente",
      "fechaCreacion": "2024-01-15T14:20:00Z",
      "fechaResolucion": null,
      "emisorId": 456,
      "infractorId": 789,
      "moderadorId": null,
      "emisor": {
        "nombre": "María",
        "apellido": "García"
      },
      "infractor": {
        "nombre": "Pedro",
        "apellido": "López"
      },
      "moderador": null
    }
  ]
}
```

---

## 🔧 Troubleshooting

### Problema: Queries no retornan datos
- Verificar que GraphQL server esté corriendo en puerto 8000
- Verificar que los resolvers estén implementados en backend
- Revisar logs de GraphQL para errores
- Usar GraphQL Playground para probar queries directamente

### Problema: Estilos no se aplican
- Verificar que los archivos CSS están importados en los componentes
- Verificar que no hay conflictos con CSS existente
- Limpiar cache del navegador (Ctrl + Shift + R)

### Problema: Componentes LoadingSpinner/ErrorMessage no encontrados
- Ya solucionado: usar default import en vez de named import
- Verificar que archivos existen en `frontend/src/components/common/`

### Problema: TypeScript errors en tipos
- Verificar que `moderator.types.ts` está en `frontend/src/types/`
- Ejecutar `npm run type-check` para validar todos los tipos
- Reiniciar TypeScript server en VSCode (Cmd/Ctrl + Shift + P → Restart TS Server)

---

## 📝 Notas Importantes

1. **Queries de GraphQL**: Actualmente usan `kpisPlataforma` que ya existe. Los queries `GET_VERIFICACIONES` y `GET_INCIDENCIAS` asumen que los resolvers estarán implementados en el backend.

2. **Acciones de Moderación**: Los botones de Aprobar/Rechazar/Resolver están preparados pero muestran alertas de "en desarrollo" hasta que se implementen los endpoints REST.

3. **Paginación**: Implementada con variables `limite` y `offset` en GraphQL. Backend debe soportar estos parámetros.

4. **Tasa de Verificación**: Calculada automáticamente en el hook como `(arquitectosVerificados / totalUsuarios) * 100`.

5. **Estados de Incidencias**: Se definieron 4 estados (pendiente, en_revision, resuelto, rechazado). Backend debe usar estos mismos valores.

6. **Fechas**: Todas las fechas se formatean con `toLocaleDateString('es-ES')` para español.

7. **Responsive**: Todas las tablas tienen scroll horizontal en mobile para evitar que se rompan.

8. **Gradiente Principal**: El gradiente naranja (#ff6b35 → #f7931e) se usa en botones primarios y acciones rápidas, coincidiendo con las capturas proporcionadas.

---

## 📚 Referencias

- **Capturas de Pantalla**: 4 imágenes proporcionadas por el usuario
- **Arquitectura Existente**: `frontend/src/pages/`, `frontend/src/components/`, `frontend/src/services/graphql/`
- **Componentes Comunes**: `LoadingSpinner`, `ErrorMessage` en `frontend/src/components/common/`
- **Apollo Client**: Configuración existente en `frontend/src/services/graphql/`

---

**Estado**: ✅ Implementación Frontend Completa  
**Pendiente**: Backend GraphQL Resolvers + REST Controllers + Rutas en App.tsx
