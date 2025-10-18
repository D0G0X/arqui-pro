from sqlalchemy import Column, String, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class ImagenAsociacionModel(Base):
    __tablename__ = "imagen_asociaciones"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    asociable_type = Column(String, nullable=False)
    asociable_id = Column(String, nullable=False)
    imagen_id = Column(UUID(as_uuid=True), ForeignKey("imagenes.id"), nullable=False)
