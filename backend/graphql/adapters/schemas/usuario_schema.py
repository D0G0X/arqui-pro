import strawberry
from typing import Optional
from datetime import datetime

@strawberry.type
class UsuarioType:
    id: strawberry.ID
    nombre: str
    apellido: str
    email: str
    estado_cuenta: str
    rol: str
    fecha_registro: Optional[datetime]
    foto_perfil: Optional[str]


@strawberry.input
class UsuarioInput:
    nombre: str
    apellido: str
    email: str
    password: str
    estado_cuenta: Optional[str] = "activo"
    rol: Optional[str] = "cliente"
    foto_perfil: Optional[str] = None