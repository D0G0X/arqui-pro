# Services

Carpeta dedicada a la **comunicación con el backend**. Aquí se centralizan todas las llamadas HTTP (REST) y GraphQL.

---

## 📋 Propósito

- Encapsular lógica de comunicación con APIs
- Separar UI de peticiones HTTP
- Reutilizar servicios en múltiples componentes
- Centralizar configuración de clientes HTTP

---

## 📁 Estructura

```
services/
├── api/
│   ├── axiosInstance.ts      # Cliente HTTP configurado
│   ├── authService.ts         # Autenticación (login, register, logout)
│   ├── usuariosService.ts     # CRUD usuarios
│   ├── proyectosService.ts    # CRUD proyectos
│   ├── arquitectosService.ts  # CRUD arquitectos
│   ├── conversacionesService.ts
│   └── mensajesService.ts
│
└── graphql/                   # (Opcional)
    ├── apolloClient.ts        # Cliente GraphQL
    └── queries/
        ├── buscarArquitectos.ts
        ├── dashboardProyecto.ts
        └── estadisticasArquitecto.ts
```

---

## 🔧 Cliente HTTP - Axios

### `axiosInstance.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: agregar token en cada request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: manejar errores globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido → logout
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📡 Patrón de Servicio

Cada entidad del backend tiene su propio servicio con operaciones CRUD:

### Ejemplo: `proyectosService.ts`

```typescript
import { axiosInstance } from './axiosInstance';
import type { Proyecto } from '@/types/proyecto.types';

export const proyectosService = {
  // GET /proyectos
  getAll: async (): Promise<Proyecto[]> => {
    const response = await axiosInstance.get('/proyectos');
    return response.data;
  },

  // GET /proyectos/:id
  getById: async (id: string): Promise<Proyecto> => {
    const response = await axiosInstance.get(`/proyectos/${id}`);
    return response.data;
  },

  // POST /proyectos
  create: async (data: Partial<Proyecto>): Promise<Proyecto> => {
    const response = await axiosInstance.post('/proyectos', { proyecto: data });
    return response.data;
  },

  // PATCH /proyectos/:id
  update: async (id: string, data: Partial<Proyecto>): Promise<Proyecto> => {
    const response = await axiosInstance.patch(`/proyectos/${id}`, { proyecto: data });
    return response.data;
  },

  // DELETE /proyectos/:id
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/proyectos/${id}`);
  },
};
```

---

## 🔐 Servicio de Autenticación

### `authService.ts`

```typescript
import { axiosInstance } from './axiosInstance';

export const authService = {
  // POST /login
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/login', { email, password });
    const { token, usuario } = response.data;
    localStorage.setItem('authToken', token);
    return usuario;
  },

  // POST /registro
  register: async (data: any) => {
    const response = await axiosInstance.post('/registro', data);
    return response.data;
  },

  // DELETE /logout
  logout: async () => {
    await axiosInstance.delete('/logout');
    localStorage.removeItem('authToken');
  },

  // GET /me
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/me');
    return response.data;
  },
};
```

---

## 🎯 GraphQL (Opcional)

Si decides usar Apollo Client para consultas GraphQL complejas:

### `apolloClient.ts`

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URL }),
  cache: new InMemoryCache(),
});
```

### Query: `buscarArquitectos.ts`

```typescript
import { gql } from '@apollo/client';

export const BUSCAR_ARQUITECTOS = gql`
  query BuscarArquitectos($nombre: String, $especialidad: String) {
    buscarArquitectos(nombre: $nombre, especialidad: $especialidad) {
      id
      nombre
      apellido
      especialidad
      calificacionPromedio
    }
  }
`;
```

---

## 🧪 Uso en Componentes

Los servicios **NO** se usan directamente en componentes. Usa **hooks personalizados**:

```tsx
// ❌ MAL - No usar directamente en componente
const ProyectosPage = () => {
  const [proyectos, setProyectos] = useState([]);
  
  useEffect(() => {
    proyectosService.getAll().then(setProyectos);
  }, []);
};

// ✅ BIEN - Usar hook personalizado
const ProyectosPage = () => {
  const { proyectos, loading } = useProyectos();
};
```

Ver: `src/hooks/README.md` para ejemplos de hooks.

---

## 📚 Recursos

- [Axios Docs](https://axios-http.com/docs/intro)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [REST API Rails](../../backend/APIREST/)
- [GraphQL Docs](../../docs/GRAPHQL.md)
