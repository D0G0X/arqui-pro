from sqlalchemy import Column, Text, Date, String, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class IncidenciaModel(Base):
    __tablename__ = "incidencias"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    descripcion = Column(Text, nullable=False)
    estado = Column(String, nullable=False)
    fecha = Column(Date, nullable=False)
    usuario_emisor_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
    usuario_infractor_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
    moderador_id = Column(UUID(as_uuid=True), ForeignKey("moderadores.id"), nullable=False)
