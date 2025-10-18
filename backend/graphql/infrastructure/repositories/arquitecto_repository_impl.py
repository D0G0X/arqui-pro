from typing import List, Optional
from sqlalchemy.future import select
from domain.entitiesPy.arquitecto_entity import Arquitecto
from infrastructure.repositories.arquitecto_repository import ArquitectoRepository
from infrastructure.orm.arquitecto_model import ArquitectoModel


class ArquitectoRepositoryImpl(ArquitectoRepository):
    def __init__(self, db):
        self.db = db

    def _to_entity(self, m: ArquitectoModel) -> Arquitecto:
        return Arquitecto(
            id=str(m.id) if m.id else None,
            cedula=m.cedula,
            valoracion_prom_proyecto=m.valoracion_prom_proyecto,
            descripcion=m.descripcion,
            especialidades=m.especialidades,
            ubicacion=m.ubicacion,
            verificado=m.verificado,
            vistas_perfil=m.vistas_perfil,
            usuario_id=str(m.usuario_id),
        )

    async def crear(self, arquitecto: Arquitecto) -> Arquitecto:
        model = ArquitectoModel(
            cedula=arquitecto.cedula,
            valoracion_prom_proyecto=arquitecto.valoracion_prom_proyecto,
            descripcion=arquitecto.descripcion,
            especialidades=arquitecto.especialidades,
            ubicacion=arquitecto.ubicacion,
            verificado=arquitecto.verificado,
            vistas_perfil=arquitecto.vistas_perfil,
            usuario_id=arquitecto.usuario_id,
        )
        self.db.add(model)
        await self.db.commit()
        await self.db.refresh(model)
        return self._to_entity(model)

    async def obtener_todos(self) -> List[Arquitecto]:
        result = await self.db.execute(select(ArquitectoModel))
        return [self._to_entity(m) for m in result.scalars().all()]

    async def obtener_por_id(self, id_: str) -> Optional[Arquitecto]:
        result = await self.db.execute(select(ArquitectoModel).where(ArquitectoModel.id == id_))
        m = result.scalars().first()
        return self._to_entity(m) if m else None

    async def actualizar(self, id_: str, datos: dict) -> Optional[Arquitecto]:
        result = await self.db.execute(select(ArquitectoModel).where(ArquitectoModel.id == id_))
        m = result.scalars().first()
        if not m:
            return None
        for key in ("cedula", "valoracion_prom_proyecto", "descripcion", "especialidades", "ubicacion", "verificado", "vistas_perfil", "usuario_id"):
            if key in datos and datos[key] is not None:
                setattr(m, key, datos[key])
        self.db.add(m)
        await self.db.commit()
        await self.db.refresh(m)
        return self._to_entity(m)

    async def eliminar(self, id_: str) -> bool:
        result = await self.db.execute(select(ArquitectoModel).where(ArquitectoModel.id == id_))
        m = result.scalars().first()
        if not m:
            return False
        await self.db.delete(m)
        await self.db.commit()
        return True

    async def existe_por_cedula(self, cedula: str) -> bool:
        result = await self.db.execute(select(ArquitectoModel).where(ArquitectoModel.cedula == cedula))
        return result.scalars().first() is not None
