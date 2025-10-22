import strawberry
from typing import List, Optional
from adapters.schemas.notificacion_schema import NotificacionType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryNotificacion:
    """Queries de notificacion. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_notificacions(self, info) -> List[NotificacionType]:
        """GET /api/v1/notificacions"""
        data = await rest_client.get_notificacions()
        return [
            NotificacionType(
                id=item.get("id"),
                tipo_notificacion=item.get("tipo_notificacion"),
                contenido=item.get("contenido"),
                leida=item.get("leida"),
                fecha_creacion=item.get("fecha_creacion"),
                usuario_id=item.get("usuario_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_notificacion(self, info, id: strawberry.ID) -> Optional[NotificacionType]:
        """GET /api/v1/notificacions/:id"""
        try:
            item = await rest_client.get_notificacion(str(id))
            return NotificacionType(
                id=item.get("id"),
                tipo_notificacion=item.get("tipo_notificacion"),
                contenido=item.get("contenido"),
                leida=item.get("leida"),
                fecha_creacion=item.get("fecha_creacion"),
                usuario_id=item.get("usuario_id")
            )
        except Exception:
            return None
