from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.mensaje_entity import Mensaje
from infrastructure.repositories.mensaje_repository import MensajeRepository
from infrastructure.orm.mensaje_model import MensajeModel


class MensajeRepositoryImpl(MensajeRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: MensajeModel) -> Mensaje:
        return Mensaje(
            id=str(m.id) if m.id else None,
            contenido=m.contenido,
            fecha_envio=m.fecha_envio,
            leido=m.leido,
            conversacion_id=str(m.conversacion_id),
            remitente_id=str(m.remitente_id),
        )

    async def crear(self, obj: Mensaje) -> Mensaje:
        m = MensajeModel(
            contenido=obj.contenido,
            fecha_envio=obj.fecha_envio,
            leido=obj.leido,
            conversacion_id=obj.conversacion_id,
            remitente_id=obj.remitente_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Mensaje]:
        result = await self.db.execute(select(MensajeModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Mensaje]:
        result = await self.db.execute(select(MensajeModel).where(MensajeModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Mensaje]:
        result = await self.db.execute(select(MensajeModel).where(MensajeModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("contenido", "fecha_envio", "leido", "conversacion_id", "remitente_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(MensajeModel).where(MensajeModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
