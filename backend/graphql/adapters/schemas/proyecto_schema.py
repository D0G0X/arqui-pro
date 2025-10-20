import strawberry
from typing import Optional, List, Annotated
from datetime import date


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
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.arquitecto_model import ArquitectoModel
        
        async for db in get_db():
            result = await db.execute(
                select(ArquitectoModel).where(ArquitectoModel.id == self.arquitecto_id)
            )
            arq = result.scalars().first()
            if arq:
                return ArquitectoType(
                    id=str(arq.id),
                    cedula=arq.cedula,
                    valoracion_prom_proyecto=arq.valoracion_prom_proyecto,
                    descripcion=arq.descripcion,
                    especialidades=arq.especialidades,
                    ubicacion=arq.ubicacion,
                    verificado=arq.verificado,
                    vistas_perfil=arq.vistas_perfil,
                    usuario_id=str(arq.usuario_id)
                )
            return None

    @strawberry.field
    async def cliente(self, info) -> Optional[Annotated["ClienteType", strawberry.lazy("adapters.schemas.cliente_schema")]]:
        if not self.cliente_id:
            return None
        from adapters.schemas.cliente_schema import ClienteType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.cliente_model import ClienteModel
        
        async for db in get_db():
            result = await db.execute(
                select(ClienteModel).where(ClienteModel.id == self.cliente_id)
            )
            cli = result.scalars().first()
            if cli:
                return ClienteType(id=str(cli.id), cedula=cli.cedula, usuario_id=str(cli.usuario_id))
            return None

    @strawberry.field
    async def avances(self, info) -> List[Annotated["AvanceType", strawberry.lazy("adapters.schemas.avance_schema")]]:
        from adapters.schemas.avance_schema import AvanceType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.avance_model import AvanceModel
        
        async for db in get_db():
            result = await db.execute(
                select(AvanceModel).where(AvanceModel.proyecto_id == self.id)
            )
            avances = result.scalars().all()
            return [
                AvanceType(
                    id=str(a.id),
                    descripcion=a.descripcion,
                    fecha=a.fecha,
                    proyecto_id=str(a.proyecto_id)
                )
                for a in avances
            ]

    @strawberry.field
    async def valoraciones(self, info) -> List[Annotated["ValoracionType", strawberry.lazy("adapters.schemas.valoracion_schema")]]:
        from adapters.schemas.valoracion_schema import ValoracionType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.valoracion_model import ValoracionModel
        
        async for db in get_db():
            result = await db.execute(
                select(ValoracionModel).where(ValoracionModel.proyecto_id == self.id)
            )
            valoraciones = result.scalars().all()
            return [
                ValoracionType(
                    id=str(v.id),
                    calificacion=v.calificacion,
                    comentario=v.comentario,
                    fecha=v.fecha,
                    cliente_id=str(v.cliente_id),
                    proyecto_id=str(v.proyecto_id)
                )
                for v in valoraciones
            ]


@strawberry.input
class ProyectoInput:
    titulo_proyecto: str
    descripcion: str
    tipo_proyecto: str
    fecha_publicacion: date
    arquitecto_id: strawberry.ID
    valoracion_promedio: Optional[float] = 0.0
    conversacion_id: Optional[strawberry.ID] = None
    cliente_id: Optional[strawberry.ID] = None
    solicitud_proyecto_id: Optional[strawberry.ID] = None
