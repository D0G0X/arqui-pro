# 📊 Queries de Agregación y Estadísticas - GraphQL

Este archivo contiene ejemplos de queries para **reportes, estadísticas y dashboards**.

---

## 🎯 Queries Disponibles

### 1. Estadísticas Generales del Sistema

```graphql
query EstadisticasGenerales {
  estadisticasGenerales {
    totalUsuarios
    totalArquitectos
    totalClientes
    totalModeradores
    totalProyectos
    totalConversaciones
    totalValoraciones
  }
}
```

**Uso:** Dashboard principal, métricas globales del sistema.

---

### 2. Estadísticas de Arquitectos

```graphql
query EstadisticasArquitectos {
  estadisticasArquitectos {
    total
    verificados
    noVerificados
    promedioValoracion
    conProyectos
    sinProyectos
  }
}
```

**Uso:** Análisis de arquitectos registrados, verificación y actividad.

---

### 3. Estadísticas de Proyectos

```graphql
query EstadisticasProyectos {
  estadisticasProyectos {
    total
    portafolio
    contratados
    promedioValoracion
    totalAvances
    totalValoraciones
  }
}
```

**Uso:** Métricas de proyectos, tipos y engagement.

---

### 4. Proyectos Agrupados por Tipo

```graphql
query ProyectosPorTipo {
  proyectosPorTipo {
    tipo
    cantidad
    promedioValoracion
  }
}
```

**Uso:** Gráficos de distribución de proyectos por tipo (portafolio vs contratado).

---

### 5. Top Arquitectos por Valoración

```graphql
query TopArquitectos {
  topArquitectos(limit: 10) {
    id
    nombre
    apellido
    cedula
    promedioValoracion
    totalProyectos
    verificado
  }
}
```

**Variables:**
```json
{
  "limit": 10
}
```

**Uso:** Ranking de mejores arquitectos, destacados en homepage.

---

### 6. Proyectos Más Recientes

```graphql
query ProyectosRecientes {
  proyectosRecientes(limit: 5) {
    id
    titulo
    tipo
    fechaPublicacion
    valoracionPromedio
    nombreArquitecto
  }
}
```

**Uso:** Feed de actividad reciente, "Últimos proyectos publicados".

---

### 7. Dashboard Completo (Todas las Métricas)

```graphql
query DashboardCompleto {
  dashboardMetricas {
    # Estadísticas generales
    generales {
      totalUsuarios
      totalArquitectos
      totalClientes
      totalModeradores
      totalProyectos
      totalConversaciones
      totalValoraciones
    }
    
    # Estadísticas de arquitectos
    arquitectos {
      total
      verificados
      noVerificados
      promedioValoracion
      conProyectos
      sinProyectos
    }
    
    # Estadísticas de proyectos
    proyectos {
      total
      portafolio
      contratados
      promedioValoracion
      totalAvances
      totalValoraciones
    }
    
    # Top 5 arquitectos
    topArquitectos {
      id
      nombre
      apellido
      cedula
      promedioValoracion
      totalProyectos
      verificado
    }
    
    # Últimos 5 proyectos
    proyectosRecientes {
      id
      titulo
      tipo
      fechaPublicacion
      valoracionPromedio
      nombreArquitecto
    }
  }
}
```

**Uso:** Dashboard administrativo completo con una sola query.

---

## 💡 Casos de Uso

### Dashboard Administrativo
- Usa `dashboardMetricas` para obtener todas las métricas en una sola llamada
- Muestra contadores, gráficos y rankings

### Homepage Pública
- Usa `topArquitectos` para destacar los mejores arquitectos
- Usa `proyectosRecientes` para mostrar actividad reciente

### Panel de Reportes
- Combina `estadisticasGenerales`, `estadisticasArquitectos` y `estadisticasProyectos`
- Usa `proyectosPorTipo` para gráficos de distribución

### Búsqueda y Filtros
- Usa `topArquitectos` con diferentes límites
- Filtra por `verificado` en el frontend

---

## 📈 Ejemplo: Dashboard con Gráficos

```graphql
query DashboardVisual {
  # Para gráfico de dona: Distribución de usuarios
  estadisticasGenerales {
    totalArquitectos
    totalClientes
    totalModeradores
  }
  
  # Para gráfico de barras: Proyectos por tipo
  proyectosPorTipo {
    tipo
    cantidad
    promedioValoracion
  }
  
  # Para tabla de ranking
  topArquitectos(limit: 10) {
    nombre
    apellido
    promedioValoracion
    totalProyectos
    verificado
  }
  
  # Para línea de tiempo
  proyectosRecientes(limit: 20) {
    titulo
    fechaPublicacion
    valoracionPromedio
  }
}
```

---

## ⚡ Ventajas

1. **Una sola query** para dashboard completo
2. **Datos agregados** calculados en la base de datos (eficiente)
3. **Flexible** - pide solo las estadísticas que necesitas
4. **Optimizado** - usa funciones SQL (COUNT, AVG, GROUP BY)
5. **Tiempo real** - siempre datos actuales

---

## 🚀 Próximos pasos

1. Agregar filtros por fecha (estadísticas de último mes, año, etc.)
2. Implementar caché para queries frecuentes
3. Agregar más agregaciones (mediana, percentiles, etc.)
4. Exportar reportes a CSV/PDF
