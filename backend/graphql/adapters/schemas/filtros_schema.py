"""
Esquemas de filtros y búsqueda para GraphQL
"""
import strawberry
from typing import Optional
from datetime import date


@strawberry.input
class FiltroArquitectoInput:
    """Input para filtrar arquitectos"""
    especialidad: Optional[str] = None
    ubicacion: Optional[str] = None
    verificado: Optional[bool] = None
    valoracion_minima: Optional[float] = None


@strawberry.input
class FiltroProyectoInput:
    """Input para filtrar proyectos"""
    tipo: Optional[str] = None  # portafolio, contratado
    arquitecto_id: Optional[str] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    valoracion_minima: Optional[float] = None


@strawberry.input
class BusquedaGlobalInput:
    """Input para búsqueda global"""
    texto: str
    limite: Optional[int] = 10


@strawberry.type
class ResultadoBusquedaGlobal:
    """Resultado de búsqueda global"""
    tipo: str  # "usuario", "arquitecto", "proyecto"
    id: str
    titulo: str
    descripcion: Optional[str] = None
    relevancia: float  # Score de relevancia (0-1)
