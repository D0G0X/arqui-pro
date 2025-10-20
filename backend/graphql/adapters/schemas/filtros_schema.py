"""
Esquemas de filtros y búsqueda para GraphQL, incluyendo ordenamiento.
"""
import strawberry
from typing import Optional
from datetime import date
from enum import Enum
@strawberry.enum
class OrdenArquitecto(Enum):
    VALORACION_ASC = "VALORACION_ASC"
    VALORACION_DESC = "VALORACION_DESC"
    NOMBRE_ASC = "NOMBRE_ASC"
    NOMBRE_DESC = "NOMBRE_DESC"
    VERIFICADO_FIRST = "VERIFICADO_FIRST"
    VERIFICADO_LAST = "VERIFICADO_LAST"
    VISTAS_ASC = "VISTAS_ASC"
    VISTAS_DESC = "VISTAS_DESC"


@strawberry.enum
class OrdenProyecto(Enum):
    FECHA_ASC = "FECHA_ASC"
    FECHA_DESC = "FECHA_DESC"
    VALORACION_ASC = "VALORACION_ASC"
    VALORACION_DESC = "VALORACION_DESC"
    TITULO_ASC = "TITULO_ASC"
    TITULO_DESC = "TITULO_DESC"



@strawberry.input
class FiltroArquitectoInput:
    """Input para filtrar arquitectos"""
    especialidad: Optional[str] = None
    ubicacion: Optional[str] = None
    verificado: Optional[bool] = None
    valoracion_minima: Optional[float] = None
    orden: Optional[OrdenArquitecto] = None


@strawberry.input
class FiltroProyectoInput:
    """Input para filtrar proyectos"""
    tipo: Optional[str] = None  # portafolio, contratado
    arquitecto_id: Optional[str] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    valoracion_minima: Optional[float] = None
    orden: Optional[OrdenProyecto] = None


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
