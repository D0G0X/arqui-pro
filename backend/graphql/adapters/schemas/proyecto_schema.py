import strawberry
from typing import Optional
from datetime import date


@strawberry.type
class ProyectoType:
    id: strawberry.ID
    titulo_proyecto: str
    valoracion_promedio: float
    descripcion: str
    tipo_proyecto: str
    fecha_publicacion: date
    arquitecto_id: strawberry.ID
    conversacion_id: Optional[strawberry.ID]
    cliente_id: Optional[strawberry.ID]
    solicitud_proyecto_id: Optional[strawberry.ID]


@strawberry.input
class ProyectoInput:
    titulo_proyecto: str
    descripcion: str
    tipo_proyecto: str
    fecha_publicacion: date
    arquitecto_id: strawberry.ID
    valoracion_promedio: Optional[float] = 0.0
    conversacion_id: Optional[strawberry.ID] = None
    cliente_id: Optional[strawberry.ID] = None
    solicitud_proyecto_id: Optional[strawberry.ID] = None
