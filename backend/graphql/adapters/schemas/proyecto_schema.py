import strawberry
from typing import Optional, List, Annotated
from datetime import date
from infrastructure.rest_client import rest_client


@strawberry.type
class ProyectoType:
    id: strawberry.ID
    titulo_proyecto: str
    valoracion_promedio: float
    descripcion: str
    tipo_proyecto: str
    fecha_publicacion: date
    arquitecto_id: strawberry.ID
    conversacion_id: Optional[strawberry.ID]
    cliente_id: Optional[strawberry.ID]
    solicitud_proyecto_id: Optional[strawberry.ID]

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
    async def cliente(self, info) -> Optional[Annotated["ClienteType", strawberry.lazy("adapters.schemas.cliente_schema")]]:
        if not self.cliente_id:
            return None
        from adapters.schemas.cliente_schema import ClienteType
        try:
            c = await rest_client.get_cliente(str(self.cliente_id))
            return ClienteType(id=c.get("id"), cedula=c.get("cedula"), usuario_id=c.get("usuario_id"))
        except Exception:
            return None

    @strawberry.field
    async def avances(self, info) -> List[Annotated["AvanceType", strawberry.lazy("adapters.schemas.avance_schema")]]:
        from adapters.schemas.avance_schema import AvanceType
        data = await rest_client.get_avances(params={"proyecto_id": str(self.id)})
        return [
            AvanceType(
                id=a.get("id"),
                descripcion=a.get("descripcion"),
                fecha=a.get("fecha"),
                proyecto_id=a.get("proyecto_id"),
            )
            for a in data
            if not a.get("proyecto_id") or str(a.get("proyecto_id")) == str(self.id)
        ]

    @strawberry.field
    async def valoraciones(self, info) -> List[Annotated["ValoracionType", strawberry.lazy("adapters.schemas.valoracion_schema")]]:
        from adapters.schemas.valoracion_schema import ValoracionType
        data = await rest_client.get_valoraciones(params={"proyecto_id": str(self.id)})
        return [
            ValoracionType(
                id=v.get("id"),
                calificacion=v.get("calificacion"),
                comentario=v.get("comentario"),
                fecha=v.get("fecha"),
                cliente_id=v.get("cliente_id"),
                proyecto_id=v.get("proyecto_id"),
            )
            for v in data
            if not v.get("proyecto_id") or str(v.get("proyecto_id")) == str(self.id)
        ]


# Sin inputs: no hay mutaciones en el esquema actual
