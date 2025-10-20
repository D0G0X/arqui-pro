import strawberry
from typing import List
from adapters.schemas.estadisticas_schema import (
    DashboardMetricas,
    EstadisticasGenerales,
    EstadisticasArquitectos,
    EstadisticasProyectos,
    ProyectosPorTipo,
    ArquitectoTop,
    ProyectoReciente,
)
from application.use_cases.estadisticas_use_case import EstadisticasUseCase
from infrastructure.database import get_db


@strawberry.type
class QueryEstadisticas:
    @strawberry.field
    async def estadisticas_generales(self, info) -> EstadisticasGenerales:
        """Obtiene estadísticas generales del sistema"""
        async for db in get_db():
            use_case = EstadisticasUseCase(db)
            stats = await use_case.obtener_estadisticas_generales()
            return EstadisticasGenerales(
                total_usuarios=stats["total_usuarios"],
                total_arquitectos=stats["total_arquitectos"],
                total_clientes=stats["total_clientes"],
                total_moderadores=stats["total_moderadores"],
                total_proyectos=stats["total_proyectos"],
                total_conversaciones=stats["total_conversaciones"],
                total_valoraciones=stats["total_valoraciones"],
            )

    @strawberry.field
    async def estadisticas_arquitectos(self, info) -> EstadisticasArquitectos:
        """Obtiene estadísticas sobre arquitectos"""
        async for db in get_db():
            use_case = EstadisticasUseCase(db)
            stats = await use_case.obtener_estadisticas_arquitectos()
            return EstadisticasArquitectos(
                total=stats["total"],
                verificados=stats["verificados"],
                no_verificados=stats["no_verificados"],
                promedio_valoracion=stats["promedio_valoracion"],
                con_proyectos=stats["con_proyectos"],
                sin_proyectos=stats["sin_proyectos"],
            )

    @strawberry.field
    async def estadisticas_proyectos(self, info) -> EstadisticasProyectos:
        """Obtiene estadísticas sobre proyectos"""
        async for db in get_db():
            use_case = EstadisticasUseCase(db)
            stats = await use_case.obtener_estadisticas_proyectos()
            return EstadisticasProyectos(
                total=stats["total"],
                portafolio=stats["portafolio"],
                contratados=stats["contratados"],
                promedio_valoracion=stats["promedio_valoracion"],
                total_avances=stats["total_avances"],
                total_valoraciones=stats["total_valoraciones"],
            )

    @strawberry.field
    async def proyectos_por_tipo(self, info) -> List[ProyectosPorTipo]:
        """Obtiene conteo de proyectos agrupados por tipo"""
        async for db in get_db():
            use_case = EstadisticasUseCase(db)
            result = await use_case.obtener_proyectos_por_tipo()
            return [
                ProyectosPorTipo(
                    tipo=item["tipo"],
                    cantidad=item["cantidad"],
                    promedio_valoracion=item["promedio_valoracion"],
                )
                for item in result
            ]

    @strawberry.field
    async def top_arquitectos(self, info, limit: int = 5) -> List[ArquitectoTop]:
        """Obtiene los top arquitectos por valoración"""
        async for db in get_db():
            use_case = EstadisticasUseCase(db)
            result = await use_case.obtener_top_arquitectos(limit)
            return [
                ArquitectoTop(
                    id=item["id"],
                    nombre=item["nombre"],
                    apellido=item["apellido"],
                    cedula=item["cedula"],
                    promedio_valoracion=item["promedio_valoracion"],
                    total_proyectos=item["total_proyectos"],
                    verificado=item["verificado"],
                )
                for item in result
            ]

    @strawberry.field
    async def proyectos_recientes(self, info, limit: int = 5) -> List[ProyectoReciente]:
        """Obtiene los proyectos más recientes"""
        async for db in get_db():
            use_case = EstadisticasUseCase(db)
            result = await use_case.obtener_proyectos_recientes(limit)
            return [
                ProyectoReciente(
                    id=item["id"],
                    titulo=item["titulo"],
                    tipo=item["tipo"],
                    fecha_publicacion=item["fecha_publicacion"],
                    valoracion_promedio=item["valoracion_promedio"],
                    nombre_arquitecto=item["nombre_arquitecto"],
                )
                for item in result
            ]

    @strawberry.field
    async def dashboard_metricas(self, info) -> DashboardMetricas:
        """Obtiene todas las métricas para el dashboard administrativo"""
        async for db in get_db():
            use_case = EstadisticasUseCase(db)
            
            # Obtener todas las estadísticas
            generales = await use_case.obtener_estadisticas_generales()
            arquitectos = await use_case.obtener_estadisticas_arquitectos()
            proyectos = await use_case.obtener_estadisticas_proyectos()
            top_arq = await use_case.obtener_top_arquitectos(5)
            recientes = await use_case.obtener_proyectos_recientes(5)

            return DashboardMetricas(
                generales=EstadisticasGenerales(
                    total_usuarios=generales["total_usuarios"],
                    total_arquitectos=generales["total_arquitectos"],
                    total_clientes=generales["total_clientes"],
                    total_moderadores=generales["total_moderadores"],
                    total_proyectos=generales["total_proyectos"],
                    total_conversaciones=generales["total_conversaciones"],
                    total_valoraciones=generales["total_valoraciones"],
                ),
                arquitectos=EstadisticasArquitectos(
                    total=arquitectos["total"],
                    verificados=arquitectos["verificados"],
                    no_verificados=arquitectos["no_verificados"],
                    promedio_valoracion=arquitectos["promedio_valoracion"],
                    con_proyectos=arquitectos["con_proyectos"],
                    sin_proyectos=arquitectos["sin_proyectos"],
                ),
                proyectos=EstadisticasProyectos(
                    total=proyectos["total"],
                    portafolio=proyectos["portafolio"],
                    contratados=proyectos["contratados"],
                    promedio_valoracion=proyectos["promedio_valoracion"],
                    total_avances=proyectos["total_avances"],
                    total_valoraciones=proyectos["total_valoraciones"],
                ),
                top_arquitectos=[
                    ArquitectoTop(
                        id=item["id"],
                        nombre=item["nombre"],
                        apellido=item["apellido"],
                        cedula=item["cedula"],
                        promedio_valoracion=item["promedio_valoracion"],
                        total_proyectos=item["total_proyectos"],
                        verificado=item["verificado"],
                    )
                    for item in top_arq
                ],
                proyectos_recientes=[
                    ProyectoReciente(
                        id=item["id"],
                        titulo=item["titulo"],
                        tipo=item["tipo"],
                        fecha_publicacion=item["fecha_publicacion"],
                        valoracion_promedio=item["valoracion_promedio"],
                        nombre_arquitecto=item["nombre_arquitecto"],
                    )
                    for item in recientes
                ],
            )
