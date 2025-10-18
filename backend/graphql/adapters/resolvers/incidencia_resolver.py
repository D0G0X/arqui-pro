import strawberry
from typing import List, Optional
from adapters.schemas.incidencia_schema import IncidenciaType, IncidenciaInput
from application.use_cases.incidencia_use_case import IncidenciaUseCase
from infrastructure.database import get_db
from infrastructure.repositories.incidencia_repository_impl import IncidenciaRepositoryImpl


@strawberry.type
class QueryIncidencia:
    @strawberry.field
    async def listar_incidencias(self, info) -> List[IncidenciaType]:
        async for db in get_db():
            repo = IncidenciaRepositoryImpl(db)
            use_case = IncidenciaUseCase(repo)
            items = await use_case.listar()
            return [
                IncidenciaType(
                    id=i.id,
                    descripcion=i.descripcion,
                    estado=i.estado,
                    fecha=i.fecha,
                    usuario_emisor_id=i.usuario_emisor_id,
                    usuario_infractor_id=i.usuario_infractor_id,
                    moderador_id=i.moderador_id,
                ) for i in items
            ]

    @strawberry.field
    async def obtener_incidencia(self, info, id: strawberry.ID) -> Optional[IncidenciaType]:
        async for db in get_db():
            repo = IncidenciaRepositoryImpl(db)
            use_case = IncidenciaUseCase(repo)
            i = await use_case.obtener(str(id))
            if not i:
                return None
            return IncidenciaType(
                id=i.id,
                descripcion=i.descripcion,
                estado=i.estado,
                fecha=i.fecha,
                usuario_emisor_id=i.usuario_emisor_id,
                usuario_infractor_id=i.usuario_infractor_id,
                moderador_id=i.moderador_id,
            )


@strawberry.type
class MutationIncidencia:
    @strawberry.mutation
    async def crear_incidencia(self, info, input: IncidenciaInput) -> IncidenciaType:
        async for db in get_db():
            repo = IncidenciaRepositoryImpl(db)
            use_case = IncidenciaUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return IncidenciaType(
                id=nuevo.id,
                descripcion=nuevo.descripcion,
                estado=nuevo.estado,
                fecha=nuevo.fecha,
                usuario_emisor_id=nuevo.usuario_emisor_id,
                usuario_infractor_id=nuevo.usuario_infractor_id,
                moderador_id=nuevo.moderador_id,
            )

    @strawberry.mutation
    async def actualizar_incidencia(self, info, id: strawberry.ID, input: IncidenciaInput) -> Optional[IncidenciaType]:
        async for db in get_db():
            repo = IncidenciaRepositoryImpl(db)
            use_case = IncidenciaUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            if not actualizado:
                return None
            return IncidenciaType(
                id=actualizado.id,
                descripcion=actualizado.descripcion,
                estado=actualizado.estado,
                fecha=actualizado.fecha,
                usuario_emisor_id=actualizado.usuario_emisor_id,
                usuario_infractor_id=actualizado.usuario_infractor_id,
                moderador_id=actualizado.moderador_id,
            )

    @strawberry.mutation
    async def eliminar_incidencia(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = IncidenciaRepositoryImpl(db)
            use_case = IncidenciaUseCase(repo)
            return await use_case.eliminar(str(id))
