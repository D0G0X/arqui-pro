"""
Query 7: Buscar Arquitectos
Búsqueda avanzada de arquitectos con múltiples filtros.
"""
import strawberry
from typing import Optional, List
from infrastructure.rest_client import rest_client
from graphql_types.perfil_completo_arquitecto import PerfilCompletoArquitecto
from adapters.schemas.arquitecto_schema import ArquitectoType
from adapters.schemas.usuario_schema import UsuarioType
from adapters.schemas.proyecto_schema import ProyectoType


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
            
            # El serializer de Rails incluye el usuario completo
            usuario_data = arq.get("usuario", {})
            if not usuario_data:
                continue  # Saltar si no tiene usuario
            
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
            
            # Construir objetos completos
            arquitecto = ArquitectoType(
                id=arq.get("id"),
                cedula=arq.get("cedula"),
                valoracion_prom_proyecto=val_prom,
                descripcion=arq.get("descripcion") or "",
                especialidades=arq.get("especialidades") or "",
                ubicacion=arq.get("ubicacion") or "",
                verificado=arq.get("verificado") or False,
                vistas_perfil=arq.get("vistas_perfil") or 0,
                usuario_id=usuario_data.get("id"),
            )
            
            usuario = UsuarioType(
                id=usuario_data.get("id"),
                nombre=usuario_data.get("nombre"),
                apellido=usuario_data.get("apellido"),
                email=usuario_data.get("email"),
                estado_cuenta=usuario_data.get("estado_cuenta"),
                rol=usuario_data.get("rol"),
                fecha_registro=usuario_data.get("fecha_registro"),
                foto_perfil=usuario_data.get("foto_perfil"),
            )
            
            proyectos_list = [
                ProyectoType(
                    id=p.get("id"),
                    titulo_proyecto=p.get("titulo_proyecto"),
                    valoracion_promedio=p.get("valoracion_promedio") or 0.0,
                    descripcion=p.get("descripcion") or "",
                    tipo_proyecto=p.get("tipo_proyecto") or "",
                    fecha_publicacion=p.get("fecha_publicacion"),
                    arquitecto_id=p.get("arquitecto_id"),
                    conversacion_id=p.get("conversacion_id"),
                    cliente_id=p.get("cliente_id"),
                    solicitud_proyecto_id=p.get("solicitud_proyecto_id"),
                )
                for p in proyectos
            ]
            
            perfil = PerfilCompletoArquitecto(
                arquitecto=arquitecto,
                usuario=usuario,
                proyectos=proyectos_list,
                total_proyectos=len(proyectos),
                valoracion_promedio=val_prom
            )
            resultados.append(perfil)
        
        return resultados
    except Exception as e:
        print(f"❌ Error en buscarArquitectos: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
