import strawberry
from typing import List, Optional
from adapters.schemas.mensaje_schema import MensajeType, MensajeInput
from application.use_cases.mensaje_use_case import MensajeUseCase
from infrastructure.database import get_db
from infrastructure.repositories.mensaje_repository_impl import MensajeRepositoryImpl


@strawberry.type
class QueryMensaje:
    @strawberry.field
    async def listar_mensajes(self, info) -> List[MensajeType]:
        async for db in get_db():
            repo = MensajeRepositoryImpl(db)
            use_case = MensajeUseCase(repo)
            items = await use_case.listar()
            return [
                MensajeType(id=m.id, contenido=m.contenido, fecha_envio=m.fecha_envio, leido=m.leido, conversacion_id=m.conversacion_id, remitente_id=m.remitente_id)
                for m in items
            ]

    @strawberry.field
    async def obtener_mensaje(self, info, id: strawberry.ID) -> Optional[MensajeType]:
        async for db in get_db():
            repo = MensajeRepositoryImpl(db)
            use_case = MensajeUseCase(repo)
            m = await use_case.obtener(str(id))
            return MensajeType(id=m.id, contenido=m.contenido, fecha_envio=m.fecha_envio, leido=m.leido, conversacion_id=m.conversacion_id, remitente_id=m.remitente_id) if m else None


@strawberry.type
class MutationMensaje:
    @strawberry.mutation
    async def crear_mensaje(self, info, input: MensajeInput) -> MensajeType:
        async for db in get_db():
            repo = MensajeRepositoryImpl(db)
            use_case = MensajeUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return MensajeType(id=nuevo.id, contenido=nuevo.contenido, fecha_envio=nuevo.fecha_envio, leido=nuevo.leido, conversacion_id=nuevo.conversacion_id, remitente_id=nuevo.remitente_id)

    @strawberry.mutation
    async def actualizar_mensaje(self, info, id: strawberry.ID, input: MensajeInput) -> Optional[MensajeType]:
        async for db in get_db():
            repo = MensajeRepositoryImpl(db)
            use_case = MensajeUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return MensajeType(id=actualizado.id, contenido=actualizado.contenido, fecha_envio=actualizado.fecha_envio, leido=actualizado.leido, conversacion_id=actualizado.conversacion_id, remitente_id=actualizado.remitente_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_mensaje(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = MensajeRepositoryImpl(db)
            use_case = MensajeUseCase(repo)
            return await use_case.eliminar(str(id))
