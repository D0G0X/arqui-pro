import strawberry
from datetime import date
from typing import Optional


@strawberry.type
class MensajeType:
    id: strawberry.ID
    contenido: str
    fecha_envio: date
    leido: bool
    conversacion_id: strawberry.ID
    remitente_id: strawberry.ID


@strawberry.input
class MensajeInput:
    contenido: str
    fecha_envio: date
    conversacion_id: strawberry.ID
    remitente_id: strawberry.ID
    leido: Optional[bool] = False
