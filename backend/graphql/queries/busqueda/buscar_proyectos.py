"""
Query 8: Buscar Proyectos
Búsqueda avanzada de proyectos con múltiples filtros.
"""
import strawberry
from typing import Optional, List
from infrastructure.rest_client import rest_client
from graphql_types.dashboard_proyecto import DashboardProyecto


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
                usr_data = await rest_client.get_usuario(str(arq_data.get("usuario_id")))
                nombre_arq = f"{usr_data.get('nombre')} {usr_data.get('apellido')}"
            except:
                nombre_arq = "Desconocido"
            
            # Obtener avances
            avances_data = await rest_client.get_avances(params={"proyecto_id": str(proy.get("id"))})
            avances = [a for a in avances_data if str(a.get("proyecto_id")) == str(proy.get("id"))]
            
            # Obtener valoraciones
            val_data = await rest_client.get_valoraciones(params={"proyecto_id": str(proy.get("id"))})
            valoraciones = [v for v in val_data if str(v.get("proyecto_id")) == str(proy.get("id"))]
            val_prom = sum(v.get("calificacion", 0.0) for v in valoraciones) / len(valoraciones) if valoraciones else 0.0
            
            # Obtener incidencias
            inc_data = await rest_client.get_incidencias(params={"proyecto_id": str(proy.get("id"))})
            incidencias = [i for i in inc_data if str(i.get("proyecto_id")) == str(proy.get("id"))]
            
            # Construir dashboard
            dashboard = DashboardProyecto(
                proyecto_id=str(proy.get("id")),
                titulo=proy.get("titulo_proyecto") or "Sin título",
                descripcion=proy.get("descripcion_proyecto"),
                tipo_proyecto=proy.get("tipo_proyecto"),
                nombre_arquitecto=nombre_arq,
                total_avances=len(avances),
                total_valoraciones=len(valoraciones),
                valoracion_promedio=val_prom,
                total_incidencias=len(incidencias)
            )
            resultados.append(dashboard)
        
        return resultados
    except Exception as e:
        print(f"❌ Error en buscarProyectos: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
