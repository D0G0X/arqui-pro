import strawberry
from typing import List, Optional
from adapters.schemas.arquitecto_schema import ArquitectoType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryArquitecto:
    """Queries de arquitectos. Consume el API REST de Rails."""

    @strawberry.field
    async def listar_arquitectos(self, info) -> List[ArquitectoType]:
        """GET /api/v1/arquitectos"""
        data = await rest_client.get_arquitectos()
        return [
            ArquitectoType(
                id=item.get("id"),
                cedula=item.get("cedula"),
                valoracion_prom_proyecto=item.get("valoracion_prom_proyecto") or 0.0,
                descripcion=item.get("descripcion") or "",
                especialidades=item.get("especialidades") or "",
                ubicacion=item.get("ubicacion") or "",
                verificado=item.get("verificado") or False,
                vistas_perfil=item.get("vistas_perfil") or 0,
                usuario_id=item.get("usuario_id"),
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_arquitecto(self, info, id: strawberry.ID) -> Optional[ArquitectoType]:
        """GET /api/v1/arquitectos/:id"""
        try:
            a = await rest_client.get_arquitecto(str(id))
            return ArquitectoType(
                id=a.get("id"),
                cedula=a.get("cedula"),
                valoracion_prom_proyecto=a.get("valoracion_prom_proyecto") or 0.0,
                descripcion=a.get("descripcion") or "",
                especialidades=a.get("especialidades") or "",
                ubicacion=a.get("ubicacion") or "",
                verificado=a.get("verificado") or False,
                vistas_perfil=a.get("vistas_perfil") or 0,
                usuario_id=a.get("usuario_id"),
            )
        except Exception:
            return None
