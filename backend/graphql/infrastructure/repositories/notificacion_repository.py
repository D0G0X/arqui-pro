from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.notificacion_entity import Notificacion


class NotificacionRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Notificacion) -> Notificacion: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Notificacion]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Notificacion]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Notificacion]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
