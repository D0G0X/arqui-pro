from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.conversacion_entity import Conversacion


class ConversacionRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Conversacion) -> Conversacion: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Conversacion]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Conversacion]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Conversacion]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
