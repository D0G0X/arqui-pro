from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.imagen_asociacion_entity import ImagenAsociacion
from infrastructure.repositories.imagen_asociacion_repository import ImagenAsociacionRepository
from infrastructure.orm.imagen_asociacion_model import ImagenAsociacionModel


class ImagenAsociacionRepositoryImpl(ImagenAsociacionRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ImagenAsociacionModel) -> ImagenAsociacion:
        return ImagenAsociacion(
            id=str(m.id) if m.id else None,
            asociable_type=m.asociable_type,
            asociable_id=m.asociable_id,
            imagen_id=str(m.imagen_id),
        )

    async def crear(self, obj: ImagenAsociacion) -> ImagenAsociacion:
        m = ImagenAsociacionModel(
            asociable_type=obj.asociable_type,
            asociable_id=obj.asociable_id,
            imagen_id=obj.imagen_id,
        )
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[ImagenAsociacion]:
        result = await self.db.execute(select(ImagenAsociacionModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[ImagenAsociacion]:
        result = await self.db.execute(select(ImagenAsociacionModel).where(ImagenAsociacionModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[ImagenAsociacion]:
        result = await self.db.execute(select(ImagenAsociacionModel).where(ImagenAsociacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("asociable_type", "asociable_id", "imagen_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ImagenAsociacionModel).where(ImagenAsociacionModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
