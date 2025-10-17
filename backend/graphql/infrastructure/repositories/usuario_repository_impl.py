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
        rows = result.scalars().all()
        return [
            Usuario(
                id=str(r.id),
                nombre=r.nombre,
                apellido=r.apellido,
                email=r.email,
                estado_cuenta=r.estado_cuenta,
                password_hash=r.password,
                rol=r.rol,
                fecha_registro=r.fecha_registro,
                foto_perfil=r.foto_perfil
            ) for r in rows
        ]

    async def obtener_por_id(self, id_usuario: str) -> Optional[Usuario]:
        result = await self.db.execute(select(UsuarioModel).where(UsuarioModel.id == id_usuario))
        r = result.scalars().first()
        if not r:
            return None
        return Usuario(
            id=str(r.id),
            nombre=r.nombre,
            apellido=r.apellido,
            email=r.email,
            estado_cuenta=r.estado_cuenta,
            password_hash=r.password,
            rol=r.rol,
            fecha_registro=r.fecha_registro,
            foto_perfil=r.foto_perfil
        )

    async def actualizar(self, id_usuario: str, datos: dict) -> Optional[Usuario]:
        # traer modelo
        result = await self.db.execute(select(UsuarioModel).where(UsuarioModel.id == id_usuario))
        model = result.scalars().first()
        if not model:
            return None
        # actualizar campos permitidos
        for key in ("nombre", "apellido", "email", "estado_cuenta", "rol", "foto_perfil"):
            if key in datos and datos[key] is not None:
                setattr(model, key, datos[key])
        # password si viene (en producción: hash)
        if "password_hash" in datos and datos["password_hash"]:
            model.password = datos["password_hash"]
        self.db.add(model)
        await self.db.commit()
        await self.db.refresh(model)
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

    async def eliminar(self, id_usuario: str) -> bool:
        result = await self.db.execute(select(UsuarioModel).where(UsuarioModel.id == id_usuario))
        model = result.scalars().first()
        if not model:
            return False
        await self.db.delete(model)
        await self.db.commit()
        return True

    async def existe_por_email(self, email: str) -> bool:
        result = await self.db.execute(select(UsuarioModel).where(UsuarioModel.email == email))
        return result.scalars().first() is not None