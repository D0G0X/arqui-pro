import strawberry
from typing import List, Optional
from adapters.schemas.conversacion_schema import ConversacionType, ConversacionInput
from application.use_cases.conversacion_use_case import ConversacionUseCase
from infrastructure.database import get_db
from infrastructure.repositories.conversacion_repository_impl import ConversacionRepositoryImpl


@strawberry.type
class QueryConversacion:
    @strawberry.field
    async def listar_conversaciones(self, info) -> List[ConversacionType]:
        async for db in get_db():
            repo = ConversacionRepositoryImpl(db)
            use_case = ConversacionUseCase(repo)
            items = await use_case.listar()
            return [ConversacionType(id=c.id, fecha=c.fecha, cliente_id=c.cliente_id, arquitecto_id=c.arquitecto_id) for c in items]

    @strawberry.field
    async def obtener_conversacion(self, info, id: strawberry.ID) -> Optional[ConversacionType]:
        async for db in get_db():
            repo = ConversacionRepositoryImpl(db)
            use_case = ConversacionUseCase(repo)
            c = await use_case.obtener(str(id))
            return ConversacionType(id=c.id, fecha=c.fecha, cliente_id=c.cliente_id, arquitecto_id=c.arquitecto_id) if c else None


@strawberry.type
class MutationConversacion:
    @strawberry.mutation
    async def crear_conversacion(self, info, input: ConversacionInput) -> ConversacionType:
        async for db in get_db():
            repo = ConversacionRepositoryImpl(db)
            use_case = ConversacionUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ConversacionType(id=nuevo.id, fecha=nuevo.fecha, cliente_id=nuevo.cliente_id, arquitecto_id=nuevo.arquitecto_id)

    @strawberry.mutation
    async def actualizar_conversacion(self, info, id: strawberry.ID, input: ConversacionInput) -> Optional[ConversacionType]:
        async for db in get_db():
            repo = ConversacionRepositoryImpl(db)
            use_case = ConversacionUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return ConversacionType(id=actualizado.id, fecha=actualizado.fecha, cliente_id=actualizado.cliente_id, arquitecto_id=actualizado.arquitecto_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_conversacion(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ConversacionRepositoryImpl(db)
            use_case = ConversacionUseCase(repo)
            return await use_case.eliminar(str(id))
