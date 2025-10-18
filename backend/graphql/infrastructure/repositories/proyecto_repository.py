from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.proyecto_entity import Proyecto


class ProyectoRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Proyecto) -> Proyecto: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Proyecto]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Proyecto]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Proyecto]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
