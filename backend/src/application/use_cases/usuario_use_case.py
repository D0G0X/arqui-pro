from domain.entitiesPy.usuario_entity import Usuario
from infrastructure.repositories.usuario_repository import UsuarioRepository
from typing import List, Optional

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

    async def actualizar_usuario(self, id_usuario: str, datos: dict) -> Usuario:
        return await self.repo.actualizar(id_usuario, datos)

    async def eliminar_usuario(self, id_usuario: str) -> bool:
        return await self.repo.eliminar(id_usuario)