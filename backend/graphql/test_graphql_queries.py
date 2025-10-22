"""
Test suite for GraphQL queries (REST-backed).
Run with: pytest test_graphql_queries.py -v
"""

import pytest
import httpx
from unittest.mock import AsyncMock, patch


GRAPHQL_URL = "http://127.0.0.1:8000/graphql"


@pytest.mark.asyncio
async def test_listar_usuarios_basic():
    """Test basic listar_usuarios query."""
    query = """
    query {
        listar_usuarios {
            id
            nombre
            apellido
            email
            rol
        }
    }
    """
    
    # Mock REST response
    mock_usuarios = [
        {"id": "1", "nombre": "Juan", "apellido": "Pérez", "email": "juan@example.com", "rol": "cliente", "estado_cuenta": "activo", "fecha_registro": "2024-01-01T00:00:00Z", "foto_perfil": None},
        {"id": "2", "nombre": "María", "apellido": "García", "email": "maria@example.com", "rol": "arquitecto", "estado_cuenta": "activo", "fecha_registro": "2024-01-02T00:00:00Z", "foto_perfil": None}
    ]
    
    with patch("infrastructure.rest_client.rest_client.get_usuarios", new=AsyncMock(return_value=mock_usuarios)):
        async with httpx.AsyncClient() as client:
            response = await client.post(GRAPHQL_URL, json={"query": query})
            
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "listar_usuarios" in data["data"]
        usuarios = data["data"]["listar_usuarios"]
        assert len(usuarios) == 2
        assert usuarios[0]["nombre"] == "Juan"
        assert usuarios[1]["rol"] == "arquitecto"


@pytest.mark.asyncio
async def test_listar_arquitectos_with_nested_usuario():
    """Test listar_arquitectos with nested usuario field."""
    query = """
    query {
        listar_arquitectos {
            id
            cedula
            especialidades
            usuario {
                nombre
                email
            }
        }
    }
    """
    
    mock_arquitectos = [
        {"id": "1", "cedula": "12345", "especialidades": "Residencial", "usuario_id": "10", "valoracion_prom_proyecto": 4.5, "descripcion": "Test", "ubicacion": "Lima", "verificado": True, "vistas_perfil": 100}
    ]
    
    mock_usuario = {
        "id": "10", "nombre": "Arq. Juan", "apellido": "Torres", "email": "arq.juan@example.com",
        "rol": "arquitecto", "estado_cuenta": "activo", "fecha_registro": "2024-01-01T00:00:00Z", "foto_perfil": None
    }
    
    with patch("infrastructure.rest_client.rest_client.get_arquitectos", new=AsyncMock(return_value=mock_arquitectos)), \
         patch("infrastructure.rest_client.rest_client.get_usuario", new=AsyncMock(return_value=mock_usuario)):
        
        async with httpx.AsyncClient() as client:
            response = await client.post(GRAPHQL_URL, json={"query": query})
        
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        arquitectos = data["data"]["listar_arquitectos"]
        assert len(arquitectos) == 1
        assert arquitectos[0]["cedula"] == "12345"
        assert arquitectos[0]["usuario"]["nombre"] == "Arq. Juan"


@pytest.mark.asyncio
async def test_obtener_usuario_with_nested_arquitecto():
    """Test obtener_usuario with nested arquitecto field."""
    query = """
    query {
        obtener_usuario(id: "10") {
            id
            nombre
            rol
            arquitecto {
                cedula
                especialidades
            }
        }
    }
    """
    
    mock_usuario = {
        "id": "10", "nombre": "Arq. Juan", "apellido": "Torres", "email": "arq.juan@example.com",
        "rol": "arquitecto", "estado_cuenta": "activo", "fecha_registro": "2024-01-01T00:00:00Z", "foto_perfil": None
    }
    
    mock_arquitectos = [
        {"id": "1", "cedula": "12345", "especialidades": "Residencial", "usuario_id": "10", "valoracion_prom_proyecto": 4.5, "descripcion": "Test", "ubicacion": "Lima", "verificado": True, "vistas_perfil": 100}
    ]
    
    with patch("infrastructure.rest_client.rest_client.get_usuario", new=AsyncMock(return_value=mock_usuario)), \
         patch("infrastructure.rest_client.rest_client.get_arquitectos", new=AsyncMock(return_value=mock_arquitectos)):
        
        async with httpx.AsyncClient() as client:
            response = await client.post(GRAPHQL_URL, json={"query": query})
        
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        usuario = data["data"]["obtener_usuario"]
        assert usuario["nombre"] == "Arq. Juan"
        assert usuario["arquitecto"]["cedula"] == "12345"
        assert usuario["arquitecto"]["especialidades"] == "Residencial"


@pytest.mark.asyncio
async def test_listar_proyectos_with_nested_fields():
    """Test listar_proyectos with nested arquitecto and cliente."""
    query = """
    query {
        listar_proyectos {
            id
            titulo_proyecto
            arquitecto {
                cedula
            }
            cliente {
                cedula
            }
        }
    }
    """
    
    mock_proyectos = [
        {
            "id": "1",
            "titulo_proyecto": "Casa Moderna",
            "arquitecto_id": "1",
            "cliente_id": "2",
            "valoracion_promedio": 4.8,
            "descripcion": "Proyecto moderno",
            "tipo_proyecto": "Residencial",
            "fecha_publicacion": "2024-01-15",
            "conversacion_id": "10",
            "solicitud_proyecto_id": "5"
        }
    ]
    
    mock_arquitecto = {
        "id": "1", "cedula": "12345", "especialidades": "Residencial", "usuario_id": "10",
        "valoracion_prom_proyecto": 4.5, "descripcion": "Test", "ubicacion": "Lima", "verificado": True, "vistas_perfil": 100
    }
    
    mock_cliente = {"id": "2", "cedula": "67890", "usuario_id": "11"}
    
    with patch("infrastructure.rest_client.rest_client.get_proyectos", new=AsyncMock(return_value=mock_proyectos)), \
         patch("infrastructure.rest_client.rest_client.get_arquitecto", new=AsyncMock(return_value=mock_arquitecto)), \
         patch("infrastructure.rest_client.rest_client.get_cliente", new=AsyncMock(return_value=mock_cliente)):
        
        async with httpx.AsyncClient() as client:
            response = await client.post(GRAPHQL_URL, json={"query": query})
        
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        proyectos = data["data"]["listar_proyectos"]
        assert len(proyectos) == 1
        assert proyectos[0]["titulo_proyecto"] == "Casa Moderna"
        assert proyectos[0]["arquitecto"]["cedula"] == "12345"
        assert proyectos[0]["cliente"]["cedula"] == "67890"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
