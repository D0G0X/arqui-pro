"""
Query 7: Buscar Arquitectos
Búsqueda avanzada de arquitectos con múltiples filtros.
"""
import strawberry
from typing import Optional, List
from infrastructure.rest_client import rest_client
from graphql_types.arquitecto_busqueda import ArquitectoBusqueda, UsuarioSimple, ProyectoSimple


async def resolver_buscar_arquitectos(
    especialidad: Optional[str] = None,
    valoracion_minima: Optional[float] = None,
    verificado: Optional[bool] = None,
    limite: Optional[int] = None
) -> List[ArquitectoBusqueda]:
    """
    Búsqueda avanzada de arquitectos:
    - Filtro por especialidad
    - Filtro por valoración mínima
    - Filtro por estado de verificación
    - Límite de resultados
    Retorna lista de perfiles completos de arquitectos que cumplan criterios
    """
    try:
        # Obtener todos los arquitectos
        arquitectos_data = await rest_client.get_arquitectos()
        print(f"🔍 Total arquitectos obtenidos: {len(arquitectos_data)}")
        print(f"🔍 Primer arquitecto completo: {arquitectos_data[0] if arquitectos_data else 'N/A'}")
        print(f"🔍 Filtros aplicados - verificado: {verificado}, especialidad: {especialidad}, valoracion_minima: {valoracion_minima}, limite: {limite}")
        
        resultados = []
        
        for arq in arquitectos_data:
            print(f"🔍 Procesando arquitecto ID: {arq.get('id')}, verificado: {arq.get('verificado')}")
            
            # Aplicar filtro de verificación
            if verificado is not None and arq.get("verificado") != verificado:
                print(f"  ❌ Rechazado por verificado: {arq.get('verificado')} != {verificado}")
                continue
            
            # Aplicar filtro de especialidad
            if especialidad and arq.get("especialidades"):
                if especialidad.lower() not in arq.get("especialidades").lower():
                    print(f"  ❌ Rechazado por especialidad: '{especialidad}' no en '{arq.get('especialidades')}'")
                    continue
            
            # El serializer de Rails incluye el usuario completo
            usuario_data = arq.get("usuario", {})
            if not usuario_data:
                print(f"  ❌ Rechazado: No tiene usuario asociado")
                continue  # Saltar si no tiene usuario
            
            print(f"  ✅ Usuario encontrado: {usuario_data.get('nombre')} {usuario_data.get('apellido')}")
            
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
            
            # Construir usuario simple
            usuario = UsuarioSimple(
                id=str(usuario_data.get("id")),
                nombre=usuario_data.get("nombre"),
                apellido=usuario_data.get("apellido"),
                email=usuario_data.get("email"),
                foto_perfil=usuario_data.get("foto_perfil")
            )
            
            # Construir lista de proyectos simples
            proyectos_list = [
                ProyectoSimple(
                    id=str(p.get("id")),
                    titulo_proyecto=p.get("titulo_proyecto"),
                    valoracion_promedio=p.get("valoracion_promedio") or 0.0
                )
                for p in proyectos
            ]
            
            # Construir arquitecto de búsqueda (estructura plana)
            arquitecto_busqueda = ArquitectoBusqueda(
                id=str(arq.get("id")),
                cedula=arq.get("cedula"),
                especialidades=arq.get("especialidades") or "",
                descripcion=arq.get("descripcion"),
                valoracion_promedio_proyecto=val_prom,
                verificado=arq.get("verificado") or False,
                usuario=usuario,
                proyectos=proyectos_list
            )
            
            resultados.append(arquitecto_busqueda)
            print(f"  ✅ Arquitecto agregado a resultados. Total: {len(resultados)}")
            
            # Aplicar límite si se especificó
            if limite and len(resultados) >= limite:
                print(f"🔍 Límite alcanzado: {limite}")
                break
        
        print(f"🔍 Total arquitectos retornados: {len(resultados)}")
        return resultados
    except Exception as e:
        print(f"❌ Error en buscarArquitectos: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
