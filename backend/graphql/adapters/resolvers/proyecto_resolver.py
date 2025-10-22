import strawberry
from typing import List, Optional
from adapters.schemas.proyecto_schema import ProyectoType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryProyecto:
    """Queries de proyecto. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_proyectos(self, info) -> List[ProyectoType]:
        """GET /api/v1/proyectos"""
        data = await rest_client.get_proyectos()
        return [
            ProyectoType(
                id=item.get("id"),
                titulo=item.get("titulo"),
                descripcion=item.get("descripcion"),
                presupuesto=item.get("presupuesto"),
                fecha_inicio=item.get("fecha_inicio"),
                fecha_fin_estimada=item.get("fecha_fin_estimada"),
                estado_proyecto=item.get("estado_proyecto"),
                ubicacion_proyecto=item.get("ubicacion_proyecto"),
                cliente_id=item.get("cliente_id"),
                arquitecto_id=item.get("arquitecto_id")
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_proyecto(self, info, id: strawberry.ID) -> Optional[ProyectoType]:
        """GET /api/v1/proyectos/:id"""
        try:
            item = await rest_client.get_proyecto(str(id))
            return ProyectoType(
                id=item.get("id"),
                titulo=item.get("titulo"),
                descripcion=item.get("descripcion"),
                presupuesto=item.get("presupuesto"),
                fecha_inicio=item.get("fecha_inicio"),
                fecha_fin_estimada=item.get("fecha_fin_estimada"),
                estado_proyecto=item.get("estado_proyecto"),
                ubicacion_proyecto=item.get("ubicacion_proyecto"),
                cliente_id=item.get("cliente_id"),
                arquitecto_id=item.get("arquitecto_id")
            )
        except Exception:
            return None
