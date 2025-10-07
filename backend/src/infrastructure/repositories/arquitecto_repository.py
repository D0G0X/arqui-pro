# src/domain/repositories/arquitecto_repository.py
from abc import ABC, abstractmethod
from domain.entitiesPy.arquitecto_entity import Arquitecto

class ArquitectoRepository(ABC):

    @abstractmethod
    async def crear(self, arquitecto: Arquitecto) -> Arquitecto:
        pass

    @abstractmethod
    async def obtener_todos(self) -> list[Arquitecto]:
        pass

    @abstractmethod
    async def obtener_por_id(self, id_arquitecto: int) -> Arquitecto | None:
        pass

    @abstractmethod
    async def actualizar(self, id_arquitecto: int, datos: dict) -> Arquitecto:
        pass

    @abstractmethod
    async def eliminar(self, id_arquitecto: int) -> bool:
        pass
