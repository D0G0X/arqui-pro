from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.valoracion_entity import Valoracion


class ValoracionRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Valoracion) -> Valoracion: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Valoracion]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Valoracion]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Valoracion]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
