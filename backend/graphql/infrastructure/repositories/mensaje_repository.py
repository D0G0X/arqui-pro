from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.mensaje_entity import Mensaje


class MensajeRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Mensaje) -> Mensaje: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Mensaje]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Mensaje]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Mensaje]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
