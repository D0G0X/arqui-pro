from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.incidencia_entity import Incidencia
from infrastructure.repositories.incidencia_repository import IncidenciaRepository
from infrastructure.orm.incidencia_model import IncidenciaModel


class IncidenciaRepositoryImpl(IncidenciaRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: IncidenciaModel) -> Incidencia:
        return Incidencia(
            id=str(m.id) if m.id else None,
            descripcion=m.descripcion,
            estado=m.estado,
            fecha=m.fecha,
            usuario_emisor_id=str(m.usuario_emisor_id),
            usuario_infractor_id=str(m.usuario_infractor_id),
            moderador_id=str(m.moderador_id),
        )

    async def crear(self, obj: Incidencia) -> Incidencia:
        m = IncidenciaModel(
            descripcion=obj.descripcion,
            estado=obj.estado,
            fecha=obj.fecha,
            usuario_emisor_id=obj.usuario_emisor_id,
            usuario_infractor_id=obj.usuario_infractor_id,
            moderador_id=obj.moderador_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Incidencia]:
        result = await self.db.execute(select(IncidenciaModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Incidencia]:
        result = await self.db.execute(select(IncidenciaModel).where(IncidenciaModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Incidencia]:
        result = await self.db.execute(select(IncidenciaModel).where(IncidenciaModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("descripcion", "estado", "fecha", "usuario_emisor_id", "usuario_infractor_id", "moderador_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(IncidenciaModel).where(IncidenciaModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
