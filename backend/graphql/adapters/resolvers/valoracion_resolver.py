import strawberry
from typing import List, Optional
from adapters.schemas.valoracion_schema import ValoracionType, ValoracionInput
from application.use_cases.valoracion_use_case import ValoracionUseCase
from infrastructure.database import get_db
from infrastructure.repositories.valoracion_repository_impl import ValoracionRepositoryImpl


@strawberry.type
class QueryValoracion:
    @strawberry.field
    async def listar_valoraciones(self, info) -> List[ValoracionType]:
        async for db in get_db():
            repo = ValoracionRepositoryImpl(db)
            use_case = ValoracionUseCase(repo)
            items = await use_case.listar()
            return [ValoracionType(id=v.id, calificacion=v.calificacion, comentario=v.comentario, fecha=v.fecha, cliente_id=v.cliente_id, proyecto_id=v.proyecto_id) for v in items]

    @strawberry.field
    async def obtener_valoracion(self, info, id: strawberry.ID) -> Optional[ValoracionType]:
        async for db in get_db():
            repo = ValoracionRepositoryImpl(db)
            use_case = ValoracionUseCase(repo)
            v = await use_case.obtener(str(id))
            return ValoracionType(id=v.id, calificacion=v.calificacion, comentario=v.comentario, fecha=v.fecha, cliente_id=v.cliente_id, proyecto_id=v.proyecto_id) if v else None


@strawberry.type
class MutationValoracion:
    @strawberry.mutation
    async def crear_valoracion(self, info, input: ValoracionInput) -> ValoracionType:
        async for db in get_db():
            repo = ValoracionRepositoryImpl(db)
            use_case = ValoracionUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ValoracionType(id=nuevo.id, calificacion=nuevo.calificacion, comentario=nuevo.comentario, fecha=nuevo.fecha, cliente_id=nuevo.cliente_id, proyecto_id=nuevo.proyecto_id)

    @strawberry.mutation
    async def actualizar_valoracion(self, info, id: strawberry.ID, input: ValoracionInput) -> Optional[ValoracionType]:
        async for db in get_db():
            repo = ValoracionRepositoryImpl(db)
            use_case = ValoracionUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return ValoracionType(id=actualizado.id, calificacion=actualizado.calificacion, comentario=actualizado.comentario, fecha=actualizado.fecha, cliente_id=actualizado.cliente_id, proyecto_id=actualizado.proyecto_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_valoracion(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ValoracionRepositoryImpl(db)
            use_case = ValoracionUseCase(repo)
            return await use_case.eliminar(str(id))
