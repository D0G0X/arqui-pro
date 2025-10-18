from sqlalchemy import Column, Text, Date, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class MensajeModel(Base):
    __tablename__ = "mensajes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    contenido = Column(Text, nullable=False)
    fecha_envio = Column(Date, nullable=False)
    leido = Column(Boolean, nullable=False, default=False)
    conversacion_id = Column(UUID(as_uuid=True), ForeignKey("conversaciones.id"), nullable=False)
    remitente_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
