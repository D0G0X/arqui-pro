from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Imagen:
    id: Optional[str]
    imagen_url: str
    fecha: date
