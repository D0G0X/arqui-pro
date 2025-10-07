# src/infrastructure/orm/arquitecto_model.py
from sqlalchemy import Column, Integer, String, Boolean
from infrastructure.database import Base

class ArquitectoModel(Base):
    __tablename__ = "arquitecto"

    id_arquitecto = Column(Integer, primary_key=True, index=True)
    cedula = Column(String, nullable=False)
    valoracion_prom_proyecto = Column(Integer, default=0)
    descripcion = Column(String)
    especialidades = Column(String)
    ubicacion = Column(String)
    verificado = Column(Boolean, default=False)
    vistas_perfil = Column(Integer, default=0)
