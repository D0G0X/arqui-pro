import strawberry
from datetime import date


@strawberry.type
class ValoracionType:
    id: strawberry.ID
    calificacion: float
    comentario: str
    fecha: date
    cliente_id: strawberry.ID
    proyecto_id: strawberry.ID
