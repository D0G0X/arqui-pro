import strawberry
from typing import List, Optional
from adapters.schemas.imagen_schema import ImagenType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryImagen:
    """Queries de imagen. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_imagens(self, info) -> List[ImagenType]:
        """GET /api/v1/imagens"""
        data = await rest_client.get_imagens()
        return [
            ImagenType(
                id=item.get("id"),
                url=item.get("url"),
                tipo_imagen=item.get("tipo_imagen"),
                descripcion=item.get("descripcion"),
                fecha_subida=item.get("fecha_subida")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_imagen(self, info, id: strawberry.ID) -> Optional[ImagenType]:
        """GET /api/v1/imagens/:id"""
        try:
            item = await rest_client.get_imagen(str(id))
            return ImagenType(
                id=item.get("id"),
                url=item.get("url"),
                tipo_imagen=item.get("tipo_imagen"),
                descripcion=item.get("descripcion"),
                fecha_subida=item.get("fecha_subida")
            )
        except Exception:
            return None
