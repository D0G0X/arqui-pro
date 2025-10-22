import strawberry
from typing import List, Optional
from adapters.schemas.valoracion_schema import ValoracionType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryValoracion:
    """Queries de valoracion. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_valoracions(self, info) -> List[ValoracionType]:
        """GET /api/v1/valoracions"""
        data = await rest_client.get_valoracions()
        return [
            ValoracionType(
                id=item.get("id"),
                puntuacion=item.get("puntuacion"),
                comentario=item.get("comentario"),
                fecha_valoracion=item.get("fecha_valoracion"),
                proyecto_id=item.get("proyecto_id"),
                cliente_id=item.get("cliente_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_valoracion(self, info, id: strawberry.ID) -> Optional[ValoracionType]:
        """GET /api/v1/valoracions/:id"""
        try:
            item = await rest_client.get_valoracion(str(id))
            return ValoracionType(
                id=item.get("id"),
                puntuacion=item.get("puntuacion"),
                comentario=item.get("comentario"),
                fecha_valoracion=item.get("fecha_valoracion"),
                proyecto_id=item.get("proyecto_id"),
                cliente_id=item.get("cliente_id")
            )
        except Exception:
            return None
