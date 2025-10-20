# 🔍 Queries de Filtros y Búsqueda

Este documento contiene ejemplos de uso de las queries de filtros y búsqueda implementadas en el servicio GraphQL.

## 📋 Índice

1. [Buscar Arquitectos](#1-buscar-arquitectos)
2. [Filtrar Proyectos](#2-filtrar-proyectos)
3. [Búsqueda Global](#3-búsqueda-global)

---

## 1. Buscar Arquitectos

Busca arquitectos con filtros opcionales (especialidad, ubicación, verificación, valoración).

### 🔹 Filtro por Especialidad

```graphql
query BuscarPorEspecialidad {
  buscarArquitectos(filtro: { especialidad: "residencial" }) {
    id
    cedula
    especialidades
    ubicacion
    verificado
    valoracionPromProyecto
    usuario {
      nombre
      apellido
      email
    }
  }
}
```

**Uso:** Encontrar arquitectos especializados en un tipo de construcción específico.

### 🔹 Filtro por Ubicación

```graphql
query BuscarPorUbicacion {
  buscarArquitectos(filtro: { ubicacion: "Manta-Manabí-Ecuador" }) {
    id
    cedula
    especialidades
    ubicacion
    verificado
    valoracionPromProyecto
    usuario {
      nombre
      apellido
    }
  }
}
```

**Uso:** Buscar arquitectos en una ciudad o región específica.

### 🔹 Filtro por Verificación

```graphql
query BuscarVerificados {
  buscarArquitectos(filtro: { verificado: true }) {
    id
    cedula
    especialidades
    ubicacion
    verificado
    valoracionPromProyecto
  }
}
```

**Uso:** Mostrar solo arquitectos verificados en el sistema.

### 🔹 Filtro por Valoración Mínima

```graphql
query BuscarTopArquitectos {
  buscarArquitectos(filtro: { valoracionMinima: 4.5 }) {
    id
    cedula
    especialidades
    ubicacion
    valoracionPromProyecto
    usuario {
      nombre
      apellido
    }
  }
}
```

**Uso:** Filtrar arquitectos con buenas valoraciones (4.5 estrellas o más).

### 🔹 Filtro Combinado

```graphql
query BuscarArquitectosAvanzado {
  buscarArquitectos(
    filtro: {
      especialidad: "comercial"
      ubicacion: "Barcelona"
      verificado: true
      valoracionMinima: 4.0
    }
  ) {
    id
    cedula
    especialidades
    ubicacion
    verificado
    valoracionPromProyecto
    vistasPerfil
    usuario {
      nombre
      apellido
      email
      fotoPerfil
    }
  }
}
```

**Uso:** Búsqueda avanzada con múltiples criterios (arquitectos comerciales, en Barcelona, verificados, con buena valoración).

---

### 🔽 Ordenamiento de Arquitectos

Puedes ordenar los resultados de arquitectos usando el campo `orden` dentro del input.

Opciones disponibles:
- `VALORACION_ASC` | `VALORACION_DESC`
- `NOMBRE_ASC` | `NOMBRE_DESC`
- `VERIFICADO_FIRST` | `VERIFICADO_LAST`
- `VISTAS_ASC` | `VISTAS_DESC`

Ejemplos:

```graphql
query ArquitectosPorValoracionDesc {
  buscarArquitectos(filtro: { orden: VALORACION_DESC }) {
    id
    cedula
    valoracionPromProyecto
  }
}
```

```graphql
query ArquitectosPorNombreAsc {
  buscarArquitectos(filtro: { orden: NOMBRE_ASC }) {
    id
    cedula
    usuario { nombre }
  }
}
```

```graphql
query ArquitectosVerificadosPrimero {
  buscarArquitectos(filtro: { orden: VERIFICADO_FIRST }) {
    id
    verificado
  }
}
```

## 2. Filtrar Proyectos

Filtra proyectos con múltiples criterios (tipo, arquitecto, fechas, valoración).

### 🔹 Filtro por Tipo de Proyecto

```graphql
query ProyectosContratados {
  filtrarProyectos(filtro: { tipo: "contratado" }) {
    id
    tituloProyecto
    descripcion
    tipoProyecto
    fechaPublicacion
    valoracionPromedio
    arquitecto {
      cedula
      usuario {
        nombre
        apellido
      }
    }
  }
}
```

**Uso:** Obtener solo proyectos contratados (o portafolio).

### 🔹 Filtro por Arquitecto

```graphql
query ProyectosDeArquitecto {
  filtrarProyectos(
    filtro: { arquitectoId: "550e8400-e29b-41d4-a716-446655440000" }
  ) {
    id
    tituloProyecto
    descripcion
    tipoProyecto
    fechaPublicacion
    valoracionPromedio
  }
}
```

**Uso:** Ver todos los proyectos de un arquitecto específico.

### 🔹 Filtro por Rango de Fechas

```graphql
query ProyectosDelAnio {
  filtrarProyectos(
    filtro: {
      fechaDesde: "2024-01-01"
      fechaHasta: "2024-12-31"
    }
  ) {
    id
    tituloProyecto
    tipoProyecto
    fechaPublicacion
    valoracionPromedio
    arquitecto {
      usuario {
        nombre
        apellido
      }
    }
  }
}
```

**Uso:** Obtener proyectos publicados en un periodo específico.

### 🔹 Filtro por Valoración Mínima

```graphql
query ProyectosDestacados {
  filtrarProyectos(filtro: { valoracionMinima: 4.0 }) {
    id
    tituloProyecto
    descripcion
    tipoProyecto
    fechaPublicacion
    valoracionPromedio
    valoraciones {
      calificacion
      comentario
      cliente {
        usuario {
          nombre
          apellido
        }
      }
    }
  }
}
```

**Uso:** Mostrar solo proyectos con buenas valoraciones.

### 🔹 Filtro Combinado

```graphql
query ProyectosFiltradosAvanzado {
  filtrarProyectos(
    filtro: {
      tipo: "portafolio"
      fechaDesde: "2024-01-01"
      valoracionMinima: 4.5
    }
  ) {
    id
    tituloProyecto
    descripcion
    tipoProyecto
    fechaPublicacion
    valoracionPromedio
    arquitecto {
      cedula
      especialidades
      ubicacion
      usuario {
        nombre
        apellido
      }
    }
    avances {
      descripcion
      fecha
    }
    valoraciones {
      calificacion
      comentario
    }
  }
}
```

**Uso:** Búsqueda avanzada de proyectos de portafolio del 2024 con excelente valoración.

---

### 🔽 Ordenamiento de Proyectos

Puedes ordenar los resultados de proyectos usando el campo `orden` dentro del input.

Opciones disponibles:
- `FECHA_ASC` | `FECHA_DESC`
- `VALORACION_ASC` | `VALORACION_DESC`
- `TITULO_ASC` | `TITULO_DESC`

Ejemplos:

```graphql
query ProyectosMasRecientes {
  filtrarProyectos(filtro: { orden: FECHA_DESC }) {
    id
    tituloProyecto
    fechaPublicacion
  }
}
```

```graphql
query ProyectosPorValoracionAsc {
  filtrarProyectos(filtro: { orden: VALORACION_ASC }) {
    id
    tituloProyecto
    valoracionPromedio
  }
}
```

```graphql
query ProyectosPorTituloDesc {
  filtrarProyectos(filtro: { orden: TITULO_DESC }) {
    id
    tituloProyecto
  }
}
```

## 3. Búsqueda Global

Busca texto en usuarios, arquitectos y proyectos simultáneamente.

### 🔹 Búsqueda Simple

```graphql
query BuscarEnTodo {
  busquedaGlobal(busqueda: { texto: "arquitectura" }) {
    tipo
    id
    titulo
    descripcion
    relevancia
  }
}
```

**Uso:** Buscar el término "arquitectura" en todas las entidades.

**Respuesta esperada:**
```json
{
  "data": {
    "busquedaGlobal": [
      {
        "tipo": "proyecto",
        "id": "uuid-1",
        "titulo": "Edificio de Arquitectura Moderna",
        "descripcion": "Proyecto de oficinas con diseño contemporáneo...",
        "relevancia": 1.0
      },
      {
        "tipo": "arquitecto",
        "id": "uuid-2",
        "titulo": "Arquitecto - Cédula 12345678",
        "descripcion": "arquitectura residencial - Madrid",
        "relevancia": 0.9
      },
      {
        "tipo": "usuario",
        "id": "uuid-3",
        "titulo": "Juan Arquitecto",
        "descripcion": "arquitecto - juan@example.com",
        "relevancia": 0.7
      }
    ]
  }
}
```

### 🔹 Búsqueda con Límite

```graphql
query BuscarConLimite {
  busquedaGlobal(busqueda: { texto: "Madrid", limite: 20 }) {
    tipo
    id
    titulo
    descripcion
    relevancia
  }
}
```

**Uso:** Buscar "Madrid" con máximo 20 resultados por tipo de entidad.

### 🔹 Búsqueda por Nombre

```graphql
query BuscarPorNombre {
  busquedaGlobal(busqueda: { texto: "juan perez" }) {
    tipo
    id
    titulo
    descripcion
    relevancia
  }
}
```

**Uso:** Buscar usuarios por nombre.

### 🔹 Búsqueda por Email

```graphql
query BuscarPorEmail {
  busquedaGlobal(busqueda: { texto: "juan@example.com" }) {
    tipo
    id
    titulo
    descripcion
    relevancia
  }
}
```

**Uso:** Buscar usuarios por email.

---

## ✅ Ventajas de los Filtros

- **Búsqueda Flexible**: Combina múltiples criterios en una sola query
- **Performance Optimizado**: Usa índices de base de datos (ILIKE para búsqueda case-insensitive)
- **Resultados Ordenados**: 
  - Arquitectos por valoración descendente
  - Proyectos por fecha descendente
  - Búsqueda global por relevancia
- **Case-Insensitive**: Las búsquedas de texto ignoran mayúsculas/minúsculas
- **Relevancia Calculada**: La búsqueda global asigna scores de relevancia (0-1)

---

## 📖 Casos de Uso

### 1. **Homepage - Arquitectos Destacados**
```graphql
query ArquitectosDestacados {
  buscarArquitectos(filtro: { verificado: true, valoracionMinima: 4.5 }) {
    # ... campos
  }
}
```

### 2. **Directorio de Arquitectos - Búsqueda por Especialidad**
```graphql
query DirectorioEspecializado {
  buscarArquitectos(filtro: { especialidad: "residencial", ubicacion: "Madrid" }) {
    # ... campos
  }
}
```

### 3. **Portfolio de Arquitecto - Proyectos Propios**
```graphql
query MisProyectos {
  filtrarProyectos(filtro: { arquitectoId: "mi-uuid" }) {
    # ... campos
  }
}
```

### 4. **Dashboard Cliente - Proyectos Recientes**
```graphql
query ProyectosRecientes {
  filtrarProyectos(
    filtro: { 
      tipo: "contratado",
      fechaDesde: "2024-10-01"
    }
  ) {
    # ... campos
  }
}
```

### 5. **Barra de Búsqueda Global**
```graphql
query BarraBusqueda {
  busquedaGlobal(busqueda: { texto: $searchText, limite: 10 }) {
    tipo
    id
    titulo
    descripcion
    relevancia
  }
}
```
## 🔗 Ver También

- `TEST_QUERIES.md` - Queries CRUD básicas
- `NESTED_QUERIES.md` - Relaciones anidadas
- `ESTADISTICAS_QUERIES.md` - Agregaciones y reportes
- `README.md` - Documentación general
