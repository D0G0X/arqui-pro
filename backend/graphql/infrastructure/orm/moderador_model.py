from sqlalchemy import Column, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class ModeradorModel(Base):
    __tablename__ = "moderadores"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
