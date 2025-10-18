import strawberry
from typing import List, Optional
from adapters.schemas.avance_schema import AvanceType, AvanceInput
from application.use_cases.avance_use_case import AvanceUseCase
from infrastructure.database import get_db
from infrastructure.repositories.avance_repository_impl import AvanceRepositoryImpl


@strawberry.type
class QueryAvance:
    @strawberry.field
    async def listar_avances(self, info) -> List[AvanceType]:
        async for db in get_db():
            repo = AvanceRepositoryImpl(db)
            use_case = AvanceUseCase(repo)
            items = await use_case.listar()
            return [AvanceType(id=a.id, descripcion=a.descripcion, fecha=a.fecha, proyecto_id=a.proyecto_id) for a in items]

    @strawberry.field
    async def obtener_avance(self, info, id: strawberry.ID) -> Optional[AvanceType]:
        async for db in get_db():
            repo = AvanceRepositoryImpl(db)
            use_case = AvanceUseCase(repo)
            a = await use_case.obtener(str(id))
            return AvanceType(id=a.id, descripcion=a.descripcion, fecha=a.fecha, proyecto_id=a.proyecto_id) if a else None


@strawberry.type
class MutationAvance:
    @strawberry.mutation
    async def crear_avance(self, info, input: AvanceInput) -> AvanceType:
        async for db in get_db():
            repo = AvanceRepositoryImpl(db)
            use_case = AvanceUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return AvanceType(id=nuevo.id, descripcion=nuevo.descripcion, fecha=nuevo.fecha, proyecto_id=nuevo.proyecto_id)

    @strawberry.mutation
    async def actualizar_avance(self, info, id: strawberry.ID, input: AvanceInput) -> Optional[AvanceType]:
        async for db in get_db():
            repo = AvanceRepositoryImpl(db)
            use_case = AvanceUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return AvanceType(id=actualizado.id, descripcion=actualizado.descripcion, fecha=actualizado.fecha, proyecto_id=actualizado.proyecto_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_avance(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = AvanceRepositoryImpl(db)
            use_case = AvanceUseCase(repo)
            return await use_case.eliminar(str(id))
