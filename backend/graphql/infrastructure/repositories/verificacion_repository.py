from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.verificacion_entity import Verificacion


class VerificacionRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Verificacion) -> Verificacion: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Verificacion]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Verificacion]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Verificacion]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
