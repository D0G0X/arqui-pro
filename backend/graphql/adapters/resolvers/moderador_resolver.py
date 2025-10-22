import strawberry
from typing import List, Optional
from adapters.schemas.moderador_schema import ModeradorType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryModerador:
    """Queries de moderador. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_moderadors(self, info) -> List[ModeradorType]:
        """GET /api/v1/moderadors"""
        data = await rest_client.get_moderadors()
        return [
            ModeradorType(
                id=item.get("id"),
                permisos=item.get("permisos"),
                fecha_asignacion=item.get("fecha_asignacion"),
                usuario_id=item.get("usuario_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_moderador(self, info, id: strawberry.ID) -> Optional[ModeradorType]:
        """GET /api/v1/moderadors/:id"""
        try:
            item = await rest_client.get_moderador(str(id))
            return ModeradorType(
                id=item.get("id"),
                permisos=item.get("permisos"),
                fecha_asignacion=item.get("fecha_asignacion"),
                usuario_id=item.get("usuario_id")
            )
        except Exception:
            return None
