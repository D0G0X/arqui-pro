from abc import ABC, abstractmethod
from domain.entitiesPy.usuario_entity import Usuario
from typing import List, Optional

class UsuarioRepository(ABC):

    @abstractmethod
    async def crear(self, usuario: Usuario) -> Usuario:
        pass

    @abstractmethod
    async def obtener_todos(self) -> List[Usuario]:
        pass

    @abstractmethod
    async def obtener_por_id(self, id_usuario: str) -> Optional[Usuario]:
        pass

    @abstractmethod
    async def actualizar(self, id_usuario: str, datos: dict) -> Usuario:
        pass

    @abstractmethod
    async def eliminar(self, id_usuario: str) -> bool:
        pass