from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.imagen_asociacion_entity import ImagenAsociacion
from infrastructure.repositories.imagen_asociacion_repository import ImagenAsociacionRepository


class ImagenAsociacionUseCase:
    def __init__(self, repo: ImagenAsociacionRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> ImagenAsociacion:
        requeridos = ["asociable_type", "asociable_id", "imagen_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        if datos.get("asociable_type") not in {"Proyecto", "Mensaje", "Incidencia", "Avance"}:
            raise GraphQLError("asociable_type inválido", extensions={"code": "400"})
        obj = ImagenAsociacion(
            id=None,
            asociable_type=datos["asociable_type"],
            asociable_id=datos["asociable_id"],
            imagen_id=datos["imagen_id"],
        )
        return await self.repo.crear(obj)

    async def listar(self) -> List[ImagenAsociacion]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[ImagenAsociacion]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[ImagenAsociacion]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("imagen_asociacion no encontrada", extensions={"code": "404"})
        if "asociable_type" in datos and datos["asociable_type"] is not None:
            if datos["asociable_type"] not in {"Proyecto", "Mensaje", "Incidencia", "Avance"}:
                raise GraphQLError("asociable_type inválido", extensions={"code": "400"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("imagen_asociacion no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
