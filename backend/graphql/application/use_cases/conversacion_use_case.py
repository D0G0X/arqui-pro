from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.conversacion_entity import Conversacion
from infrastructure.repositories.conversacion_repository import ConversacionRepository


class ConversacionUseCase:
    def __init__(self, repo: ConversacionRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Conversacion:
        requeridos = ["fecha", "cliente_id", "arquitecto_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        return await self.repo.crear(Conversacion(id=None, fecha=datos["fecha"], cliente_id=datos["cliente_id"], arquitecto_id=datos["arquitecto_id"]))

    async def listar(self) -> List[Conversacion]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Conversacion]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Conversacion]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("conversacion no encontrada", extensions={"code": "404"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("conversacion no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
