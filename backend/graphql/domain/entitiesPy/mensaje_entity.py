from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Mensaje:
    id: Optional[str]
    contenido: str
    fecha_envio: date
    leido: bool
    conversacion_id: str
    remitente_id: str
