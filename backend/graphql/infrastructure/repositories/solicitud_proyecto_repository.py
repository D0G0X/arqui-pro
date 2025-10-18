from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.solicitud_proyecto_entity import SolicitudProyecto


class SolicitudProyectoRepository(ABC):
    @abstractmethod
    async def crear(self, obj: SolicitudProyecto) -> SolicitudProyecto: ...

    @abstractmethod
    async def obtener_todos(self) -> List[SolicitudProyecto]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[SolicitudProyecto]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[SolicitudProyecto]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
