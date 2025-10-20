from sqlalchemy import select, func, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict
from infrastructure.orm.usuario_model import UsuarioModel
from infrastructure.orm.arquitecto_model import ArquitectoModel
from infrastructure.orm.cliente_model import ClienteModel
from infrastructure.orm.moderador_model import ModeradorModel
from infrastructure.orm.proyecto_model import ProyectoModel
from infrastructure.orm.conversacion_model import ConversacionModel
from infrastructure.orm.valoracion_model import ValoracionModel
from infrastructure.orm.avance_model import AvanceModel


class EstadisticasUseCase:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def obtener_estadisticas_generales(self) -> Dict:
        """Obtiene conteos generales de todas las entidades"""
        total_usuarios = await self.db.execute(select(func.count(UsuarioModel.id)))
        total_arquitectos = await self.db.execute(select(func.count(ArquitectoModel.id)))
        total_clientes = await self.db.execute(select(func.count(ClienteModel.id)))
        total_moderadores = await self.db.execute(select(func.count(ModeradorModel.id)))
        total_proyectos = await self.db.execute(select(func.count(ProyectoModel.id)))
        total_conversaciones = await self.db.execute(select(func.count(ConversacionModel.id)))
        total_valoraciones = await self.db.execute(select(func.count(ValoracionModel.id)))

        return {
            "total_usuarios": total_usuarios.scalar() or 0,
            "total_arquitectos": total_arquitectos.scalar() or 0,
            "total_clientes": total_clientes.scalar() or 0,
            "total_moderadores": total_moderadores.scalar() or 0,
            "total_proyectos": total_proyectos.scalar() or 0,
            "total_conversaciones": total_conversaciones.scalar() or 0,
            "total_valoraciones": total_valoraciones.scalar() or 0,
        }

    async def obtener_estadisticas_arquitectos(self) -> Dict:
        """Obtiene estadísticas sobre arquitectos"""
        total = await self.db.execute(select(func.count(ArquitectoModel.id)))
        verificados = await self.db.execute(
            select(func.count(ArquitectoModel.id)).where(ArquitectoModel.verificado == True)
        )
        no_verificados = await self.db.execute(
            select(func.count(ArquitectoModel.id)).where(ArquitectoModel.verificado == False)
        )
        promedio_val = await self.db.execute(
            select(func.avg(ArquitectoModel.valoracion_prom_proyecto))
        )
        
        # Contar arquitectos con proyectos
        con_proyectos = await self.db.execute(
            select(func.count(func.distinct(ProyectoModel.arquitecto_id)))
        )

        total_count = total.scalar() or 0
        con_proyectos_count = con_proyectos.scalar() or 0

        return {
            "total": total_count,
            "verificados": verificados.scalar() or 0,
            "no_verificados": no_verificados.scalar() or 0,
            "promedio_valoracion": float(promedio_val.scalar() or 0),
            "con_proyectos": con_proyectos_count,
            "sin_proyectos": total_count - con_proyectos_count,
        }

    async def obtener_estadisticas_proyectos(self) -> Dict:
        """Obtiene estadísticas sobre proyectos"""
        total = await self.db.execute(select(func.count(ProyectoModel.id)))
        portafolio = await self.db.execute(
            select(func.count(ProyectoModel.id)).where(ProyectoModel.tipo_proyecto == "portafolio")
        )
        contratados = await self.db.execute(
            select(func.count(ProyectoModel.id)).where(ProyectoModel.tipo_proyecto == "contratado")
        )
        promedio_val = await self.db.execute(
            select(func.avg(ProyectoModel.valoracion_promedio))
        )
        total_avances = await self.db.execute(select(func.count(AvanceModel.id)))
        total_valoraciones = await self.db.execute(select(func.count(ValoracionModel.id)))

        return {
            "total": total.scalar() or 0,
            "portafolio": portafolio.scalar() or 0,
            "contratados": contratados.scalar() or 0,
            "promedio_valoracion": float(promedio_val.scalar() or 0),
            "total_avances": total_avances.scalar() or 0,
            "total_valoraciones": total_valoraciones.scalar() or 0,
        }

    async def obtener_proyectos_por_tipo(self) -> List[Dict]:
        """Agrupa proyectos por tipo con estadísticas"""
        result = await self.db.execute(
            select(
                ProyectoModel.tipo_proyecto,
                func.count(ProyectoModel.id).label("cantidad"),
                func.avg(ProyectoModel.valoracion_promedio).label("promedio_valoracion")
            )
            .group_by(ProyectoModel.tipo_proyecto)
        )
        
        proyectos_por_tipo = []
        for row in result:
            proyectos_por_tipo.append({
                "tipo": row.tipo_proyecto,
                "cantidad": row.cantidad,
                "promedio_valoracion": float(row.promedio_valoracion or 0),
            })
        
        return proyectos_por_tipo

    async def obtener_top_arquitectos(self, limit: int = 5) -> List[Dict]:
        """Obtiene los arquitectos con mejor valoración"""
        result = await self.db.execute(
            select(
                ArquitectoModel,
                UsuarioModel,
                func.count(ProyectoModel.id).label("total_proyectos")
            )
            .join(UsuarioModel, ArquitectoModel.usuario_id == UsuarioModel.id)
            .outerjoin(ProyectoModel, ProyectoModel.arquitecto_id == ArquitectoModel.id)
            .group_by(ArquitectoModel.id, UsuarioModel.id)
            .order_by(desc(ArquitectoModel.valoracion_prom_proyecto))
            .limit(limit)
        )

        top_arquitectos = []
        for row in result:
            arq, user, total_proy = row
            top_arquitectos.append({
                "id": str(arq.id),
                "nombre": user.nombre,
                "apellido": user.apellido,
                "cedula": arq.cedula,
                "promedio_valoracion": arq.valoracion_prom_proyecto,
                "total_proyectos": total_proy,
                "verificado": arq.verificado,
            })

        return top_arquitectos

    async def obtener_proyectos_recientes(self, limit: int = 5) -> List[Dict]:
        """Obtiene los proyectos más recientes"""
        result = await self.db.execute(
            select(ProyectoModel, UsuarioModel)
            .join(ArquitectoModel, ProyectoModel.arquitecto_id == ArquitectoModel.id)
            .join(UsuarioModel, ArquitectoModel.usuario_id == UsuarioModel.id)
            .order_by(desc(ProyectoModel.fecha_publicacion))
            .limit(limit)
        )

        proyectos_recientes = []
        for row in result:
            proy, user = row
            proyectos_recientes.append({
                "id": str(proy.id),
                "titulo": proy.titulo_proyecto,
                "tipo": proy.tipo_proyecto,
                "fecha_publicacion": str(proy.fecha_publicacion),
                "valoracion_promedio": proy.valoracion_promedio,
                "nombre_arquitecto": f"{user.nombre} {user.apellido}",
            })

        return proyectos_recientes
