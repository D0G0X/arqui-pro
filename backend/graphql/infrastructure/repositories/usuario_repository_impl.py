from sqlalchemy.future import select
from sqlalchemy import update, delete
from typing import List, Optional
from domain.entitiesPy.usuario_entity import Usuario
from infrastructure.repositories.usuario_repository import UsuarioRepository
from infrastructure.orm.usuario_model import UsuarioModel

class UsuarioRepositoryImpl(UsuarioRepository):
    def __init__(self, db):
        self.db = db

    async def crear(self, usuario: Usuario) -> Usuario:
        model = UsuarioModel(
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            email=usuario.email,
            estado_cuenta=usuario.estado_cuenta,
            password=usuario.password_hash,
            rol=usuario.rol,
            foto_perfil=usuario.foto_perfil,
        )
        self.db.add(model)
        await self.db.commit()
        await self.db.refresh(model)
        return Usuario(
            id=str(model.id) if model.id else None,
            nombre=model.nombre,
            apellido=model.apellido,
            email=model.email,
            estado_cuenta=model.estado_cuenta,
            password_hash=model.password,
            rol=model.rol,
            fecha_registro=model.fecha_registro,
            foto_perfil=model.foto_perfil

        )

    async def obtener_todos(self) -> List[Usuario]:
        result = await self.db.execute(select(UsuarioModel))
        modelos = result.scalars().all()
        return [
            Usuario(
                id=str(m.id) if m.id else None,
                nombre=m.nombre,
                apellido=m.apellido,
                email=m.email,
                estado_cuenta=m.estado_cuenta,
                password_hash=m.password,
                rol=m.rol,
                fecha_registro=m.fecha_registro,
                foto_perfil=m.foto_perfil
            )
            for m in modelos
        ]

    async def obtener_por_id(self, id_usuario: str) -> Optional[Usuario]:
        model = await self.db.get(UsuarioModel, id_usuario)
        if not model:
            return None
        return Usuario(
            id=str(model.id),
            nombre=model.nombre,
            apellido=model.apellido,
            email=model.email,
            estado_cuenta=model.estado_cuenta,
            password_hash=model.password,
            rol=model.rol,
            fecha_registro=model.fecha_registro,
            foto_perfil=model.foto_perfil
        )

    async def actualizar(self, id_usuario: str, datos: dict) -> Usuario:
        await self.db.execute(
            update(UsuarioModel)
            .where(UsuarioModel.id == id_usuario)
            .values(**datos)
        )
        await self.db.commit()
        return await self.obtener_por_id(id_usuario)

    async def eliminar(self, id_usuario: str) -> bool:
        await self.db.execute(
            delete(UsuarioModel).where(UsuarioModel.id == id_usuario)
        )
        await self.db.commit()
        return True