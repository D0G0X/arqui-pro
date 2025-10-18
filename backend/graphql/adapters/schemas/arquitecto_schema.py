import strawberry
from typing import Optional


@strawberry.type
class ArquitectoType:
    id: strawberry.ID
    cedula: str
    valoracion_prom_proyecto: float
    descripcion: str
    especialidades: str
    ubicacion: str
    verificado: bool
    vistas_perfil: int
    usuario_id: strawberry.ID


@strawberry.input
class ArquitectoInput:
    cedula: str
    descripcion: str
    especialidades: str
    ubicacion: str
    usuario_id: strawberry.ID
    valoracion_prom_proyecto: Optional[float] = 0.0
    verificado: Optional[bool] = False
    vistas_perfil: Optional[int] = 0
