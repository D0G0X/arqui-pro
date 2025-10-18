from sqlalchemy import Column, Text, Date, Float, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class ValoracionModel(Base):
    __tablename__ = "valoraciones"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    calificacion = Column(Float, nullable=False)
    comentario = Column(Text, nullable=False)
    fecha = Column(Date, nullable=False)
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id"), nullable=False)
    proyecto_id = Column(UUID(as_uuid=True), ForeignKey("proyectos.id"), nullable=False)
