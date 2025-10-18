from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.arquitecto_entity import Arquitecto


class ArquitectoRepository(ABC):
    @abstractmethod
    async def crear(self, arquitecto: Arquitecto) -> Arquitecto: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Arquitecto]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Arquitecto]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Arquitecto]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...

    @abstractmethod
    async def existe_por_cedula(self, cedula: str) -> bool: ...
