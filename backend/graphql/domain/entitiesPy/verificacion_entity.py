from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Verificacion:
    id: Optional[str]
    estado: str
    fecha_verificacion: date
    arquitecto_id: str
    moderador_id: str
