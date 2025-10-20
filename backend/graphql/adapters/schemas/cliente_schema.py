import strawberry
from typing import Optional, Annotated


@strawberry.type
class ClienteType:
    id: strawberry.ID
    cedula: str
    usuario_id: strawberry.ID

    @strawberry.field
    async def usuario(self, info) -> Optional[Annotated["UsuarioType", strawberry.lazy("adapters.schemas.usuario_schema")]]:
        from adapters.schemas.usuario_schema import UsuarioType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.usuario_model import UsuarioModel
        
        async for db in get_db():
            result = await db.execute(
                select(UsuarioModel).where(UsuarioModel.id == self.usuario_id)
            )
            user = result.scalars().first()
            if user:
                return UsuarioType(
                    id=str(user.id),
                    nombre=user.nombre,
                    apellido=user.apellido,
                    email=user.email,
                    estado_cuenta=user.estado_cuenta,
                    rol=user.rol,
                    fecha_registro=user.fecha_registro,
                    foto_perfil=user.foto_perfil
                )
            return None


@strawberry.input
class ClienteInput:
    cedula: str
    usuario_id: strawberry.ID
