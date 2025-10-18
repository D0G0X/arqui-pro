import strawberry


@strawberry.type
class ClienteType:
    id: strawberry.ID
    cedula: str
    usuario_id: strawberry.ID


@strawberry.input
class ClienteInput:
    cedula: str
    usuario_id: strawberry.ID
