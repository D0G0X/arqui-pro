"""
Helper para obtener usuarios directamente desde la base de datos compartida (Supabase).
Como el microservicio de auth y Rails comparten la misma tabla usuarios,
podemos consultarla directamente.
"""
from typing import Optional, Dict, Any, List
from loguru import logger
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

class UsuarioHelper:
    """Helper para obtener usuarios desde la base de datos compartida"""
    
    def __init__(self):
        self.db_host = os.getenv("DB_HOST")
        self.db_port = int(os.getenv("DB_PORT", "5432"))
        self.db_user = os.getenv("DB_USER")
        self.db_password = os.getenv("DB_PASS")
        self.db_name = os.getenv("DB_NAME", "postgres")
        self.db_ssl = os.getenv("DB_SSL", "true").lower() == "true"
        
    async def _get_connection(self):
        """Obtiene una conexión a la base de datos"""
        # Para Supabase, necesitamos SSL
        # asyncpg requiere ssl=True o un objeto SSLContext
        import ssl as ssl_module
        
        if not self.db_host:
            raise Exception("DB_HOST no está configurado. Verifica las variables de entorno.")
        
        ssl_config = None
        if self.db_ssl:
            # Crear contexto SSL que no verifica certificados (para Supabase)
            ssl_config = ssl_module.create_default_context()
            ssl_config.check_hostname = False
            ssl_config.verify_mode = ssl_module.CERT_NONE
        
        try:
            logger.info(f"Conectando a BD: host={self.db_host}, port={self.db_port}, db={self.db_name}, ssl={self.db_ssl}")
            return await asyncpg.connect(
                host=self.db_host,
                port=self.db_port,
                user=self.db_user,
                password=self.db_password,
                database=self.db_name,
                ssl=ssl_config
            )
        except Exception as e:
            logger.error(f"Error de conexión a BD: host={self.db_host}, port={self.db_port}, error={str(e)}")
            raise
    
    async def get_usuario_by_id(self, usuario_id: str) -> Optional[Dict[str, Any]]:
        """
        Obtiene un usuario por ID desde la base de datos compartida.
        Esta es la fuente de verdad del microservicio de auth.
        """
        try:
            conn = await self._get_connection()
            try:
                row = await conn.fetchrow(
                    """
                    SELECT 
                        id, nombre, apellido, email, estado_cuenta, 
                        rol, fecha_registro, foto_perfil
                    FROM usuarios
                    WHERE id = $1
                    """,
                    usuario_id
                )
                
                if not row:
                    return None
                
                return {
                    "id": str(row["id"]),
                    "nombre": row["nombre"],
                    "apellido": row["apellido"],
                    "email": row["email"],
                    "estado_cuenta": row["estado_cuenta"],
                    "rol": row["rol"],
                    "fecha_registro": row["fecha_registro"].isoformat() if row["fecha_registro"] else None,
                    "foto_perfil": row["foto_perfil"]
                }
            finally:
                await conn.close()
        except Exception as e:
            logger.error(f"Error obteniendo usuario {usuario_id} desde BD: {str(e)}")
            return None
    
    async def get_usuario_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Obtiene un usuario por email desde la base de datos compartida"""
        try:
            conn = await self._get_connection()
            try:
                row = await conn.fetchrow(
                    """
                    SELECT 
                        id, nombre, apellido, email, estado_cuenta, 
                        rol, fecha_registro, foto_perfil
                    FROM usuarios
                    WHERE LOWER(email) = LOWER($1)
                    """,
                    email
                )
                
                if not row:
                    return None
                
                return {
                    "id": str(row["id"]),
                    "nombre": row["nombre"],
                    "apellido": row["apellido"],
                    "email": row["email"],
                    "estado_cuenta": row["estado_cuenta"],
                    "rol": row["rol"],
                    "fecha_registro": row["fecha_registro"].isoformat() if row["fecha_registro"] else None,
                    "foto_perfil": row["foto_perfil"]
                }
            finally:
                await conn.close()
        except Exception as e:
            logger.error(f"Error obteniendo usuario {email} desde BD: {str(e)}")
            return None
    
    async def get_usuarios_by_ids(self, usuario_ids: list[str]) -> Dict[str, Dict[str, Any]]:
        """
        Obtiene múltiples usuarios por IDs desde la base de datos compartida.
        Retorna un diccionario con usuario_id como clave.
        """
        if not usuario_ids:
            return {}
        
        try:
            conn = await self._get_connection()
            try:
                rows = await conn.fetch(
                    """
                    SELECT 
                        id, nombre, apellido, email, estado_cuenta, 
                        rol, fecha_registro, foto_perfil
                    FROM usuarios
                    WHERE id = ANY($1::uuid[])
                    """,
                    usuario_ids
                )
                
                result = {}
                for row in rows:
                    result[str(row["id"])] = {
                        "id": str(row["id"]),
                        "nombre": row["nombre"],
                        "apellido": row["apellido"],
                        "email": row["email"],
                        "estado_cuenta": row["estado_cuenta"],
                        "rol": row["rol"],
                        "fecha_registro": row["fecha_registro"].isoformat() if row["fecha_registro"] else None,
                        "foto_perfil": row["foto_perfil"]
                    }
                
                return result
            finally:
                await conn.close()
        except Exception as e:
            logger.error(f"Error obteniendo usuarios desde BD: {str(e)}")
            return {}
    
    async def get_all_usuarios(self) -> List[Dict[str, Any]]:
        """
        Obtiene todos los usuarios desde la base de datos compartida.
        Retorna una lista de usuarios.
        """
        try:
            conn = await self._get_connection()
            try:
                rows = await conn.fetch(
                    """
                    SELECT 
                        id, nombre, apellido, email, estado_cuenta, 
                        rol, fecha_registro, foto_perfil
                    FROM usuarios
                    ORDER BY fecha_registro DESC
                    """
                )
                
                result = []
                for row in rows:
                    result.append({
                        "id": str(row["id"]),
                        "nombre": row["nombre"],
                        "apellido": row["apellido"],
                        "email": row["email"],
                        "estado_cuenta": row["estado_cuenta"],
                        "rol": row["rol"],
                        "fecha_registro": row["fecha_registro"].isoformat() if row["fecha_registro"] else None,
                        "foto_perfil": row["foto_perfil"]
                    })
                
                return result
            finally:
                await conn.close()
        except Exception as e:
            logger.error(f"Error obteniendo todos los usuarios desde BD: {str(e)}")
            return []


# Singleton instance
usuario_helper = UsuarioHelper()
