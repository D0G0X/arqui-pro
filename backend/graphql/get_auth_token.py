"""
Script para obtener un token JWT del API de Rails.
Ejecutar este script cuando necesites un nuevo token.
"""
import httpx
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def get_auth_token(email: str, password: str):
    """Obtiene un token JWT del API de Rails"""
    base_url = os.getenv("REST_API_URL", "http://localhost:3000/api/v1")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/usuarios/sign_in",
            json={
                "usuario": {
                    "email": email,
                    "password": password
                }
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            # El token debería venir en el header Authorization
            auth_header = response.headers.get("Authorization")
            if auth_header:
                token = auth_header.replace("Bearer ", "")
                print("\n✅ Token obtenido exitosamente:")
                print(f"\n{token}\n")
                print("📝 Copia este token y agrégalo a tu archivo .env:")
                print(f"AUTH_TOKEN={token}\n")
                return token
            else:
                print("❌ No se encontró el token en la respuesta")
                print(f"Headers: {response.headers}")
                return None
        else:
            print(f"❌ Error al autenticar: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None

if __name__ == "__main__":
    print("\n🔐 Generador de Token JWT\n")
    
    # Puedes cambiar estas credenciales o pedirlas por input
    # Por ahora, usa un usuario administrador o crea uno de servicio
    email = input("Email del usuario: ")
    password = input("Password: ")
    
    asyncio.run(get_auth_token(email, password))
