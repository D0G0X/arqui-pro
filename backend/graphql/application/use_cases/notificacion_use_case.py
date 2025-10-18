from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.notificacion_entity import Notificacion
from infrastructure.repositories.notificacion_repository import NotificacionRepository


class NotificacionUseCase:
    def __init__(self, repo: NotificacionRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Notificacion:
        requeridos = ["mensaje", "fecha", "usuario_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        obj = Notificacion(id=None, mensaje=datos["mensaje"], fecha=datos["fecha"], leido=bool(datos.get("leido", False)), usuario_id=datos["usuario_id"])
        return await self.repo.crear(obj)

    async def listar(self) -> List[Notificacion]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Notificacion]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Notificacion]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("notificacion no encontrada", extensions={"code": "404"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("notificacion no encontrada", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
