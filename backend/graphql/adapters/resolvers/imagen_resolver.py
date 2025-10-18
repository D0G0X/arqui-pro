import strawberry
from typing import List, Optional
from adapters.schemas.imagen_schema import ImagenType, ImagenInput
from application.use_cases.imagen_use_case import ImagenUseCase
from infrastructure.database import get_db
from infrastructure.repositories.imagen_repository_impl import ImagenRepositoryImpl


@strawberry.type
class QueryImagen:
    @strawberry.field
    async def listar_imagenes(self, info) -> List[ImagenType]:
        async for db in get_db():
            repo = ImagenRepositoryImpl(db)
            use_case = ImagenUseCase(repo)
            items = await use_case.listar()
            return [ImagenType(id=i.id, imagen_url=i.imagen_url, fecha=i.fecha) for i in items]

    @strawberry.field
    async def obtener_imagen(self, info, id: strawberry.ID) -> Optional[ImagenType]:
        async for db in get_db():
            repo = ImagenRepositoryImpl(db)
            use_case = ImagenUseCase(repo)
            i = await use_case.obtener(str(id))
            return ImagenType(id=i.id, imagen_url=i.imagen_url, fecha=i.fecha) if i else None


@strawberry.type
class MutationImagen:
    @strawberry.mutation
    async def crear_imagen(self, info, input: ImagenInput) -> ImagenType:
        async for db in get_db():
            repo = ImagenRepositoryImpl(db)
            use_case = ImagenUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ImagenType(id=nuevo.id, imagen_url=nuevo.imagen_url, fecha=nuevo.fecha)

    @strawberry.mutation
    async def actualizar_imagen(self, info, id: strawberry.ID, input: ImagenInput) -> Optional[ImagenType]:
        async for db in get_db():
            repo = ImagenRepositoryImpl(db)
            use_case = ImagenUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            return ImagenType(id=actualizado.id, imagen_url=actualizado.imagen_url, fecha=actualizado.fecha) if actualizado else None

    @strawberry.mutation
    async def eliminar_imagen(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ImagenRepositoryImpl(db)
            use_case = ImagenUseCase(repo)
            return await use_case.eliminar(str(id))
