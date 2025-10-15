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

Ejemplo: mutación crear usuario (Thunder Client / Raw JSON)
- Endpoint: POST http://127.0.0.1:8000/graphql
- Header: Content-Type: application/json
- Body:
```json
{
  "query": "mutation CrearUsuario($input: UsuarioInput!) { crearUsuario(input: $input) { id nombre apellido email estadoCuenta rol createdAt updatedAt } }",
  "variables": {
    "input": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "password": "secret123",
      "estadoCuenta": "activo",
      "rol": "user",
      "fotoPerfil": null
    }
  }
}
```

Respuestas esperadas
- Validación faltante (400):
  - HTTP status: 400
  - Body.errors[0].extensions.code === "400"
- Email duplicado (business code 202):
  - HTTP status: 200
  - Body.errors[0].extensions.code === "202"
- Error inesperado (sin extensions):
  - HTTP status: 500

Notas y buenas prácticas
- Mantener las validaciones en UseCases; lanzar GraphQLError con `extensions={"code": "<código>"}`.
- No devolver `password`/`password_hash` en tipos públicos.
- Usar Alembic para migraciones en producción.
- Hashear contraseñas (bcrypt/argon2) en UseCase antes de persistir.

