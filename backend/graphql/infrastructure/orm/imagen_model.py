from sqlalchemy import Column, Text, Date, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base


class ImagenModel(Base):
    __tablename__ = "imagenes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    imagen_url = Column(Text, nullable=False)
    fecha = Column(Date, nullable=False)
