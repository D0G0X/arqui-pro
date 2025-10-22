import strawberry
from typing import List, Optional
from adapters.schemas.incidencia_schema import IncidenciaType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryIncidencia:
    """Queries de incidencia. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_incidencias(self, info) -> List[IncidenciaType]:
        """GET /api/v1/incidencias"""
        data = await rest_client.get_incidencias()
        return [
            IncidenciaType(
                id=item.get("id"),
                tipo_incidencia=item.get("tipo_incidencia"),
                descripcion=item.get("descripcion"),
                estado=item.get("estado"),
                fecha_reporte=item.get("fecha_reporte"),
                fecha_resolucion=item.get("fecha_resolucion"),
                proyecto_id=item.get("proyecto_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_incidencia(self, info, id: strawberry.ID) -> Optional[IncidenciaType]:
        """GET /api/v1/incidencias/:id"""
        try:
            item = await rest_client.get_incidencia(str(id))
            return IncidenciaType(
                id=item.get("id"),
                tipo_incidencia=item.get("tipo_incidencia"),
                descripcion=item.get("descripcion"),
                estado=item.get("estado"),
                fecha_reporte=item.get("fecha_reporte"),
                fecha_resolucion=item.get("fecha_resolucion"),
                proyecto_id=item.get("proyecto_id")
            )
        except Exception:
            return None
