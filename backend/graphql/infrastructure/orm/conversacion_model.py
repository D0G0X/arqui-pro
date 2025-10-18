from sqlalchemy import Column, Date, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class ConversacionModel(Base):
    __tablename__ = "conversaciones"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    fecha = Column(Date, nullable=False)
    cliente_id = Column(UUID(as_uuid=True), ForeignKey("clientes.id"), nullable=False)
    arquitecto_id = Column(UUID(as_uuid=True), ForeignKey("arquitectos.id"), nullable=False)
