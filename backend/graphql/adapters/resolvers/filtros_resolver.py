"""
Resolvers para filtros y búsqueda
"""
import strawberry
from typing import List, Optional
from datetime import date

from adapters.schemas.arquitecto_schema import ArquitectoType
from adapters.schemas.proyecto_schema import ProyectoType
from adapters.schemas.filtros_schema import (
    FiltroArquitectoInput,
    FiltroProyectoInput,
    BusquedaGlobalInput,
    ResultadoBusquedaGlobal
)
from application.use_cases.filtros_use_case import FiltrosUseCase
from infrastructure.database import get_db


@strawberry.type
class QueryFiltros:
    """Queries de filtros y búsqueda"""

    @strawberry.field
    async def buscar_arquitectos(
        self,
        filtro: Optional[FiltroArquitectoInput] = None
    ) -> List[ArquitectoType]:
        """
        Buscar arquitectos con filtros opcionales
        
        Ejemplos:
        - Por especialidad: filtro: { especialidad: "residencial" }
        - Por ubicación: filtro: { ubicacion: "Madrid" }
        - Verificados: filtro: { verificado: true }
        - Con buena valoración: filtro: { valoracionMinima: 4.5 }
        - Combinado: filtro: { especialidad: "comercial", verificado: true, valoracionMinima: 4.0 }
        """
        async for db in get_db():
            use_case = FiltrosUseCase()
            
            # Extraer parámetros del filtro
            especialidad = filtro.especialidad if filtro else None
            ubicacion = filtro.ubicacion if filtro else None
            verificado = filtro.verificado if filtro else None
            valoracion_minima = filtro.valoracion_minima if filtro else None
            orden = filtro.orden if filtro else None
            
            arquitectos = await use_case.buscar_arquitectos(
                db=db,
                especialidad=especialidad,
                ubicacion=ubicacion,
                verificado=verificado,
                valoracion_minima=valoracion_minima,
                orden=orden,
            )
            
            # Convertir a ArquitectoType
            return [
                ArquitectoType(
                    id=a.id,
                    usuario_id=a.usuario_id,
                    cedula=a.cedula,
                    descripcion=a.descripcion,
                    especialidades=a.especialidades,
                    ubicacion=a.ubicacion,
                    verificado=a.verificado,
                    vistas_perfil=a.vistas_perfil,
                    valoracion_prom_proyecto=a.valoracion_prom_proyecto
                )
                for a in arquitectos
            ]

    @strawberry.field
    async def filtrar_proyectos(
        self,
        filtro: Optional[FiltroProyectoInput] = None
    ) -> List[ProyectoType]:
        """
        Filtrar proyectos con múltiples criterios
        
        Ejemplos:
        - Por tipo: filtro: { tipo: "contratado" }
        - Por arquitecto: filtro: { arquitectoId: "uuid-del-arquitecto" }
        - Por rango de fechas: filtro: { fechaDesde: "2024-01-01", fechaHasta: "2024-12-31" }
        - Con buena valoración: filtro: { valoracionMinima: 4.0 }
        - Combinado: filtro: { tipo: "portafolio", valoracionMinima: 4.5, fechaDesde: "2024-01-01" }
        """
        async for db in get_db():
            use_case = FiltrosUseCase()
            
            # Extraer parámetros del filtro
            tipo = filtro.tipo if filtro else None
            arquitecto_id = filtro.arquitecto_id if filtro else None
            fecha_desde = filtro.fecha_desde if filtro else None
            fecha_hasta = filtro.fecha_hasta if filtro else None
            valoracion_minima = filtro.valoracion_minima if filtro else None
            orden = filtro.orden if filtro else None
            
            proyectos = await use_case.filtrar_proyectos(
                db=db,
                tipo=tipo,
                arquitecto_id=arquitecto_id,
                fecha_desde=fecha_desde,
                fecha_hasta=fecha_hasta,
                valoracion_minima=valoracion_minima,
                orden=orden,
            )
            
            # Convertir a ProyectoType
            return [
                ProyectoType(
                    id=p.id,
                    titulo_proyecto=p.titulo_proyecto,
                    descripcion=p.descripcion,
                    tipo_proyecto=p.tipo_proyecto,
                    fecha_publicacion=p.fecha_publicacion,
                    valoracion_promedio=p.valoracion_promedio,
                    arquitecto_id=p.arquitecto_id,
                    cliente_id=p.cliente_id,
                    conversacion_id=p.conversacion_id
                )
                for p in proyectos
            ]

    @strawberry.field
    async def busqueda_global(
        self,
        busqueda: BusquedaGlobalInput
    ) -> List[ResultadoBusquedaGlobal]:
        """
        Búsqueda global de texto en usuarios, arquitectos y proyectos
        
        Ejemplo:
        busqueda: { texto: "arquitectura", limite: 20 }
        
        Retorna resultados ordenados por relevancia con tipo, id, titulo y descripción
        """
        async for db in get_db():
            use_case = FiltrosUseCase()
            
            resultados = await use_case.busqueda_global(
                db=db,
                texto=busqueda.texto,
                limite=busqueda.limite or 10
            )
            
            # Convertir a ResultadoBusquedaGlobal
            return [
                ResultadoBusquedaGlobal(
                    tipo=r["tipo"],
                    id=r["id"],
                    titulo=r["titulo"],
                    descripcion=r["descripcion"],
                    relevancia=r["relevancia"]
                )
                for r in resultados
            ]
