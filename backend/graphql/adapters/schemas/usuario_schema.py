import strawberry
from typing import Optional, Annotated
from datetime import datetime


@strawberry.type
class UsuarioType:
    id: strawberry.ID
    nombre: str
    apellido: str
    email: str
    estado_cuenta: str
    rol: str
    fecha_registro: Optional[datetime]
    foto_perfil: Optional[str]

    @strawberry.field
    async def arquitecto(self, info) -> Optional[Annotated["ArquitectoType", strawberry.lazy("adapters.schemas.arquitecto_schema")]]:
        from adapters.schemas.arquitecto_schema import ArquitectoType
        from infrastructure.repositories.arquitecto_repository_impl import ArquitectoRepositoryImpl
        from infrastructure.database import get_db
        
        async for db in get_db():
            from sqlalchemy.future import select
            from infrastructure.orm.arquitecto_model import ArquitectoModel
            result = await db.execute(
                select(ArquitectoModel).where(ArquitectoModel.usuario_id == self.id)
            )
            arq = result.scalars().first()
            if arq:
                return ArquitectoType(
                    id=str(arq.id),
                    cedula=arq.cedula,
                    valoracion_prom_proyecto=arq.valoracion_prom_proyecto,
                    descripcion=arq.descripcion,
                    especialidades=arq.especialidades,
                    ubicacion=arq.ubicacion,
                    verificado=arq.verificado,
                    vistas_perfil=arq.vistas_perfil,
                    usuario_id=str(arq.usuario_id)
                )
            return None

    @strawberry.field
    async def cliente(self, info) -> Optional[Annotated["ClienteType", strawberry.lazy("adapters.schemas.cliente_schema")]]:
        from adapters.schemas.cliente_schema import ClienteType
        from infrastructure.database import get_db
        
        async for db in get_db():
            from sqlalchemy.future import select
            from infrastructure.orm.cliente_model import ClienteModel
            result = await db.execute(
                select(ClienteModel).where(ClienteModel.usuario_id == self.id)
            )
            cli = result.scalars().first()
            if cli:
                return ClienteType(id=str(cli.id), cedula=cli.cedula, usuario_id=str(cli.usuario_id))
            return None

    @strawberry.field
    async def moderador(self, info) -> Optional[Annotated["ModeradorType", strawberry.lazy("adapters.schemas.moderador_schema")]]:
        from adapters.schemas.moderador_schema import ModeradorType
        from infrastructure.database import get_db
        
        async for db in get_db():
            from sqlalchemy.future import select
            from infrastructure.orm.moderador_model import ModeradorModel
            result = await db.execute(
                select(ModeradorModel).where(ModeradorModel.usuario_id == self.id)
            )
            mod = result.scalars().first()
            if mod:
                return ModeradorType(id=str(mod.id), usuario_id=str(mod.usuario_id))
            return None


@strawberry.input
class UsuarioInput:
    nombre: str
    apellido: str
    email: str
    password: str
    estado_cuenta: Optional[str] = "activo"
    rol: Optional[str] = "cliente"
    foto_perfil: Optional[str] = None