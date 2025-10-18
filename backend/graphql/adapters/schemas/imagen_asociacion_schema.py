import strawberry


@strawberry.type
class ImagenAsociacionType:
    id: strawberry.ID
    asociable_type: str
    asociable_id: str
    imagen_id: strawberry.ID


@strawberry.input
class ImagenAsociacionInput:
    asociable_type: str
    asociable_id: str
    imagen_id: strawberry.ID
