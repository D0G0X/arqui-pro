from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.imagen_entity import Imagen
from infrastructure.repositories.imagen_repository import ImagenRepository


class ImagenUseCase:
    def __init__(self, repo: ImagenRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Imagen:
        requeridos = ["imagen_url", "fecha"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        obj = Imagen(id=None, imagen_url=datos["imagen_url"], fecha=datos["fecha"])
        return await self.repo.crear(obj)

    async def listar(self) -> List[Imagen]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Imagen]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Imagen]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("imagen no encontrada", extensions={"code": "404"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("imagen no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
