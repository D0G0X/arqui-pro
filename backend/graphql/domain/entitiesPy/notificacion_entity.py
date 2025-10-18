from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Notificacion:
    id: Optional[str]
    mensaje: str
    fecha: date
    leido: bool
    usuario_id: str
