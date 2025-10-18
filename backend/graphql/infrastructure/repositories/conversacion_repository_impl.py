from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.conversacion_entity import Conversacion
from infrastructure.repositories.conversacion_repository import ConversacionRepository
from infrastructure.orm.conversacion_model import ConversacionModel


class ConversacionRepositoryImpl(ConversacionRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ConversacionModel) -> Conversacion:
        return Conversacion(
            id=str(m.id) if m.id else None,
            fecha=m.fecha,
            cliente_id=str(m.cliente_id),
            arquitecto_id=str(m.arquitecto_id),
        )

    async def crear(self, obj: Conversacion) -> Conversacion:
        m = ConversacionModel(
            fecha=obj.fecha,
            cliente_id=obj.cliente_id,
            arquitecto_id=obj.arquitecto_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Conversacion]:
        result = await self.db.execute(select(ConversacionModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Conversacion]:
        result = await self.db.execute(select(ConversacionModel).where(ConversacionModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Conversacion]:
        result = await self.db.execute(select(ConversacionModel).where(ConversacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("fecha", "cliente_id", "arquitecto_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ConversacionModel).where(ConversacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
