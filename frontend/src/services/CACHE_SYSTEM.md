# 📦 Sistema de Caché con localStorage

Este sistema implementa un caché automático en localStorage para reducir llamadas repetitivas al backend.

## 🎯 Características

- ✅ **Caché automático**: Los datos se guardan automáticamente en localStorage
- ✅ **Expiración temporal**: Caché válido por 5 minutos (configurable)
- ✅ **Validación de parámetros**: Solo usa caché si los filtros/parámetros coinciden
- ✅ **Limpieza automática**: Elimina cachés antiguos cuando el storage se llena
- ✅ **Logging transparente**: Indica cuando usa caché vs. cuando consulta API
- ✅ **Soporte multi-servicio**: Funciona con REST API y GraphQL

## 📁 Estructura

```
frontend/src/
├── utils/
│   └── cacheService.ts          # Servicio centralizado de caché
├── services/
│   ├── api/
│   │   └── arquitectosService.ts # REST API con caché
│   └── graphql/
│       └── arquitectosGraphQL.ts # GraphQL con caché
```

## 🔧 Uso del CacheService

### Métodos Disponibles

```typescript
import { CacheService } from '@/utils/cacheService'

// Obtener datos del caché
const cached = CacheService.get<MiTipo>('mi_clave_cache', variables, duration)

// Guardar datos en caché
CacheService.set('mi_clave_cache', datos, variables)

// Eliminar un caché específico
CacheService.remove('mi_clave_cache')

// Limpiar todos los cachés
CacheService.clearAll()

// Limpiar cachés antiguos (>1 hora)
CacheService.clearOldCache()

// Obtener tamaño del localStorage
const size = CacheService.getStorageSize()
```

## 📊 Ejemplo: Servicio con Caché

```typescript
import { CacheService } from '../../utils/cacheService'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

class MiServicio {
  async getData(filters?: any): Promise<any> {
    // 1. Intentar obtener del caché
    const cacheKey = 'mi_servicio_data_cache'
    const cached = CacheService.get(cacheKey, filters, CACHE_DURATION)
    
    if (cached) {
      console.log('📦 Usando datos desde caché')
      return cached
    }

    // 2. Si no hay caché, consultar API
    console.log('🌐 Obteniendo datos desde API')
    const response = await api.get('/endpoint', { params: filters })
    
    // 3. Guardar en caché
    CacheService.set(cacheKey, response.data, filters)
    
    return response.data
  }

  // Método para limpiar caché manualmente
  clearCache(): void {
    CacheService.remove('mi_servicio_data_cache')
  }
}
```

## 🏗️ Servicios Implementados

### 1. ArquitectosService (REST API)

```typescript
import arquitectosService from '@/services/api/arquitectosService'

// Obtener todos (con caché)
const { arquitectos } = await arquitectosService.getAll()

// Obtener por ID (con caché)
const arquitecto = await arquitectosService.getById('123')

// Obtener verificados (con caché)
const verificados = await arquitectosService.getVerificados()

// Buscar (con caché)
const results = await arquitectosService.search('arquitecto moderno')

// Limpiar caché
arquitectosService.clearCache()
```

**Claves de caché:**
- `arquitectos_all_cache` - Lista completa con filtros
- `arquitecto_{id}_cache` - Arquitecto individual
- `arquitectos_verificados_cache` - Solo verificados
- `arquitectos_search_cache` - Resultados de búsqueda

### 2. useBuscarArquitectos (GraphQL)

```typescript
import { useBuscarArquitectos } from '@/services/graphql/arquitectosGraphQL'

function MiComponente() {
  const { data, loading, error, refetch } = useBuscarArquitectos({
    especialidad: 'moderno',
    limite: 20
  })

  // Refetch limpia el caché y consulta de nuevo
  const handleRefresh = () => refetch()

  return (
    <div>
      {loading ? 'Cargando...' : data?.buscarArquitectos.map(...)}
      <button onClick={handleRefresh}>Refrescar</button>
    </div>
  )
}
```

**Clave de caché:**
- `arquitectos_graphql_cache` - Query de búsqueda con variables

## ⏱️ Duración del Caché

Por defecto: **5 minutos** (300,000 ms)

```typescript
const CACHE_DURATION = 5 * 60 * 1000

// Para cambiar la duración:
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutos
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutos
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora
```

## 🔄 Comportamiento de Caché

### Cuándo USA el caché:
- ✅ Navegas entre páginas (Home ↔ FindArchitects)
- ✅ Recargas la página (dentro de los 5 minutos)
- ✅ Los filtros/parámetros son idénticos
- ✅ El caché no ha expirado

### Cuándo CONSULTA la API:
- ❌ Primera vez que se carga la página
- ❌ Han pasado más de 5 minutos
- ❌ Cambias los filtros de búsqueda
- ❌ Llamas a `refetch()` manualmente
- ❌ Llamas a `clearCache()`

## 📝 Logging en Consola

El sistema muestra mensajes claros en la consola:

```
📦 Usando datos de arquitectos desde caché
🌐 Obteniendo arquitectos desde API REST
📦 Guardando arquitectos de GraphQL en caché
🔄 Limpiando caché y refrescando datos de GraphQL
```

## 🗑️ Limpieza de Caché

### Manual
```typescript
// Limpiar servicio específico
arquitectosService.clearCache()

// Limpiar todos los cachés
CacheService.clearAll()
```

### Automática
- Cachés expirados se eliminan al intentar acceder
- Si localStorage se llena, se limpian cachés >1 hora automáticamente

## 💾 Límites de localStorage

- **Tamaño máximo**: ~5-10 MB (varía por navegador)
- **Manejo de cuota**: Limpieza automática al superar límite
- **Keys format**: `{servicio}_{tipo}_cache`

## 🔒 Consideraciones de Seguridad

- ⚠️ **NO guardar datos sensibles** (tokens, passwords)
- ⚠️ **NO guardar datos privados de usuarios** sin encriptar
- ✅ **OK para datos públicos** (lista de arquitectos, proyectos)
- ✅ **OK para datos de solo lectura** (búsquedas, catálogos)

## 🧪 Testing

```typescript
// Verificar que el caché funciona
localStorage.clear() // Limpiar todo
await arquitectosService.getAll() // Primera llamada (API)
await arquitectosService.getAll() // Segunda llamada (caché)

// Verificar expiración
const CACHE_DURATION = 1000 // 1 segundo para pruebas
await service.getData()
await new Promise(r => setTimeout(r, 1100))
await service.getData() // Debe consultar API de nuevo
```

## 📈 Beneficios

1. **Reducción de carga en servidor**: Menos requests HTTP/GraphQL
2. **Mejor rendimiento**: Respuesta instantánea desde localStorage
3. **Mejor UX**: Navegación fluida sin esperas
4. **Menor consumo de datos**: Ideal para móviles
5. **Offline-ready**: Datos disponibles aunque el servidor no responda

## 🚀 Próximas Mejoras

- [ ] Soporte para Service Workers (caché offline real)
- [ ] Compresión de datos con LZ-String
- [ ] Sincronización entre pestañas
- [ ] Caché selectivo por usuario
- [ ] Métricas de hit/miss ratio

---

**Versión**: 1.0  
**Última actualización**: 31 de Octubre, 2025
