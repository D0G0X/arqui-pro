from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.moderador_entity import Moderador
from infrastructure.repositories.moderador_repository import ModeradorRepository


class ModeradorUseCase:
    def __init__(self, repo: ModeradorRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Moderador:
        if not datos.get("usuario_id"):
            raise GraphQLError("usuario_id requerido", extensions={"code": "400"})
        return await self.repo.crear(Moderador(id=None, usuario_id=datos["usuario_id"]))

    async def listar(self) -> List[Moderador]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Moderador]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Moderador]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("moderador no encontrado", extensions={"code": "404"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("moderador no encontrado", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
