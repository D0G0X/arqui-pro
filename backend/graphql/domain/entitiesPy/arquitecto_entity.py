from dataclasses import dataclass
from typing import Optional


@dataclass
class Arquitecto:
    id: Optional[str]
    cedula: str
    valoracion_prom_proyecto: float
    descripcion: str
    especialidades: str
    ubicacion: str
    verificado: bool
    vistas_perfil: int
    usuario_id: str
