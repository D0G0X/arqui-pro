from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.cliente_entity import Cliente


class ClienteRepository(ABC):
    @abstractmethod
    async def crear(self, cliente: Cliente) -> Cliente: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Cliente]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Cliente]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Cliente]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...

    @abstractmethod
    async def existe_por_cedula(self, cedula: str) -> bool: ...
