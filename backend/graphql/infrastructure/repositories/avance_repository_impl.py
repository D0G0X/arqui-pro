from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.avance_entity import Avance
from infrastructure.repositories.avance_repository import AvanceRepository
from infrastructure.orm.avance_model import AvanceModel


class AvanceRepositoryImpl(AvanceRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: AvanceModel) -> Avance:
        return Avance(id=str(m.id) if m.id else None, descripcion=m.descripcion, fecha=m.fecha, proyecto_id=str(m.proyecto_id))

    async def crear(self, obj: Avance) -> Avance:
        m = AvanceModel(descripcion=obj.descripcion, fecha=obj.fecha, proyecto_id=obj.proyecto_id)
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Avance]:
        result = await self.db.execute(select(AvanceModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Avance]:
        result = await self.db.execute(select(AvanceModel).where(AvanceModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Avance]:
        result = await self.db.execute(select(AvanceModel).where(AvanceModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("descripcion", "fecha", "proyecto_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(AvanceModel).where(AvanceModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
