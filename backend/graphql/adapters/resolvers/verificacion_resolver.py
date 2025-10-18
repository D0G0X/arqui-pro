import strawberry
from typing import List, Optional
from adapters.schemas.verificacion_schema import VerificacionType, VerificacionInput
from application.use_cases.verificacion_use_case import VerificacionUseCase
from infrastructure.database import get_db
from infrastructure.repositories.verificacion_repository_impl import VerificacionRepositoryImpl


@strawberry.type
class QueryVerificacion:
    @strawberry.field
    async def listar_verificaciones(self, info) -> List[VerificacionType]:
        async for db in get_db():
            repo = VerificacionRepositoryImpl(db)
            use_case = VerificacionUseCase(repo)
            items = await use_case.listar()
            return [
                VerificacionType(id=v.id, estado=v.estado, fecha_verificacion=v.fecha_verificacion, arquitecto_id=v.arquitecto_id, moderador_id=v.moderador_id)
                for v in items
            ]

    @strawberry.field
    async def obtener_verificacion(self, info, id: strawberry.ID) -> Optional[VerificacionType]:
        async for db in get_db():
            repo = VerificacionRepositoryImpl(db)
            use_case = VerificacionUseCase(repo)
            v = await use_case.obtener(str(id))
            return VerificacionType(id=v.id, estado=v.estado, fecha_verificacion=v.fecha_verificacion, arquitecto_id=v.arquitecto_id, moderador_id=v.moderador_id) if v else None


@strawberry.type
class MutationVerificacion:
    @strawberry.mutation
    async def crear_verificacion(self, info, input: VerificacionInput) -> VerificacionType:
        async for db in get_db():
            repo = VerificacionRepositoryImpl(db)
            use_case = VerificacionUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return VerificacionType(id=nuevo.id, estado=nuevo.estado, fecha_verificacion=nuevo.fecha_verificacion, arquitecto_id=nuevo.arquitecto_id, moderador_id=nuevo.moderador_id)

    @strawberry.mutation
    async def actualizar_verificacion(self, info, id: strawberry.ID, input: VerificacionInput) -> Optional[VerificacionType]:
        async for db in get_db():
            repo = VerificacionRepositoryImpl(db)
            use_case = VerificacionUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return VerificacionType(id=actualizado.id, estado=actualizado.estado, fecha_verificacion=actualizado.fecha_verificacion, arquitecto_id=actualizado.arquitecto_id, moderador_id=actualizado.moderador_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_verificacion(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = VerificacionRepositoryImpl(db)
            use_case = VerificacionUseCase(repo)
            return await use_case.eliminar(str(id))
