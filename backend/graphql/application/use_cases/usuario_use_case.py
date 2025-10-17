from domain.entitiesPy.usuario_entity import Usuario
from infrastructure.repositories.usuario_repository import UsuarioRepository
from typing import List, Optional
from graphql import GraphQLError

class UsuarioUseCase:
    def __init__(self, repo: UsuarioRepository):
        self.repo = repo

    async def crear_usuario(self, datos: dict) -> Usuario:
        # validaciones mínimas
        if not datos.get("nombre") or not datos.get("apellido") or not datos.get("email") or not datos.get("password_hash"):
            raise ValueError("nombre, apellido, email y password son requeridos")
        # en producción: hashear password aquí (bcrypt/argon2)
        usuario = Usuario(
            id=None,
            nombre=datos["nombre"],
            apellido=datos["apellido"],
            email=datos["email"],
            estado_cuenta=datos.get("estado_cuenta", "activo"),
            password_hash=datos["password_hash"],
            rol=datos.get("rol", "user"),
            foto_perfil=datos.get("foto_perfil"),
        )
        return await self.repo.crear(usuario)

    async def listar_usuarios(self) -> List[Usuario]:
        return await self.repo.obtener_todos()

    async def obtener_usuario(self, id_usuario: str) -> Optional[Usuario]:
        return await self.repo.obtener_por_id(id_usuario)

    async def actualizar_usuario(self, id_usuario: str, datos: dict) -> Optional[Usuario]:
        # validar existencia
        existente = await self.repo.obtener_por_id(id_usuario)
        if not existente:
            raise GraphQLError("usuario no encontrado", extensions={"code": "404"})
        # si email cambia, comprobar duplicado
        new_email = datos.get("email")
        if new_email and new_email != existente.email:
            if await self.repo.existe_por_email(new_email):
                raise GraphQLError("email ya existente", extensions={"code": "202"})
        # validar formato simple email
        if new_email and "@" not in new_email:
            raise GraphQLError("email inválido", extensions={"code": "400"})
        # reglas de negocio simples para rol
        rol = datos.get("rol", existente.rol)
        allowed_roles = {"user", "admin", "cliente"}
        if rol not in allowed_roles:
            raise GraphQLError(f"rol no permitido: {rol}", extensions={"code": "300"})
        # en producción: si password_hash viene, hashear antes de guardar
        # delegar al repo para actualizar
        actualizado = await self.repo.actualizar(id_usuario, datos)
        return actualizado

    async def eliminar_usuario(self, id_usuario: str) -> bool:
        existente = await self.repo.obtener_por_id(id_usuario)
        if not existente:
            raise GraphQLError("usuario no encontrado", extensions={"code": "404"})
        return await self.repo.eliminar(id_usuario)