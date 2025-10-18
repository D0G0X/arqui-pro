# 🧪 Pruebas GraphQL - Todas las Entidades (14/14)

## Servidor corriendo en: http://127.0.0.1:8000/graphql/ui

---

## 1️⃣ AVANCES

### Listar Avances
```graphql
query ListarAvances {
  listarAvances {
    id
    descripcion
    fecha
    proyectoId
  }
}
```

### Crear Avance
```graphql
mutation CrearAvance($input: AvanceInput!) {
  crearAvance(input: $input) {
    id
    descripcion
    fecha
    proyectoId
  }
}
```
**Variables:**
```json
{
  "input": {
    "descripcion": "Primera fase completada",
    "fecha": "2025-10-18",
    "proyectoId": "PROYECTO_ID_AQUI"
  }
}
```

---

## 2️⃣ INCIDENCIAS

### Listar Incidencias
```graphql
query ListarIncidencias {
  listarIncidencias {
    id
    descripcion
    estado
    fecha
    usuarioEmisorId
    usuarioInfractorId
    moderadorId
  }
}
```

### Crear Incidencia
```graphql
mutation CrearIncidencia($input: IncidenciaInput!) {
  crearIncidencia(input: $input) {
    id
    descripcion
    estado
    fecha
    usuarioEmisorId
    usuarioInfractorId
    moderadorId
  }
}
```
**Variables:**
```json
{
  "input": {
    "descripcion": "Reporte de conducta inapropiada",
    "estado": "pendiente",
    "fecha": "2025-10-18",
    "usuarioEmisorId": "USUARIO_ID_AQUI",
    "usuarioInfractorId": "USUARIO_ID_AQUI",
    "moderadorId": "MODERADOR_ID_AQUI"
  }
}
```

---

## 3️⃣ IMÁGENES

### Listar Imágenes
```graphql
query ListarImagenes {
  listarImagenes {
    id
    imagenUrl
    fecha
  }
}
```

### Crear Imagen
```graphql
mutation CrearImagen($input: ImagenInput!) {
  crearImagen(input: $input) {
    id
    imagenUrl
    fecha
  }
}
```
**Variables:**
```json
{
  "input": {
    "imagenUrl": "https://example.com/imagen1.jpg",
    "fecha": "2025-10-18"
  }
}
```

---

## 4️⃣ IMAGEN ASOCIACIONES

### Listar Imagen Asociaciones
```graphql
query ListarImagenAsociaciones {
  listarImagenAsociaciones {
    id
    asociableType
    asociableId
    imagenId
  }
}
```

### Crear Imagen Asociación
```graphql
mutation CrearImagenAsociacion($input: ImagenAsociacionInput!) {
  crearImagenAsociacion(input: $input) {
    id
    asociableType
    asociableId
    imagenId
  }
}
```
**Variables:**
```json
{
  "input": {
    "asociableType": "Proyecto",
    "asociableId": "PROYECTO_ID_AQUI",
    "imagenId": "IMAGEN_ID_AQUI"
  }
}
```

---

## 5️⃣ VERIFICACIONES

### Listar Verificaciones
```graphql
query ListarVerificaciones {
  listarVerificaciones {
    id
    estado
    fechaVerificacion
    arquitectoId
    moderadorId
  }
}
```

### Crear Verificación
```graphql
mutation CrearVerificacion($input: VerificacionInput!) {
  crearVerificacion(input: $input) {
    id
    estado
    fechaVerificacion
    arquitectoId
    moderadorId
  }
}
```
**Variables:**
```json
{
  "input": {
    "estado": "pendiente",
    "fechaVerificacion": "2025-10-18",
    "arquitectoId": "ARQUITECTO_ID_AQUI",
    "moderadorId": "MODERADOR_ID_AQUI"
  }
}
```

---

## 6️⃣ PROYECTOS

### Listar Proyectos
```graphql
query ListarProyectos {
  listarProyectos {
    id
    tituloProyecto
    valoracionPromedio
    descripcion
    tipoProyecto
    fechaPublicacion
    arquitectoId
    conversacionId
    clienteId
    solicitudProyectoId
  }
}
```

---

## 7️⃣ SOLICITUDES PROYECTO

### Listar Solicitudes
```graphql
query ListarSolicitudesProyecto {
  listarSolicitudesProyecto {
    id
    estado
    fechaSolicitud
    arquitectoId
    clienteId
  }
}
```

---

## 8️⃣ MODERADORES

### Listar Moderadores
```graphql
query ListarModeradores {
  listarModeradores {
    id
    usuarioId
  }
}
```

---

## 9️⃣ CONVERSACIONES

### Listar Conversaciones
```graphql
query ListarConversaciones {
  listarConversaciones {
    id
    fecha
    clienteId
    arquitectoId
  }
}
```

---

## 🔟 MENSAJES

### Listar Mensajes
```graphql
query ListarMensajes {
  listarMensajes {
    id
    contenido
    fechaEnvio
    leido
    conversacionId
    remitenteId
  }
}
```

---

## 1️⃣1️⃣ NOTIFICACIONES

### Listar Notificaciones
```graphql
query ListarNotificaciones {
  listarNotificaciones {
    id
    mensaje
    fecha
    leido
    usuarioId
  }
}
```

---

## 1️⃣2️⃣ VALORACIONES

### Listar Valoraciones
```graphql
query ListarValoraciones {
  listarValoraciones {
    id
    calificacion
    comentario
    fecha
    clienteId
    proyectoId
  }
}
```

---

## 1️⃣3️⃣ ARQUITECTOS

### Listar Arquitectos
```graphql
query ListarArquitectos {
  listarArquitectos {
    id
    cedula
    usuarioId
  }
}
```

---

## 1️⃣4️⃣ CLIENTES

### Listar Clientes
```graphql
query ListarClientes {
  listarClientes {
    id
    cedula
    usuarioId
  }
}
```

---

## ✅ QUERY COMPLETA PARA VERIFICAR TODAS LAS ENTIDADES

```graphql
query VerificarTodasLasEntidades {
  # 1. Usuarios
  listarUsuarios {
    id
    nombre
    email
  }
  
  # 2. Arquitectos
  listarArquitectos {
    id
    cedula
  }
  
  # 3. Clientes
  listarClientes {
    id
    cedula
  }
  
  # 4. Moderadores
  listarModeradores {
    id
    usuarioId
  }
  
  # 5. Proyectos
  listarProyectos {
    id
    tituloProyecto
  }
  
  # 6. Solicitudes Proyecto
  listarSolicitudesProyecto {
    id
    estado
  }
  
  # 7. Conversaciones
  listarConversaciones {
    id
    fecha
  }
  
  # 8. Mensajes
  listarMensajes {
    id
    contenido
  }
  
  # 9. Notificaciones
  listarNotificaciones {
    id
    mensaje
  }
  
  # 10. Valoraciones
  listarValoraciones {
    id
    calificacion
  }
  
  # 11. Avances
  listarAvances {
    id
    descripcion
  }
  
  # 12. Incidencias
  listarIncidencias {
    id
    descripcion
    estado
  }
  
  # 13. Imágenes
  listarImagenes {
    id
    imagenUrl
  }
  
  # 14. Imagen Asociaciones
  listarImagenAsociaciones {
    id
    asociableType
  }
  
  # 15. Verificaciones
  listarVerificaciones {
    id
    estado
  }
}
```

---

## 📋 Instrucciones de Prueba

1. **Abre la UI GraphiQL**: http://127.0.0.1:8000/graphql/ui

2. **Prueba la query completa** primero para verificar que todas las 14 entidades están expuestas:
   - Copia la query "VerificarTodasLasEntidades"
   - Pégala en GraphiQL
   - Ejecuta (botón ▶️)
   - Deberías ver datos vacíos `[]` o registros existentes para cada entidad

3. **Prueba individual por entidad**:
   - Primero ejecuta las queries de "Listar" para cada entidad
   - Luego prueba crear registros con las mutations correspondientes
   - Verifica que aparezcan en las queries de listado

4. **Validaciones esperadas**:
   - **Incidencia**: `estado` debe ser "pendiente", "resuelto" o "en revision"
   - **Proyecto**: `tipoProyecto` debe ser "portafolio" o "contratado"
   - **SolicitudProyecto**: `estado` debe ser "pendiente", "aceptado" o "rechazado"
   - **ImagenAsociacion**: `asociableType` debe ser "Proyecto", "Mensaje", "Incidencia" o "Avance"
   - **Verificacion**: `estado` debe ser "pendiente", "verificado" o "rechazado"

5. **Códigos de error esperados**:
   - `400`: Validación fallida (campos requeridos, enums inválidos)
   - `404`: Entidad no encontrada
   - `202`: Duplicado (ej: email ya existe)
   - `200`: Éxito o errores de negocio

---

## 🎯 Resultado Esperado

✅ **14 entidades completamente funcionales**:
1. Usuario ✓
2. Arquitecto ✓
3. Cliente ✓
4. Moderador ✓
5. Proyecto ✓
6. SolicitudProyecto ✓
7. Conversacion ✓
8. Mensaje ✓
9. Notificacion ✓
10. Valoracion ✓
11. Avance ✓
12. Incidencia ✓
13. Imagen ✓
14. ImagenAsociacion ✓
15. Verificacion ✓

**Total: 15 resolvers (14 entidades principales + Verificacion)**

Todas con operaciones CRUD completas (crear, listar, obtener, actualizar, eliminar) expuestas vía GraphQL! 🎉
