from typing import List, Optional
from graphql import GraphQLError
from domain.entitiesPy.arquitecto_entity import Arquitecto
from infrastructure.repositories.arquitecto_repository import ArquitectoRepository


class ArquitectoUseCase:
    def __init__(self, repo: ArquitectoRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Arquitecto:
        requeridos = ["cedula", "descripcion", "especialidades", "ubicacion", "usuario_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        if await self.repo.existe_por_cedula(datos["cedula"]):
            raise GraphQLError("cedula ya registrada", extensions={"code": "202"})
        arq = Arquitecto(
            id=None,
            cedula=datos["cedula"],
            valoracion_prom_proyecto=float(datos.get("valoracion_prom_proyecto", 0.0)),
            descripcion=datos["descripcion"],
            especialidades=datos["especialidades"],
            ubicacion=datos["ubicacion"],
            verificado=bool(datos.get("verificado", False)),
            vistas_perfil=int(datos.get("vistas_perfil", 0)),
            usuario_id=datos["usuario_id"],
        )
        return await self.repo.crear(arq)

    async def listar(self) -> List[Arquitecto]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Arquitecto]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Arquitecto]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("arquitecto no encontrado", extensions={"code": "404"})
        nueva_cedula = datos.get("cedula")
        if nueva_cedula and nueva_cedula != existente.cedula:
            if await self.repo.existe_por_cedula(nueva_cedula):
                raise GraphQLError("cedula ya registrada", extensions={"code": "202"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("arquitecto no encontrado", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
