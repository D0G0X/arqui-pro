from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class SolicitudProyecto:
    id: Optional[str]
    estado: str
    fecha: date
    arquitecto_id: str
    cliente_id: str
