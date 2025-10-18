from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.cliente_entity import Cliente
from infrastructure.repositories.cliente_repository import ClienteRepository


class ClienteUseCase:
    def __init__(self, repo: ClienteRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Cliente:
        if not datos.get("cedula") or not datos.get("usuario_id"):
            raise GraphQLError("cedula y usuario_id son requeridos", extensions={"code": "400"})
        if await self.repo.existe_por_cedula(datos["cedula"]):
            raise GraphQLError("cedula ya registrada", extensions={"code": "202"})
        c = Cliente(id=None, cedula=datos["cedula"], usuario_id=datos["usuario_id"])
        return await self.repo.crear(c)

    async def listar(self) -> List[Cliente]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Cliente]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Cliente]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("cliente no encontrado", extensions={"code": "404"})
        nueva_cedula = datos.get("cedula")
        if nueva_cedula and nueva_cedula != existente.cedula:
            if await self.repo.existe_por_cedula(nueva_cedula):
                raise GraphQLError("cedula ya registrada", extensions={"code": "202"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("cliente no encontrado", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
