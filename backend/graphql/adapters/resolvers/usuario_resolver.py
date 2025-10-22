import strawberry
from typing import List, Optional
from adapters.schemas.usuario_schema import UsuarioType
from infrastructure.rest_client import rest_client

@strawberry.type
class QueryUsuario:
    """
    Queries de usuarios.
    Consume el API REST de Rails para obtener datos.
    """
    
    @strawberry.field
    async def listar_usuarios(self, info) -> List[UsuarioType]:
        """GET /api/v1/usuarios"""
        usuarios_data = await rest_client.get_usuarios()
        
        return [
            UsuarioType(
                id=u["id"],
                nombre=u["nombre"],
                apellido=u["apellido"],
                email=u["email"],
                estado_cuenta=u.get("estado_cuenta"),
                rol=u.get("rol"),
                fecha_registro=u.get("fecha_registro"),
                foto_perfil=u.get("foto_perfil")
            )
            for u in usuarios_data
        ]

    @strawberry.field
    async def obtener_usuario(self, info, id: strawberry.ID) -> Optional[UsuarioType]:
        """GET /api/v1/usuarios/:id"""
        try:
            u = await rest_client.get_usuario(str(id))
            return UsuarioType(
                id=u["id"],
                nombre=u["nombre"],
                apellido=u["apellido"],
                email=u["email"],
                estado_cuenta=u.get("estado_cuenta"),
                rol=u.get("rol"),
                fecha_registro=u.get("fecha_registro"),
                foto_perfil=u.get("foto_perfil")
            )
        except Exception:
            return None
