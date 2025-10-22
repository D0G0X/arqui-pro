import strawberry
from typing import Optional, Annotated
from infrastructure.rest_client import rest_client


@strawberry.type
class ClienteType:
    id: strawberry.ID
    cedula: str
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
