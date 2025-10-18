from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.incidencia_entity import Incidencia
from infrastructure.repositories.incidencia_repository import IncidenciaRepository


class IncidenciaUseCase:
    def __init__(self, repo: IncidenciaRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Incidencia:
        requeridos = ["descripcion", "estado", "fecha", "usuario_emisor_id", "usuario_infractor_id", "moderador_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        if datos.get("estado") not in {"pendiente", "resuelto", "en revision"}:
            raise GraphQLError("estado inválido", extensions={"code": "400"})
        obj = Incidencia(
            id=None,
            descripcion=datos["descripcion"],
            estado=datos["estado"],
            fecha=datos["fecha"],
            usuario_emisor_id=datos["usuario_emisor_id"],
            usuario_infractor_id=datos["usuario_infractor_id"],
            moderador_id=datos["moderador_id"],
        )
        return await self.repo.crear(obj)

    async def listar(self) -> List[Incidencia]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Incidencia]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Incidencia]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("incidencia no encontrada", extensions={"code": "404"})
        if "estado" in datos and datos["estado"] is not None:
            if datos["estado"] not in {"pendiente", "resuelto", "en revision"}:
                raise GraphQLError("estado inválido", extensions={"code": "400"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("incidencia no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
