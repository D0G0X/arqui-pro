import strawberry
from datetime import date
from typing import Optional


@strawberry.type
class NotificacionType:
    id: strawberry.ID
    mensaje: str
    fecha: date
    leido: bool
    usuario_id: strawberry.ID


@strawberry.input
class NotificacionInput:
    mensaje: str
    fecha: date
    usuario_id: strawberry.ID
    leido: Optional[bool] = False
