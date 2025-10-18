import strawberry
from typing import List, Optional
from adapters.schemas.imagen_asociacion_schema import ImagenAsociacionType, ImagenAsociacionInput
from application.use_cases.imagen_asociacion_use_case import ImagenAsociacionUseCase
from infrastructure.database import get_db
from infrastructure.repositories.imagen_asociacion_repository_impl import ImagenAsociacionRepositoryImpl


@strawberry.type
class QueryImagenAsociacion:
    @strawberry.field
    async def listar_imagen_asociaciones(self, info) -> List[ImagenAsociacionType]:
        async for db in get_db():
            repo = ImagenAsociacionRepositoryImpl(db)
            use_case = ImagenAsociacionUseCase(repo)
            items = await use_case.listar()
            return [
                ImagenAsociacionType(id=ia.id, asociable_type=ia.asociable_type, asociable_id=ia.asociable_id, imagen_id=ia.imagen_id)
                for ia in items
            ]

    @strawberry.field
    async def obtener_imagen_asociacion(self, info, id: strawberry.ID) -> Optional[ImagenAsociacionType]:
        async for db in get_db():
            repo = ImagenAsociacionRepositoryImpl(db)
            use_case = ImagenAsociacionUseCase(repo)
            ia = await use_case.obtener(str(id))
            return ImagenAsociacionType(id=ia.id, asociable_type=ia.asociable_type, asociable_id=ia.asociable_id, imagen_id=ia.imagen_id) if ia else None


@strawberry.type
class MutationImagenAsociacion:
    @strawberry.mutation
    async def crear_imagen_asociacion(self, info, input: ImagenAsociacionInput) -> ImagenAsociacionType:
        async for db in get_db():
            repo = ImagenAsociacionRepositoryImpl(db)
            use_case = ImagenAsociacionUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ImagenAsociacionType(id=nuevo.id, asociable_type=nuevo.asociable_type, asociable_id=nuevo.asociable_id, imagen_id=nuevo.imagen_id)

    @strawberry.mutation
    async def actualizar_imagen_asociacion(self, info, id: strawberry.ID, input: ImagenAsociacionInput) -> Optional[ImagenAsociacionType]:
        async for db in get_db():
            repo = ImagenAsociacionRepositoryImpl(db)
            use_case = ImagenAsociacionUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return ImagenAsociacionType(id=actualizado.id, asociable_type=actualizado.asociable_type, asociable_id=actualizado.asociable_id, imagen_id=actualizado.imagen_id) if actualizado else None

    @strawberry.mutation
    async def eliminar_imagen_asociacion(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ImagenAsociacionRepositoryImpl(db)
            use_case = ImagenAsociacionUseCase(repo)
            return await use_case.eliminar(str(id))
