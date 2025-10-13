import strawberry
from typing import List, Optional
from adapters.graphql.schemas.usuario_schema import UsuarioType, UsuarioInput
from application.use_cases.usuario_use_case import UsuarioUseCase
from infrastructure.database import get_db
from infrastructure.repositories.usuario_repository_impl import UsuarioRepositoryImpl

@strawberry.type
class QueryUsuario:
    @strawberry.field
    async def listar_usuarios(self, info) -> List[UsuarioType]:
        async for db in get_db():
            repo = UsuarioRepositoryImpl(db)
            use_case = UsuarioUseCase(repo)
            usuarios = await use_case.listar_usuarios()
            return [
                UsuarioType(
                    id=u.id,
                    nombre=u.nombre,
                    apellido=u.apellido,
                    email=u.email,
                    estado_cuenta=u.estado_cuenta,
                    rol=u.rol,
                    fecha_registro=u.fecha_registro,
                    foto_perfil=u.foto_perfil,
                    created_at=u.created_at,
                    updated_at=u.updated_at,
                )
                for u in usuarios
            ]

    @strawberry.field
    async def obtener_usuario(self, info, id: strawberry.ID) -> Optional[UsuarioType]:
        async for db in get_db():
            repo = UsuarioRepositoryImpl(db)
            use_case = UsuarioUseCase(repo)
            u = await use_case.obtener_usuario(str(id))
            if not u:
                return None
            return UsuarioType(
                id=u.id,
                nombre=u.nombre,
                apellido=u.apellido,
                email=u.email,
                estado_cuenta=u.estado_cuenta,
                rol=u.rol,
                fecha_registro=u.fecha_registro,
                foto_perfil=u.foto_perfil,
                created_at=u.created_at,
                updated_at=u.updated_at,
            )

@strawberry.type
class MutationUsuario:
    @strawberry.mutation
    async def crear_usuario(self, info, input: UsuarioInput) -> UsuarioType:
        async for db in get_db():
            repo = UsuarioRepositoryImpl(db)
            use_case = UsuarioUseCase(repo)
            datos = {
                "nombre": input.nombre,
                "apellido": input.apellido,
                "email": input.email,
                "password_hash": input.password,  # en producción: hash aquí
                "estado_cuenta": input.estado_cuenta,
                "rol": input.rol,
                "foto_perfil": input.foto_perfil,
            }
            nuevo = await use_case.crear_usuario(datos)
            return UsuarioType(
                id=nuevo.id,
                nombre=nuevo.nombre,
                apellido=nuevo.apellido,
                email=nuevo.email,
                estado_cuenta=nuevo.estado_cuenta,
                rol=nuevo.rol,
                fecha_registro=nuevo.fecha_registro,
                foto_perfil=nuevo.foto_perfil,
                created_at=nuevo.created_at,
                updated_at=nuevo.updated_at,
            )