"""
Use case para filtros y búsqueda
"""
from typing import List, Optional
from datetime import date
from sqlalchemy import select, func, or_, and_, cast, String
from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.orm.arquitecto_model import ArquitectoModel
from infrastructure.orm.proyecto_model import ProyectoModel
from infrastructure.orm.usuario_model import UsuarioModel
from domain.entitiesPy.arquitecto_entity import Arquitecto
from domain.entitiesPy.proyecto_entity import Proyecto


class FiltrosUseCase:
    """Use case para filtros y búsqueda avanzada"""

    async def buscar_arquitectos(
        self,
        db: AsyncSession,
        especialidad: Optional[str] = None,
        ubicacion: Optional[str] = None,
        verificado: Optional[bool] = None,
        valoracion_minima: Optional[float] = None
    ) -> List[Arquitecto]:
        """
        Buscar arquitectos con filtros opcionales
        
        Args:
            db: Sesión de base de datos
            especialidad: Filtrar por especialidad (búsqueda parcial)
            ubicacion: Filtrar por ubicación (búsqueda parcial)
            verificado: Filtrar por estado de verificación
            valoracion_minima: Filtrar por valoración mínima promedio
        
        Returns:
            Lista de arquitectos que cumplen los filtros
        """
        # Construir query base
        query = select(ArquitectoModel)
        
        # Aplicar filtros
        conditions = []
        
        if especialidad:
            # Búsqueda case-insensitive con ILIKE
            conditions.append(
                ArquitectoModel.especialidades.ilike(f"%{especialidad}%")
            )
        
        if ubicacion:
            conditions.append(
                ArquitectoModel.ubicacion.ilike(f"%{ubicacion}%")
            )
        
        if verificado is not None:
            conditions.append(ArquitectoModel.verificado == verificado)
        
        if valoracion_minima is not None:
            conditions.append(
                ArquitectoModel.valoracion_prom_proyecto >= valoracion_minima
            )
        
        # Aplicar condiciones si existen
        if conditions:
            query = query.where(and_(*conditions))
        
        # Ordenar por valoración descendente
        query = query.order_by(ArquitectoModel.valoracion_prom_proyecto.desc())
        
        # Ejecutar query
        result = await db.execute(query)
        arquitectos = result.scalars().all()
        
        # Convertir a entidades
        return [
            Arquitecto(
                id=str(a.id),
                usuario_id=str(a.usuario_id),
                cedula=a.cedula,
                descripcion=a.descripcion,
                especialidades=a.especialidades,
                ubicacion=a.ubicacion,
                verificado=a.verificado,
                vistas_perfil=a.vistas_perfil,
                valoracion_prom_proyecto=float(a.valoracion_prom_proyecto) if a.valoracion_prom_proyecto else 0.0
            )
            for a in arquitectos
        ]

    async def filtrar_proyectos(
        self,
        db: AsyncSession,
        tipo: Optional[str] = None,
        arquitecto_id: Optional[str] = None,
        fecha_desde: Optional[date] = None,
        fecha_hasta: Optional[date] = None,
        valoracion_minima: Optional[float] = None
    ) -> List[Proyecto]:
        """
        Filtrar proyectos con múltiples criterios
        
        Args:
            db: Sesión de base de datos
            tipo: Tipo de proyecto (portafolio/contratado)
            arquitecto_id: ID del arquitecto
            fecha_desde: Fecha de publicación desde
            fecha_hasta: Fecha de publicación hasta
            valoracion_minima: Valoración promedio mínima
        
        Returns:
            Lista de proyectos que cumplen los filtros
        """
        # Construir query base
        query = select(ProyectoModel)
        
        # Aplicar filtros
        conditions = []
        
        if tipo:
            conditions.append(ProyectoModel.tipo_proyecto == tipo)
        
        if arquitecto_id:
            conditions.append(
                cast(ProyectoModel.arquitecto_id, String) == arquitecto_id
            )
        
        if fecha_desde:
            conditions.append(ProyectoModel.fecha_publicacion >= fecha_desde)
        
        if fecha_hasta:
            conditions.append(ProyectoModel.fecha_publicacion <= fecha_hasta)
        
        if valoracion_minima is not None:
            conditions.append(
                ProyectoModel.valoracion_promedio >= valoracion_minima
            )
        
        # Aplicar condiciones
        if conditions:
            query = query.where(and_(*conditions))
        
        # Ordenar por fecha de publicación descendente
        query = query.order_by(ProyectoModel.fecha_publicacion.desc())
        
        # Ejecutar query
        result = await db.execute(query)
        proyectos = result.scalars().all()
        
        # Convertir a entidades
        return [
            Proyecto(
                id=str(p.id),
                titulo_proyecto=p.titulo_proyecto,
                descripcion=p.descripcion,
                tipo_proyecto=p.tipo_proyecto,
                fecha_publicacion=p.fecha_publicacion,
                valoracion_promedio=float(p.valoracion_promedio) if p.valoracion_promedio else 0.0,
                arquitecto_id=str(p.arquitecto_id) if p.arquitecto_id else None,
                cliente_id=str(p.cliente_id) if p.cliente_id else None,
                conversacion_id=str(p.conversacion_id) if p.conversacion_id else None
            )
            for p in proyectos
        ]

    async def busqueda_global(
        self,
        db: AsyncSession,
        texto: str,
        limite: int = 10
    ) -> List[dict]:
        """
        Búsqueda global de texto en múltiples entidades
        
        Args:
            db: Sesión de base de datos
            texto: Texto a buscar
            limite: Máximo de resultados por tipo
        
        Returns:
            Lista de resultados con tipo, id, titulo, descripcion y relevancia
        """
        resultados = []
        texto_busqueda = f"%{texto}%"
        
        # Buscar en usuarios
        query_usuarios = (
            select(UsuarioModel)
            .where(
                or_(
                    UsuarioModel.nombre.ilike(texto_busqueda),
                    UsuarioModel.apellido.ilike(texto_busqueda),
                    UsuarioModel.email.ilike(texto_busqueda)
                )
            )
            .limit(limite)
        )
        result_usuarios = await db.execute(query_usuarios)
        usuarios = result_usuarios.scalars().all()
        
        for u in usuarios:
            # Calcular relevancia simple (1.0 si coincide con nombre)
            relevancia = 1.0 if texto.lower() in u.nombre.lower() else 0.7
            resultados.append({
                "tipo": "usuario",
                "id": str(u.id),
                "titulo": f"{u.nombre} {u.apellido}",
                "descripcion": f"{u.rol} - {u.email}",
                "relevancia": relevancia
            })
        
        # Buscar en arquitectos (por especialidad/ubicación)
        query_arquitectos = (
            select(ArquitectoModel)
            .where(
                or_(
                    ArquitectoModel.especialidades.ilike(texto_busqueda),
                    ArquitectoModel.ubicacion.ilike(texto_busqueda),
                    ArquitectoModel.descripcion.ilike(texto_busqueda)
                )
            )
            .limit(limite)
        )
        result_arquitectos = await db.execute(query_arquitectos)
        arquitectos = result_arquitectos.scalars().all()
        
        for a in arquitectos:
            relevancia = 0.9 if texto.lower() in (a.especialidades or "").lower() else 0.6
            resultados.append({
                "tipo": "arquitecto",
                "id": str(a.id),
                "titulo": f"Arquitecto - Cédula {a.cedula}",
                "descripcion": f"{a.especialidades} - {a.ubicacion}",
                "relevancia": relevancia
            })
        
        # Buscar en proyectos
        query_proyectos = (
            select(ProyectoModel)
            .where(
                or_(
                    ProyectoModel.titulo_proyecto.ilike(texto_busqueda),
                    ProyectoModel.descripcion.ilike(texto_busqueda)
                )
            )
            .limit(limite)
        )
        result_proyectos = await db.execute(query_proyectos)
        proyectos = result_proyectos.scalars().all()
        
        for p in proyectos:
            relevancia = 1.0 if texto.lower() in p.titulo_proyecto.lower() else 0.8
            resultados.append({
                "tipo": "proyecto",
                "id": str(p.id),
                "titulo": p.titulo_proyecto,
                "descripcion": p.descripcion[:100] if p.descripcion else None,
                "relevancia": relevancia
            })
        
        # Ordenar por relevancia descendente
        resultados.sort(key=lambda x: x["relevancia"], reverse=True)
        
        return resultados
