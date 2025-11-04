# Backend GraphQL - Implementación Requerida para Módulo Moderador

## 📋 Resumen

El frontend del módulo Moderador está completo y listo. Ahora se requiere implementar los resolvers de GraphQL en el backend para que las queries funcionen correctamente.

---

## 🔧 Resolvers a Implementar

### 1. Query: `verificaciones`

**Ubicación**: `backend/graphql/queries/moderador/get_verificaciones.py`

**Signature**:
```python
async def verificaciones(
    info: Info,
    estado: Optional[str] = None,
    limite: int = 10,
    offset: int = 0
) -> List[Dict[str, Any]]:
    """
    Obtiene lista de verificaciones de arquitectos con paginación y filtros
    
    Args:
        estado: 'pendiente' | 'aprobado' | 'rechazado' | None (todos)
        limite: Número de resultados por página (default 10)
        offset: Desplazamiento para paginación (default 0)
    
    Returns:
        Lista de verificaciones con arquitecto y moderador anidados
    """
```

**Estructura de Respuesta Esperada**:
```json
[
  {
    "id": 1,
    "arquitectoId": 123,
    "fechaSolicitud": "2024-01-15T10:30:00Z",
    "fechaResolucion": null,
    "estado": "pendiente",
    "moderadorId": null,
    "comentarios": "Solicitud inicial de verificación",
    "arquitecto": {
      "id": 123,
      "cedula": "1234567890",
      "usuario": {
        "nombre": "Juan",
        "apellido": "Pérez",
        "email": "juan@example.com"
      }
    },
    "moderador": null
  }
]
```

**Llamadas REST Requeridas**:
```python
# Obtener verificaciones desde REST API
verificaciones_data = await rest_client.get("/api/verificaciones", params={
    "estado": estado,
    "limite": limite,
    "offset": offset
})

# Para cada verificación, obtener arquitecto y moderador
for verif in verificaciones_data:
    arquitecto = await rest_client.get(f"/api/arquitectos/{verif['arquitecto_id']}")
    if verif['moderador_id']:
        moderador = await rest_client.get(f"/api/moderadores/{verif['moderador_id']}")
```

**Optimización**: Usar batch loading si hay muchas verificaciones (similar al fix de N+1 queries de arquitectos).

---

### 2. Query: `incidencias`

**Ubicación**: `backend/graphql/queries/moderador/get_incidencias.py`

**Signature**:
```python
async def incidencias(
    info: Info,
    estado: Optional[str] = None,
    limite: int = 10,
    offset: int = 0
) -> List[Dict[str, Any]]:
    """
    Obtiene lista de incidencias con paginación y filtros
    
    Args:
        estado: 'pendiente' | 'en_revision' | 'resuelto' | 'rechazado' | None
        limite: Número de resultados por página (default 10)
        offset: Desplazamiento para paginación (default 0)
    
    Returns:
        Lista de incidencias con emisor, infractor y moderador anidados
    """
```

**Estructura de Respuesta Esperada**:
```json
[
  {
    "id": 1,
    "descripcion": "Contenido inapropiado en proyecto",
    "estado": "pendiente",
    "fechaCreacion": "2024-01-15T14:20:00Z",
    "fechaResolucion": null,
    "emisorId": 456,
    "infractorId": 789,
    "moderadorId": null,
    "emisor": {
      "nombre": "María",
      "apellido": "García"
    },
    "infractor": {
      "nombre": "Pedro",
      "apellido": "López"
    },
    "moderador": null
  }
]
```

**Llamadas REST Requeridas**:
```python
# Obtener incidencias
incidencias_data = await rest_client.get("/api/incidencias", params={
    "estado": estado,
    "limite": limite,
    "offset": offset
})

# Batch loading de usuarios
usuario_ids = set()
for inc in incidencias_data:
    usuario_ids.add(inc['emisor_id'])
    usuario_ids.add(inc['infractor_id'])
    if inc['moderador_id']:
        usuario_ids.add(inc['moderador_id'])

usuarios = await rest_client.get("/api/usuarios", params={
    "ids": list(usuario_ids)
})

# Mapear usuarios a incidencias
usuarios_dict = {u['id']: u for u in usuarios}
for inc in incidencias_data:
    inc['emisor'] = usuarios_dict.get(inc['emisor_id'])
    inc['infractor'] = usuarios_dict.get(inc['infractor_id'])
    if inc['moderador_id']:
        inc['moderador'] = usuarios_dict.get(inc['moderador_id'])
```

---

### 3. Query: `kpisPlataforma` (YA EXISTE - VERIFICAR)

**Ubicación**: Probablemente ya implementado

**Verificar que retorna**:
```json
{
  "totalUsuarios": 1580,
  "totalProyectos": 892,
  "arquitectosVerificados": 156,
  "totalIncidencias": 23
}
```

Si no existe o tiene diferente estructura, actualizar para incluir estos campos.

---

## 📝 Registrar Resolvers

### Archivo: `backend/graphql/adapters/resolvers/query_resolver.py`

Agregar los nuevos resolvers:

```python
from queries.moderador.get_verificaciones import verificaciones
from queries.moderador.get_incidencias import incidencias

@strawberry.type
class Query:
    # ... resolvers existentes ...
    
    # Resolvers de Moderador
    verificaciones: list[strawberry.Private[dict]] = strawberry.field(
        resolver=verificaciones,
        description="Obtiene lista de verificaciones de arquitectos con filtros"
    )
    
    incidencias: list[strawberry.Private[dict]] = strawberry.field(
        resolver=incidencias,
        description="Obtiene lista de incidencias con filtros"
    )
```

---

## 🛣️ REST API Endpoints Requeridos

El backend Rails debe exponer estos endpoints (si no existen):

### Verificaciones

```ruby
# GET /api/verificaciones
# Params: estado, limite, offset
# Response: Array de verificaciones

# POST /api/verificaciones/:id/aprobar
# Body: { moderador_id, comentarios }
# Response: Verificacion actualizada

# POST /api/verificaciones/:id/rechazar
# Body: { moderador_id, motivo }
# Response: Verificacion actualizada
```

### Incidencias

```ruby
# GET /api/incidencias
# Params: estado, limite, offset
# Response: Array de incidencias

# POST /api/incidencias/:id/resolver
# Body: { moderador_id, resolucion }
# Response: Incidencia actualizada

# POST /api/incidencias/:id/rechazar
# Body: { moderador_id, motivo }
# Response: Incidencia actualizada
```

### Usuarios (para batch loading)

```ruby
# GET /api/usuarios
# Params: ids[] (array de IDs)
# Response: Array de usuarios filtrados por IDs
```

---

## 🗂️ Estructura de Archivos Backend

```
backend/
└── graphql/
    ├── queries/
    │   └── moderador/
    │       ├── __init__.py
    │       ├── get_verificaciones.py  ← CREAR
    │       └── get_incidencias.py     ← CREAR
    └── adapters/
        └── resolvers/
            └── query_resolver.py      ← MODIFICAR
```

---

## 📊 Ejemplo de Implementación: get_verificaciones.py

```python
from typing import Optional, List, Dict, Any
from strawberry.types import Info
from infrastructure.rest_client import RestClient

async def verificaciones(
    info: Info,
    estado: Optional[str] = None,
    limite: int = 10,
    offset: int = 0
) -> List[Dict[str, Any]]:
    """
    Resolver para obtener verificaciones de arquitectos
    """
    rest_client = RestClient()
    
    # Construir params
    params = {
        "limite": limite,
        "offset": offset
    }
    if estado:
        params["estado"] = estado
    
    # Llamada REST
    try:
        verificaciones_data = await rest_client.get(
            "/api/verificaciones",
            params=params
        )
        
        # Obtener arquitectos (batch loading)
        arquitecto_ids = [v['arquitecto_id'] for v in verificaciones_data]
        arquitectos_data = await rest_client.get(
            "/api/arquitectos",
            params={"ids": arquitecto_ids}
        )
        arquitectos_dict = {a['id']: a for a in arquitectos_data}
        
        # Obtener moderadores (batch loading)
        moderador_ids = [v['moderador_id'] for v in verificaciones_data if v['moderador_id']]
        moderadores_data = []
        if moderador_ids:
            moderadores_data = await rest_client.get(
                "/api/moderadores",
                params={"ids": moderador_ids}
            )
        moderadores_dict = {m['id']: m for m in moderadores_data}
        
        # Construir response con nombres en camelCase
        result = []
        for verif in verificaciones_data:
            arquitecto = arquitectos_dict.get(verif['arquitecto_id'])
            moderador = moderadores_dict.get(verif['moderador_id']) if verif['moderador_id'] else None
            
            result.append({
                "id": verif['id'],
                "arquitectoId": verif['arquitecto_id'],
                "fechaSolicitud": verif['fecha_solicitud'],
                "fechaResolucion": verif.get('fecha_resolucion'),
                "estado": verif['estado'],
                "moderadorId": verif.get('moderador_id'),
                "comentarios": verif.get('comentarios'),
                "arquitecto": {
                    "id": arquitecto['id'],
                    "cedula": arquitecto['cedula'],
                    "usuario": {
                        "nombre": arquitecto['usuario']['nombre'],
                        "apellido": arquitecto['usuario']['apellido'],
                        "email": arquitecto['usuario']['email']
                    }
                } if arquitecto else None,
                "moderador": {
                    "nombre": moderador['usuario']['nombre'],
                    "apellido": moderador['usuario']['apellido']
                } if moderador else None
            })
        
        return result
        
    except Exception as e:
        print(f"Error en resolver verificaciones: {str(e)}")
        raise Exception(f"Error al obtener verificaciones: {str(e)}")
```

---

## 🧪 Testing con GraphQL Playground

Una vez implementados los resolvers, probar en `http://localhost:8000/graphql`:

### Test 1: Obtener todas las verificaciones
```graphql
query {
  verificaciones(limite: 5) {
    id
    estado
    fechaSolicitud
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

### Test 2: Filtrar verificaciones pendientes
```graphql
query {
  verificaciones(estado: "pendiente", limite: 10) {
    id
    estado
    comentarios
    arquitecto {
      usuario {
        nombre
      }
    }
  }
}
```

### Test 3: Obtener incidencias
```graphql
query {
  incidencias(limite: 5) {
    id
    descripcion
    estado
    fechaCreacion
    emisor {
      nombre
      apellido
    }
    infractor {
      nombre
      apellido
    }
  }
}
```

---

## ⚡ Optimizaciones Recomendadas

### 1. Batch Loading (Evitar N+1 Queries)
- Similar al fix implementado en `buscar_arquitectos`
- Cargar todos los arquitectos/usuarios relacionados de una vez
- Usar diccionarios para mapeo rápido

### 2. Caching
```python
from functools import lru_cache
from datetime import datetime, timedelta

# Cache de usuarios por 5 minutos
@lru_cache(maxsize=1000)
def get_usuario_cached(usuario_id: int, timestamp: int):
    # timestamp se usa para invalidar cache cada 5 min
    return rest_client.get(f"/api/usuarios/{usuario_id}")

# Uso:
current_timestamp = int(datetime.now().timestamp() / 300)  # Cada 5 min
usuario = get_usuario_cached(user_id, current_timestamp)
```

### 3. Índices en Base de Datos
Asegurarse de que existan índices en:
- `verificaciones.estado`
- `verificaciones.arquitecto_id`
- `verificaciones.moderador_id`
- `incidencias.estado`
- `incidencias.emisor_id`
- `incidencias.infractor_id`

---

## 📋 Checklist de Implementación

### Backend GraphQL
- [ ] Crear `backend/graphql/queries/moderador/__init__.py`
- [ ] Implementar `get_verificaciones.py`
- [ ] Implementar `get_incidencias.py`
- [ ] Registrar resolvers en `query_resolver.py`
- [ ] Probar queries en GraphQL Playground

### Backend REST
- [ ] Crear `VerificacionesController` en Rails
- [ ] Crear `IncidenciasController` en Rails
- [ ] Implementar endpoints GET con filtros y paginación
- [ ] Implementar endpoints POST para acciones (aprobar/rechazar/resolver)
- [ ] Agregar rutas en `config/routes.rb`
- [ ] Probar endpoints con Postman o curl

### Validaciones
- [ ] Verificar que `kpisPlataforma` existe y retorna datos correctos
- [ ] Validar que estados de verificaciones coinciden: pendiente/aprobado/rechazado
- [ ] Validar que estados de incidencias coinciden: pendiente/en_revision/resuelto/rechazado
- [ ] Probar paginación (limite y offset funcionan correctamente)
- [ ] Probar filtros por estado

### Integración
- [ ] Frontend conecta correctamente con GraphQL
- [ ] Dashboard muestra estadísticas reales
- [ ] Tabla de Verificaciones carga datos
- [ ] Tabla de Incidencias carga datos
- [ ] Filtros funcionan en ambas tablas
- [ ] Paginación funciona correctamente

---

## 🚨 Errores Comunes y Soluciones

### Error: "Cannot query field 'verificaciones' on type 'Query'"
- **Causa**: Resolver no registrado en `query_resolver.py`
- **Solución**: Agregar el resolver en la clase Query

### Error: "Expected type 'String', found 'pendiente'"
- **Causa**: Enum no definido en schema de Strawberry
- **Solución**: Definir enum o usar String para estado

### Error: REST API retorna 404
- **Causa**: Endpoint no existe en Rails
- **Solución**: Implementar controller y agregar ruta

### Error: Datos retornan pero frontend muestra undefined
- **Causa**: Nombres de campos no coinciden (snake_case vs camelCase)
- **Solución**: Transformar nombres en el resolver de GraphQL

---

## 📞 Soporte

Si hay dudas sobre la implementación:
1. Revisar el resolver de `buscar_arquitectos` como referencia (usa batch loading)
2. Revisar `N_PLUS_ONE_QUERY_FIX.md` para entender el patrón de optimización
3. Consultar documentación de Strawberry GraphQL: https://strawberry.rocks/

---

**Prioridad**: 🔴 ALTA - El frontend está listo y esperando estos resolvers
**Tiempo Estimado**: 4-6 horas para implementación completa
**Dependencias**: REST API debe tener los endpoints básicos primero
