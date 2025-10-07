# src/application/use_cases/arquitecto_use_case.py
from domain.entitiesPy.arquitecto_entity import Arquitecto
from infrastructure.repositories.arquitecto_repository import ArquitectoRepository

class ArquitectoUseCase:
    def __init__(self, repo: ArquitectoRepository):
        self.repo = repo

    async def crear_arquitecto(self, datos: dict):
        arquitecto = Arquitecto(**datos)
        return await self.repo.crear(arquitecto)

    async def listar_arquitectos(self):
        return await self.repo.obtener_todos()
