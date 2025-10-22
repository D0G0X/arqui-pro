import strawberry
from typing import List, Optional
from adapters.schemas.avance_schema import AvanceType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryAvance:
    """Queries de avance. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_avances(self, info) -> List[AvanceType]:
        """GET /api/v1/avances"""
        data = await rest_client.get_avances()
        return [
            AvanceType(
                id=item.get("id"),
                descripcion=item.get("descripcion"),
                porcentaje_avance=item.get("porcentaje_avance"),
                fecha_reporte=item.get("fecha_reporte"),
                proyecto_id=item.get("proyecto_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_avance(self, info, id: strawberry.ID) -> Optional[AvanceType]:
        """GET /api/v1/avances/:id"""
        try:
            item = await rest_client.get_avance(str(id))
            return AvanceType(
                id=item.get("id"),
                descripcion=item.get("descripcion"),
                porcentaje_avance=item.get("porcentaje_avance"),
                fecha_reporte=item.get("fecha_reporte"),
                proyecto_id=item.get("proyecto_id")
            )
        except Exception:
            return None
