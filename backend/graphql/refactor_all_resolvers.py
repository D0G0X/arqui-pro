"""
Script de refactorización masiva de resolvers.
Ejecutar: python refactor_all_resolvers.py
"""
import os

# Configuración de cada entidad
ENTITIES = {
    "proyecto": {
        "fields": {
            "id": "id",
            "titulo": "titulo",
            "descripcion": "descripcion",
            "presupuesto": "presupuesto",
            "fecha_inicio": "fecha_inicio",
            "fecha_fin_estimada": "fecha_fin_estimada",
            "estado_proyecto": "estado_proyecto",
            "ubicacion_proyecto": "ubicacion_proyecto",
            "cliente_id": "cliente_id",
            "arquitecto_id": "arquitecto_id"
        }
    },
    "moderador": {
        "fields": {
            "id": "id",
            "permisos": "permisos",
            "fecha_asignacion": "fecha_asignacion",
            "usuario_id": "usuario_id"
        }
    },
    "conversacion": {
        "fields": {
            "id": "id",
            "titulo": "titulo",
            "fecha_inicio": "fecha_inicio",
            "fecha_ultimo_mensaje": "fecha_ultimo_mensaje",
            "usuario1_id": "usuario1_id",
            "usuario2_id": "usuario2_id"
        }
    },
    "mensaje": {
        "fields": {
            "id": "id",
            "contenido": "contenido",
            "fecha_envio": "fecha_envio",
            "leido": "leido",
            "conversacion_id": "conversacion_id",
            "remitente_id": "remitente_id"
        }
    },
    "notificacion": {
        "fields": {
            "id": "id",
            "tipo_notificacion": "tipo_notificacion",
            "contenido": "contenido",
            "leida": "leida",
            "fecha_creacion": "fecha_creacion",
            "usuario_id": "usuario_id"
        }
    },
    "solicitud_proyecto": {
        "fields": {
            "id": "id",
            "descripcion_proyecto": "descripcion_proyecto",
            "presupuesto_estimado": "presupuesto_estimado",
            "fecha_solicitud": "fecha_solicitud",
            "estado_solicitud": "estado_solicitud",
            "ubicacion": "ubicacion",
            "cliente_id": "cliente_id"
        }
    },
    "avance": {
        "fields": {
            "id": "id",
            "descripcion": "descripcion",
            "porcentaje_avance": "porcentaje_avance",
            "fecha_reporte": "fecha_reporte",
            "proyecto_id": "proyecto_id"
        }
    },
    "incidencia": {
        "fields": {
            "id": "id",
            "tipo_incidencia": "tipo_incidencia",
            "descripcion": "descripcion",
            "estado": "estado",
            "fecha_reporte": "fecha_reporte",
            "fecha_resolucion": "fecha_resolucion",
            "proyecto_id": "proyecto_id"
        }
    },
    "valoracion": {
        "fields": {
            "id": "id",
            "puntuacion": "puntuacion",
            "comentario": "comentario",
            "fecha_valoracion": "fecha_valoracion",
            "proyecto_id": "proyecto_id",
            "cliente_id": "cliente_id"
        }
    },
    "verificacion": {
        "fields": {
            "id": "id",
            "documento_presentado": "documento_presentado",
            "estado_verificacion": "estado_verificacion",
            "fecha_solicitud": "fecha_solicitud",
            "fecha_verificacion": "fecha_verificacion",
            "arquitecto_id": "arquitecto_id",
            "moderador_id": "moderador_id"
        }
    },
    "imagen": {
        "fields": {
            "id": "id",
            "url": "url",
            "tipo_imagen": "tipo_imagen",
            "descripcion": "descripcion",
            "fecha_subida": "fecha_subida"
        }
    },
    "imagen_asociacion": {
        "fields": {
            "id": "id",
            "imagen_id": "imagen_id",
            "entidad_tipo": "entidad_tipo",
            "entidad_id": "entidad_id"
        }
    }
}

def generate_resolver_code(entity_name, config):
    """Genera el código del resolver refactorizado"""
    # Capitalizar nombres
    class_name = entity_name.replace("_", " ").title().replace(" ", "")
    type_name = f"{class_name}Type"
    
    # Endpoint REST
    if entity_name == "solicitud_proyecto":
        endpoint_plural = "solicitudes_proyecto"
        endpoint_single = "solicitud_proyecto"
    elif entity_name.endswith("s"):
        endpoint_plural = entity_name
        endpoint_single = entity_name
    else:
        endpoint_plural = entity_name + "s"
        endpoint_single = entity_name
    
    # Construir campos de mapeo
    field_lines = []
    for field_name, field_key in config["fields"].items():
        field_lines.append(f'                {field_name}=item.get("{field_key}")')
    
    fields_str = ",\n".join(field_lines)
    
    code = f'''import strawberry
from typing import List, Optional
from adapters.schemas.{entity_name}_schema import {type_name}
from infrastructure.rest_client import rest_client


@strawberry.type
class Query{class_name}:
    """Queries de {entity_name}. Consume el API REST de Rails."""
    
    @strawberry.field
    async def listar_{endpoint_plural}(self, info) -> List[{type_name}]:
        """GET /api/v1/{endpoint_plural}"""
        data = await rest_client.get_{endpoint_plural}()
        return [
            {type_name}(
{fields_str}
            )
            for item in data
        ]

    @strawberry.field
    async def obtener_{endpoint_single}(self, info, id: strawberry.ID) -> Optional[{type_name}]:
        """GET /api/v1/{endpoint_plural}/:id"""
        try:
            item = await rest_client.get_{endpoint_single}(str(id))
            return {type_name}(
{fields_str}
            )
        except Exception:
            return None
'''
    return code

# Directorio de resolvers
base_dir = "c:/Users/leoan/Desktop/arqui-pro/backend/graphql/adapters/resolvers"

print("🔄 Refactorizando resolvers...")
print("=" * 60)

for entity_name, config in ENTITIES.items():
    filename = f"{entity_name}_resolver.py"
    filepath = os.path.join(base_dir, filename)
    
    print(f"✏️  Refactorizando {filename}...")
    
    code = generate_resolver_code(entity_name, config)
    
    # Mostrar vista previa
    print(f"   Preview: {len(code)} caracteres generados")
    
    # Escribir archivo
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"   ✅ {filename} actualizado")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()

print("=" * 60)
print(f"✅ {len(ENTITIES)} resolvers refactorizados exitosamente")
print("\n📝 Archivos modificados:")
for entity in ENTITIES.keys():
    print(f"   - {entity}_resolver.py")
