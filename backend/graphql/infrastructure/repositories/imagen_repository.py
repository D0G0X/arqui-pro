from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.imagen_entity import Imagen


class ImagenRepository(ABC):
    @abstractmethod
    async def crear(self, obj: Imagen) -> Imagen: ...

    @abstractmethod
    async def obtener_todos(self) -> List[Imagen]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[Imagen]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[Imagen]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
