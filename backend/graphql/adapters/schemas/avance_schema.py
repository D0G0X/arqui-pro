import strawberry
from datetime import date


@strawberry.type
class AvanceType:
    id: strawberry.ID
    descripcion: str
    fecha: date
    proyecto_id: strawberry.ID
