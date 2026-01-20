"""
Query 7: Buscar Arquitectos
Búsqueda avanzada de arquitectos con múltiples filtros.
"""
import strawberry
from typing import Optional, List
from infrastructure.rest_client import rest_client
from infrastructure.usuario_helper import usuario_helper
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
        print(f"🔍 Filtros aplicados - verificado: {verificado}, especialidad: {especialidad}, valoracion_minima: {valoracion_minima}, limite: {limite}")
        
        # 🚀 OPTIMIZACIÓN: Obtener TODOS los proyectos de una sola vez en lugar de por arquitecto
        print(f"📊 Obteniendo todos los proyectos (batch)...")
        todos_proyectos_data = await rest_client.get_proyectos()
        print(f"📊 Total proyectos: {len(todos_proyectos_data)}")
        
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
            
            # Obtener usuario_id del arquitecto
            usuario_id = arq.get("usuario_id")
            if not usuario_id:
                # Intentar obtener desde el objeto usuario si viene en la respuesta de Rails
                usuario_data_from_rails = arq.get("usuario")
                if usuario_data_from_rails:
                    usuario_id = usuario_data_from_rails.get("id")
            
            if not usuario_id:
                print(f"  ❌ Rechazado: No tiene usuario_id asociado")
                continue  # Saltar si no tiene usuario
            
            # Obtener usuario directamente desde la BD compartida (auth microservice)
            usuario_data = await usuario_helper.get_usuario_by_id(str(usuario_id))
            
            if not usuario_data:
                print(f"  ❌ Rechazado: Usuario {usuario_id} no encontrado en BD de auth")
                continue  # Saltar si no se encuentra el usuario
            
            print(f"  ✅ Usuario encontrado desde auth BD: {usuario_data.get('nombre')} {usuario_data.get('apellido')}")
            
            # 🔧 USAR VALOR DE LA BD EN LUGAR DE RECALCULAR
            # La BD ya tiene el valor pre-calculado en "valoracion_prom_proyecto"
            val_prom = float(arq.get("valoracion_prom_proyecto") or 0.0)
            print(f"  📊 Valoración promedio de BD: {val_prom}")
            
            # Aplicar filtro de valoración mínima
            if valoracion_minima is not None and val_prom < valoracion_minima:
                print(f"  ❌ Rechazado por valoración mínima: {val_prom} < {valoracion_minima}")
                continue
            
            # 🚀 OPTIMIZACIÓN: Usar proyectos ya cargados (batch) en lugar de query por arquitecto
            arquitecto_id = str(arq.get("id"))
            proyectos = [p for p in todos_proyectos_data if str(p.get("arquitecto_id")) == arquitecto_id]
            print(f"  📦 Proyectos del arquitecto {arquitecto_id}: {len(proyectos)}")
            
            # Construir usuario simple desde datos de auth BD
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
