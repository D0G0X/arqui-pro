import strawberry
from typing import List, Optional
from adapters.schemas.notificacion_schema import NotificacionType, NotificacionInput
from application.use_cases.notificacion_use_case import NotificacionUseCase
from infrastructure.database import get_db
from infrastructure.repositories.notificacion_repository_impl import NotificacionRepositoryImpl


@strawberry.type
class QueryNotificacion:
    @strawberry.field
    async def listar_notificaciones(self, info) -> List[NotificacionType]:
        async for db in get_db():
            repo = NotificacionRepositoryImpl(db)
            use_case = NotificacionUseCase(repo)
            items = await use_case.listar()
            return [NotificacionType(id=n.id, mensaje=n.mensaje, fecha=n.fecha, leido=n.leido, usuario_id=n.usuario_id) for n in items]

    @strawberry.field
    async def obtener_notificacion(self, info, id: strawberry.ID) -> Optional[NotificacionType]:
        async for db in get_db():
            repo = NotificacionRepositoryImpl(db)
            use_case = NotificacionUseCase(repo)
            n = await use_case.obtener(str(id))
            return NotificacionType(id=n.id, mensaje=n.mensaje, fecha=n.fecha, leido=n.leido, usuario_id=n.usuario_id) if n else None


@strawberry.type
class MutationNotificacion:
    @strawberry.mutation
    async def crear_notificacion(self, info, input: NotificacionInput) -> NotificacionType:
        async for db in get_db():
            repo = NotificacionRepositoryImpl(db)
            use_case = NotificacionUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return NotificacionType(id=nuevo.id, mensaje=nuevo.mensaje, fecha=nuevo.fecha, leido=nuevo.leido, usuario_id=nuevo.usuario_id)

    @strawberry.mutation
    async def actualizar_notificacion(self, info, id: strawberry.ID, input: NotificacionInput) -> Optional[NotificacionType]:
        async for db in get_db():
            repo = NotificacionRepositoryImpl(db)
            use_case = NotificacionUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return NotificacionType(id=actualizado.id, mensaje=actualizado.mensaje, fecha=actualizado.fecha, leido=actualizado.leido, usuario_id=actualizado.usuario_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_notificacion(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = NotificacionRepositoryImpl(db)
            use_case = NotificacionUseCase(repo)
            return await use_case.eliminar(str(id))
