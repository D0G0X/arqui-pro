# 🧩 Servicio de Usuarios — GraphQL (Python)

## 🌐 Descripción general

Este servicio implementa un **API GraphQL** para la gestión de usuarios, utilizando **FastAPI** y **Strawberry**.  
Se basa en una arquitectura **modular y limpia por capas**, que separa responsabilidades y facilita la mantenibilidad del proyecto.

**Stack principal:**
- **FastAPI + Strawberry** → para el servidor GraphQL.  
- **SQLAlchemy (async)** + **asyncpg** → para la capa de persistencia.  
- **PostgreSQL (Supabase)** → como base de datos principal.  

---

## 🧱 Arquitectura del proyecto

El proyecto sigue una estructura en capas dentro de la carpeta `src/`:

| Carpeta | Rol | Descripción |
|----------|-----|-------------|
| `src/main.py` | App principal | Crea el esquema de Strawberry, configura el router `/graphql` y arranca la aplicación. |
| `src/adapters/graphql/schemas/` | Tipos e Inputs | Define los tipos y entradas GraphQL (`UsuarioType`, `UsuarioInput`, etc.). |
| `src/adapters/graphql/resolvers/` | Resolvers | Atienden las peticiones GraphQL y llaman a los casos de uso. |
| `src/application/use_cases/` | Lógica de negocio | Contiene validaciones, reglas de negocio y coordinación de operaciones. |
| `src/domain/entities/` | Entidades de dominio | Representan la lógica del negocio sin depender de la infraestructura. |
| `src/infrastructure/orm/` | Modelos ORM | Mapeo de tablas usando SQLAlchemy (asincrónico). |
| `src/infrastructure/repositories/` | Repositorios | CRUD asincrónico mediante `AsyncSession`. |
| `src/infrastructure/database.py` | Configuración DB | Crea el engine, las sesiones y la función `init_db()`. |

---

## ⚙️ Requisitos previos

Asegúrate de tener **Python 3.12+** y **PostgreSQL** configurado.

### 1️⃣ Crear entorno virtual

En la carpeta `backend`, abre una terminal y ejecuta:

#### PowerShell
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
