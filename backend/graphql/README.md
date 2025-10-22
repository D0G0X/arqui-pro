# GraphQL Gateway - Sistema de Arquitectos y Proyectos

## Descripción del Proyecto

Gateway GraphQL que actúa como capa de consultas sobre un API REST de Rails. Proporciona **9 queries especializadas** organizadas en 3 categorías:

1. **Información Agregada** (combina múltiples entidades)
2. **Análisis y Métricas** (cálculos y estadísticas)  
3. **Búsqueda Avanzada** (filtros complejos)

### Tecnologías

- **Framework:** FastAPI + Strawberry GraphQL
- **Servidor:** Uvicorn (ASGI)
- **Cliente HTTP:** httpx (async)
- **Lenguaje:** Python 3.11+
- **Backend REST:** Ruby on Rails API

### Arquitectura Modular

```
backend/graphql/
├── main.py                      # Punto de entrada + Schema GraphQL
├── infrastructure/
│   └── rest_client.py           # Cliente HTTP para API REST
├── graphql_types/               # Tipos GraphQL (1 por archivo)
│   ├── perfil_completo_arquitecto.py
│   ├── dashboard_proyecto.py
│   ├── historial_conversacion.py
│   ├── estadisticas_arquitecto.py
│   ├── kpis_plataforma.py
│   └── metricas_proyecto.py
└── queries/                     # Queries por categoría
    ├── agregacion/              # Información Agregada
    │   ├── perfil_completo_arquitecto.py
    │   ├── dashboard_proyecto.py
    │   └── historial_conversacion.py
    ├── metricas/                # Análisis y Métricas
    │   ├── estadisticas_arquitecto.py
    │   ├── kpis_plataforma.py
    │   └── metricas_proyecto.py
    └── busqueda/                # Búsqueda Avanzada
        ├── buscar_arquitectos.py
        ├── buscar_proyectos.py
        └── buscar_conversaciones.py
```

### Flujo de Comunicación

```
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   Clientes   │ ───────> │   GraphQL    │ ───────> │  Rails REST  │
│  (Frontend)  │  GraphQL │   Gateway    │   HTTP   │     API      │
└──────────────┘          └──────────────┘          └──────────────┘
                               (Python)                  (Ruby)
```

**Responsabilidades:**

- **GraphQL Gateway (Python):**
  - 9 queries especializadas de lectura
  - Agregación de datos de múltiples endpoints
  - Cálculos y métricas en tiempo de consulta
  - Filtrado y búsqueda avanzada
  - Resolución de relaciones nested

- **Rails REST API:**
  - CRUD completo (Create, Read, Update, Delete)
  - Validaciones de negocio
  - Persistencia en base de datos
  - Autenticación y autorización

## Instalación

### 1. Requisitos Previos

- Python 3.11 o superior
- pip (gestor de paquetes de Python)
- Acceso al API REST de Rails en ejecución

### 2. Clonar el Repositorio

```bash
cd backend/graphql
```

### 3. Crear Entorno Virtual (Recomendado)

```bash
python -m venv venv

# Windows
venv\\Scripts\\activate

# Linux/Mac
source venv/bin/activate
```

### 4. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 5. Configurar Variables de Entorno

Crear archivo `.env` en `backend/graphql/`:

```env
REST_API_URL=http://localhost:3000
```

## Ejecución

### Modo Desarrollo

```bash
cd backend/graphql
uvicorn main:app --reload --port 8000
```

### Modo Producción

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Acceder a GraphiQL (Interfaz de Pruebas)

Abrir en el navegador:

```
http://127.0.0.1:8000/graphql/ui
```

---

## 📊 Documentación de las 9 Queries Especializadas

### 🔵 Grupo 1: Consultas de Información Agregada

Queries que combinan datos de múltiples entidades para crear vistas completas.

---

#### Query 1: `perfilCompletoArquitecto`

**Descripción:** Obtiene el perfil completo de un arquitecto incluyendo datos personales, proyectos, y estadísticas.

**Argumentos:**
- `arquitecto_id` (ID!): ID del arquitecto

**Retorna:**
```graphql
type PerfilCompletoArquitecto {
  arquitecto: ArquitectoType!
  usuario: UsuarioType!
  proyectos: [ProyectoType!]!
  total_proyectos: Int!
  valoracion_promedio: Float!
}
```

**Ejemplo de Uso:**

```graphql
query {
  perfilCompletoArquitecto(arquitectoId: "1") {
    arquitecto {
      cedula
      especialidades
      ubicacion
      verificado
    }
    usuario {
      nombre
      apellido
      email
    }
    proyectos {
      titulo_proyecto
      valoracion_promedio
      tipo_proyecto
    }
    total_proyectos
    valoracion_promedio
  }
}
```

**Caso de Uso:** Pantalla de perfil público de arquitecto.

---

#### Query 2: `dashboardProyecto`

**Descripción:** Dashboard completo de un proyecto con todos los datos relevantes: arquitecto, cliente, avances y valoraciones.

**Argumentos:**
- `proyecto_id` (ID!): ID del proyecto

**Retorna:**
```graphql
type DashboardProyecto {
  proyecto: ProyectoType!
  arquitecto: ArquitectoType!
  arquitecto_usuario: UsuarioType!
  cliente: ClienteType
  cliente_usuario: UsuarioType
  avances: [AvanceType!]!
  valoraciones: [ValoracionType!]!
  total_avances: Int!
  valoracion_promedio: Float!
}
```

**Ejemplo de Uso:**

```graphql
query {
  dashboardProyecto(proyectoId: "5") {
    proyecto {
      titulo_proyecto
      descripcion
      tipo_proyecto
      fecha_publicacion
    }
    arquitecto {
      cedula
      especialidades
    }
    arquitecto_usuario {
      nombre
      apellido
      email
    }
    cliente {
      cedula
    }
    cliente_usuario {
      nombre
      apellido
    }
    avances {
      descripcion
      fecha
    }
    valoraciones {
      calificacion
      comentario
      fecha
    }
    total_avances
    valoracion_promedio
  }
}
```

**Caso de Uso:** Vista detallada de proyecto para clientes y arquitectos.

---

#### Query 3: `historialConversacion`

**Descripción:** Historial completo de una conversación con participantes y todos los mensajes intercambiados.

**Argumentos:**
- `conversacion_id` (ID!): ID de la conversación

**Retorna:**
```graphql
type HistorialConversacion {
  conversacion: ConversacionType!
  cliente: ClienteType!
  cliente_usuario: UsuarioType!
  arquitecto: ArquitectoType!
  arquitecto_usuario: UsuarioType!
  mensajes: [MensajeType!]!
  total_mensajes: Int!
  mensajes_no_leidos: Int!
}
```

**Ejemplo de Uso:**

```graphql
query {
  historialConversacion(conversacionId: "10") {
    conversacion {
      fecha
    }
    cliente_usuario {
      nombre
      apellido
    }
    arquitecto_usuario {
      nombre
      apellido
    }
    mensajes {
      contenido
      fecha_envio
      leido
      usuario_emisor_id
    }
    total_mensajes
    mensajes_no_leidos
  }
}
```

**Caso de Uso:** Chat/mensajería entre cliente y arquitecto.

---

### 🔵 Grupo 2: Consultas de Análisis y Métricas

Queries con cálculos, estadísticas y KPIs.

---

#### Query 4: `estadisticasArquitecto`

**Descripción:** Estadísticas completas de un arquitecto: proyectos realizados, valoraciones, y distribución por tipo.

**Argumentos:**
- `arquitecto_id` (ID!): ID del arquitecto

**Retorna:**
```graphql
type EstadisticasArquitecto {
  arquitecto_id: ID!
  nombre_completo: String!
  total_proyectos: Int!
  valoracion_promedio: Float!
  proyectos_por_tipo: [ProyectosPorTipo!]!
  total_valoraciones: Int!
  verificado: Boolean!
}

type ProyectosPorTipo {
  tipo: String!
  cantidad: Int!
}
```

**Ejemplo de Uso:**

```graphql
query {
  estadisticasArquitecto(arquitectoId: "1") {
    arquitecto_id
    nombre_completo
    total_proyectos
    valoracion_promedio
    proyectos_por_tipo {
      tipo
      cantidad
    }
    total_valoraciones
    verificado
  }
}
```

**Caso de Uso:** Panel de métricas del arquitecto, reportes internos.

---

#### Query 5: `kpisPlataforma`

**Descripción:** KPIs generales de la plataforma completa.

**Argumentos:** Ninguno

**Retorna:**
```graphql
type KPIsPlataforma {
  total_usuarios: Int!
  usuarios_por_rol: [UsuariosPorRol!]!
  total_proyectos: Int!
  total_arquitectos: Int!
  total_clientes: Int!
  total_incidencias: Int!
  arquitectos_verificados: Int!
}

type UsuariosPorRol {
  rol: String!
  cantidad: Int!
}
```

**Ejemplo de Uso:**

```graphql
query {
  kpisPlataforma {
    total_usuarios
    usuarios_por_rol {
      rol
      cantidad
    }
    total_proyectos
    total_arquitectos
    total_clientes
    total_incidencias
    arquitectos_verificados
  }
}
```

**Caso de Uso:** Dashboard administrativo, estadísticas generales.

---

#### Query 6: `metricasProyecto`

**Descripción:** Métricas calculadas de un proyecto específico: avances, valoraciones, tiempo transcurrido.

**Argumentos:**
- `proyecto_id` (ID!): ID del proyecto

**Retorna:**
```graphql
type MetricasProyecto {
  proyecto_id: ID!
  titulo: String!
  total_avances: Int!
  total_valoraciones: Int!
  valoracion_promedio: Float!
  dias_transcurridos: Int
  estado: String!
}
```

**Ejemplo de Uso:**

```graphql
query {
  metricasProyecto(proyectoId: "5") {
    proyecto_id
    titulo
    total_avances
    total_valoraciones
    valoracion_promedio
    dias_transcurridos
    estado
  }
}
```

**Caso de Uso:** Análisis de progreso de proyecto, reportes de estado.

---

### 🔵 Grupo 3: Consultas de Búsqueda Avanzada

Queries con filtros complejos y búsquedas parametrizadas.

---

#### Query 7: `buscarArquitectos`

**Descripción:** Búsqueda avanzada de arquitectos con múltiples filtros.

**Argumentos (todos opcionales):**
- `ubicacion` (String): Filtra por ubicación (contiene)
- `especialidad` (String): Filtra por especialidad (contiene)
- `valoracion_minima` (Float): Valoración promedio mínima
- `verificado` (Boolean): Solo arquitectos verificados/no verificados

**Retorna:** `[ArquitectoType!]!`

**Ejemplo de Uso:**

```graphql
query {
  buscarArquitectos(
    ubicacion: "Lima"
    especialidad: "Residencial"
    valoracionMinima: 4.0
    verificado: true
  ) {
    id
    cedula
    especialidades
    ubicacion
    valoracion_prom_proyecto
    verificado
    usuario {
      nombre
      apellido
      email
    }
  }
}
```

**Caso de Uso:** Buscador de arquitectos para clientes.

---

#### Query 8: `buscarProyectos`

**Descripción:** Búsqueda avanzada de proyectos con filtros múltiples.

**Argumentos (todos opcionales):**
- `tipo_proyecto` (String): Tipo de proyecto exacto
- `valoracion_minima` (Float): Valoración mínima
- `fecha_desde` (Date): Fecha de publicación desde
- `fecha_hasta` (Date): Fecha de publicación hasta

**Retorna:** `[ProyectoType!]!`

**Ejemplo de Uso:**

```graphql
query {
  buscarProyectos(
    tipoProyecto: "Residencial"
    valoracionMinima: 4.5
    fechaDesde: "2024-01-01"
    fechaHasta: "2024-12-31"
  ) {
    id
    titulo_proyecto
    descripcion
    tipo_proyecto
    valoracion_promedio
    fecha_publicacion
    arquitecto {
      usuario {
        nombre
        apellido
      }
    }
  }
}
```

**Caso de Uso:** Catálogo de proyectos, portafolio filtrado.

---

#### Query 9: `buscarConversaciones`

**Descripción:** Búsqueda avanzada de conversaciones con filtros.

**Argumentos (todos opcionales):**
- `cliente_id` (ID): ID del cliente participante
- `arquitecto_id` (ID): ID del arquitecto participante
- `fecha_desde` (Date): Fecha desde
- `solo_con_no_leidos` (Boolean): Solo conversaciones con mensajes no leídos

**Retorna:** `[ConversacionType!]!`

**Ejemplo de Uso:**

```graphql
query {
  buscarConversaciones(
    clienteId: "3"
    soloConNoLeidos: true
  ) {
    id
    fecha
    cliente {
      usuario {
        nombre
      }
    }
    arquitecto {
      usuario {
        nombre
      }
    }
    mensajes {
      contenido
      leido
    }
  }
}
```

**Caso de Uso:** Bandeja de entrada de mensajes, filtrado de conversaciones.

---

## 📁 Estructura del Proyecto

```
backend/graphql/
├── main.py                          # Punto de entrada, FastAPI app
├── requirements.txt                 # Dependencias Python
├── .env                             # Variables de entorno
├── adapters/
│   ├── resolvers/
│   │   ├── usuario_resolver.py
│   │   ├── arquitecto_resolver.py
│   │   ├── proyecto_resolver.py
│   │   ├── conversacion_resolver.py
│   │   ├── consultas_avanzadas_resolver.py  # 9 queries especializadas
│   │   └── ... (otros resolvers)
│   └── schemas/
│       ├── usuario_schema.py
│       ├── arquitecto_schema.py
│       ├── proyecto_schema.py
│       └── ... (otros schemas)
├── infrastructure/
│   └── rest_client.py               # Cliente HTTP async para REST API
└── domain/
    └── entitiesPy/                  # Entidades de dominio (si se usan)
```

---

## 🔗 División de Responsabilidades

### GraphQL Gateway (Python)

✅ **Hace:**
- Queries de solo lectura
- Agregación de datos
- Cálculos en tiempo real
- Filtrado y búsqueda
- Relaciones nested

❌ **NO hace:**
- Mutaciones (crear/actualizar/eliminar)
- Validaciones de negocio
- Escritura en base de datos
- Autenticación

### Rails REST API

✅ **Hace:**
- CRUD completo
- Validaciones
- Persistencia
- Autenticación/Autorización
- Lógica de negocio

❌ **NO hace:**
- Agregaciones complejas (las hace GraphQL)
- Queries anidadas profundas

---

## 🧪 Testing

### Ejecutar Tests

```bash
pytest test_graphql_queries.py -v
```

### Ejemplos de Pruebas Manuales

Usar GraphiQL UI en `http://127.0.0.1:8000/graphql/ui` y probar las queries documentadas arriba.

---

## 📝 Notas Importantes

1. **No hay mutaciones:** Todas las operaciones de escritura (crear, actualizar, eliminar) deben hacerse directamente al API REST de Rails.

2. **Filtros en GraphQL:** Algunos filtros se aplican en el lado de GraphQL ya que el API REST puede no soportar todos los parámetros. Esto es aceptable para volúmenes moderados de datos.

3. **Performance:** Para optimizar queries con muchas relaciones nested, considerar implementar DataLoader en el futuro.

4. **Errores:** Los errores del API REST se propagan como errores de GraphQL con códigos HTTP apropiados.

---

## 📦 Entregables Completados

✅ 1. Código fuente completo del proyecto GraphQL Gateway
✅ 2. Archivo README.md (este documento)
✅ 3. Colección de Queries GraphQL (ver `queries_ejemplos.graphql`)
✅ 4. Schema GraphQL generado (ver `schema.graphql`)

---

## 🚀 Despliegue

### Docker (Opcional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t graphql-gateway .
docker run -p 8000:8000 --env-file .env graphql-gateway
```

---

## 📧 Contacto y Soporte

Para dudas o problemas, consultar la documentación del código o revisar los ejemplos en `queries_ejemplos.graphql`.

---

**Versión:** 1.0.0  
**Fecha:** Octubre 2025  
**Tecnología:** Python 3.11 + FastAPI + Strawberry GraphQL
