# Pages

Componentes de **páginas completas** asociadas a rutas de React Router.

---

## 📋 Propósito

- Representar vistas completas de la aplicación
- Vincular rutas (`/proyectos`, `/login`, etc.)
- Orquestar componentes más pequeños
- Manejar lógica de página

---

## 📁 Estructura

```
pages/
├── Home/
│   ├── HomePage.tsx
│   └── index.ts
│
├── Auth/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── index.ts
│
├── Arquitectos/
│   ├── ArquitectosListPage.tsx
│   ├── ArquitectoDetailPage.tsx
│   └── index.ts
│
├── Proyectos/
│   ├── ProyectosListPage.tsx
│   ├── ProyectoDetailPage.tsx
│   ├── ProyectoCreatePage.tsx
│   └── index.ts
│
├── Conversaciones/
│   ├── ConversacionesListPage.tsx
│   ├── ConversacionDetailPage.tsx
│   └── index.ts
│
└── Dashboard/
    ├── DashboardPage.tsx
    └── index.ts
```

---

## 🛣️ Routing

Las páginas se vinculan con rutas en `App.tsx`:

### `App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/Home';
import { LoginPage } from '@/pages/Auth/LoginPage';
import { ProyectosListPage } from '@/pages/Proyectos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/proyectos" element={<ProyectosListPage />} />
        <Route path="/proyectos/:id" element={<ProyectoDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🔧 Ejemplo: Lista de Proyectos

### `ProyectosListPage.tsx`

```tsx
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useProyectos } from '@/hooks/useProyectos';
import { useNavigate } from 'react-router-dom';

export const ProyectosListPage: React.FC = () => {
  const navigate = useNavigate();
  const { proyectos, loading, error } = useProyectos();

  if (loading) return <MainLayout>Cargando...</MainLayout>;
  if (error) return <MainLayout>Error: {error}</MainLayout>;

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <Button onClick={() => navigate('/proyectos/nuevo')}>
          + Nuevo Proyecto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((proyecto) => (
          <Card
            key={proyecto.id}
            title={proyecto.titulo}
            onClick={() => navigate(`/proyectos/${proyecto.id}`)}
            footer={`Cliente: ${proyecto.cliente_nombre}`}
          >
            <p className="text-gray-600">{proyecto.descripcion}</p>
            <p className="text-sm mt-2">Estado: {proyecto.estado}</p>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};
```

---

## 🔧 Ejemplo: Detalle de Proyecto

### `ProyectoDetailPage.tsx`

```tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/common/Button';
import { useProyecto } from '@/hooks/useProyecto';

export const ProyectoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { proyecto, loading } = useProyecto(id!);

  if (loading) return <MainLayout>Cargando...</MainLayout>;
  if (!proyecto) return <MainLayout>Proyecto no encontrado</MainLayout>;

  return (
    <MainLayout>
      <div className="mb-6">
        <Button onClick={() => navigate('/proyectos')}>← Volver</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-4">{proyecto.titulo}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Cliente</p>
            <p className="font-medium">{proyecto.cliente_nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Arquitecto</p>
            <p className="font-medium">{proyecto.arquitecto_nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <p className="font-medium">{proyecto.estado}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Presupuesto</p>
            <p className="font-medium">${proyecto.presupuesto}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Descripción</h2>
          <p className="text-gray-700">{proyecto.descripcion}</p>
        </div>
      </div>
    </MainLayout>
  );
};
```

---

## 🔧 Ejemplo: Login

### `LoginPage.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Button type="submit" size="large" className="w-full">
          Iniciar Sesión
        </Button>
      </form>

      <p className="text-center mt-4 text-sm">
        ¿No tienes cuenta?{' '}
        <a href="/registro" className="text-blue-600 hover:underline">
          Registrarse
        </a>
      </p>
    </AuthLayout>
  );
};
```

---

## 🔧 Dashboard con GraphQL

### `DashboardPage.tsx`

```tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/common/Card';
import { DASHBOARD_PROYECTO } from '@/services/graphql/queries/dashboardProyecto';

export const DashboardPage: React.FC = () => {
  const { data, loading } = useQuery(DASHBOARD_PROYECTO, {
    variables: { proyectoId: '1' },
  });

  if (loading) return <MainLayout>Cargando...</MainLayout>;

  const dashboard = data?.dashboardProyecto;

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Proyecto">
          <p className="text-2xl font-bold">{dashboard.proyecto.titulo}</p>
          <p className="text-gray-600">{dashboard.proyecto.estado}</p>
        </Card>

        <Card title="Avances">
          <p className="text-2xl font-bold">{dashboard.estadisticas.totalAvances}</p>
          <p className="text-sm text-gray-600">Total registrados</p>
        </Card>

        <Card title="Valoraciones">
          <p className="text-2xl font-bold">{dashboard.estadisticas.promedioValoraciones}</p>
          <p className="text-sm text-gray-600">Promedio</p>
        </Card>
      </div>
    </MainLayout>
  );
};
```

---

## 💡 Mejores Prácticas

### 1. **Una página por archivo**
Cada página debe estar en su propio archivo.

### 2. **Usar layouts**
Todas las páginas deben usar un layout (`MainLayout`, `AuthLayout`).

### 3. **Lógica en hooks**
No pongas lógica compleja en la página, usa hooks personalizados.

### 4. **Rutas dinámicas**
Usa `useParams` para rutas con parámetros:

```tsx
const { id } = useParams<{ id: string }>();
```

### 5. **Navegación programática**
Usa `useNavigate` para redirecciones:

```tsx
const navigate = useNavigate();
navigate('/proyectos');
```

---

## 📚 Recursos

- [React Router](https://reactrouter.com/)
- [useParams](https://reactrouter.com/en/main/hooks/use-params)
- [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)
