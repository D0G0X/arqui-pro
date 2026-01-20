"""
HTTP Client para comunicarse con el microservicio de autenticación.
Usa httpx para peticiones asíncronas.
"""
import httpx
from typing import Optional, Dict, Any, List
from loguru import logger
import os
from dotenv import load_dotenv

load_dotenv()

class AuthApiClient:
    """Cliente HTTP para comunicarse con el microservicio de autenticación"""
    
    def __init__(self):
        # URL del microservicio de auth (a través del gateway o directo)
        self.base_url = os.getenv("AUTH_SERVICE_URL", "http://localhost:4001")
        self.timeout = 30.0
        
    async def _request(
        self,
        method: str,
        endpoint: str,
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Ejecuta una petición HTTP al microservicio de auth"""
        url = f"{self.base_url}/{endpoint}"
        
        default_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        if headers:
            default_headers.update(headers)
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.request(
                    method=method,
                    url=url,
                    json=json_data,
                    params=params,
                    headers=default_headers
                )
                
                response.raise_for_status()
                
                # Si es 204 No Content, devolver dict vacío
                if response.status_code == 204:
                    return {}
                
                return response.json()
                
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP Error {e.response.status_code}: {e.response.text}")
            raise Exception(f"Error en Auth Service: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Request Error: {str(e)}")
            raise Exception(f"Error de conexión con Auth Service: {str(e)}")
    
    async def get_usuario(self, usuario_id: str) -> Optional[Dict]:
        """
        Obtiene un usuario por ID desde el microservicio de auth.
        Nota: Esto requiere que el microservicio de auth tenga un endpoint para obtener usuarios.
        Por ahora, consultamos directamente la base de datos compartida.
        """
        # Como el microservicio de auth no tiene un endpoint público para obtener usuarios por ID,
        # y ambos sistemas comparten la misma tabla usuarios en Supabase,
        # podemos consultar directamente la BD o usar el endpoint /auth/me con autenticación de servicio.
        # Por ahora, retornamos None y manejaremos esto consultando directamente la BD compartida.
        return None
    
    async def get_usuario_by_email(self, email: str) -> Optional[Dict]:
        """Obtiene un usuario por email"""
        # Similar al anterior, necesitaríamos un endpoint en el microservicio de auth
        return None


# Singleton instance
auth_client = AuthApiClient()
