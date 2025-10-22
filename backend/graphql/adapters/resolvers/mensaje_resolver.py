import strawberry
from typing import List, Optional
from adapters.schemas.mensaje_schema import MensajeType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryMensaje:
    """Queries de mensaje. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_mensajes(self, info) -> List[MensajeType]:
        """GET /api/v1/mensajes"""
        data = await rest_client.get_mensajes()
        return [
            MensajeType(
                id=item.get("id"),
                contenido=item.get("contenido"),
                fecha_envio=item.get("fecha_envio"),
                leido=item.get("leido"),
                conversacion_id=item.get("conversacion_id"),
                remitente_id=item.get("remitente_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_mensaje(self, info, id: strawberry.ID) -> Optional[MensajeType]:
        """GET /api/v1/mensajes/:id"""
        try:
            item = await rest_client.get_mensaje(str(id))
            return MensajeType(
                id=item.get("id"),
                contenido=item.get("contenido"),
                fecha_envio=item.get("fecha_envio"),
                leido=item.get("leido"),
                conversacion_id=item.get("conversacion_id"),
                remitente_id=item.get("remitente_id")
            )
        except Exception:
            return None
