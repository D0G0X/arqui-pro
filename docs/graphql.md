# 🧩 Servicio GraphQL — Arquitectura de Proyectos (Python)

Resumen
- Servicio GraphQL con FastAPI + Strawberry.
- Persistencia con SQLAlchemy (async) + asyncpg.
- Arquitectura por capas: adapters (GraphQL/resolvers + schemas), application (use cases), domain (entities), infrastructure (ORM, DB, repositories).
- Base de datos: Supabase (Postgres).
- **15 entidades completamente implementadas** con operaciones CRUD completas:
  1. Usuarios
  2. Arquitectos
  3. Clientes
  4. Moderadores
  5. Proyectos
  6. Solicitudes de Proyecto
  7. Conversaciones
  8. Mensajes
  9. Notificaciones
  10. Valoraciones
  11. Avances
  12. Incidencias
  13. Imágenes
  14. Imagen Asociaciones
  15. Verificaciones

Cambios importantes (HTTP handling)
- Se añadió un endpoint POST /graphql que ejecuta el schema y devuelve status HTTP según errores:
  - 200 OK: consulta/mutación exitosa o errores de negocio (ej. códigos 202/300 definidos en extensions).
  - 400 Bad Request: errores de validación marcados con extensión code que empieza por "4" (por ejemplo "400").
  - 500 Internal Server Error: errores sin extensión o con code que empieza por "5".
- La UI GraphiQL quedó disponible en GET /graphql/ui (separada para evitar conflicto con la ruta POST personalizada).

Estructura clave (ruta `backend/graphql`)
- `main.py` — router FastAPI, endpoint POST /graphql (manejo HTTP) y GraphiQL en /graphql/ui.
- `adapters/schemas/` — tipos e inputs Strawberry para las 15 entidades + estadísticas + filtros (UsuarioType, ProyectoType, EstadisticasGenerales, FiltroArquitectoInput, etc.).
- `adapters/resolvers/` — resolvers Query/Mutation para cada entidad (CRUD completo) + QueryEstadisticas (agregaciones) + QueryFiltros (búsqueda).
- `application/use_cases/` — lógica de negocio (validaciones de enums, campos requeridos, códigos de error) + EstadisticasUseCase (SQL agregaciones) + FiltrosUseCase (búsqueda avanzada).
- `domain/entitiesPy/` — entidades del dominio (dataclasses) para las 15 entidades.
- `infrastructure/orm/` — modelos SQLAlchemy con relaciones, FKs y constraints.
- `infrastructure/repositories/` — interfaces e implementaciones CRUD para cada entidad.
- `infrastructure/database.py` — engine async, async_sessionmaker, get_db, init_db con todas las tablas.
- `TEST_QUERIES.md` — queries de prueba CRUD para todas las entidades.
- `NESTED_QUERIES.md` — ejemplos de queries con relaciones anidadas.
- `ESTADISTICAS_QUERIES.md` — queries de agregación y estadísticas (7 tipos).
- `FILTROS_QUERIES.md` — queries de filtros y búsqueda (3 tipos).

Tabla de contenidos
- Instalación y ejecución (Windows)
- Entidades disponibles
- Queries de Agregación y Estadísticas
- Relaciones y Queries Anidadas
- Filtros, Búsqueda y Ordenamiento
- Uso: llamadas GraphQL (UI) vs Raw JSON (POST)
- Validaciones implementadas
- Arquitectura del servicio

Requisitos (resumen)
- Python 3.10+
- Virtualenv
- Dependencias en `requirements.txt`: fastapi, uvicorn, strawberry-graphql, sqlalchemy[asyncio], asyncpg, python-dotenv

Instalación y ejecución (Windows)
1. Abrir terminal en la carpeta `backend/graphql`:
   ```
   cd C:\Users\leoan\Desktop\arqui-pro\backend\graphql
   python -m venv .venv
  # Activa el entorno virtual:
  # PowerShell
  .\.venv\Scripts\Activate.ps1
  # CMD
  .\.venv\Scripts\activate.bat
   pip install -r requirements.txt
   ```
2. Configurar `.env` (archivo en `backend/graphql/.env`):
   ```
   DATABASE_URL_ASYNC=postgresql+asyncpg://USER:PASS@HOST:5432/postgres
   ```
3. Arrancar servidor:
   ```
   python -m uvicorn main:app --reload
   ```
4. UI GraphQL (GraphiQL):
   - http://127.0.0.1:8000/graphql/ui

Entidades disponibles (15 completas)
Cada entidad tiene operaciones completas: listar, obtener por ID, crear, actualizar y eliminar.

1. **Usuarios** (`usuarios`) — Tabla base de usuarios del sistema
   - Queries: `listarUsuarios`, `obtenerUsuario`
   - Mutations: `crearUsuario`, `actualizarUsuario`, `eliminarUsuario`
   - Validaciones: formato email, roles (cliente/arquitecto/moderador), estados (activo/suspendido)
   - **Campos expuestos**: `id`, `nombre`, `apellido`, `email`, `rol`, `estado_cuenta`, `fecha_registro`, `foto_perfil`
   - **🔒 NO expuestos por seguridad**: `encrypted_password` (hash BCrypt), `jti` (JWT ID), `remember_created_at`
   - **Input**: acepta `password` en texto plano, se encripta automáticamente a `encrypted_password`

2. **Arquitectos** (`arquitectos`) — Perfil de arquitecto vinculado a usuario
   - Queries: `listarArquitectos`, `obtenerArquitecto`
   - Mutations: `crearArquitecto`, `actualizarArquitecto`, `eliminarArquitecto`
   - Validaciones: cédula única, FK a usuarios

3. **Clientes** (`clientes`) — Perfil de cliente vinculado a usuario
   - Queries: `listarClientes`, `obtenerCliente`
   - Mutations: `crearCliente`, `actualizarCliente`, `eliminarCliente`
   - Validaciones: cédula única, FK a usuarios

4. **Moderadores** (`moderadores`) — Perfil de moderador vinculado a usuario
   - Queries: `listarModeradores`, `obtenerModerador`
   - Mutations: `crearModerador`, `actualizarModerador`, `eliminarModerador`

5. **Proyectos** (`proyectos`) — Proyectos arquitectónicos
   - Queries: `listarProyectos`, `obtenerProyecto`
   - Mutations: `crearProyecto`, `actualizarProyecto`, `eliminarProyecto`
   - Validaciones: tipo_proyecto (portafolio/contratado), FK a arquitectos/clientes/conversaciones

6. **Solicitudes de Proyecto** (`solicitudes_proyecto`) — Solicitudes de trabajo
   - Queries: `listarSolicitudesProyecto`, `obtenerSolicitudProyecto`
   - Mutations: `crearSolicitudProyecto`, `actualizarSolicitudProyecto`, `eliminarSolicitudProyecto`
   - Validaciones: estado (pendiente/aceptado/rechazado), FK a arquitectos/clientes

7. **Conversaciones** (`conversaciones`) — Chats entre clientes y arquitectos
   - Queries: `listarConversaciones`, `obtenerConversacion`
   - Mutations: `crearConversacion`, `actualizarConversacion`, `eliminarConversacion`

8. **Mensajes** (`mensajes`) — Mensajes dentro de conversaciones
   - Queries: `listarMensajes`, `obtenerMensaje`
   - Mutations: `crearMensaje`, `actualizarMensaje`, `eliminarMensaje`
   - Validaciones: FK a conversaciones y usuarios (remitente)

9. **Notificaciones** (`notificaciones`) — Notificaciones para usuarios
   - Queries: `listarNotificaciones`, `obtenerNotificacion`
   - Mutations: `crearNotificacion`, `actualizarNotificacion`, `eliminarNotificacion`

10. **Valoraciones** (`valoraciones`) — Valoraciones de proyectos por clientes
    - Queries: `listarValoraciones`, `obtenerValoracion`
    - Mutations: `crearValoracion`, `actualizarValoracion`, `eliminarValoracion`
    - Validaciones: calificación (float), FK a proyectos/clientes

11. **Avances** (`avances`) — Avances/progreso de proyectos
    - Queries: `listarAvances`, `obtenerAvance`
    - Mutations: `crearAvance`, `actualizarAvance`, `eliminarAvance`

12. **Incidencias** (`incidencias`) — Reportes de problemas entre usuarios
    - Queries: `listarIncidencias`, `obtenerIncidencia`
    - Mutations: `crearIncidencia`, `actualizarIncidencia`, `eliminarIncidencia`
    - Validaciones: estado (pendiente/resuelto/en revision), FK a usuarios y moderadores

13. **Imágenes** (`imagenes`) — Almacenamiento de URLs de imágenes
    - Queries: `listarImagenes`, `obtenerImagen`
    - Mutations: `crearImagen`, `actualizarImagen`, `eliminarImagen`

14. **Imagen Asociaciones** (`imagen_asociaciones`) — Relación polimórfica de imágenes
    - Queries: `listarImagenAsociaciones`, `obtenerImagenAsociacion`
    - Mutations: `crearImagenAsociacion`, `actualizarImagenAsociacion`, `eliminarImagenAsociacion`
    - Validaciones: asociable_type (Proyecto/Mensaje/Incidencia/Avance)

15. **Verificaciones** (`verificaciones`) — Verificación de arquitectos por moderadores
    - Queries: `listarVerificaciones`, `obtenerVerificacion`
    - Mutations: `crearVerificacion`, `actualizarVerificacion`, `eliminarVerificacion`
    - Validaciones: estado (pendiente/verificado/rechazado), FK a arquitectos/moderadores

---

## 📊 Queries de Agregación y Estadísticas

Además de las operaciones CRUD, el servicio incluye **queries especializadas para reportes, dashboards y análisis de datos**.

Ejemplo rápido
```graphql
query {
  estadisticasGenerales {
    totalUsuarios
    totalArquitectos
    totalProyectos
  }
}
```


### Casos de Uso

- **Dashboard Administrativo**: Usa `dashboardMetricas` para vista completa
- **Homepage Pública**: Combina `topArquitectos` + `proyectosRecientes`
- **Panel de Reportes**: Usa estadísticas individuales con gráficos
- **Análisis de Negocio**: `proyectosPorTipo` para métricas de distribución

📖 **Documentación completa**: Ver `ESTADISTICAS_QUERIES.md` para más ejemplos.



## 🔗 Relaciones y Queries Anidadas

El servicio soporta **queries anidadas** para obtener datos relacionados en una sola llamada.

### Relaciones Implementadas

- **Usuario** → Arquitecto/Cliente/Moderador (perfil según rol)
- **Arquitecto** → Usuario + Proyectos (datos base + proyectos del arquitecto)
- **Cliente** → Usuario (datos base del cliente)
- **Proyecto** → Arquitecto + Cliente + Avances + Valoraciones (datos completos del proyecto)
- **Conversación** → Cliente + Arquitecto + Mensajes (chat completo)

📖 **Documentación completa**: Ver `NESTED_QUERIES.md` para 10+ ejemplos avanzados.



## 🔍 Filtros y Búsqueda Avanzada

El servicio incluye **queries especializadas para filtros y búsqueda** que permiten encontrar datos específicos rápidamente.


**Filtros disponibles:**
- `especialidad` - Búsqueda parcial en especialidades (ej: "residencial", "comercial")
- `ubicacion` - Búsqueda parcial en ubicación (ej: "Madrid", "Barcelona")
- `verificado` - Filtrar por estado de verificación (true/false)
- `valoracionMinima` - Valoración promedio mínima (ej: 4.5)
- `tipo` - Tipo de proyecto ("portafolio" o "contratado")
- `arquitectoId` - UUID del arquitecto
- `fechaDesde` - Fecha de publicación desde (formato: "YYYY-MM-DD")
- `fechaHasta` - Fecha de publicación hasta
- `valoracionMinima` - Valoración promedio mínima

**Busca en:**
- **Usuarios** - nombre, apellido, email
- **Arquitectos** - especialidades, ubicación, descripción
- **Proyectos** - título, descripción

**Uso:** Barra de búsqueda global, autocompletado, resultados unificados.

### Ordenamiento disponible

- Arquitectos (`orden` en `buscarArquitectos`):
  - `VALORACION_ASC` | `VALORACION_DESC`
  - `NOMBRE_ASC` | `NOMBRE_DESC`
  - `VERIFICADO_FIRST` | `VERIFICADO_LAST`
  - `VISTAS_ASC` | `VISTAS_DESC`
- Proyectos (`orden` en `filtrarProyectos`):
  - `FECHA_ASC` | `FECHA_DESC`
  - `VALORACION_ASC` | `VALORACION_DESC`
  - `TITULO_ASC` | `TITULO_DESC`

Ejemplo rápido
```graphql
query {
  buscarArquitectos(filtro: { verificado: true, orden: VALORACION_DESC }) {
    id
    valoracionPromProyecto
  }
}
```


### Casos de Uso

- **Directorio de Arquitectos**: Filtrar por especialidad + ubicación + verificado
- **Portfolio Personal**: Filtrar proyectos de un arquitecto específico
- **Proyectos Destacados**: Filtrar por tipo + valoración mínima
- **Búsqueda Rápida**: Buscar cualquier texto en todo el sistema
- **Filtros Combinados**: Múltiples criterios en una sola llamada

📖 **Documentación completa**: Ver `FILTROS_QUERIES.md` para 10+ ejemplos avanzados.

---

Cómo funciona el mapeo HTTP
- Los resolvers y use cases siguen lanzando GraphQLError con `extensions={"code": "400"}` u otros códigos de negocio.
- El endpoint POST /graphql examina los errores devueltos por Strawberry y decide el HTTP status:
  - Si aparece cualquier error con code que empieza por "4" → HTTP 400.
  - Si aparece error sin extension o con code que empieza por "5" → HTTP 500.
  - Si sólo hay errores de negocio (por ejemplo "202" o "300") o no hay errores → HTTP 200 (respuesta con campo "errors" en el body).


# Uso: llamadas GraphQL (UI) vs Raw JSON (POST)

Resumen rápido
- Endpoint GraphQL (API): POST http://127.0.0.1:8000/graphql — usar para GraphQL desde clientes (Thunder Client, curl).
- UI GraphiQL (interactivo): GET http://127.0.0.1:8000/graphql/ui — pegar queries/mutations directamente.
- Header requerido para POST: `Content-Type: application/json`
- HTTP mapping implementado:
  - 200 OK → éxito o errores de negocio (ej. extensions.code "202"/"300")
  - 400 Bad Request → errores con extensions.code que empiezan por "4"
  - 500 Internal Server Error → errores sin extensions o con code que empieza por "5"

Cómo usar: ejemplos para cada operación
- Dos formas de ejecutar:
  1. UI GraphiQL / pestaña GraphQL en Thunder — pegar la Query/Mutation directamente y, si aplica, las Variables en el panel Variables.
  2. Raw JSON POST — enviar un objeto JSON con keys `query`, `variables` (opcional) y `operationName` (opcional).

Query para verificar todas las entidades
- GraphQL (UI):
```graphql
query VerificarTodasLasEntidades {
  listarUsuarios { id nombre email }
  listarArquitectos { id cedula }
  listarClientes { id cedula }
  listarModeradores { id usuarioId }
  listarProyectos { id tituloProyecto }
  listarSolicitudesProyecto { id estado }
  listarConversaciones { id fecha }
  listarMensajes { id contenido }
  listarNotificaciones { id mensaje }
  listarValoraciones { id calificacion }
  listarAvances { id descripcion }
  listarIncidencias { id estado }
  listarImagenes { id imagenUrl }
  listarImagenAsociaciones { id asociableType }
  listarVerificaciones { id estado }
}

Consejos prácticos
- En Thunder Client: en la pestaña GraphQL pega la Query/Mutation y en Variables pega el JSON. Alternativamente usa Raw → JSON con los objetos `{"query": "...", "variables": {...}}`.
- Para debug rápido: probar en UI GraphiQL en /graphql/ui (autocompletado del schema).
- Revisa `errors[].extensions.code` para decidir acción en el cliente (409/alerta/mostrar mensaje).
- No uses métodos HTTP distintos (PUT/DELETE) para operaciones GraphQL: siempre POST (queries simples pueden usar GET).
- **Queries de prueba completas**: Ver archivo `backend/graphql/TEST_QUERIES.md` para ejemplos de todas las entidades.

Validaciones implementadas
El servicio incluye validaciones de negocio para garantizar integridad de datos:

- **Enums validados**:
  - `rol`: cliente, arquitecto, moderador
  - `estadoCuenta`: activo, inactivo, suspendido
  - `tipo_proyecto`: portafolio, contratado
  - `estado` (solicitudes): pendiente, aceptado, rechazado
  - `estado` (incidencias): pendiente, resuelto, en revision
  - `estado` (verificaciones): pendiente, verificado, rechazado
  - `asociable_type`: Proyecto, Mensaje, Incidencia, Avance

- **Campos únicos**:
  - Email de usuario (con formato validado)
  - Cédula de arquitecto
  - Cédula de cliente

- **Códigos de error**:
  - `400`: Validación fallida (campos requeridos, enums inválidos, formato incorrecto)
  - `404`: Entidad no encontrada
  - `202`: Duplicado (email/cédula ya existe)
  - `300`: Error de negocio
  - `500`: Error interno del servidor

- **🔒 Seguridad y Privacidad**:
  - El campo `password` del input se almacena como `encrypted_password` (hash BCrypt)
  - Campos sensibles **NO expuestos** en GraphQL:
    - `encrypted_password` - Hash del password
    - `jti` - JWT ID - Identificador único de token
    - `remember_created_at` - Timestamp de sesión persistente
  - **TODO en producción**: Implementar hashing con BCrypt antes de guardar passwords

Arquitectura del servicio

```
backend/graphql/
├── main.py                          # Entry point, FastAPI app, GraphQL schema
├── TEST_QUERIES.md                  # Queries de prueba para todas las entidades
├── adapters/
│   ├── schemas/                     # Strawberry GraphQL types & inputs
│   │   ├── usuario_schema.py
│   │   ├── arquitecto_schema.py
│   │   ├── proyecto_schema.py
│   │   └── ... (15 schemas totales)
│   └── resolvers/                   # GraphQL Query & Mutation resolvers
│       ├── usuario_resolver.py
│       ├── arquitecto_resolver.py
│       ├── proyecto_resolver.py
│       └── ... (15 resolvers totales)
├── application/
│   └── use_cases/                   # Business logic & validations
│       ├── usuario_use_case.py
│       ├── arquitecto_use_case.py
│       └── ... (15 use cases totales)
├── domain/
│   └── entitiesPy/                  # Domain entities (dataclasses)
│       ├── usuario_entity.py
│       ├── arquitecto_entity.py
│       └── ... (15 entities totales)
└── infrastructure/
    ├── database.py                  # DB engine, session, init_db
    ├── orm/                         # SQLAlchemy models
    │   ├── usuario_model.py
    │   ├── arquitecto_model.py
  │   └── ... (15 models totales)
    └── repositories/                # Repository interfaces & implementations
        ├── usuario_repository.py
        ├── usuario_repository_impl.py
  └── ... (15 repos + impls totales)

---

Troubleshooting rápido
- Enums de Strawberry: deben heredar de `enum.Enum` (por ejemplo: `class MiEnum(Enum): ...`) antes de usar `@strawberry.enum`.
- Uvicorn autoreload: si no recarga cambios, detén el proceso y vuelve a ejecutar `uvicorn`.
- Conexión a BD: `DATABASE_URL_ASYNC` debe usar el driver async `postgresql+asyncpg://...`.
```