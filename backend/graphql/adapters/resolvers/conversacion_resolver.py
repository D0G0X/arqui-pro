import strawberry
from typing import List, Optional
from adapters.schemas.conversacion_schema import ConversacionType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryConversacion:
    """Queries de conversacion. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_conversacions(self, info) -> List[ConversacionType]:
        """GET /api/v1/conversacions"""
        data = await rest_client.get_conversacions()
        return [
            ConversacionType(
                id=item.get("id"),
                titulo=item.get("titulo"),
                fecha_inicio=item.get("fecha_inicio"),
                fecha_ultimo_mensaje=item.get("fecha_ultimo_mensaje"),
                usuario1_id=item.get("usuario1_id"),
                usuario2_id=item.get("usuario2_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_conversacion(self, info, id: strawberry.ID) -> Optional[ConversacionType]:
        """GET /api/v1/conversacions/:id"""
        try:
            item = await rest_client.get_conversacion(str(id))
            return ConversacionType(
                id=item.get("id"),
                titulo=item.get("titulo"),
                fecha_inicio=item.get("fecha_inicio"),
                fecha_ultimo_mensaje=item.get("fecha_ultimo_mensaje"),
                usuario1_id=item.get("usuario1_id"),
                usuario2_id=item.get("usuario2_id")
            )
        except Exception:
            return None
