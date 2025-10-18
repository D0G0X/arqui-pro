from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.verificacion_entity import Verificacion
from infrastructure.repositories.verificacion_repository import VerificacionRepository
from infrastructure.orm.verificacion_model import VerificacionModel


class VerificacionRepositoryImpl(VerificacionRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: VerificacionModel) -> Verificacion:
        return Verificacion(
            id=str(m.id) if m.id else None,
            estado=m.estado,
            fecha_verificacion=m.fecha_verificacion,
            arquitecto_id=str(m.arquitecto_id),
            moderador_id=str(m.moderador_id),
        )

    async def crear(self, obj: Verificacion) -> Verificacion:
        m = VerificacionModel(
            estado=obj.estado,
            fecha_verificacion=obj.fecha_verificacion,
            arquitecto_id=obj.arquitecto_id,
            moderador_id=obj.moderador_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Verificacion]:
        result = await self.db.execute(select(VerificacionModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Verificacion]:
        result = await self.db.execute(select(VerificacionModel).where(VerificacionModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Verificacion]:
        result = await self.db.execute(select(VerificacionModel).where(VerificacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("estado", "fecha_verificacion", "arquitecto_id", "moderador_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(VerificacionModel).where(VerificacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
