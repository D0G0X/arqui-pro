from typing import List, Optional
from datetime import date
from graphql import GraphQLError
from domain.entitiesPy.proyecto_entity import Proyecto
from infrastructure.repositories.proyecto_repository import ProyectoRepository


class ProyectoUseCase:
    def __init__(self, repo: ProyectoRepository):
        self.repo = repo

    async def crear(self, datos: dict) -> Proyecto:
        requeridos = ["titulo_proyecto", "descripcion", "tipo_proyecto", "fecha_publicacion", "arquitecto_id"]
        if any(not datos.get(k) for k in requeridos):
            raise GraphQLError("faltan campos requeridos", extensions={"code": "400"})
        tipo = datos.get("tipo_proyecto")
        if tipo not in {"portafolio", "contratado"}:
            raise GraphQLError("tipo_proyecto inválido", extensions={"code": "400"})
        valoracion = float(datos.get("valoracion_promedio", 0.0))
        obj = Proyecto(
            id=None,
            titulo_proyecto=datos["titulo_proyecto"],
            valoracion_promedio=valoracion,
            descripcion=datos["descripcion"],
            tipo_proyecto=tipo,
            fecha_publicacion=datos["fecha_publicacion"],
            arquitecto_id=datos["arquitecto_id"],
            conversacion_id=datos.get("conversacion_id"),
            cliente_id=datos.get("cliente_id"),
            solicitud_proyecto_id=datos.get("solicitud_proyecto_id"),
        )
        return await self.repo.crear(obj)

    async def listar(self) -> List[Proyecto]:
        return await self.repo.obtener_todos()

    async def obtener(self, id_: str) -> Optional[Proyecto]:
        return await self.repo.obtener_por_id(id_)

    async def actualizar(self, id_: str, datos: dict) -> Optional[Proyecto]:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("proyecto no encontrado", extensions={"code": "404"})
        if "tipo_proyecto" in datos and datos["tipo_proyecto"] is not None:
            if datos["tipo_proyecto"] not in {"portafolio", "contratado"}:
                raise GraphQLError("tipo_proyecto inválido", extensions={"code": "400"})
        return await self.repo.actualizar(id_, datos)

    async def eliminar(self, id_: str) -> bool:
        existente = await self.repo.obtener_por_id(id_)
        if not existente:
            raise GraphQLError("proyecto no encontrado", extensions={"code": "404"})
        return await self.repo.eliminar(id_)
