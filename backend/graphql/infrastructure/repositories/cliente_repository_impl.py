from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.cliente_entity import Cliente
from infrastructure.repositories.cliente_repository import ClienteRepository
from infrastructure.orm.cliente_model import ClienteModel


class ClienteRepositoryImpl(ClienteRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ClienteModel) -> Cliente:
        return Cliente(
            id=str(m.id) if m.id else None,
            cedula=m.cedula,
            usuario_id=str(m.usuario_id),
        )

    async def crear(self, cliente: Cliente) -> Cliente:
        model = ClienteModel(
            cedula=cliente.cedula,
            usuario_id=cliente.usuario_id,
        )
        self.db.add(model)
        await self.db.commit()
        await self.db.refresh(model)
        return self._to_entity(model)

    async def obtener_todos(self) -> List[Cliente]:
        result = await self.db.execute(select(ClienteModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Cliente]:
        result = await self.db.execute(select(ClienteModel).where(ClienteModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Cliente]:
        result = await self.db.execute(select(ClienteModel).where(ClienteModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("cedula", "usuario_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ClienteModel).where(ClienteModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True

    async def existe_por_cedula(self, cedula: str) -> bool:
        result = await self.db.execute(select(ClienteModel).where(ClienteModel.cedula == cedula))
        return result.scalars().first() is not None
