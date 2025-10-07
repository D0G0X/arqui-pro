# src/adapters/graphql/schemas/arquitecto_schema.py
import strawberry

@strawberry.type
class ArquitectoType:
    id_arquitecto: int
    cedula: str
    valoracion_prom_proyecto: int
    descripcion: str
    especialidades: str
    ubicacion: str
    verificado: bool
    vistas_perfil: int
