import strawberry
from datetime import date


@strawberry.type
class IncidenciaType:
    id: strawberry.ID
    descripcion: str
    estado: str
    fecha: date
    usuario_emisor_id: strawberry.ID
    usuario_infractor_id: strawberry.ID
    moderador_id: strawberry.ID
