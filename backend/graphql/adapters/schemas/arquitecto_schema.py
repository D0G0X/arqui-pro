import strawberry
from typing import Optional, List, Annotated
from infrastructure.rest_client import rest_client


@strawberry.type
class ArquitectoType:
    id: strawberry.ID
    cedula: str
    valoracion_prom_proyecto: float
    descripcion: str
    especialidades: str
    ubicacion: str
    verificado: bool
    vistas_perfil: int
    usuario_id: strawberry.ID

    @strawberry.field
    async def usuario(self, info) -> Optional[Annotated["UsuarioType", strawberry.lazy("adapters.schemas.usuario_schema")]]:
        from adapters.schemas.usuario_schema import UsuarioType
        try:
            u = await rest_client.get_usuario(str(self.usuario_id))
            return UsuarioType(
                id=u.get("id"),
                nombre=u.get("nombre"),
                apellido=u.get("apellido"),
                email=u.get("email"),
                estado_cuenta=u.get("estado_cuenta"),
                rol=u.get("rol"),
                fecha_registro=u.get("fecha_registro"),
                foto_perfil=u.get("foto_perfil"),
            )
        except Exception:
            return None

    @strawberry.field
    async def proyectos(self, info) -> List[Annotated["ProyectoType", strawberry.lazy("adapters.schemas.proyecto_schema")]]:
        from adapters.schemas.proyecto_schema import ProyectoType
        # Intentar filtrar por arquitecto_id si el API REST lo soporta
        params = {"arquitecto_id": str(self.id)}
        data = await rest_client.get_proyectos(params=params)
        items: List[ProyectoType] = []
        for p in data:
            if p.get("arquitecto_id") and str(p.get("arquitecto_id")) != str(self.id):
                # Si el API ignoró el filtro y devolvió todos, descartamos los que no coinciden
                continue
            items.append(
                ProyectoType(
                    id=p.get("id"),
                    titulo_proyecto=p.get("titulo_proyecto"),
                    valoracion_promedio=p.get("valoracion_promedio"),
                    descripcion=p.get("descripcion"),
                    tipo_proyecto=p.get("tipo_proyecto"),
                    fecha_publicacion=p.get("fecha_publicacion"),
                    arquitecto_id=p.get("arquitecto_id"),
                    conversacion_id=p.get("conversacion_id"),
                    cliente_id=p.get("cliente_id"),
                    solicitud_proyecto_id=p.get("solicitud_proyecto_id"),
                )
            )
        return items
