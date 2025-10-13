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
    password_hash: str
    rol: str = "cliente"
    fecha_registro: Optional[datetime] = datetime.now()
    foto_perfil: Optional[str] = None
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()