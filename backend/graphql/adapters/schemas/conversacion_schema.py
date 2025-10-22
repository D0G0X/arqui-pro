import strawberry
from typing import Optional, List, Annotated
from datetime import date
from infrastructure.rest_client import rest_client


@strawberry.type
class ConversacionType:
    id: strawberry.ID
    fecha: date
    cliente_id: strawberry.ID
    arquitecto_id: strawberry.ID

    @strawberry.field
    async def cliente(self, info) -> Optional[Annotated["ClienteType", strawberry.lazy("adapters.schemas.cliente_schema")]]:
        from adapters.schemas.cliente_schema import ClienteType
        try:
            c = await rest_client.get_cliente(str(self.cliente_id))
            return ClienteType(id=c.get("id"), cedula=c.get("cedula"), usuario_id=c.get("usuario_id"))
        except Exception:
            return None

    @strawberry.field
    async def arquitecto(self, info) -> Optional[Annotated["ArquitectoType", strawberry.lazy("adapters.schemas.arquitecto_schema")]]:
        from adapters.schemas.arquitecto_schema import ArquitectoType
        try:
            a = await rest_client.get_arquitecto(str(self.arquitecto_id))
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

    @strawberry.field
    async def mensajes(self, info) -> List[Annotated["MensajeType", strawberry.lazy("adapters.schemas.mensaje_schema")]]:
        from adapters.schemas.mensaje_schema import MensajeType
        data = await rest_client.get_mensajes(params={"conversacion_id": str(self.id)})
        return [
            MensajeType(
                id=m.get("id"),
                contenido=m.get("contenido"),
                fecha_envio=m.get("fecha_envio"),
                leido=m.get("leido"),
                conversacion_id=m.get("conversacion_id"),
                remitente_id=m.get("remitente_id"),
            )
            for m in data
            if not m.get("conversacion_id") or str(m.get("conversacion_id")) == str(self.id)
        ]
