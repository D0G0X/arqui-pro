import strawberry
from datetime import date


@strawberry.type
class ConversacionType:
    id: strawberry.ID
    fecha: date
    cliente_id: strawberry.ID
    arquitecto_id: strawberry.ID


@strawberry.input
class ConversacionInput:
    fecha: date
    cliente_id: strawberry.ID
    arquitecto_id: strawberry.ID
