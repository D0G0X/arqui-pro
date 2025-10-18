import strawberry
from typing import List, Optional
from adapters.schemas.moderador_schema import ModeradorType, ModeradorInput
from application.use_cases.moderador_use_case import ModeradorUseCase
from infrastructure.database import get_db
from infrastructure.repositories.moderador_repository_impl import ModeradorRepositoryImpl


@strawberry.type
class QueryModerador:
    @strawberry.field
    async def listar_moderadores(self, info) -> List[ModeradorType]:
        async for db in get_db():
            repo = ModeradorRepositoryImpl(db)
            use_case = ModeradorUseCase(repo)
            items = await use_case.listar()
            return [ModeradorType(id=m.id, usuario_id=m.usuario_id) for m in items]

    @strawberry.field
    async def obtener_moderador(self, info, id: strawberry.ID) -> Optional[ModeradorType]:
        async for db in get_db():
            repo = ModeradorRepositoryImpl(db)
            use_case = ModeradorUseCase(repo)
            m = await use_case.obtener(str(id))
            return ModeradorType(id=m.id, usuario_id=m.usuario_id) if m else None


@strawberry.type
class MutationModerador:
    @strawberry.mutation
    async def crear_moderador(self, info, input: ModeradorInput) -> ModeradorType:
        async for db in get_db():
            repo = ModeradorRepositoryImpl(db)
            use_case = ModeradorUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ModeradorType(id=nuevo.id, usuario_id=nuevo.usuario_id)

    @strawberry.mutation
    async def actualizar_moderador(self, info, id: strawberry.ID, input: ModeradorInput) -> Optional[ModeradorType]:
        async for db in get_db():
            repo = ModeradorRepositoryImpl(db)
            use_case = ModeradorUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return ModeradorType(id=actualizado.id, usuario_id=actualizado.usuario_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_moderador(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ModeradorRepositoryImpl(db)
            use_case = ModeradorUseCase(repo)
            return await use_case.eliminar(str(id))
