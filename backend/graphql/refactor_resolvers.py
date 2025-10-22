"""
Script para refactorizar todos los resolvers:
- Eliminar mutaciones
- Usar rest_client en lugar de repositories
- Simplificar queries
"""

RESOLVERS_CONFIG = {
    "cliente": {
        "fields": ["id", "telefono", "proyectos_solicitados", "usuario_id"],
        "type": "ClienteType"
    },
    "proyecto": {
        "fields": ["id", "titulo", "descripcion", "presupuesto", "fecha_inicio", 
                   "fecha_fin_estimada", "estado_proyecto", "ubicacion_proyecto",
                   "cliente_id", "arquitecto_id"],
        "type": "ProyectoType"
    },
    "moderador": {
        "fields": ["id", "permisos", "fecha_asignacion", "usuario_id"],
        "type": "ModeradorType"
    },
    "conversacion": {
        "fields": ["id", "titulo", "fecha_inicio", "fecha_ultimo_mensaje",
                   "usuario1_id", "usuario2_id"],
        "type": "ConversacionType"
    },
    "mensaje": {
        "fields": ["id", "contenido", "fecha_envio", "leido", 
                   "conversacion_id", "remitente_id"],
        "type": "MensajeType"
    },
    "notificacion": {
        "fields": ["id", "tipo_notificacion", "contenido", "leida",
                   "fecha_creacion", "usuario_id"],
        "type": "NotificacionType"
    },
    "solicitud_proyecto": {
        "fields": ["id", "descripcion_proyecto", "presupuesto_estimado",
                   "fecha_solicitud", "estado_solicitud", "ubicacion",
                   "cliente_id"],
        "type": "SolicitudProyectoType"
    },
    "avance": {
        "fields": ["id", "descripcion", "porcentaje_avance", "fecha_reporte",
                   "proyecto_id"],
        "type": "AvanceType"
    },
    "incidencia": {
        "fields": ["id", "tipo_incidencia", "descripcion", "estado",
                   "fecha_reporte", "fecha_resolucion", "proyecto_id"],
        "type": "IncidenciaType"
    },
    "valoracion": {
        "fields": ["id", "puntuacion", "comentario", "fecha_valoracion",
                   "proyecto_id", "cliente_id"],
        "type": "ValoracionType"
    },
    "verificacion": {
        "fields": ["id", "documento_presentado", "estado_verificacion",
                   "fecha_solicitud", "fecha_verificacion", "arquitecto_id",
                   "moderador_id"],
        "type": "VerificacionType"
    },
    "imagen": {
        "fields": ["id", "url", "tipo_imagen", "descripcion", "fecha_subida"],
        "type": "ImagenType"
    },
    "imagen_asociacion": {
        "fields": ["id", "imagen_id", "entidad_tipo", "entidad_id"],
        "type": "ImagenAsociacionType"
    },
}

def generate_resolver(entity_name, config):
    """Genera el código de un resolver refactorizado"""
    class_name = entity_name.replace("_", " ").title().replace(" ", "")
    type_name = config["type"]
    fields = config["fields"]
    endpoint = entity_name + "s" if not entity_name.endswith("s") else entity_name
    
    # Construir mapping de campos
    field_mapping = []
    for field in fields:
        field_mapping.append(f'{field}=item.get("{field}")')
    
    field_str = ",\n                ".join(field_mapping)
    
    code = f'''import strawberry
from typing import List, Optional
from adapters.schemas.{entity_name}_schema import {type_name}
from infrastructure.rest_client import rest_client

@strawberry.type
class Query{class_name}:
    """
    Queries de {entity_name}.
    Consume el API REST de Rails.
    """
    
    @strawberry.field
    async def listar_{endpoint}(self, info) -> List[{type_name}]:
        """GET /api/v1/{endpoint}"""
        data = await rest_client.get_{endpoint}()
        return [
            {type_name}(
                {field_str}
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_{entity_name}(self, info, id: strawberry.ID) -> Optional[{type_name}]:
        """GET /api/v1/{endpoint}/:id"""
        try:
            item = await rest_client.get_{entity_name}(str(id))
            return {type_name}(
                {field_str}
            )
        except Exception:
            return None
'''
    return code

# Generar todos los resolvers
print("Generando resolvers refactorizados...")
for entity, config in RESOLVERS_CONFIG.items():
    code = generate_resolver(entity, config)
    filename = f"c:/Users/leoan/Desktop/arqui-pro/backend/graphql/adapters/resolvers/{entity}_resolver_refactored.py"
    print(f"Generando {filename}...")
    # No escribimos aún, solo mostramos
    print(code[:200] + "...")

print(f"\n✅ {len(RESOLVERS_CONFIG)} resolvers listos para generar")
print("\nPara aplicar los cambios, ejecuta este script con permisos de escritura")
