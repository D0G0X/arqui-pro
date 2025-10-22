import strawberry
from typing import List, Optional
from adapters.schemas.imagen_asociacion_schema import ImagenAsociacionType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryImagenAsociacion:
    """Queries de imagen_asociacion. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_imagen_asociacions(self, info) -> List[ImagenAsociacionType]:
        """GET /api/v1/imagen_asociacions"""
        data = await rest_client.get_imagen_asociacions()
        return [
            ImagenAsociacionType(
                id=item.get("id"),
                imagen_id=item.get("imagen_id"),
                entidad_tipo=item.get("entidad_tipo"),
                entidad_id=item.get("entidad_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_imagen_asociacion(self, info, id: strawberry.ID) -> Optional[ImagenAsociacionType]:
        """GET /api/v1/imagen_asociacions/:id"""
        try:
            item = await rest_client.get_imagen_asociacion(str(id))
            return ImagenAsociacionType(
                id=item.get("id"),
                imagen_id=item.get("imagen_id"),
                entidad_tipo=item.get("entidad_tipo"),
                entidad_id=item.get("entidad_id")
            )
        except Exception:
            return None
