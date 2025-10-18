from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.valoracion_entity import Valoracion
from infrastructure.repositories.valoracion_repository import ValoracionRepository
from infrastructure.orm.valoracion_model import ValoracionModel


class ValoracionRepositoryImpl(ValoracionRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ValoracionModel) -> Valoracion:
        return Valoracion(
            id=str(m.id) if m.id else None,
            calificacion=m.calificacion,
            comentario=m.comentario,
            fecha=m.fecha,
            cliente_id=str(m.cliente_id),
            proyecto_id=str(m.proyecto_id),
        )

    async def crear(self, obj: Valoracion) -> Valoracion:
        m = ValoracionModel(
            calificacion=obj.calificacion,
            comentario=obj.comentario,
            fecha=obj.fecha,
            cliente_id=obj.cliente_id,
            proyecto_id=obj.proyecto_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Valoracion]:
        result = await self.db.execute(select(ValoracionModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Valoracion]:
        result = await self.db.execute(select(ValoracionModel).where(ValoracionModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Valoracion]:
        result = await self.db.execute(select(ValoracionModel).where(ValoracionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("calificacion", "comentario", "fecha", "cliente_id", "proyecto_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ValoracionModel).where(ValoracionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
