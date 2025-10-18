from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Conversacion:
    id: Optional[str]
    fecha: date
    cliente_id: str
    arquitecto_id: str
