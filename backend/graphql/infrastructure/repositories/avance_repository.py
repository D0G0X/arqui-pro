from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.avance_entity import Avance


class AvanceRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Avance) -> Avance: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Avance]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Avance]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Avance]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
