import strawberry
from typing import Optional, List, Annotated


@strawberry.type
class ArquitectoType:
    id: strawberry.ID
    cedula: str
    valoracion_prom_proyecto: float
    descripcion: str
    especialidades: str
    ubicacion: str
    verificado: bool
    vistas_perfil: int
    usuario_id: strawberry.ID

    @strawberry.field
    async def usuario(self, info) -> Optional[Annotated["UsuarioType", strawberry.lazy("adapters.schemas.usuario_schema")]]:
        from adapters.schemas.usuario_schema import UsuarioType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.usuario_model import UsuarioModel
        
        async for db in get_db():
            result = await db.execute(
                select(UsuarioModel).where(UsuarioModel.id == self.usuario_id)
            )
            user = result.scalars().first()
            if user:
                return UsuarioType(
                    id=str(user.id),
                    nombre=user.nombre,
                    apellido=user.apellido,
                    email=user.email,
                    estado_cuenta=user.estado_cuenta,
                    rol=user.rol,
                    fecha_registro=user.fecha_registro,
                    foto_perfil=user.foto_perfil
                )
            return None

    @strawberry.field
    async def proyectos(self, info) -> List[Annotated["ProyectoType", strawberry.lazy("adapters.schemas.proyecto_schema")]]:
        from adapters.schemas.proyecto_schema import ProyectoType
        from infrastructure.database import get_db
        from sqlalchemy.future import select
        from infrastructure.orm.proyecto_model import ProyectoModel
        
        async for db in get_db():
            result = await db.execute(
                select(ProyectoModel).where(ProyectoModel.arquitecto_id == self.id)
            )
            proyectos = result.scalars().all()
            return [
                ProyectoType(
                    id=str(p.id),
                    titulo_proyecto=p.titulo_proyecto,
                    valoracion_promedio=p.valoracion_promedio,
                    descripcion=p.descripcion,
                    tipo_proyecto=p.tipo_proyecto,
                    fecha_publicacion=p.fecha_publicacion,
                    arquitecto_id=str(p.arquitecto_id),
                    conversacion_id=str(p.conversacion_id) if p.conversacion_id else None,
                    cliente_id=str(p.cliente_id) if p.cliente_id else None,
                    solicitud_proyecto_id=str(p.solicitud_proyecto_id) if p.solicitud_proyecto_id else None
                )
                for p in proyectos
            ]


@strawberry.input
class ArquitectoInput:
    cedula: str
    descripcion: str
    especialidades: str
    ubicacion: str
    usuario_id: strawberry.ID
    valoracion_prom_proyecto: Optional[float] = 0.0
    verificado: Optional[bool] = False
    vistas_perfil: Optional[int] = 0
