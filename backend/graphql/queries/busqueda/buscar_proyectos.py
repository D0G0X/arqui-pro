"""
Query 8: Buscar Proyectos
Búsqueda avanzada de proyectos con múltiples filtros.
"""
import strawberry
from typing import Optional, List
from infrastructure.rest_client import rest_client
from graphql_types.dashboard_proyecto import DashboardProyecto
from adapters.schemas.proyecto_schema import ProyectoType
from adapters.schemas.arquitecto_schema import ArquitectoType
from adapters.schemas.usuario_schema import UsuarioType
from adapters.schemas.cliente_schema import ClienteType
from adapters.schemas.avance_schema import AvanceType
from adapters.schemas.valoracion_schema import ValoracionType


async def resolver_buscar_proyectos(
    tipo_proyecto: Optional[str] = None,
    arquitecto_id: Optional[strawberry.ID] = None,
    estado: Optional[str] = None
) -> List[DashboardProyecto]:
    """
    Búsqueda avanzada de proyectos:
    - Filtro por tipo de proyecto
    - Filtro por arquitecto
    - Filtro por estado
    Retorna lista de dashboards de proyectos que cumplan criterios
    """
    try:
        # Obtener todos los proyectos
        proyectos_data = await rest_client.get_proyectos()
        resultados = []
        
        for proy in proyectos_data:
            # Aplicar filtro de tipo
            if tipo_proyecto and proy.get("tipo_proyecto"):
                if tipo_proyecto.lower() not in proy.get("tipo_proyecto").lower():
                    continue
            
            # Aplicar filtro de arquitecto
            if arquitecto_id is not None:
                if str(proy.get("arquitecto_id")) != str(arquitecto_id):
                    continue
            
            # Aplicar filtro de estado (usar tipo_proyecto como estado)
            if estado and proy.get("tipo_proyecto"):
                if estado.lower() not in proy.get("tipo_proyecto").lower():
                    continue
            
            # Obtener datos del arquitecto
            try:
                arq_data = await rest_client.get_arquitecto(str(proy.get("arquitecto_id")))
                arq_usuario_data = arq_data.get("usuario", {})
                
                arquitecto = ArquitectoType(
                    id=arq_data.get("id"),
                    cedula=arq_data.get("cedula"),
                    valoracion_prom_proyecto=arq_data.get("valoracion_prom_proyecto") or 0.0,
                    descripcion=arq_data.get("descripcion") or "",
                    especialidades=arq_data.get("especialidades") or "",
                    ubicacion=arq_data.get("ubicacion") or "",
                    verificado=arq_data.get("verificado") or False,
                    vistas_perfil=arq_data.get("vistas_perfil") or 0,
                    usuario_id=arq_usuario_data.get("id"),
                )
                
                arquitecto_usuario = UsuarioType(
                    id=arq_usuario_data.get("id"),
                    nombre=arq_usuario_data.get("nombre"),
                    apellido=arq_usuario_data.get("apellido"),
                    email=arq_usuario_data.get("email"),
                    estado_cuenta=arq_usuario_data.get("estado_cuenta"),
                    rol=arq_usuario_data.get("rol"),
                    fecha_registro=arq_usuario_data.get("fecha_registro"),
                    foto_perfil=arq_usuario_data.get("foto_perfil"),
                )
            except:
                continue  # Saltar proyecto si no se puede obtener arquitecto
            
            # Obtener avances
            avances_data = await rest_client.get_avances(params={"proyecto_id": str(proy.get("id"))})
            avances = [a for a in avances_data if str(a.get("proyecto_id")) == str(proy.get("id"))]
            
            # Obtener valoraciones
            val_data = await rest_client.get_valoraciones(params={"proyecto_id": str(proy.get("id"))})
            valoraciones = [v for v in val_data if str(v.get("proyecto_id")) == str(proy.get("id"))]
            val_prom = sum(v.get("calificacion", 0.0) for v in valoraciones) / len(valoraciones) if valoraciones else 0.0
            
            
            # Construir proyecto
            proyecto = ProyectoType(
                id=proy.get("id"),
                titulo_proyecto=proy.get("titulo_proyecto"),
                valoracion_promedio=val_prom,
                descripcion=proy.get("descripcion") or "",
                tipo_proyecto=proy.get("tipo_proyecto") or "",
                fecha_publicacion=proy.get("fecha_publicacion"),
                arquitecto_id=proy.get("arquitecto_id"),
                conversacion_id=proy.get("conversacion_id"),
                cliente_id=proy.get("cliente_id"),
                solicitud_proyecto_id=proy.get("solicitud_proyecto_id"),
            )
            
            # Construir avances
            avances_list = [
                AvanceType(
                    id=a.get("id"),
                    descripcion=a.get("descripcion"),
                    fecha=a.get("fecha"),
                    proyecto_id=a.get("proyecto_id"),
                )
                for a in avances
            ]
            
            # Construir valoraciones
            valoraciones_list = [
                ValoracionType(
                    id=v.get("id"),
                    calificacion=v.get("calificacion"),
                    comentario=v.get("comentario"),
                    fecha=v.get("fecha"),
                    cliente_id=v.get("cliente_id"),
                    proyecto_id=v.get("proyecto_id"),
                )
                for v in valoraciones
            ]
            
            # Obtener cliente si existe
            cliente = None
            cliente_usuario = None
            if proy.get("cliente_id"):
                try:
                    cli_data = await rest_client.get_cliente(str(proy.get("cliente_id")))
                    cli_usuario_data = cli_data.get("usuario", {})
                    
                    cliente = ClienteType(
                        id=cli_data.get("id"),
                        cedula=cli_data.get("cedula"),
                        usuario_id=cli_usuario_data.get("id"),
                    )
                    
                    cliente_usuario = UsuarioType(
                        id=cli_usuario_data.get("id"),
                        nombre=cli_usuario_data.get("nombre"),
                        apellido=cli_usuario_data.get("apellido"),
                        email=cli_usuario_data.get("email"),
                        estado_cuenta=cli_usuario_data.get("estado_cuenta"),
                        rol=cli_usuario_data.get("rol"),
                        fecha_registro=cli_usuario_data.get("fecha_registro"),
                        foto_perfil=cli_usuario_data.get("foto_perfil"),
                    )
                except:
                    pass
            
            # Construir dashboard
            dashboard = DashboardProyecto(
                proyecto=proyecto,
                arquitecto=arquitecto,
                arquitecto_usuario=arquitecto_usuario,
                cliente=cliente,
                cliente_usuario=cliente_usuario,
                avances=avances_list,
                valoraciones=valoraciones_list,
                total_avances=len(avances),
                valoracion_promedio=val_prom
            )
            resultados.append(dashboard)
        
        return resultados
    except Exception as e:
        print(f"❌ Error en buscarProyectos: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
