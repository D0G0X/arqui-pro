from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class Usuario:
    id: Optional[str]
    nombre: str
    apellido: str
    email: str
    estado_cuenta: str
    encrypted_password: str  # password hash (Devise/BCrypt)
    jti: Optional[str] = None  # JWT ID - identificador único de token
    remember_created_at: Optional[datetime] = None  # timestamp para "recordarme"
    rol: str = "cliente"
    fecha_registro: Optional[datetime] = datetime.now()
    foto_perfil: Optional[str] = None
