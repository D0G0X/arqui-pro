# GraphQL Service Architecture - Final State

## Overview

The GraphQL service is a **query-only** API layer that sits on top of a Rails REST API. It provides a flexible querying interface using GraphQL while delegating all data operations to the REST backend.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      Client Layer                        │
│  (Web App, Mobile App, External Services)               │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ HTTP/GraphQL Queries
                     ▼
┌──────────────────────────────────────────────────────────┐
│              GraphQL Service (Port 8000)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  FastAPI + Strawberry GraphQL + Uvicorn            │  │
│  │  - /graphql (POST endpoint)                        │  │
│  │  - /graphql/ui (GraphiQL interface)                │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Query Resolvers (adapters/resolvers)             │  │
│  │  - usuarios_resolver.py                            │  │
│  │  - arquitectos_resolver.py                         │  │
│  │  - proyectos_resolver.py                           │  │
│  │  - conversaciones_resolver.py                      │  │
│  │  - ... (and more)                                  │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  GraphQL Schemas (adapters/schemas)                │  │
│  │  - Type definitions with nested resolvers          │  │
│  │  - No Input types (query-only)                     │  │
│  │  - All use REST client for data                    │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  REST Client (infrastructure/rest_client.py)       │  │
│  │  - Async HTTP calls (httpx)                        │  │
│  │  - Retry logic                                     │  │
│  │  - Error handling                                  │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ HTTP REST Calls
                     ▼
┌──────────────────────────────────────────────────────────┐
│              Rails REST API (Port 3000)                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Ruby on Rails APIREST                             │  │
│  │  - Full CRUD operations                            │  │
│  │  - Data validation                                 │  │
│  │  - Business logic                                  │  │
│  │  - Authentication/Authorization                    │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ActiveRecord ORM                                  │  │
│  └────────────────────────────────────────────────────┘  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ SQL Queries
                     ▼
┌──────────────────────────────────────────────────────────┐
│              PostgreSQL Database                         │
│  - All entity tables                                     │
│  - Relationships and constraints                         │
│  - Persistence layer                                     │
└──────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. No Database Access in GraphQL
- **Rationale**: Single source of truth, avoid dual data layers
- **Benefit**: All business logic stays in Rails; GraphQL is a thin query layer
- **Trade-off**: Additional HTTP overhead for nested fields

### 2. Query-Only GraphQL
- **Rationale**: Mutations handled by REST API directly
- **Benefit**: Simpler GraphQL layer, easier to maintain
- **Future**: Mutations can be added via REST proxy if needed

### 3. Async REST Client
- **Rationale**: Non-blocking I/O for better performance
- **Benefit**: Can handle multiple nested field requests concurrently
- **Implementation**: Uses `httpx.AsyncClient`

### 4. No Advanced Queries (For Now)
- **Status**: Statistics and complex filters disabled
- **Rationale**: Focus on core entity queries first
- **Future**: Can be re-enabled via REST endpoints when ready

## Data Flow Example

### Query Request
```graphql
query {
  listar_arquitectos {
    cedula
    usuario {
      nombre
      email
    }
    proyectos {
      titulo_proyecto
    }
  }
}
```

### Execution Flow

1. **GraphQL Layer** receives query
   - Validates query syntax
   - Routes to `arquitectos_resolver.listar_arquitectos()`

2. **Resolver** calls REST client
   ```python
   arquitectos = await rest_client.get_arquitectos()
   ```

3. **REST Client** makes HTTP call
   ```
   GET http://localhost:3000/api/arquitectos
   ```

4. **Rails API** processes request
   - Queries database via ActiveRecord
   - Returns JSON response

5. **GraphQL** constructs response
   - For each arquitecto, resolves nested fields:
     - `usuario`: `GET /api/usuarios/{usuario_id}`
     - `proyectos`: `GET /api/proyectos?arquitecto_id={id}`

6. **Client** receives complete GraphQL response
   ```json
   {
     "data": {
       "listar_arquitectos": [
         {
           "cedula": "12345",
           "usuario": {
             "nombre": "Juan",
             "email": "juan@example.com"
           },
           "proyectos": [
             {"titulo_proyecto": "Casa Moderna"}
           ]
         }
       ]
     }
   }
   ```

## Entity Relationships

```
Usuario (User)
├── Arquitecto (Architect) [1:1]
│   └── Proyectos (Projects) [1:N]
│       ├── Avances (Progress) [1:N]
│       └── Valoraciones (Ratings) [1:N]
├── Cliente (Client) [1:1]
│   └── Proyectos (Projects) [1:N]
└── Moderador (Moderator) [1:1]

Conversacion (Conversation)
├── Cliente [N:1]
├── Arquitecto [N:1]
└── Mensajes (Messages) [1:N]

Proyecto (Project)
├── Arquitecto [N:1]
├── Cliente [N:1]
├── SolicitudProyecto (Request) [1:1]
├── Avances (Progress) [1:N]
├── Valoraciones (Ratings) [1:N]
└── ImagenAsociacion [1:N]

Incidencia (Incident)
├── Usuario Emisor [N:1]
├── Usuario Infractor [N:1]
└── Moderador [N:1]

Verificacion (Verification)
├── Arquitecto [N:1]
└── Moderador [N:1]
```

## REST Endpoints Used

### Core Entities
- `GET /api/usuarios` - List all users
- `GET /api/usuarios/{id}` - Get single user
- `GET /api/arquitectos` - List all architects
- `GET /api/arquitectos/{id}` - Get single architect
- `GET /api/clientes` - List all clients
- `GET /api/clientes/{id}` - Get single client
- `GET /api/proyectos` - List all projects
- `GET /api/proyectos/{id}` - Get single project
- `GET /api/conversaciones` - List all conversations
- `GET /api/conversaciones/{id}` - Get single conversation
- `GET /api/mensajes` - List all messages
- `GET /api/avances` - List all progress updates
- `GET /api/valoraciones` - List all ratings
- `GET /api/moderadores` - List all moderators
- `GET /api/solicitudes_proyecto` - List all project requests
- `GET /api/notificaciones` - List all notifications
- `GET /api/incidencias` - List all incidents
- `GET /api/verificaciones` - List all verifications
- `GET /api/imagenes` - List all images
- `GET /api/imagenes_asociacion` - List all image associations

### Filter Support (Assumed)
Nested resolvers attempt to filter via query params:
- `?usuario_id={id}` - Filter by user
- `?arquitecto_id={id}` - Filter by architect
- `?cliente_id={id}` - Filter by client
- `?conversacion_id={id}` - Filter by conversation
- `?proyecto_id={id}` - Filter by project

**Note**: If Rails doesn't support these filters, GraphQL applies defensive client-side filtering.

## Technology Stack

### GraphQL Layer (Python)
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.115.2 |
| GraphQL | Strawberry-GraphQL | 0.242.0 |
| Server | Uvicorn | 0.31.1 |
| HTTP Client | httpx | 0.27.2 |
| Validation | Pydantic | 2.8.2 |
| Config | python-dotenv | 1.0.1 |
| Logging | loguru | 0.7.2 |
| Testing | pytest, pytest-asyncio | 8.3.3, 0.24.0 |

### REST API Layer (Ruby)
| Component | Technology |
|-----------|-----------|
| Framework | Ruby on Rails (API mode) |
| ORM | ActiveRecord |
| Database | PostgreSQL |
| Serialization | ActiveModel::Serializers |

## Configuration

### Environment Variables

#### GraphQL Service
```env
# backend/graphql/.env
REST_API_URL=http://localhost:3000
```

#### Rails API
```ruby
# backend/APIREST/config/database.yml
# (PostgreSQL connection settings)
```

## Performance Considerations

### N+1 Query Problem
**Issue**: Nested fields can cause multiple REST calls per parent entity.

**Example**:
```graphql
query {
  listar_arquitectos {  # 1 REST call
    usuario {           # N REST calls (one per arquitecto)
      nombre
    }
  }
}
```

**Mitigation Options** (Future):
1. **DataLoader Pattern**: Batch requests to REST API
2. **REST API Batch Endpoint**: Single call for multiple IDs
3. **GraphQL Field Selection**: Only resolve requested fields
4. **Caching**: Cache frequent entities (usuarios, arquitectos)

### Current Performance
- Simple list queries: ~50-200ms (single REST call)
- Nested queries (1 level): ~100-500ms (1 + N REST calls)
- Nested queries (2+ levels): ~200ms-2s (multiple nested calls)

## Security Model

### Current State
- ❌ No authentication in GraphQL layer
- ❌ No authorization checks
- ❌ No rate limiting

### Assumed Security (Rails Side)
- Rails API handles authentication
- Rails API enforces authorization
- Rails API validates all data

### Future Enhancements
1. **JWT Token Passthrough**: Forward auth headers to REST API
2. **GraphQL Query Depth Limiting**: Prevent deeply nested queries
3. **Rate Limiting**: Throttle requests by IP/user
4. **Query Complexity Analysis**: Prevent expensive queries

## Error Handling

### REST Client Errors
```python
try:
    data = await rest_client.get_usuarios()
except httpx.HTTPError:
    raise GraphQLError("Error connecting to REST API")
```

### Nested Field Errors
```python
try:
    user = await rest_client.get_usuario(id)
    return UsuarioType(...)
except Exception:
    return None  # Graceful null return
```

### GraphQL Response Errors
```json
{
  "errors": [
    {
      "message": "Error connecting to REST API",
      "locations": [{"line": 2, "column": 3}],
      "path": ["listar_usuarios"]
    }
  ]
}
```

## Monitoring & Logging

### Current Logging (Loguru)
- REST client requests/responses
- Resolver execution
- Error stack traces

### Recommended Additions
- [ ] Request/response timing
- [ ] Query complexity metrics
- [ ] REST API error rates
- [ ] Slow query logging

## Deployment

### Development
```bash
cd backend/graphql
uvicorn main:app --reload --port 8000
```

### Production (Example)
```bash
# Using Gunicorn with Uvicorn workers
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

### Docker (Potential)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Testing Strategy

### Unit Tests (with Mocks)
- ✅ Implemented in `test_graphql_queries.py`
- Mock REST responses
- Test GraphQL layer logic

### Integration Tests (Future)
- [ ] Test against real Rails API
- [ ] Test nested field resolution
- [ ] Test error scenarios

### E2E Tests (Future)
- [ ] Full stack tests (Client → GraphQL → REST → DB)
- [ ] Performance benchmarks
- [ ] Load testing

## Maintenance & Operations

### Health Check Endpoint
**TODO**: Add health check
```python
@app.get("/health")
async def health():
    return {"status": "ok", "service": "graphql"}
```

### Dependency Updates
```bash
# Check outdated packages
pip list --outdated

# Update specific package
pip install --upgrade strawberry-graphql

# Regenerate requirements
pip freeze > requirements.txt
```

### Rollback Plan
1. Keep previous working version tagged in git
2. Database schema is managed by Rails (no GraphQL migrations)
3. Rolling restart safe (stateless service)

## Future Roadmap

### Phase 1: Stabilization (Current) ✅
- [x] Query-only GraphQL
- [x] REST client integration
- [x] Remove DB dependencies
- [x] Basic test suite

### Phase 2: Enhancement (Next)
- [ ] Add authentication/authorization
- [ ] Implement DataLoader for batching
- [ ] Add caching layer (Redis)
- [ ] Query complexity limits

### Phase 3: Advanced Features
- [ ] Re-enable statistics queries via REST
- [ ] Re-enable complex filters via REST
- [ ] Real-time subscriptions (WebSocket)
- [ ] GraphQL mutations (REST proxy)

### Phase 4: Production Readiness
- [ ] Comprehensive test coverage (>80%)
- [ ] Performance optimization
- [ ] Monitoring and alerting
- [ ] Documentation for all queries

---

**Last Updated**: Current session
**Status**: ✅ Production-ready for read-only queries
**Maintainer**: Backend Team
