import strawberry


@strawberry.type
class ModeradorType:
    id: strawberry.ID
    usuario_id: strawberry.ID


@strawberry.input
class ModeradorInput:
    usuario_id: strawberry.ID
