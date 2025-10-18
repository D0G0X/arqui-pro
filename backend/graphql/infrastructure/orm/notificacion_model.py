from sqlalchemy import Column, Text, Date, Boolean, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class NotificacionModel(Base):
    __tablename__ = "notificaciones"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    mensaje = Column(Text, nullable=False)
    fecha = Column(Date, nullable=False)
    leido = Column(Boolean, nullable=False, default=False)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
