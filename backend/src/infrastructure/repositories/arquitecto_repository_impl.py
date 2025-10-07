# src/infrastructure/repositories/arquitecto_repository_impl.py
from sqlalchemy.future import select
from sqlalchemy import update, delete
from domain.entitiesPy.arquitecto_entity import Arquitecto
from infrastructure.repositories.arquitecto_repository import ArquitectoRepository
from infrastructure.orm.arquitecto_model import ArquitectoModel
from infrastructure.database import get_db

class ArquitectoRepositoryImpl(ArquitectoRepository):
    def __init__(self, db):
        self.db = db

    async def crear(self, arquitecto: Arquitecto) -> Arquitecto:
        nuevo = ArquitectoModel(**arquitecto.__dict__)
        self.db.add(nuevo)
        await self.db.commit()
        await self.db.refresh(nuevo)
        return Arquitecto(**nuevo.__dict__)

    async def obtener_todos(self):
        result = await self.db.execute(select(ArquitectoModel))
        return [Arquitecto(**row.__dict__) for row in result.scalars().all()]

    async def obtener_por_id(self, id_arquitecto: int):
        result = await self.db.get(ArquitectoModel, id_arquitecto)
        return Arquitecto(**result.__dict__) if result else None

    async def actualizar(self, id_arquitecto: int, datos: dict):
        await self.db.execute(update(ArquitectoModel).where(ArquitectoModel.id_arquitecto == id_arquitecto).values(**datos))
        await self.db.commit()
        return await self.obtener_por_id(id_arquitecto)

    async def eliminar(self, id_arquitecto: int):
        await self.db.execute(delete(ArquitectoModel).where(ArquitectoModel.id_arquitecto == id_arquitecto))
        await self.db.commit()
        return True
