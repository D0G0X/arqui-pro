from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.valoracion_entity import Valoracion
from infrastructure.repositories.valoracion_repository import ValoracionRepository


class ValoracionUseCase:
    def __init__(self, repo: ValoracionRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Valoracion:
        requeridos = ["calificacion", "comentario", "fecha", "cliente_id", "proyecto_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        obj = Valoracion(id=None, calificacion=float(datos["calificacion"]), comentario=datos["comentario"], fecha=datos["fecha"], cliente_id=datos["cliente_id"], proyecto_id=datos["proyecto_id"])
        return await self.repo.crear(obj)

    async def listar(self) -> List[Valoracion]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Valoracion]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Valoracion]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("valoracion no encontrada", extensions={"code": "404"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("valoracion no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
