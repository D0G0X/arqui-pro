from sqlalchemy import Column, Text, Date, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class AvanceModel(Base):
    __tablename__ = "avances"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    descripcion = Column(Text, nullable=False)
    fecha = Column(Date, nullable=False)
    proyecto_id = Column(UUID(as_uuid=True), ForeignKey("proyectos.id"), nullable=False)
