from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.moderador_entity import Moderador


class ModeradorRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Moderador) -> Moderador: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Moderador]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Moderador]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Moderador]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
