import strawberry
from typing import Optional, List, Annotated
from datetime import date


@strawberry.type
class ConversacionType:
    id: strawberry.ID
    fecha: date
    cliente_id: strawberry.ID
    arquitecto_id: strawberry.ID

    @strawberry.field
    async def cliente(self, info) -> Optional[Annotated["ClienteType", strawberry.lazy("adapters.schemas.cliente_schema")]]:
        from adapters.schemas.cliente_schema import ClienteType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.cliente_model import ClienteModel
        
        async for db in get_db():
            result = await db.execute(
                select(ClienteModel).where(ClienteModel.id == self.cliente_id)
            )
            cli = result.scalars().first()
            if cli:
                return ClienteType(id=str(cli.id), cedula=cli.cedula, usuario_id=str(cli.usuario_id))
            return None

    @strawberry.field
    async def arquitecto(self, info) -> Optional[Annotated["ArquitectoType", strawberry.lazy("adapters.schemas.arquitecto_schema")]]:
        from adapters.schemas.arquitecto_schema import ArquitectoType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.arquitecto_model import ArquitectoModel
        
        async for db in get_db():
            result = await db.execute(
                select(ArquitectoModel).where(ArquitectoModel.id == self.arquitecto_id)
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
    async def mensajes(self, info) -> List[Annotated["MensajeType", strawberry.lazy("adapters.schemas.mensaje_schema")]]:
        from adapters.schemas.mensaje_schema import MensajeType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.mensaje_model import MensajeModel
        
        async for db in get_db():
            result = await db.execute(
                select(MensajeModel).where(MensajeModel.conversacion_id == self.id).order_by(MensajeModel.fecha_envio)
            )
            mensajes = result.scalars().all()
            return [
                MensajeType(
                    id=str(m.id),
                    contenido=m.contenido,
                    fecha_envio=m.fecha_envio,
                    leido=m.leido,
                    conversacion_id=str(m.conversacion_id),
                    remitente_id=str(m.remitente_id)
                )
                for m in mensajes
            ]


@strawberry.input
class ConversacionInput:
    fecha: date
    cliente_id: strawberry.ID
    arquitecto_id: strawberry.ID
