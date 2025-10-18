from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.solicitud_proyecto_entity import SolicitudProyecto
from infrastructure.repositories.solicitud_proyecto_repository import SolicitudProyectoRepository
from infrastructure.orm.solicitud_proyecto_model import SolicitudProyectoModel


class SolicitudProyectoRepositoryImpl(SolicitudProyectoRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: SolicitudProyectoModel) -> SolicitudProyecto:
        return SolicitudProyecto(
            id=str(m.id) if m.id else None,
            estado=m.estado,
            fecha=m.fecha,
            arquitecto_id=str(m.arquitecto_id),
            cliente_id=str(m.cliente_id),
        )

    async def crear(self, obj: SolicitudProyecto) -> SolicitudProyecto:
        m = SolicitudProyectoModel(
            estado=obj.estado,
            fecha=obj.fecha,
            arquitecto_id=obj.arquitecto_id,
            cliente_id=obj.cliente_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[SolicitudProyecto]:
        result = await self.db.execute(select(SolicitudProyectoModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[SolicitudProyecto]:
        result = await self.db.execute(select(SolicitudProyectoModel).where(SolicitudProyectoModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[SolicitudProyecto]:
        result = await self.db.execute(select(SolicitudProyectoModel).where(SolicitudProyectoModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("estado", "fecha", "arquitecto_id", "cliente_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(SolicitudProyectoModel).where(SolicitudProyectoModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
