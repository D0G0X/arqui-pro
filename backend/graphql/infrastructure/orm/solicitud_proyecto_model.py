from sqlalchemy import Column, String, Date, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class SolicitudProyectoModel(Base):
    __tablename__ = "solicitudes_proyecto"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    estado = Column(String, nullable=False, default="pendiente")
    fecha = Column(Date, nullable=False)
    arquitecto_id = Column(UUID(as_uuid=True), ForeignKey("arquitectos.id"), nullable=False)
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id"), nullable=False)
