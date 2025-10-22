"""
Query 9: Buscar Conversaciones
Búsqueda avanzada de conversaciones con múltiples filtros.
"""
import strawberry
from typing import Optional, List
from infrastructure.rest_client import rest_client
from graphql_types.historial_conversacion import HistorialConversacion


async def resolver_buscar_conversaciones(
    proyecto_id: Optional[strawberry.ID] = None,
    cliente_id: Optional[strawberry.ID] = None,
    arquitecto_id: Optional[strawberry.ID] = None
) -> List[HistorialConversacion]:
    """
    Búsqueda avanzada de conversaciones:
    - Filtro por proyecto
    - Filtro por cliente
    - Filtro por arquitecto
    Retorna lista de historiales de conversaciones que cumplan criterios
    """
    try:
        # Obtener todas las conversaciones
        conversaciones_data = await rest_client.get_conversaciones()
        resultados = []
        
        for conv in conversaciones_data:
            # Aplicar filtro de proyecto
            if proyecto_id is not None:
                if str(conv.get("proyecto_id")) != str(proyecto_id):
                    continue
            
            # Aplicar filtro de cliente
            if cliente_id is not None:
                if str(conv.get("cliente_id")) != str(cliente_id):
                    continue
            
            # Aplicar filtro de arquitecto
            if arquitecto_id is not None:
                if str(conv.get("arquitecto_id")) != str(arquitecto_id):
                    continue
            
            # Obtener datos del proyecto
            try:
                proy_data = await rest_client.get_proyecto(str(conv.get("proyecto_id")))
                titulo_proy = proy_data.get("titulo_proyecto") or "Sin título"
            except:
                titulo_proy = "Proyecto desconocido"
            
            # Obtener datos del cliente
            try:
                cli_data = await rest_client.get_cliente(str(conv.get("cliente_id")))
                usr_cli = await rest_client.get_usuario(str(cli_data.get("usuario_id")))
                nombre_cli = f"{usr_cli.get('nombre')} {usr_cli.get('apellido')}"
            except:
                nombre_cli = "Cliente desconocido"
            
            # Obtener datos del arquitecto
            try:
                arq_data = await rest_client.get_arquitecto(str(conv.get("arquitecto_id")))
                usr_arq = await rest_client.get_usuario(str(arq_data.get("usuario_id")))
                nombre_arq = f"{usr_arq.get('nombre')} {usr_arq.get('apellido')}"
            except:
                nombre_arq = "Arquitecto desconocido"
            
            # Obtener mensajes de la conversación
            mensajes_data = await rest_client.get_mensajes(params={"conversacion_id": str(conv.get("id"))})
            mensajes = [m for m in mensajes_data if str(m.get("conversacion_id")) == str(conv.get("id"))]
            
            # Construir historial
            historial = HistorialConversacion(
                conversacion_id=str(conv.get("id")),
                proyecto_titulo=titulo_proy,
                cliente_nombre=nombre_cli,
                arquitecto_nombre=nombre_arq,
                total_mensajes=len(mensajes),
                ultimo_mensaje=mensajes[-1].get("contenido") if mensajes else None
            )
            resultados.append(historial)
        
        return resultados
    except Exception as e:
        print(f"❌ Error en buscarConversaciones: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
