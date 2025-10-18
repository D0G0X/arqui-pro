from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.avance_entity import Avance
from infrastructure.repositories.avance_repository import AvanceRepository


class AvanceUseCase:
    def __init__(self, repo: AvanceRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Avance:
        requeridos = ["descripcion", "fecha", "proyecto_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        obj = Avance(id=None, descripcion=datos["descripcion"], fecha=datos["fecha"], proyecto_id=datos["proyecto_id"])
        return await self.repo.crear(obj)

    async def listar(self) -> List[Avance]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Avance]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Avance]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("avance no encontrado", extensions={"code": "404"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("avance no encontrado", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
