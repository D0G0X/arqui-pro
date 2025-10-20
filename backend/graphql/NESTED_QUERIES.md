# 🔗 Queries con Relaciones - GraphQL

Este archivo contiene ejemplos de queries que aprovechan las **relaciones entre entidades** implementadas.

---

## 📋 Relaciones Implementadas

### Usuario → Arquitecto/Cliente/Moderador
Un usuario puede tener un perfil de arquitecto, cliente o moderador.

**Campos expuestos en GraphQL:**
- ✅ `id`, `nombre`, `apellido`, `email`, `rol`, `estado_cuenta`, `fecha_registro`, `foto_perfil`
- 🔒 **NO expuestos por seguridad:** `encrypted_password`, `jti` (JWT ID), `remember_created_at`

### Arquitecto → Usuario + Proyectos
Un arquitecto tiene un usuario base y puede tener múltiples proyectos.

### Cliente → Usuario
Un cliente tiene un usuario base.

### Proyecto → Arquitecto + Cliente + Avances + Valoraciones
Un proyecto pertenece a un arquitecto, puede tener un cliente, y tiene avances y valoraciones.

### Conversación → Cliente + Arquitecto + Mensajes
Una conversación es entre un cliente y un arquitecto, y contiene mensajes.

---

## 🎯 Ejemplos de Queries Anidadas

### 1. Obtener Usuario con su perfil (Arquitecto/Cliente/Moderador)

```graphql
query ObtenerUsuarioCompleto {
  listarUsuarios {
    id
    nombre
    apellido
    email
    rol
    
    # Si es arquitecto, obtener su perfil
    arquitecto {
      id
      cedula
      descripcion
      especialidades
      verificado
    }
    
    # Si es cliente, obtener su perfil
    cliente {
      id
      cedula
    }
    
    # Si es moderador, obtener su perfil
    moderador {
      id
    }
  }
}
```

### 2. Obtener Arquitecto con su Usuario y Proyectos

```graphql
query ArquitectoCompleto($id: ID!) {
  obtenerArquitecto(id: $id) {
    id
    cedula
    descripcion
    especialidades
    ubicacion
    verificado
    valoracion_prom_proyecto
    
    # Usuario base del arquitecto
    usuario {
      id
      nombre
      apellido
      email
      foto_perfil
    }
    
    # Todos los proyectos del arquitecto
    proyectos {
      id
      titulo_proyecto
      descripcion
      tipo_proyecto
      fecha_publicacion
      valoracion_promedio
    }
  }
}
```

### 3. Obtener Proyecto con Arquitecto, Avances y Valoraciones

```graphql
query ProyectoCompleto($id: ID!) {
  obtenerProyecto(id: $id) {
    id
    titulo_proyecto
    descripcion
    tipo_proyecto
    fecha_publicacion
    valoracion_promedio
    
    # Arquitecto que creó el proyecto
    arquitecto {
      id
      cedula
      descripcion
      especialidades
      
      # Usuario del arquitecto
      usuario {
        nombre
        apellido
        email
        foto_perfil
      }
    }
    
    # Cliente del proyecto (si existe)
    cliente {
      id
      cedula
      usuario {
        nombre
        apellido
        email
      }
    }
    
    # Avances del proyecto
    avances {
      id
      descripcion
      fecha
    }
    
    # Valoraciones del proyecto
    valoraciones {
      id
      calificacion
      comentario
      fecha
    }
  }
}
```

### 4. Obtener Conversación con Cliente, Arquitecto y Mensajes

```graphql
query ConversacionCompleta($id: ID!) {
  obtenerConversacion(id: $id) {
    id
    fecha
    
    # Cliente de la conversación
    cliente {
      id
      cedula
      usuario {
        nombre
        apellido
        foto_perfil
      }
    }
    
    # Arquitecto de la conversación
    arquitecto {
      id
      cedula
      descripcion
      usuario {
        nombre
        apellido
        foto_perfil
      }
    }
    
    # Mensajes de la conversación (ordenados por fecha)
    mensajes {
      id
      contenido
      fecha_envio
      leido
      remitente_id
    }
  }
}
```

### 5. Listar todos los Arquitectos con sus Proyectos

```graphql
query TodosLosArquitectos {
  listarArquitectos {
    id
    cedula
    descripcion
    especialidades
    verificado
    valoracion_prom_proyecto
    
    usuario {
      nombre
      apellido
      email
      foto_perfil
    }
    
    proyectos {
      id
      titulo_proyecto
      tipo_proyecto
      valoracion_promedio
      fecha_publicacion
    }
  }
}
```

### 6. Listar Proyectos con todos sus detalles anidados

```graphql
query TodosLosProyectosCompletos {
  listarProyectos {
    id
    titulo_proyecto
    descripcion
    tipo_proyecto
    valoracion_promedio
    
    arquitecto {
      cedula
      usuario {
        nombre
        apellido
      }
    }
    
    avances {
      id
      descripcion
      fecha
    }
    
    valoraciones {
      id
      calificacion
      comentario
      fecha
    }
  }
}
```

### 7. Query para Dashboard de Arquitecto

```graphql
query DashboardArquitecto($arquitectoId: ID!) {
  obtenerArquitecto(id: $arquitectoId) {
    id
    cedula
    descripcion
    especialidades
    ubicacion
    verificado
    valoracion_prom_proyecto
    vistas_perfil
    
    usuario {
      nombre
      apellido
      email
      foto_perfil
      estado_cuenta
    }
    
    proyectos {
      id
      titulo_proyecto
      tipo_proyecto
      valoracion_promedio
      fecha_publicacion
      
      avances {
        id
        descripcion
        fecha
      }
      
      valoraciones {
        id
        calificacion
        comentario
      }
    }
  }
}
```

### 8. Query para perfil público de Arquitecto

```graphql
query PerfilPublicoArquitecto($arquitectoId: ID!) {
  obtenerArquitecto(id: $arquitectoId) {
    cedula
    descripcion
    especialidades
    ubicacion
    verificado
    valoracion_prom_proyecto
    
    usuario {
      nombre
      apellido
      foto_perfil
    }
    
    # Solo proyectos de portafolio (públicos)
    proyectos {
      id
      titulo_proyecto
      descripcion
      tipo_proyecto
      fecha_publicacion
      valoracion_promedio
      
      valoraciones {
        calificacion
        comentario
        fecha
      }
    }
  }
}
```

### 9. Listar Conversaciones de un Usuario con Mensajes

```graphql
query ConversacionesDeUsuario {
  listarConversaciones {
    id
    fecha
    
    cliente {
      usuario {
        nombre
        foto_perfil
      }
    }
    
    arquitecto {
      usuario {
        nombre
        foto_perfil
      }
    }
    
    mensajes {
      id
      contenido
      fecha_envio
      leido
    }
  }
}
```

### 10. Query combinada: Usuario completo con todo

```graphql
query UsuarioConTodo($id: ID!) {
  obtenerUsuario(id: $id) {
    id
    nombre
    apellido
    email
    rol
    estado_cuenta
    fecha_registro
    foto_perfil
    
    arquitecto {
      id
      cedula
      descripcion
      especialidades
      ubicacion
      verificado
      valoracion_prom_proyecto
      
      proyectos {
        id
        titulo_proyecto
        tipo_proyecto
        valoracion_promedio
        
        avances {
          descripcion
          fecha
        }
        
        valoraciones {
          calificacion
          comentario
        }
      }
    }
    
    cliente {
      id
      cedula
    }
    
    moderador {
      id
    }
  }
}
```

---

## 💡 Ventajas de las Relaciones

1. **Una sola query** en lugar de múltiples llamadas
2. **Menos tráfico de red** y latencia reducida
3. **Datos relacionados** cargados de forma eficiente
4. **Flexibilidad**: pide solo lo que necesitas
5. **Queries complejas** sin necesidad de endpoints especiales

---

## ⚠️ Consideraciones

- Las relaciones se resuelven de forma **lazy** (solo cuando las pides)
- Evita queries muy anidadas en producción (pueden ser lentas)
- Para optimizar, considera implementar **DataLoaders** en el futuro

### 🔒 Seguridad y Privacidad

**Campos sensibles NO expuestos en GraphQL:**
- `encrypted_password` - Hash del password (solo en BD)
- `jti` - JWT ID - Identificador único de token (solo en BD)
- `remember_created_at` - Timestamp interno (solo en BD)

**Para crear usuarios, usa:**
```graphql
mutation {
  crearUsuario(input: {
    nombre: "Juan"
    apellido: "Pérez"
    email: "juan@example.com"
    password: "mi_password_texto_plano"  # Se encripta internamente
    rol: "cliente"
    estado_cuenta: "activo"
  }) {
    id
    nombre
    email
    rol
  }
}
```

El campo `password` en el input se convierte internamente a `encrypted_password` (hasheado con BCrypt en producción).

---

## 🚀 Próximos pasos

1. Probar estas queries en GraphiQL: http://127.0.0.1:8000/graphql/ui
2. Implementar DataLoaders para optimizar N+1 queries
3. Agregar paginación en listas grandes
4. Agregar filtros (ej: `proyectos(tipo: "portafolio")`)
