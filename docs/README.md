# 🧩 Servicio GraphQL — Arquitectura de Proyectos (Python)

Resumen
- Servicio GraphQL con FastAPI + Strawberry.
- Persistencia con SQLAlchemy (async) + asyncpg.
- Arquitectura por capas: adapters (GraphQL/resolvers + schemas), application (use cases), domain (entities), infrastructure (ORM, DB, repositories).
- Base de datos: Supabase (Postgres).
- **14 entidades completamente implementadas** con operaciones CRUD completas:
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
- `adapters/schemas/` — tipos e inputs Strawberry para las 14 entidades (UsuarioType, ProyectoType, etc.).
- `adapters/resolvers/` — resolvers Query/Mutation para cada entidad (CRUD completo).
- `application/use_cases/` — lógica de negocio (validaciones de enums, campos requeridos, códigos de error).
- `domain/entitiesPy/` — entidades del dominio (dataclasses) para las 14 entidades.
- `infrastructure/orm/` — modelos SQLAlchemy con relaciones, FKs y constraints.
- `infrastructure/repositories/` — interfaces e implementaciones CRUD para cada entidad.
- `infrastructure/database.py` — engine async, async_sessionmaker, get_db, init_db con todas las tablas.
- `TEST_QUERIES.md` — queries de prueba para todas las entidades.

Requisitos (resumen)
- Python 3.10+
- Virtualenv
- Dependencias en `requirements.txt`: fastapi, uvicorn, strawberry-graphql, sqlalchemy[asyncio], asyncpg, python-dotenv

Instalación y ejecución (Windows)
1. Abrir terminal en la carpeta `backend/graphql`:
   ```
   cd C:\Users\leoan\Desktop\arqui-pro\backend\graphql
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
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

Entidades disponibles (14 completas)
Cada entidad tiene operaciones completas: listar, obtener por ID, crear, actualizar y eliminar.

1. **Usuarios** (`usuarios`) — Tabla base de usuarios del sistema
   - Queries: `listarUsuarios`, `obtenerUsuario`
   - Mutations: `crearUsuario`, `actualizarUsuario`, `eliminarUsuario`
   - Validaciones: formato email, roles (cliente/arquitecto/moderador), estados (activo/inactivo/suspendido)

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
```

1) Listar usuarios
- GraphQL (UI / GraphQL tab):
```graphql
query ListarUsuarios {
  listarUsuarios {
    id
    nombre
    apellido
    email
    estadoCuenta
    rol
    fechaRegistro
    fotoPerfil
  }
}
```
- Raw JSON (POST body):
```json
{
  "query": "query ListarUsuarios { listarUsuarios { id nombre apellido email estadoCuenta rol fechaRegistro fotoPerfil } }",
  "variables": {}
}
```

2) Obtener usuario por id
- GraphQL:
```graphql
query ObtenerUsuario($id: ID!) {
  obtenerUsuario(id: $id) {
    id
    nombre
    apellido
    email
    estadoCuenta
    rol
    fechaRegistro
    fotoPerfil
  }
}
```
- Variables (GraphQL tab / JSON):
```json
{
  "id": "6954e4dd-f142-402c-9351-44b28a3526e6"
}
```
- Raw JSON:
```json
{
  "query": "query ObtenerUsuario($id: ID!) { obtenerUsuario(id: $id) { id nombre apellido email estadoCuenta rol fechaRegistro fotoPerfil } }",
  "variables": { "id": "6954e4dd-f142-402c-9351-44b28a3526e6" }
}
```

3) Crear usuario
- GraphQL:
```graphql
mutation CrearUsuario($input: UsuarioInput!) {
  crearUsuario(input: $input) {
    id
    nombre
    apellido
    email
    estadoCuenta
    rol
    fechaRegistro
    fotoPerfil
  }
}
```
- Variables:
```json
{
  "input": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "secret123",
    "estadoCuenta": "activo",
    "rol": "cliente",
    "fotoPerfil": null
  }
}
```
- Raw JSON:
```json
{
  "query": "mutation CrearUsuario($input: UsuarioInput!) { crearUsuario(input: $input) { id nombre apellido email estadoCuenta rol fechaRegistro fotoPerfil } }",
  "variables": {
    "input": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "password": "secret123",
      "estadoCuenta": "activo",
      "rol": "cliente",
      "fotoPerfil": null
    }
  }
}
```

4) Actualizar usuario
- GraphQL:
```graphql
mutation ActualizarUsuario($id: ID!, $input: UsuarioInput!) {
  actualizarUsuario(id: $id, input: $input) {
    id
    nombre
    apellido
    email
    estadoCuenta
    rol
    fechaRegistro
    fotoPerfil
  }
}
```
- Variables:
```json
{
  "id": "a38358d2-ad56-41ef-8f30-b8b1320a0c31",
  "input": {
    "nombre": "Juan Actualizado",
    "apellido": "Pérez",
    "email": "juan.actualizado@example.com",
    "password": "nuevoSecret123",
    "estadoCuenta": "activo",
    "rol": "cliente",
    "fotoPerfil": null
  }
}
```
- Raw JSON:
```json
{
  "query": "mutation ActualizarUsuario($id: ID!, $input: UsuarioInput!) { actualizarUsuario(id: $id, input: $input) { id nombre apellido email estadoCuenta rol fechaRegistro fotoPerfil } }",
  "variables": {
    "id": "a38358d2-ad56-41ef-8f30-b8b1320a0c31",
    "input": {
      "nombre": "Juan Actualizado",
      "apellido": "Pérez",
      "email": "juan.actualizado@example.com",
      "password": "nuevoSecret123",
      "estadoCuenta": "activo",
      "rol": "cliente",
      "fotoPerfil": null
    }
  }
}
```

5) Eliminar usuario
- GraphQL (mutation enviada por POST):
```graphql
mutation EliminarUsuario($id: ID!) {
  eliminarUsuario(id: $id)
}
```
- Variables:
```json
{ "id": "6954e4dd-f142-402c-9351-44b28a3526e6" }
```
- Raw JSON:
```json
{
  "query": "mutation EliminarUsuario($id: ID!) { eliminarUsuario(id: $id) }",
  "variables": { "id": "6954e4dd-f142-402c-9351-44b28a3526e6" }
}
```

Ejemplos de respuestas (formato)
- Éxito (200):
```json
{
  "data": {
    "crearUsuario": {
      "id": "uuid",
      "nombre": "Juan",
      ...
    }
  }
}
```
- Error de validación (mapeado a 400 si extensions.code empieza por "4"):
HTTP status: 400
Body:
```json
{
  "data": null,
  "errors": [
    { "message": "email inválido", "extensions": { "code": "400" } }
  ]
}
```
- Error de negocio (p. ej. email duplicado, code "202"):
HTTP status: 200
Body:
```json
{
  "data": null,
  "errors": [
    { "message": "email ya existente", "extensions": { "code": "202" } }
  ]
}
```
- Error inesperado (sin extensions → mapeado a 500):
HTTP status: 500
Body:
```json
{
  "data": null,
  "errors": [
    { "message": "Internal server error" }
  ]
}
```

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
│   │   └── ... (14 schemas totales)
│   └── resolvers/                   # GraphQL Query & Mutation resolvers
│       ├── usuario_resolver.py
│       ├── arquitecto_resolver.py
│       ├── proyecto_resolver.py
│       └── ... (14 resolvers totales)
├── application/
│   └── use_cases/                   # Business logic & validations
│       ├── usuario_use_case.py
│       ├── arquitecto_use_case.py
│       └── ... (14 use cases totales)
├── domain/
│   └── entitiesPy/                  # Domain entities (dataclasses)
│       ├── usuario_entity.py
│       ├── arquitecto_entity.py
│       └── ... (14 entities totales)
└── infrastructure/
    ├── database.py                  # DB engine, session, init_db
    ├── orm/                         # SQLAlchemy models
    │   ├── usuario_model.py
    │   ├── arquitecto_model.py
    │   └── ... (14 models totales)
    └── repositories/                # Repository interfaces & implementations
        ├── usuario_repository.py
        ├── usuario_repository_impl.py
        └── ... (14 repos + impls totales)
```

Próximas mejoras sugeridas
1. **Relaciones entre entidades** - Queries anidadas (ej: obtener proyecto con sus avances)
2. **Paginación** - Para listas grandes con pageInfo
3. **Filtros y ordenamiento** - Búsquedas más específicas
4. **Autenticación JWT** - Seguridad con tokens
5. **DataLoaders** - Optimización para evitar N+1 queries
6. **Subscriptions** - Actualizaciones en tiempo real vía WebSocket
7. **Upload de archivos** - Para imágenes directamente
8. **Tests unitarios** - Cobertura de use cases y resolvers