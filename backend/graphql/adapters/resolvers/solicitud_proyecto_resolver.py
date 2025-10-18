import strawberry
from typing import List, Optional
from adapters.schemas.solicitud_proyecto_schema import SolicitudProyectoType, SolicitudProyectoInput
from application.use_cases.solicitud_proyecto_use_case import SolicitudProyectoUseCase
from infrastructure.database import get_db
from infrastructure.repositories.solicitud_proyecto_repository_impl import SolicitudProyectoRepositoryImpl


@strawberry.type
class QuerySolicitudProyecto:
    @strawberry.field
    async def listar_solicitudes_proyecto(self, info) -> List[SolicitudProyectoType]:
        async for db in get_db():
            repo = SolicitudProyectoRepositoryImpl(db)
            use_case = SolicitudProyectoUseCase(repo)
            items = await use_case.listar()
            return [
                SolicitudProyectoType(
                    id=s.id,
                    estado=s.estado,
                    fecha=s.fecha,
                    arquitecto_id=s.arquitecto_id,
                    cliente_id=s.cliente_id,
                ) for s in items
            ]

    @strawberry.field
    async def obtener_solicitud_proyecto(self, info, id: strawberry.ID) -> Optional[SolicitudProyectoType]:
        async for db in get_db():
            repo = SolicitudProyectoRepositoryImpl(db)
            use_case = SolicitudProyectoUseCase(repo)
            s = await use_case.obtener(str(id))
            if not s:
                return None
            return SolicitudProyectoType(
                id=s.id,
                estado=s.estado,
                fecha=s.fecha,
                arquitecto_id=s.arquitecto_id,
                cliente_id=s.cliente_id,
            )


@strawberry.type
class MutationSolicitudProyecto:
    @strawberry.mutation
    async def crear_solicitud_proyecto(self, info, input: SolicitudProyectoInput) -> SolicitudProyectoType:
        async for db in get_db():
            repo = SolicitudProyectoRepositoryImpl(db)
            use_case = SolicitudProyectoUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return SolicitudProyectoType(
                id=nuevo.id,
                estado=nuevo.estado,
                fecha=nuevo.fecha,
                arquitecto_id=nuevo.arquitecto_id,
                cliente_id=nuevo.cliente_id,
            )

    @strawberry.mutation
    async def actualizar_solicitud_proyecto(self, info, id: strawberry.ID, input: SolicitudProyectoInput) -> Optional[SolicitudProyectoType]:
        async for db in get_db():
            repo = SolicitudProyectoRepositoryImpl(db)
            use_case = SolicitudProyectoUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            if not actualizado:
                return None
            return SolicitudProyectoType(
                id=actualizado.id,
                estado=actualizado.estado,
                fecha=actualizado.fecha,
                arquitecto_id=actualizado.arquitecto_id,
                cliente_id=actualizado.cliente_id,
            )

    @strawberry.mutation
    async def eliminar_solicitud_proyecto(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = SolicitudProyectoRepositoryImpl(db)
            use_case = SolicitudProyectoUseCase(repo)
            return await use_case.eliminar(str(id))
