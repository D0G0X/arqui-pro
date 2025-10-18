import strawberry
from typing import List, Optional
from adapters.schemas.proyecto_schema import ProyectoType, ProyectoInput
from application.use_cases.proyecto_use_case import ProyectoUseCase
from infrastructure.database import get_db
from infrastructure.repositories.proyecto_repository_impl import ProyectoRepositoryImpl


@strawberry.type
class QueryProyecto:
    @strawberry.field
    async def listar_proyectos(self, info) -> List[ProyectoType]:
        async for db in get_db():
            repo = ProyectoRepositoryImpl(db)
            use_case = ProyectoUseCase(repo)
            items = await use_case.listar()
            return [
                ProyectoType(
                    id=p.id,
                    titulo_proyecto=p.titulo_proyecto,
                    valoracion_promedio=p.valoracion_promedio,
                    descripcion=p.descripcion,
                    tipo_proyecto=p.tipo_proyecto,
                    fecha_publicacion=p.fecha_publicacion,
                    arquitecto_id=p.arquitecto_id,
                    conversacion_id=p.conversacion_id,
                    cliente_id=p.cliente_id,
                    solicitud_proyecto_id=p.solicitud_proyecto_id,
                ) for p in items
            ]

    @strawberry.field
    async def obtener_proyecto(self, info, id: strawberry.ID) -> Optional[ProyectoType]:
        async for db in get_db():
            repo = ProyectoRepositoryImpl(db)
            use_case = ProyectoUseCase(repo)
            p = await use_case.obtener(str(id))
            if not p:
                return None
            return ProyectoType(
                id=p.id,
                titulo_proyecto=p.titulo_proyecto,
                valoracion_promedio=p.valoracion_promedio,
                descripcion=p.descripcion,
                tipo_proyecto=p.tipo_proyecto,
                fecha_publicacion=p.fecha_publicacion,
                arquitecto_id=p.arquitecto_id,
                conversacion_id=p.conversacion_id,
                cliente_id=p.cliente_id,
                solicitud_proyecto_id=p.solicitud_proyecto_id,
            )


@strawberry.type
class MutationProyecto:
    @strawberry.mutation
    async def crear_proyecto(self, info, input: ProyectoInput) -> ProyectoType:
        async for db in get_db():
            repo = ProyectoRepositoryImpl(db)
            use_case = ProyectoUseCase(repo)
            nuevo = await use_case.crear(input.__dict__)
            return ProyectoType(
                id=nuevo.id,
                titulo_proyecto=nuevo.titulo_proyecto,
                valoracion_promedio=nuevo.valoracion_promedio,
                descripcion=nuevo.descripcion,
                tipo_proyecto=nuevo.tipo_proyecto,
                fecha_publicacion=nuevo.fecha_publicacion,
                arquitecto_id=nuevo.arquitecto_id,
                conversacion_id=nuevo.conversacion_id,
                cliente_id=nuevo.cliente_id,
                solicitud_proyecto_id=nuevo.solicitud_proyecto_id,
            )

    @strawberry.mutation
    async def actualizar_proyecto(self, info, id: strawberry.ID, input: ProyectoInput) -> Optional[ProyectoType]:
        async for db in get_db():
            repo = ProyectoRepositoryImpl(db)
            use_case = ProyectoUseCase(repo)
            actualizado = await use_case.actualizar(str(id), input.__dict__)
            if not actualizado:
                return None
            return ProyectoType(
                id=actualizado.id,
                titulo_proyecto=actualizado.titulo_proyecto,
                valoracion_promedio=actualizado.valoracion_promedio,
                descripcion=actualizado.descripcion,
                tipo_proyecto=actualizado.tipo_proyecto,
                fecha_publicacion=actualizado.fecha_publicacion,
                arquitecto_id=actualizado.arquitecto_id,
                conversacion_id=actualizado.conversacion_id,
                cliente_id=actualizado.cliente_id,
                solicitud_proyecto_id=actualizado.solicitud_proyecto_id,
            )

    @strawberry.mutation
    async def eliminar_proyecto(self, info, id: strawberry.ID) -> bool:
        async for db in get_db():
            repo = ProyectoRepositoryImpl(db)
            use_case = ProyectoUseCase(repo)
            return await use_case.eliminar(str(id))
