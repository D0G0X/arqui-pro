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
    encrypted_password = Column(String, nullable=False)  # password hash (Devise/BCrypt)
    jti = Column(String, nullable=True)  # JWT ID - identificador único de token
    remember_created_at = Column(DateTime, nullable=True)  # timestamp para "recordarme"
    rol = Column(String, nullable=False, default="cliente")
    fecha_registro = Column(DateTime, nullable=False, server_default=func.now())
    foto_perfil = Column(String, nullable=True)
