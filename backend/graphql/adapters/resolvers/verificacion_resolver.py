import strawberry
from typing import List, Optional
from adapters.schemas.verificacion_schema import VerificacionType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryVerificacion:
    """Queries de verificacion. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_verificacions(self, info) -> List[VerificacionType]:
        """GET /api/v1/verificacions"""
        data = await rest_client.get_verificacions()
        return [
            VerificacionType(
                id=item.get("id"),
                documento_presentado=item.get("documento_presentado"),
                estado_verificacion=item.get("estado_verificacion"),
                fecha_solicitud=item.get("fecha_solicitud"),
                fecha_verificacion=item.get("fecha_verificacion"),
                arquitecto_id=item.get("arquitecto_id"),
                moderador_id=item.get("moderador_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_verificacion(self, info, id: strawberry.ID) -> Optional[VerificacionType]:
        """GET /api/v1/verificacions/:id"""
        try:
            item = await rest_client.get_verificacion(str(id))
            return VerificacionType(
                id=item.get("id"),
                documento_presentado=item.get("documento_presentado"),
                estado_verificacion=item.get("estado_verificacion"),
                fecha_solicitud=item.get("fecha_solicitud"),
                fecha_verificacion=item.get("fecha_verificacion"),
                arquitecto_id=item.get("arquitecto_id"),
                moderador_id=item.get("moderador_id")
            )
        except Exception:
            return None
