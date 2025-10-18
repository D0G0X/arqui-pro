from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.mensaje_entity import Mensaje
from infrastructure.repositories.mensaje_repository import MensajeRepository


class MensajeUseCase:
    def __init__(self, repo: MensajeRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Mensaje:
        requeridos = ["contenido", "fecha_envio", "conversacion_id", "remitente_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        obj = Mensaje(id=None, contenido=datos["contenido"], fecha_envio=datos["fecha_envio"], leido=bool(datos.get("leido", False)), conversacion_id=datos["conversacion_id"], remitente_id=datos["remitente_id"])
        return await self.repo.crear(obj)

    async def listar(self) -> List[Mensaje]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Mensaje]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Mensaje]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("mensaje no encontrado", extensions={"code": "404"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("mensaje no encontrado", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
