# Guía Rápida: Agregar Rutas del Moderador

## Paso 1: Modificar App.tsx

Abrir `frontend/src/App.tsx` y agregar las siguientes importaciones y rutas:

### Importar componentes

```tsx
import { ModeratorDashboard, Verificaciones, Incidencias } from './pages/Moderator'
```

### Agregar rutas dentro de Routes

```tsx
{/* Rutas de Moderador */}
<Route path="/moderador/dashboard" element={<ModeratorDashboard />} />
<Route path="/moderador/verificaciones" element={<Verificaciones />} />
<Route path="/moderador/incidencias" element={<Incidencias />} />
```

---

## Paso 2: Protección de Rutas (Opcional pero Recomendado)

### Crear ProtectedRoute Component

Crear archivo `frontend/src/components/auth/ProtectedRoute.tsx`:

```tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext' // Ajustar según tu auth context

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
```

### Usar ProtectedRoute en App.tsx

```tsx
import { ProtectedRoute } from './components/auth/ProtectedRoute'

{/* Rutas de Moderador Protegidas */}
<Route
  path="/moderador/dashboard"
  element={
    <ProtectedRoute requiredRole="moderador">
      <ModeratorDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/moderador/verificaciones"
  element={
    <ProtectedRoute requiredRole="moderador">
      <Verificaciones />
    </ProtectedRoute>
  }
/>
<Route
  path="/moderador/incidencias"
  element={
    <ProtectedRoute requiredRole="moderador">
      <Incidencias />
    </ProtectedRoute>
  }
/>
```

---

## Paso 3: Agregar Link en Navegación

Si tienes un componente de navegación/sidebar, agregar:

```tsx
{user?.role === 'moderador' && (
  <nav className="moderador-nav">
    <Link to="/moderador/dashboard">Dashboard</Link>
    <Link to="/moderador/verificaciones">Verificaciones</Link>
    <Link to="/moderador/incidencias">Incidencias</Link>
  </nav>
)}
```

---

## Paso 4: Verificar GraphQL Server

Asegurarse de que el servidor GraphQL está corriendo:

```bash
cd backend/graphql
python main.py
```

Debería estar disponible en `http://localhost:8000`

---

## Paso 5: Probar las Rutas

1. Iniciar el servidor de desarrollo:
```bash
cd frontend
npm run dev
```

2. Navegar a:
- `http://localhost:5173/moderador/dashboard`
- `http://localhost:5173/moderador/verificaciones`
- `http://localhost:5173/moderador/incidencias`

---

## Estructura de Ejemplo para App.tsx

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ModeratorDashboard, Verificaciones, Incidencias } from './pages/Moderator'

function App() {
  return (
    <Router>
      <Routes>
        {/* Otras rutas existentes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas de Moderador */}
        <Route path="/moderador/dashboard" element={<ModeratorDashboard />} />
        <Route path="/moderador/verificaciones" element={<Verificaciones />} />
        <Route path="/moderador/incidencias" element={<Incidencias />} />
      </Routes>
    </Router>
  )
}

export default App
```

---

## Troubleshooting

### Error: "Cannot find module './pages/Moderator'"
- Verificar que existe `frontend/src/pages/Moderator/index.ts`
- Verificar que los archivos Dashboard.tsx, Verificaciones.tsx, Incidencias.tsx existen

### Error: GraphQL query fails
- Verificar que GraphQL server está corriendo en puerto 8000
- Verificar que los resolvers están implementados en el backend
- Revisar console del navegador para ver el error específico

### Las páginas se ven sin estilos
- Verificar que los archivos CSS están en `frontend/src/styles/Moderator/`
- Verificar que las importaciones de CSS están en cada componente
- Limpiar cache del navegador (Ctrl + Shift + R)

---

## Próximos Pasos Recomendados

1. **Implementar Backend**: Crear resolvers GraphQL para `verificaciones` e `incidencias`
2. **Implementar REST Endpoints**: Para las acciones de aprobar/rechazar/resolver
3. **Agregar Protección**: Implementar ProtectedRoute con validación de rol
4. **Testing**: Probar todas las funcionalidades con datos reales
5. **Mejorar UX**: Agregar modals de confirmación y toast notifications
