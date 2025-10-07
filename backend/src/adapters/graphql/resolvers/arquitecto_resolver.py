# src/adapters/graphql/resolvers/arquitecto_resolver.py
import strawberry
from typing import List
from adapters.graphql.schemas.arquitecto_schema import ArquitectoType
from application.use_cases.arquitecto_use_case import ArquitectoUseCase
from infrastructure.database import get_db
from infrastructure.repositories.arquitecto_repository_impl import ArquitectoRepositoryImpl

@strawberry.type
class Query:
    @strawberry.field
    async def listar_arquitectos(self, info) -> List[ArquitectoType]:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            arquitectos = await use_case.listar_arquitectos()
            return [ArquitectoType(**a.__dict__) for a in arquitectos]

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def crear_arquitecto(
        self, info, cedula: str, descripcion: str, especialidades: str, ubicacion: str
    ) -> ArquitectoType:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            nuevo = await use_case.crear_arquitecto({
                "id_arquitecto": None,
                "cedula": cedula,
                "valoracion_prom_proyecto": 0,
                "descripcion": descripcion,
                "especialidades": especialidades,
                "ubicacion": ubicacion,
                "verificado": False,
                "vistas_perfil": 0
            })
            return ArquitectoType(**nuevo.__dict__)
