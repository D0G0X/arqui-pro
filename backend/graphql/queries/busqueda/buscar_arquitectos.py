"""
Query 7: Buscar Arquitectos
Búsqueda avanzada de arquitectos con múltiples filtros.
"""
import strawberry
from typing import Optional, List
from infrastructure.rest_client import rest_client
from graphql_types.perfil_completo_arquitecto import PerfilCompletoArquitecto


async def resolver_buscar_arquitectos(
    especialidad: Optional[str] = None,
    valoracion_minima: Optional[float] = None,
    verificado: Optional[bool] = None
) -> List[PerfilCompletoArquitecto]:
    """
    Búsqueda avanzada de arquitectos:
    - Filtro por especialidad
    - Filtro por valoración mínima
    - Filtro por estado de verificación
    Retorna lista de perfiles completos de arquitectos que cumplan criterios
    """
    try:
        # Obtener todos los arquitectos
        arquitectos_data = await rest_client.get_arquitectos()
        resultados = []
        
        for arq in arquitectos_data:
            # Aplicar filtro de verificación
            if verificado is not None and arq.get("verificado") != verificado:
                continue
            
            # Aplicar filtro de especialidad
            if especialidad and arq.get("especialidad"):
                if especialidad.lower() not in arq.get("especialidad").lower():
                    continue
            
            # Obtener datos del usuario
            try:
                usr_data = await rest_client.get_usuario(str(arq.get("usuario_id")))
            except:
                continue
            
            # Obtener proyectos para calcular valoración
            proyectos_data = await rest_client.get_proyectos(params={"arquitecto_id": str(arq.get("id"))})
            proyectos = [p for p in proyectos_data if str(p.get("arquitecto_id")) == str(arq.get("id"))]
            
            # Calcular valoración promedio
            total_val = 0
            suma_val = 0.0
            for p in proyectos:
                val_data = await rest_client.get_valoraciones(params={"proyecto_id": str(p.get("id"))})
                vals = [v for v in val_data if str(v.get("proyecto_id")) == str(p.get("id"))]
                total_val += len(vals)
                suma_val += sum(v.get("calificacion", 0.0) for v in vals)
            
            val_prom = suma_val / total_val if total_val > 0 else 0.0
            
            # Aplicar filtro de valoración mínima
            if valoracion_minima is not None and val_prom < valoracion_minima:
                continue
            
            # Construir perfil completo
            perfil = PerfilCompletoArquitecto(
                arquitecto_id=str(arq.get("id")),
                nombre_completo=f"{usr_data.get('nombre')} {usr_data.get('apellido')}",
                email=usr_data.get("email"),
                telefono=usr_data.get("telefono"),
                especialidad=arq.get("especialidad"),
                años_experiencia=arq.get("años_experiencia"),
                total_proyectos=len(proyectos),
                valoracion_promedio=val_prom,
                verificado=arq.get("verificado") or False,
                descripcion=arq.get("descripcion")
            )
            resultados.append(perfil)
        
        return resultados
    except Exception as e:
        print(f"❌ Error en buscarArquitectos: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
