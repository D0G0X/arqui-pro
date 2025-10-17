# 🧩 Servicio Usuarios — GraphQL (Python)

Resumen
- Servicio GraphQL con FastAPI + Strawberry.
- Persistencia con SQLAlchemy (async) + asyncpg.
- Arquitectura por capas: adapters (GraphQL/resolvers + schemas), application (use cases), domain (entities), infrastructure (ORM, DB, repositories).
- Base de datos: Supabase (Postgres). Tablas usadas: `usuarios`.

Cambios importantes (HTTP handling)
- Se añadió un endpoint POST /graphql que ejecuta el schema y devuelve status HTTP según errores:
  - 200 OK: consulta/mutación exitosa o errores de negocio (ej. códigos 202/300 definidos en extensions).
  - 400 Bad Request: errores de validación marcados con extensión code que empieza por "4" (por ejemplo "400").
  - 500 Internal Server Error: errores sin extensión o con code que empieza por "5".
- La UI GraphiQL quedó disponible en GET /graphql/ui (separada para evitar conflicto con la ruta POST personalizada).

Estructura clave (ruta `backend/graphql`)
- `main.py` — router FastAPI, endpoint POST /graphql (manejo HTTP) y GraphiQL en /graphql/ui.
- `adapters/graphql/schemas` — tipos e inputs Strawberry (UsuarioType, UsuarioInput...).
- `adapters/graphql/resolvers` — resolvers (Query/Mutation).
- `application/use_cases` — lógica de negocio (validaciones, hashing).
- `domain/entitiesPy` — entidades (dataclasses).
- `infrastructure/orm` — modelos SQLAlchemy.
- `infrastructure/repositories` — interfaces e implementaciones CRUD.
- `infrastructure/database.py` — engine async, async_sessionmaker, get_db, init_db.

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