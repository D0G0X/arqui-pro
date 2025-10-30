# Types

Definiciones de **tipos TypeScript** para toda la aplicación.

---

## 📋 Propósito

- Centralizar definiciones de tipos
- Mantener consistencia de datos
- Facilitar autocompletado IDE
- Prevenir errores de tipos

---

## 📁 Estructura

```
types/
├── api.types.ts            # Tipos generales de API
├── usuario.types.ts        # Usuario, Arquitecto, Cliente
├── proyecto.types.ts       # Proyectos y solicitudes
├── conversacion.types.ts   # Conversaciones y mensajes
├── valoracion.types.ts     # Valoraciones
├── notificacion.types.ts   # Notificaciones
└── graphql.types.ts        # Tipos de GraphQL
```

---

## 🔧 Tipos de API

### `api.types.ts`

```typescript
// Respuesta genérica de API
export interface ApiResponse<T> {
  data: T;
  mensaje?: string;
  error?: string;
}

// Paginación
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pagina_actual: number;
  total_paginas: number;
}

// Errores
export interface ApiError {
  mensaje: string;
  codigo: string;
  detalles?: Record<string, string[]>;
}

// Estados comunes
export type EstadoProyecto = 'borrador' | 'publicado' | 'en_progreso' | 'completado' | 'cancelado';
export type TipoUsuario = 'arquitecto' | 'cliente' | 'moderador';
```

---

## 🔧 Tipos de Usuario

### `usuario.types.ts`

```typescript
// Usuario base
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  tipo: 'arquitecto' | 'cliente' | 'moderador';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

// Arquitecto
export interface Arquitecto {
  id: string;
  usuario_id: string;
  especialidad: string;
  descripcion: string | null;
  experiencia_anos: number | null;
  tarifa_por_hora: number | null;
  portafolio_url: string | null;
  calificacion_promedio: number | null;
  verificado: boolean;
  
  // Relaciones
  usuario?: Usuario;
}

// Cliente
export interface Cliente {
  id: string;
  usuario_id: string;
  tipo_cliente: 'particular' | 'empresa';
  empresa_nombre: string | null;
  empresa_rfc: string | null;
  
  // Relaciones
  usuario?: Usuario;
}

// Moderador
export interface Moderador {
  id: string;
  usuario_id: string;
  nivel_acceso: 'basico' | 'avanzado' | 'completo';
  
  // Relaciones
  usuario?: Usuario;
}
```

---

## 🔧 Tipos de Proyecto

### `proyecto.types.ts`

```typescript
export interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string | null;
  presupuesto: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: 'borrador' | 'publicado' | 'en_progreso' | 'completado' | 'cancelado';
  
  // IDs de relaciones
  cliente_id: string;
  arquitecto_id: string | null;
  solicitud_id: string | null;
  
  // Relaciones populadas
  cliente?: Cliente;
  arquitecto?: Arquitecto;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface SolicitudProyecto {
  id: string;
  proyecto_id: string;
  arquitecto_id: string;
  mensaje: string | null;
  presupuesto_propuesto: number | null;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'retirada';
  
  // Relaciones
  proyecto?: Proyecto;
  arquitecto?: Arquitecto;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Avance {
  id: string;
  proyecto_id: string;
  descripcion: string;
  porcentaje: number | null;
  fecha_reporte: string;
  
  // Timestamps
  createdAt: string;
}
```

---

## 🔧 Tipos de Conversación

### `conversacion.types.ts`

```typescript
export interface Conversacion {
  id: string;
  proyecto_id: string;
  cliente_id: string;
  arquitecto_id: string;
  
  // Relaciones
  proyecto?: Proyecto;
  cliente?: Cliente;
  arquitecto?: Arquitecto;
  mensajes?: Mensaje[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface Mensaje {
  id: string;
  conversacion_id: string;
  emisor_id: string;
  contenido: string;
  leido: boolean;
  
  // Relaciones
  emisor?: Usuario;
  
  // Timestamps
  createdAt: string;
}
```

---

## 🔧 Tipos de Valoración

### `valoracion.types.ts`

```typescript
export interface Valoracion {
  id: string;
  proyecto_id: string;
  evaluador_id: string;
  evaluado_id: string;
  calificacion: number; // 1-5
  comentario: string | null;
  
  // Relaciones
  proyecto?: Proyecto;
  evaluador?: Usuario;
  evaluado?: Usuario;
  
  // Timestamps
  createdAt: string;
}
```

---

## 🔧 Tipos de GraphQL

### `graphql.types.ts`

```typescript
// Query: buscarArquitectos
export interface BuscarArquitectosInput {
  nombre?: string;
  especialidad?: string;
  experienciaMin?: number;
  calificacionMin?: number;
  tarifaMax?: number;
}

export interface ArquitectoResumen {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  calificacionPromedio: number | null;
  totalProyectos: number;
}

// Query: dashboardProyecto
export interface DashboardProyecto {
  proyecto: {
    id: string;
    titulo: string;
    estado: string;
    presupuesto: number | null;
  };
  estadisticas: {
    totalAvances: number;
    totalMensajes: number;
    promedioValoraciones: number | null;
  };
  ultimosAvances: Array<{
    id: string;
    descripcion: string;
    porcentaje: number | null;
    fechaReporte: string;
  }>;
  ultimosMensajes: Array<{
    id: string;
    contenido: string;
    emisorNombre: string;
    createdAt: string;
  }>;
}

// Query: estadisticasArquitecto
export interface EstadisticasArquitecto {
  arquitecto: {
    id: string;
    nombre: string;
    especialidad: string;
  };
  estadisticas: {
    totalProyectos: number;
    proyectosEnProgreso: number;
    proyectosCompletados: number;
    calificacionPromedio: number | null;
    totalValoraciones: number;
  };
}
```

---

## 🔧 Tipos de Formularios

Para formularios, crea tipos parciales:

```typescript
// Crear proyecto (sin id)
export type ProyectoCreateInput = Omit<Proyecto, 'id' | 'createdAt' | 'updatedAt'>;

// Actualizar proyecto (campos opcionales)
export type ProyectoUpdateInput = Partial<ProyectoCreateInput>;

// Login
export interface LoginInput {
  email: string;
  password: string;
}

// Registro
export interface RegisterInput {
  email: string;
  password: string;
  password_confirmation: string;
  nombre: string;
  apellido: string;
  tipo: 'arquitecto' | 'cliente';
}
```

---

## 💡 Mejores Prácticas

### 1. **Sufijo `.types.ts`**
Todos los archivos de tipos terminan en `.types.ts`.

### 2. **Export nombrado**
Usa `export interface` para que sea fácil importar.

```typescript
export interface Proyecto { ... }
```

### 3. **Nombres descriptivos**
Los tipos deben ser claros y específicos.

```typescript
// ❌ MAL
interface Data { ... }

// ✅ BIEN
interface Proyecto { ... }
```

### 4. **Reutilización**
Usa `Omit`, `Pick`, `Partial` para derivar tipos.

```typescript
type ProyectoSinTimestamps = Omit<Proyecto, 'createdAt' | 'updatedAt'>;
type ProyectoSoloTitulo = Pick<Proyecto, 'titulo'>;
```

### 5. **Union types para enums**
Usa union types en lugar de enums.

```typescript
// ✅ BIEN
type Estado = 'borrador' | 'publicado' | 'completado';

// ❌ Evitar enums
enum Estado { Borrador, Publicado, Completado }
```

### 6. **Opcional vs Required**
Usa `?` para campos opcionales.

```typescript
interface Proyecto {
  id: string;           // requerido
  titulo: string;       // requerido
  descripcion?: string; // opcional
}
```

---

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
