import strawberry
from typing import List, Optional
from adapters.schemas.cliente_schema import ClienteType, ClienteInput
from application.use_cases.cliente_use_case import ClienteUseCase
from infrastructure.database import get_db
from infrastructure.repositories.cliente_repository_impl import ClienteRepositoryImpl


@strawberry.type
class QueryCliente:
    @strawberry.field
    async def listar_clientes(self, info) -> List[ClienteType]:
        async for db in get_db():
            repo = ClienteRepositoryImpl(db)
            use_case = ClienteUseCase(repo)
            items = await use_case.listar()
            return [ClienteType(id=c.id, cedula=c.cedula, usuario_id=c.usuario_id) for c in items]

    @strawberry.field
    async def obtener_cliente(self, info, id: strawberry.ID) -> Optional[ClienteType]:
        async for db in get_db():
            repo = ClienteRepositoryImpl(db)
            use_case = ClienteUseCase(repo)
            c = await use_case.obtener(str(id))
            return ClienteType(id=c.id, cedula=c.cedula, usuario_id=c.usuario_id) if c else None


@strawberry.type
class MutationCliente:
    @strawberry.mutation
    async def crear_cliente(self, info, input: ClienteInput) -> ClienteType:
        async for db in get_db():
            repo = ClienteRepositoryImpl(db)
            use_case = ClienteUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ClienteType(id=nuevo.id, cedula=nuevo.cedula, usuario_id=nuevo.usuario_id)

    @strawberry.mutation
    async def actualizar_cliente(self, info, id: strawberry.ID, input: ClienteInput) -> Optional[ClienteType]:
        async for db in get_db():
            repo = ClienteRepositoryImpl(db)
            use_case = ClienteUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return ClienteType(id=actualizado.id, cedula=actualizado.cedula, usuario_id=actualizado.usuario_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_cliente(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ClienteRepositoryImpl(db)
            use_case = ClienteUseCase(repo)
            return await use_case.eliminar(str(id))
