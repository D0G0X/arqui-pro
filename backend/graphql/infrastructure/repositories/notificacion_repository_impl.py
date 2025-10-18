from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.notificacion_entity import Notificacion
from infrastructure.repositories.notificacion_repository import NotificacionRepository
from infrastructure.orm.notificacion_model import NotificacionModel


class NotificacionRepositoryImpl(NotificacionRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: NotificacionModel) -> Notificacion:
        return Notificacion(
            id=str(m.id) if m.id else None,
            mensaje=m.mensaje,
            fecha=m.fecha,
            leido=m.leido,
            usuario_id=str(m.usuario_id),
        )

    async def crear(self, obj: Notificacion) -> Notificacion:
        m = NotificacionModel(
            mensaje=obj.mensaje,
            fecha=obj.fecha,
            leido=obj.leido,
            usuario_id=obj.usuario_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Notificacion]:
        result = await self.db.execute(select(NotificacionModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Notificacion]:
        result = await self.db.execute(select(NotificacionModel).where(NotificacionModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Notificacion]:
        result = await self.db.execute(select(NotificacionModel).where(NotificacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("mensaje", "fecha", "leido", "usuario_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(NotificacionModel).where(NotificacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
