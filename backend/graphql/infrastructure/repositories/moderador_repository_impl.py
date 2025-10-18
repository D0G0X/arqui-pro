from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.moderador_entity import Moderador
from infrastructure.repositories.moderador_repository import ModeradorRepository
from infrastructure.orm.moderador_model import ModeradorModel


class ModeradorRepositoryImpl(ModeradorRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ModeradorModel) -> Moderador:
        return Moderador(id=str(m.id) if m.id else None, usuario_id=str(m.usuario_id))

    async def crear(self, obj: Moderador) -> Moderador:
        m = ModeradorModel(usuario_id=obj.usuario_id)
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def obtener_todos(self) -> List[Moderador]:
        result = await self.db.execute(select(ModeradorModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Moderador]:
        result = await self.db.execute(select(ModeradorModel).where(ModeradorModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Moderador]:
        result = await self.db.execute(select(ModeradorModel).where(ModeradorModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        if "usuario_id" in datos and datos["usuario_id"] is not None:
            m.usuario_id = datos["usuario_id"]
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ModeradorModel).where(ModeradorModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True
