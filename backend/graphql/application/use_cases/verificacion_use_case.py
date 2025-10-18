from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.verificacion_entity import Verificacion
from infrastructure.repositories.verificacion_repository import VerificacionRepository


class VerificacionUseCase:
    def __init__(self, repo: VerificacionRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Verificacion:
        requeridos = ["estado", "fecha_verificacion", "arquitecto_id", "moderador_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        if datos.get("estado") not in {"pendiente", "verificado", "rechazado"}:
            raise GraphQLError("estado inválido", extensions={"code": "400"})
        obj = Verificacion(
            id=None,
            estado=datos["estado"],
            fecha_verificacion=datos["fecha_verificacion"],
            arquitecto_id=datos["arquitecto_id"],
            moderador_id=datos["moderador_id"],
        )
        return await self.repo.crear(obj)

    async def listar(self) -> List[Verificacion]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Verificacion]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Verificacion]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("verificacion no encontrada", extensions={"code": "404"})
        if "estado" in datos and datos["estado"] is not None:
            if datos["estado"] not in {"pendiente", "verificado", "rechazado"}:
                raise GraphQLError("estado inválido", extensions={"code": "400"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("verificacion no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
