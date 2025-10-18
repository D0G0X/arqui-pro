from abc import ABC, abstractmethod
from typing import List, Optional
from domain.entitiesPy.imagen_asociacion_entity import ImagenAsociacion


class ImagenAsociacionRepository(ABC):
    @abstractmethod
    async def crear(self, obj: ImagenAsociacion) -> ImagenAsociacion: ...

    @abstractmethod
    async def obtener_todos(self) -> List[ImagenAsociacion]: ...

    @abstractmethod
    async def obtener_por_id(self, id_: str) -> Optional[ImagenAsociacion]: ...

    @abstractmethod
    async def actualizar(self, id_: str, datos: dict) -> Optional[ImagenAsociacion]: ...

    @abstractmethod
    async def eliminar(self, id_: str) -> bool: ...
