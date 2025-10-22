# Testing Guide for GraphQL Service

## Prerequisites

1. **Install dependencies** (if not already done):
   ```bash
   cd backend/graphql
   pip install -r requirements.txt
   ```

2. **Set up environment**:
   Create `.env` file in `backend/graphql/`:
   ```env
   REST_API_URL=http://localhost:3000
   ```

## Running Tests

### Run All Tests
```bash
cd backend/graphql
pytest test_graphql_queries.py -v
```

### Run Specific Test
```bash
pytest test_graphql_queries.py::test_listar_usuarios_basic -v
```

### Run with Coverage
```bash
pytest test_graphql_queries.py --cov=adapters --cov-report=html
```

## Manual Testing with GraphiQL

### 1. Start the GraphQL Server
```bash
cd backend/graphql
uvicorn main:app --reload --port 8000
```

### 2. Open GraphiQL UI
Navigate to: http://127.0.0.1:8000/graphql/ui

### 3. Sample Queries to Test

#### Test 1: List All Users
```graphql
query {
  listar_usuarios {
    id
    nombre
    apellido
    email
    rol
    estado_cuenta
  }
}
```

#### Test 2: Get Single User
```graphql
query {
  obtener_usuario(id: "1") {
    id
    nombre
    apellido
    email
    rol
  }
}
```

#### Test 3: List Architects with Nested User
```graphql
query {
  listar_arquitectos {
    id
    cedula
    especialidades
    valoracion_prom_proyecto
    usuario {
      nombre
      apellido
      email
    }
  }
}
```

#### Test 4: Get User with Nested Architect
```graphql
query {
  obtener_usuario(id: "1") {
    id
    nombre
    rol
    arquitecto {
      cedula
      especialidades
      verificado
    }
  }
}
```

#### Test 5: Projects with Multiple Nested Fields
```graphql
query {
  listar_proyectos {
    id
    titulo_proyecto
    descripcion
    valoracion_promedio
    arquitecto {
      cedula
      usuario {
        nombre
        email
      }
    }
    cliente {
      cedula
      usuario {
        nombre
        email
      }
    }
    avances {
      descripcion
      fecha
    }
  }
}
```

#### Test 6: Conversations with Messages
```graphql
query {
  listar_conversaciones {
    id
    fecha
    cliente {
      cedula
      usuario {
        nombre
      }
    }
    arquitecto {
      cedula
      usuario {
        nombre
      }
    }
    mensajes {
      contenido
      fecha_envio
      leido
    }
  }
}
```

## Testing with cURL

### Basic Query
```bash
curl -X POST http://127.0.0.1:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ listar_usuarios { id nombre email } }"}'
```

### Query with Variables
```bash
curl -X POST http://127.0.0.1:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($id: ID!) { obtener_usuario(id: $id) { nombre email } }",
    "variables": {"id": "1"}
  }'
```

### Nested Query
```bash
curl -X POST http://127.0.0.1:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ listar_arquitectos { cedula usuario { nombre } } }"
  }'
```

## Expected Responses

### Success Response
```json
{
  "data": {
    "listar_usuarios": [
      {
        "id": "1",
        "nombre": "Juan",
        "email": "juan@example.com"
      }
    ]
  }
}
```

### Error Response (when REST API is down)
```json
{
  "errors": [
    {
      "message": "Error connecting to REST API",
      "path": ["listar_usuarios"]
    }
  ]
}
```

### Null Nested Field (when relation doesn't exist)
```json
{
  "data": {
    "obtener_usuario": {
      "id": "1",
      "nombre": "Juan",
      "arquitecto": null
    }
  }
}
```

## Troubleshooting

### Test Failures

**Issue**: `ModuleNotFoundError: No module named 'pytest'`
```bash
pip install pytest pytest-asyncio
```

**Issue**: `Connection refused to http://127.0.0.1:8000`
- Make sure GraphQL server is running
- Check port 8000 is not in use by another process

**Issue**: Tests pass but manual queries fail
- Verify REST API is running at the URL specified in `.env`
- Check REST API endpoints are accessible
- Verify data exists in the Rails database

### GraphQL Server Issues

**Issue**: `ModuleNotFoundError: No module named 'infrastructure.database'`
- This should be fixed. If you see this, verify all schemas have been updated.
- Run: `grep -r "infrastructure.database" adapters/schemas/`

**Issue**: `No REST_API_URL in environment`
```bash
# Create .env file with:
echo "REST_API_URL=http://localhost:3000" > .env
```

**Issue**: 500 errors on nested fields
- Check REST API responses for the nested resource
- Verify the Rails API supports filter parameters (e.g., `?usuario_id=1`)
- Check GraphQL logs for specific REST client errors

## Validation Checklist

Before deploying or considering the implementation complete:

- [ ] All unit tests pass (`pytest -v`)
- [ ] GraphQL server starts without errors
- [ ] GraphiQL UI loads at `/graphql/ui`
- [ ] Basic list queries work (usuarios, arquitectos, proyectos)
- [ ] Single entity queries work (obtener_usuario, obtener_arquitecto)
- [ ] Nested fields resolve correctly (usuario.arquitecto, proyecto.cliente)
- [ ] Error handling works when REST API is down
- [ ] No database imports remain in any schema files
- [ ] No Input classes remain (query-only mode verified)

## Performance Testing (Optional)

### Load Test with Apache Bench
```bash
# Install Apache Bench (ab) if needed
# Ubuntu: sudo apt-get install apache2-utils
# macOS: already installed

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 -p query.json -T application/json http://127.0.0.1:8000/graphql
```

Where `query.json` contains:
```json
{"query": "{ listar_usuarios { id nombre } }"}
```

---

**Last Updated**: Current session
**Status**: ✅ All tests implemented and passing with mocks
