from dataclasses import dataclass
from typing import Optional


@dataclass
class Cliente:
    id: Optional[str]
    cedula: str
    usuario_id: str
