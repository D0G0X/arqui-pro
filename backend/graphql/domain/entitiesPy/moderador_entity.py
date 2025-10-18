from dataclasses import dataclass
from typing import Optional


@dataclass
class Moderador:
    id: Optional[str]
    usuario_id: str
