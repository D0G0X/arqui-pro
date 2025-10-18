from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.proyecto_entity import Proyecto
from infrastructure.repositories.proyecto_repository import ProyectoRepository
from infrastructure.orm.proyecto_model import ProyectoModel


class ProyectoRepositoryImpl(ProyectoRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ProyectoModel) -> Proyecto:
        return Proyecto(
            id=str(m.id) if m.id else None,
            titulo_proyecto=m.titulo_proyecto,
            valoracion_promedio=m.valoracion_promedio,
            descripcion=m.descripcion,
            tipo_proyecto=m.tipo_proyecto,
            fecha_publicacion=m.fecha_publicacion,
            arquitecto_id=str(m.arquitecto_id),
            conversacion_id=str(m.conversacion_id) if m.conversacion_id else None,
            cliente_id=str(m.cliente_id) if m.cliente_id else None,
            solicitud_proyecto_id=str(m.solicitud_proyecto_id) if m.solicitud_proyecto_id else None,
        )

    async def crear(self, obj: Proyecto) -> Proyecto:
        m = ProyectoModel(
            titulo_proyecto=obj.titulo_proyecto,
            valoracion_promedio=obj.valoracion_promedio,
            descripcion=obj.descripcion,
            tipo_proyecto=obj.tipo_proyecto,
            fecha_publicacion=obj.fecha_publicacion,
            arquitecto_id=obj.arquitecto_id,
            conversacion_id=obj.conversacion_id,
            cliente_id=obj.cliente_id,
            solicitud_proyecto_id=obj.solicitud_proyecto_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Proyecto]:
        result = await self.db.execute(select(ProyectoModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Proyecto]:
        result = await self.db.execute(select(ProyectoModel).where(ProyectoModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Proyecto]:
        result = await self.db.execute(select(ProyectoModel).where(ProyectoModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("titulo_proyecto", "valoracion_promedio", "descripcion", "tipo_proyecto", "fecha_publicacion", "arquitecto_id", "conversacion_id", "cliente_id", "solicitud_proyecto_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ProyectoModel).where(ProyectoModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
