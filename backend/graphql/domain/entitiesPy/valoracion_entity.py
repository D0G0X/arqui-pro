from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Valoracion:
    id: Optional[str]
    calificacion: float
    comentario: str
    fecha: date
    cliente_id: str
    proyecto_id: str
