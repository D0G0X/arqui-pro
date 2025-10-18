from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.imagen_entity import Imagen
from infrastructure.repositories.imagen_repository import ImagenRepository
from infrastructure.orm.imagen_model import ImagenModel


class ImagenRepositoryImpl(ImagenRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ImagenModel) -> Imagen:
        return Imagen(id=str(m.id) if m.id else None, imagen_url=m.imagen_url, fecha=m.fecha)

    async def crear(self, obj: Imagen) -> Imagen:
        m = ImagenModel(imagen_url=obj.imagen_url, fecha=obj.fecha)
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Imagen]:
        result = await self.db.execute(select(ImagenModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Imagen]:
        result = await self.db.execute(select(ImagenModel).where(ImagenModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Imagen]:
        result = await self.db.execute(select(ImagenModel).where(ImagenModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("imagen_url", "fecha"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ImagenModel).where(ImagenModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
