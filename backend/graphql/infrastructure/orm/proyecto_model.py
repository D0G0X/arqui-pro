from sqlalchemy import Column, Text, String, Float, Date, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class ProyectoModel(Base):
    __tablename__ = "proyectos"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    titulo_proyecto = Column(Text, nullable=False)
    valoracion_promedio = Column(Float, nullable=False, default=0.0)
    descripcion = Column(Text, nullable=False)
    tipo_proyecto = Column(String, nullable=False)
    fecha_publicacion = Column(Date, nullable=False)
    arquitecto_id = Column(UUID(as_uuid=True), ForeignKey("arquitectos.id"), nullable=False)
    conversacion_id = Column(UUID(as_uuid=True), ForeignKey("conversaciones.id"), nullable=True)
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id"), nullable=True)
    solicitud_proyecto_id = Column(UUID(as_uuid=True), ForeignKey("solicitudes_proyecto.id"), nullable=True)
