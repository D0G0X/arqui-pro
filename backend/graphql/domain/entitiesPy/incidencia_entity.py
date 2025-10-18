from dataclasses import dataclass
from typing import Optional
from datetime import date


@dataclass
class Incidencia:
    id: Optional[str]
    descripcion: str
    estado: str
    fecha: date
    usuario_emisor_id: str
    usuario_infractor_id: str
    moderador_id: str
