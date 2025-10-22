import strawberry
from typing import Optional, Annotated
from datetime import datetime
from infrastructure.rest_client import rest_client


@strawberry.type
class UsuarioType:
    id: strawberry.ID
    nombre: str
    apellido: str
    email: str
    estado_cuenta: str
    rol: str
    fecha_registro: Optional[datetime]
    foto_perfil: Optional[str]

    @strawberry.field
    async def arquitecto(self, info) -> Optional[Annotated["ArquitectoType", strawberry.lazy("adapters.schemas.arquitecto_schema")]]:
        from adapters.schemas.arquitecto_schema import ArquitectoType
        # Intentar obtener por filtro usuario_id
        data = await rest_client.get_arquitectos(params={"usuario_id": str(self.id)})
        if data:
            a = data[0]
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
        return None

    @strawberry.field
    async def cliente(self, info) -> Optional[Annotated["ClienteType", strawberry.lazy("adapters.schemas.cliente_schema")]]:
        from adapters.schemas.cliente_schema import ClienteType
        data = await rest_client.get_clientes(params={"usuario_id": str(self.id)})
        if data:
            c = data[0]
            return ClienteType(
                id=c.get("id"),
                cedula=c.get("cedula"),
                usuario_id=c.get("usuario_id"),
            )
        return None

    @strawberry.field
    async def moderador(self, info) -> Optional[Annotated["ModeradorType", strawberry.lazy("adapters.schemas.moderador_schema")]]:
        from adapters.schemas.moderador_schema import ModeradorType
        data = await rest_client.get_moderadores(params={"usuario_id": str(self.id)})
        if data:
            m = data[0]
            return ModeradorType(id=m.get("id"), usuario_id=m.get("usuario_id"))
        return None