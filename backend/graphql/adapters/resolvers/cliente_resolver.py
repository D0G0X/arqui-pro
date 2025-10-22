import strawberry
from typing import List, Optional
from adapters.schemas.cliente_schema import ClienteType
from infrastructure.rest_client import rest_client


@strawberry.type
class QueryCliente:
    """Queries de clientes. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_clientes(self, info) -> List[ClienteType]:
        """GET /api/v1/clientes"""
        data = await rest_client.get_clientes()
        return [
            ClienteType(
                id=c["id"],
                telefono=c.get("telefono"),
                proyectos_solicitados=c.get("proyectos_solicitados", 0),
                usuario_id=c["usuario_id"]
            )
            for c in data
        ]

    @strawberry.field
    async def obtener_cliente(self, info, id: strawberry.ID) -> Optional[ClienteType]:
        """GET /api/v1/clientes/:id"""
        try:
            c = await rest_client.get_cliente(str(id))
            return ClienteType(
                id=c["id"],
                telefono=c.get("telefono"),
                proyectos_solicitados=c.get("proyectos_solicitados", 0),
                usuario_id=c["usuario_id"]
            )
        except Exception:
            return None
