from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.solicitud_proyecto_entity import SolicitudProyecto
from infrastructure.repositories.solicitud_proyecto_repository import SolicitudProyectoRepository


class SolicitudProyectoUseCase:
    def __init__(self, repo: SolicitudProyectoRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> SolicitudProyecto:
        requeridos = ["estado", "fecha", "arquitecto_id", "cliente_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        if datos.get("estado") not in {"pendiente", "aceptado", "rechazado"}:
            raise GraphQLError("estado inválido", extensions={"code": "400"})
        obj = SolicitudProyecto(
            id=None,
            estado=datos["estado"],
            fecha=datos["fecha"],
            arquitecto_id=datos["arquitecto_id"],
            cliente_id=datos["cliente_id"],
        )
        return await self.repo.crear(obj)

    async def listar(self) -> List[SolicitudProyecto]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[SolicitudProyecto]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[SolicitudProyecto]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("solicitud no encontrada", extensions={"code": "404"})
        if "estado" in datos and datos["estado"] is not None:
            if datos["estado"] not in {"pendiente", "aceptado", "rechazado"}:
                raise GraphQLError("estado inválido", extensions={"code": "400"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("solicitud no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
