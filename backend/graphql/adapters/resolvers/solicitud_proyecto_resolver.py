import strawberry
from typing import List, Optional
from adapters.schemas.solicitud_proyecto_schema import SolicitudProyectoType
from infrastructure.rest_client import rest_client


@strawberry.type
class QuerySolicitudProyecto:
    """Queries de solicitud_proyecto. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_solicitudes_proyecto(self, info) -> List[SolicitudProyectoType]:
        """GET /api/v1/solicitudes_proyecto"""
        data = await rest_client.get_solicitudes_proyecto()
        return [
            SolicitudProyectoType(
                id=item.get("id"),
                descripcion_proyecto=item.get("descripcion_proyecto"),
                presupuesto_estimado=item.get("presupuesto_estimado"),
                fecha_solicitud=item.get("fecha_solicitud"),
                estado_solicitud=item.get("estado_solicitud"),
                ubicacion=item.get("ubicacion"),
                cliente_id=item.get("cliente_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_solicitud_proyecto(self, info, id: strawberry.ID) -> Optional[SolicitudProyectoType]:
        """GET /api/v1/solicitudes_proyecto/:id"""
        try:
            item = await rest_client.get_solicitud_proyecto(str(id))
            return SolicitudProyectoType(
                id=item.get("id"),
                descripcion_proyecto=item.get("descripcion_proyecto"),
                presupuesto_estimado=item.get("presupuesto_estimado"),
                fecha_solicitud=item.get("fecha_solicitud"),
                estado_solicitud=item.get("estado_solicitud"),
                ubicacion=item.get("ubicacion"),
                cliente_id=item.get("cliente_id")
            )
        except Exception:
            return None
