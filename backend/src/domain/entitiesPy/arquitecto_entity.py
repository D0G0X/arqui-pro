# src/domain/entities/arquitecto_entity.py
from dataclasses import dataclass

@dataclass
class Arquitecto:
    id_arquitecto: int | None
    cedula: str
    valoracion_prom_proyecto: int
    descripcion: str
    especialidades: str
    ubicacion: str
    verificado: bool
    vistas_perfil: int
