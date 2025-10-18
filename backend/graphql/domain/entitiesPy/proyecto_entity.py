from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Proyecto:
    id: Optional[str]
    titulo_proyecto: str
    valoracion_promedio: float
    descripcion: str
    tipo_proyecto: str
    fecha_publicacion: date
    arquitecto_id: str
    conversacion_id: Optional[str] = None
    cliente_id: Optional[str] = None
    solicitud_proyecto_id: Optional[str] = None
