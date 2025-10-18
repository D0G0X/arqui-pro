from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Avance:
    id: Optional[str]
    descripcion: str
    fecha: date
    proyecto_id: str
