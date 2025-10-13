from sqlalchemy import Column, String, Boolean, DateTime, func, text
from sqlalchemy.dialects.postgresql import UUID
from infrastructure.database import Base

class UsuarioModel(Base):
    __tablename__ = "usuarios"

    # la columna real en la BD se llama "id"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    estado_cuenta = Column(String, nullable=False, default="activo")
    password = Column(String, nullable=False)  # password hash
    rol = Column(String, nullable=False, default="cliente")
    fecha_registro = Column(DateTime, server_default=func.now())
    foto_perfil = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    # updated_at: asegurar valor por defecto al insertar y actualizar automáticamente
    updated_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )