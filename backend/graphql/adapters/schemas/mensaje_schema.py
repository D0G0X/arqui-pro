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
