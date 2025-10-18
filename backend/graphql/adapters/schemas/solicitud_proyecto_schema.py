import strawberry
from datetime import date


@strawberry.type
class SolicitudProyectoType:
    id: strawberry.ID
    estado: str
    fecha: date
    arquitecto_id: strawberry.ID
    cliente_id: strawberry.ID


@strawberry.input
class SolicitudProyectoInput:
    estado: str
    fecha: date
    arquitecto_id: strawberry.ID
    cliente_id: strawberry.ID
