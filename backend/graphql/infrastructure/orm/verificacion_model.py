from sqlalchemy import Column, String, Date, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class VerificacionModel(Base):
    __tablename__ = "verificaciones"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    estado = Column(String, nullable=False)
    fecha_verificacion = Column(Date, nullable=False)
    arquitecto_id = Column(UUID(as_uuid=True), ForeignKey("arquitectos.id"), nullable=False)
    moderador_id = Column(UUID(as_uuid=True), ForeignKey("moderadores.id"), nullable=False)
