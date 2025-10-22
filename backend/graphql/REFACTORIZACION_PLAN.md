# Plan de Refactorización GraphQL → GraphQL + REST

## 🎯 Objetivo

Transformar el servicio GraphQL actual para que:
- **Solo tenga queries** (consultas de información agregada, métricas, búsquedas complejas)
- **Use el API REST** de Rails para obtener datos base mediante HTTP
- **NO tenga mutaciones** (CRUD se hace directamente en REST)

Según la imagen propuesta, GraphQL se enfoca en:
1. **Consultas de Información Agregada** (queries que combinan múltiples entidades)
2. **Consultas de Análisis y Métricas** (estadísticas, KPIs, reportes)
3. **Consultas de Búsqueda Avanzada** (filtros complejos, búsquedas parametrizadas)

---

## 📊 Arquitectura Nueva

```
Frontend
    ↓
    ├─→ API REST (Rails)     [CRUD: Crear, Actualizar, Eliminar]
    └─→ GraphQL (Python)     [Consultas complejas, agregaciones, búsqueda]
          ↓
          └─→ API REST (HTTP Client)  [Obtener datos base]
```

### Flujo de datos:
1. Frontend necesita crear/editar/eliminar → **POST/PUT/DELETE a Rails REST**
2. Frontend necesita consultas complejas → **GraphQL query**
3. GraphQL necesita datos → **HTTP GET al Rails REST**

---

## 🔧 Cambios Técnicos

### 1. Infraestructura Layer

**Antes:**
```
infrastructure/
├── database.py           # SQLAlchemy async engine
├── orm/                  # Modelos SQLAlchemy
└── repositories/         # Repositories con queries SQL
```

**Después:**
```
infrastructure/
├── rest_client.py        # Cliente HTTP (httpx)
├── database.py           # (mantener solo para queries complejas si es necesario)
└── orm/                  # (opcional: para queries agregadas directas a BD)
```

**✅ Ya creado**: `infrastructure/rest_client.py`

### 2. Use Cases Layer

**Antes:**
```python
# usuario_use_case.py
async def listar_usuarios(self):
    return await self.repo.get_all()

async def crear_usuario(self, datos):
    return await self.repo.create(datos)
```

**Después (opción A - Usar REST):**
```python
# usuario_use_case.py
from infrastructure.rest_client import rest_client

async def listar_usuarios(self):
    return await rest_client.get_usuarios()

# No hay create/update/delete - se hace en REST directamente
```

**Después (opción B - Para queries complejas):**
```python
# estadisticas_use_case.py (mantener BD directa)
async def dashboard_arquitecto(self, arquitecto_id: str):
    # Aquí sí usamos BD directamente porque hacemos agregaciones complejas
    # que no están disponibles como endpoint REST
    ...
```

### 3. Resolvers (Adapters)

**Antes:**
```python
@strawberry.type
class QueryUsuario:
    @strawberry.field
    async def listar_usuarios(self) -> List[UsuarioType]:
        # Usaba repository directo a BD
        ...

@strawberry.type
class MutationUsuario:
    @strawberry.mutation
    async def crear_usuario(self, input: UsuarioInput) -> UsuarioType:
        # Mutación GraphQL
        ...
```

**Después:**
```python
@strawberry.type
class QueryUsuario:
    @strawberry.field
    async def listar_usuarios(self) -> List[UsuarioType]:
        # Usa REST client
        usuarios_data = await rest_client.get_usuarios()
        return [UsuarioType(**u) for u in usuarios_data]

# NO hay MutationUsuario - el frontend llama directamente a REST
```

### 4. Main.py

**Antes:**
```python
schema = strawberry.Schema(query=Query, mutation=Mutation)
```

**Después:**
```python
schema = strawberry.Schema(query=Query)  # Sin mutaciones
```

---

## 📋 Plan de Ejecución

### Fase 1: Preparación ✅
- [x] Crear `infrastructure/rest_client.py` con httpx
- [x] Añadir `REST_API_URL` a `.env`
- [x] Crear ejemplo de resolver refactorizado (`usuario_resolver_new.py`)

### Fase 2: Refactorizar Resolvers (Solo Queries)
Actualizar cada resolver para:
- Eliminar toda la clase `Mutation*`
- En `Query*`, reemplazar uso de `repository` por `rest_client`

**Archivos a modificar:**
```
adapters/resolvers/
├── arquitecto_resolver.py      → Solo QueryArquitecto
├── cliente_resolver.py         → Solo QueryCliente
├── proyecto_resolver.py        → Solo QueryProyecto
├── moderador_resolver.py       → Solo QueryModerador
├── conversacion_resolver.py    → Solo QueryConversacion
├── mensaje_resolver.py         → Solo QueryMensaje
├── notificacion_resolver.py    → Solo QueryNotificacion
├── solicitud_proyecto_resolver.py → Solo QuerySolicitudProyecto
├── avance_resolver.py          → Solo QueryAvance
├── incidencia_resolver.py      → Solo QueryIncidencia
├── valoracion_resolver.py      → Solo QueryValoracion
├── verificacion_resolver.py    → Solo QueryVerificacion
├── imagen_resolver.py          → Solo QueryImagen
└── imagen_asociacion_resolver.py → Solo QueryImagenAsociacion
```

**Mantener sin cambios** (ya usan BD para agregaciones):
```
├── estadisticas_resolver.py    ✅ (solo queries complejas)
└── filtros_resolver.py         ✅ (solo queries con filtros)
```

### Fase 3: Schemas (Simplificar)
- Mantener solo `*Type` (tipos de salida)
- Eliminar todos los `*Input` (ya no hay mutaciones GraphQL)

**Archivos a limpiar:**
```
adapters/schemas/
├── usuario_schema.py           → Eliminar UsuarioInput
├── arquitecto_schema.py        → Eliminar ArquitectoInput
├── cliente_schema.py           → Eliminar ClienteInput
... (para todos)
```

**Mantener sin cambios:**
```
├── estadisticas_schema.py      ✅ (solo types de salida)
└── filtros_schema.py           ✅ (inputs de filtros, NO de mutación)
```

### Fase 4: Main.py
```python
# Eliminar imports de Mutation*
from adapters.resolvers.usuario_resolver import QueryUsuario  # Sin MutationUsuario

@strawberry.type
class Query(
    QueryUsuario,
    QueryArquitecto,
    QueryCliente,
    # ... todos los Query*
    QueryEstadisticas,
    QueryFiltros,
):
    pass

# Eliminar clase Mutation completamente

schema = strawberry.Schema(query=Query)  # Sin mutation=
```

### Fase 5: Limpieza Opcional
- Considerar eliminar `application/use_cases/` si ya no se usan
- Considerar eliminar `infrastructure/repositories/` si ya no se usan
- Mantener `infrastructure/database.py` solo si queries de estadísticas/filtros lo necesitan

### Fase 6: Documentación
- Actualizar `docs/README.md` con nueva arquitectura
- Crear `docs/graphql-rest-integration.md` explicando flujo
- Actualizar queries examples en `QUERIES.md/`

---

## 🎯 Tipos de Queries según Imagen

### 1. Consultas de Información Agregada
**Propósito**: Combinar datos de múltiples entidades en vistas unificadas

**Ejemplos a implementar:**
```graphql
# Dashboard de arquitecto (proyectos + avances + valoraciones)
query {
  dashboardArquitecto(id: "uuid") {
    arquitecto { nombre, especialidades }
    proyectosActivos {
      titulo
      avances { descripcion, porcentaje }
    }
    valoracionPromedio
    estadisticas { totalProyectos, enCurso, completados }
  }
}

# Vista de proyecto completo (proyecto + cliente + arquitecto + avances + incidencias)
query {
  proyectoCompleto(id: "uuid") {
    proyecto { titulo, presupuesto, estado }
    cliente { nombre, email }
    arquitecto { nombre, cedula }
    avances { descripcion, fecha }
    incidencias { tipo, descripcion, estado }
    imagenes { url, tipo }
  }
}

# Timeline de conversación (conversación + mensajes + participantes)
query {
  conversacionCompleta(id: "uuid") {
    conversacion { titulo, fechaInicio }
    participantes { nombre, rol }
    mensajes { contenido, fecha, remitente { nombre } }
  }
}
```

**Usar BD directa** para hacer JOINs complejos o **llamar múltiples endpoints REST** y combinar.

### 2. Consultas de Análisis y Métricas
**Propósito**: KPIs, estadísticas, reportes con cálculos

**Ejemplos existentes (ya implementados):**
```graphql
query {
  estadisticas {
    totalProyectos
    totalArquitectos
    totalClientes
    proyectosPorEstado { estado, cantidad }
    valoracionPromedio
    arquitectosMejorValorados { nombre, valoracion }
  }
}
```

**Usar BD directa** con agregaciones SQL (COUNT, AVG, SUM, GROUP BY).

### 3. Consultas de Búsqueda Avanzada
**Propósito**: Filtros complejos, búsquedas parametrizadas, ordenamiento

**Ejemplos existentes (ya implementados):**
```graphql
query {
  buscarArquitectos(
    filtro: {
      especialidades: "residencial"
      ubicacion: "CDMX"
      valoracionMinima: 4.5
      verificado: true
      orden: VALORACION_DESC
    }
  ) {
    id, nombre, especialidades, valoracionPromProyecto
  }
}

query {
  busquedaGlobal(busqueda: { texto: "casa moderna", tipo: PROYECTO }) {
    ... on Proyecto { titulo, descripcion }
    ... on Arquitecto { nombre, especialidades }
  }
}
```

**Puede usar BD directa** (queries complejas con LIKE, filtros, ORDER BY) o **REST con query params** si Rails soporta filtros.

---

## 🚀 Beneficios de la Nueva Arquitectura

1. **Separación de responsabilidades**
   - REST: CRUD simple y directo
   - GraphQL: Consultas complejas y agregadas

2. **Menos duplicación**
   - No duplicamos lógica de CRUD
   - Rails maneja validaciones, autenticación, permisos

3. **Escalabilidad**
   - REST puede escalar independientemente
   - GraphQL optimizado solo para lecturas complejas

4. **Mantenibilidad**
   - Código GraphQL más simple (sin mutaciones)
   - Frontend elige REST o GraphQL según caso de uso

---

## 📝 Próximos Pasos

1. ¿Quieres que refactorice **todos los resolvers** a la vez?
2. ¿Prefieres que empiece con **uno o dos como ejemplo** y luego continúas tú?
3. ¿Necesitas que cree **queries agregadas específicas** según tu imagen?
4. ¿Quieres que **documente patrones** de cuándo usar REST vs GraphQL?

Espero tu decisión para continuar con la refactorización.
