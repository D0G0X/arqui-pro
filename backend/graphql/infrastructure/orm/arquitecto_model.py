from sqlalchemy import Column, String, Boolean, Integer, Float, Text, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class ArquitectoModel(Base):
    __tablename__ = "arquitectos"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    cedula = Column(String, nullable=False, unique=True)
    valoracion_prom_proyecto = Column(Float, nullable=False, default=0.0)
    descripcion = Column(Text, nullable=False)
    especialidades = Column(String, nullable=False)
    ubicacion = Column(String, nullable=False)
    verificado = Column(Boolean, nullable=False, default=False)
    vistas_perfil = Column(Integer, nullable=False, default=0)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
