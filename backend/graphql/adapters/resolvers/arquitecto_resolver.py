import strawberry
from typing import List, Optional
from adapters.schemas.arquitecto_schema import ArquitectoType, ArquitectoInput
from application.use_cases.arquitecto_use_case import ArquitectoUseCase
from infrastructure.database import get_db
from infrastructure.repositories.arquitecto_repository_impl import ArquitectoRepositoryImpl


@strawberry.type
class QueryArquitecto:
    @strawberry.field
    async def listar_arquitectos(self, info) -> List[ArquitectoType]:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            items = await use_case.listar()
            return [
                ArquitectoType(
                    id=a.id,
                    cedula=a.cedula,
                    valoracion_prom_proyecto=a.valoracion_prom_proyecto,
                    descripcion=a.descripcion,
                    especialidades=a.especialidades,
                    ubicacion=a.ubicacion,
                    verificado=a.verificado,
                    vistas_perfil=a.vistas_perfil,
                    usuario_id=a.usuario_id,
                ) for a in items
            ]

    @strawberry.field
    async def obtener_arquitecto(self, info, id: strawberry.ID) -> Optional[ArquitectoType]:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            a = await use_case.obtener(str(id))
            if not a:
                return None
            return ArquitectoType(
                id=a.id,
                cedula=a.cedula,
                valoracion_prom_proyecto=a.valoracion_prom_proyecto,
                descripcion=a.descripcion,
                especialidades=a.especialidades,
                ubicacion=a.ubicacion,
                verificado=a.verificado,
                vistas_perfil=a.vistas_perfil,
                usuario_id=a.usuario_id,
            )


@strawberry.type
class MutationArquitecto:
    @strawberry.mutation
    async def crear_arquitecto(self, info, input: ArquitectoInput) -> ArquitectoType:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ArquitectoType(
                id=nuevo.id,
                cedula=nuevo.cedula,
                valoracion_prom_proyecto=nuevo.valoracion_prom_proyecto,
                descripcion=nuevo.descripcion,
                especialidades=nuevo.especialidades,
                ubicacion=nuevo.ubicacion,
                verificado=nuevo.verificado,
                vistas_perfil=nuevo.vistas_perfil,
                usuario_id=nuevo.usuario_id,
            )

    @strawberry.mutation
    async def actualizar_arquitecto(self, info, id: strawberry.ID, input: ArquitectoInput) -> Optional[ArquitectoType]:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            if not actualizado:
                return None
            return ArquitectoType(
                id=actualizado.id,
                cedula=actualizado.cedula,
                valoracion_prom_proyecto=actualizado.valoracion_prom_proyecto,
                descripcion=actualizado.descripcion,
                especialidades=actualizado.especialidades,
                ubicacion=actualizado.ubicacion,
                verificado=actualizado.verificado,
                vistas_perfil=actualizado.vistas_perfil,
                usuario_id=actualizado.usuario_id,
            )

    @strawberry.mutation
    async def eliminar_arquitecto(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            return await use_case.eliminar(str(id))
import strawberry
from typing import List, Optional
from adapters.schemas.arquitecto_schema import ArquitectoType, ArquitectoInput
from application.use_cases.arquitecto_use_case import ArquitectoUseCase
from infrastructure.database import get_db
from infrastructure.repositories.arquitecto_repository_impl import ArquitectoRepositoryImpl


@strawberry.type
class QueryArquitecto:
    @strawberry.field
    async def listar_arquitectos(self, info) -> List[ArquitectoType]:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            items = await use_case.listar()
            return [
                ArquitectoType(
                    id=a.id,
                    cedula=a.cedula,
                    valoracion_prom_proyecto=a.valoracion_prom_proyecto,
                    descripcion=a.descripcion,
                    especialidades=a.especialidades,
                    ubicacion=a.ubicacion,
                    verificado=a.verificado,
                    vistas_perfil=a.vistas_perfil,
                    usuario_id=a.usuario_id,
                ) for a in items
            ]

    @strawberry.field
    async def obtener_arquitecto(self, info, id: strawberry.ID) -> Optional[ArquitectoType]:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            a = await use_case.obtener(str(id))
            if not a:
                return None
            return ArquitectoType(
                id=a.id,
                cedula=a.cedula,
                valoracion_prom_proyecto=a.valoracion_prom_proyecto,
                descripcion=a.descripcion,
                especialidades=a.especialidades,
                ubicacion=a.ubicacion,
                verificado=a.verificado,
                vistas_perfil=a.vistas_perfil,
                usuario_id=a.usuario_id,
            )


@strawberry.type
class MutationArquitecto:
    @strawberry.mutation
    async def crear_arquitecto(self, info, input: ArquitectoInput) -> ArquitectoType:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ArquitectoType(**nuevo.__dict__)

    @strawberry.mutation
    async def actualizar_arquitecto(self, info, id: strawberry.ID, input: ArquitectoInput) -> Optional[ArquitectoType]:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return ArquitectoType(**actualizado.__dict__) if actualizado else None

    @strawberry.mutation
    async def eliminar_arquitecto(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ArquitectoRepositoryImpl(db)
            use_case = ArquitectoUseCase(repo)
            return await use_case.eliminar(str(id))
