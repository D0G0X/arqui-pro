from dataclasses import dataclass
from typing import Optional


@dataclass
class ImagenAsociacion:
    id: Optional[str]
    asociable_type: str
    asociable_id: str
    imagen_id: str
