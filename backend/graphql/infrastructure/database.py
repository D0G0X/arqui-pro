# src/infrastructure/database.py
import ssl
import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base


ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# cargar .env relativo a la carpeta backend/graphql (evita fallos si el cwd cambia)
BASE_DIR = Path(__file__).resolve().parents[1]  # backend/graphql
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()  # fallback

# usar la variable async esperada; fallback opcional a DATABASE_URL
DATABASE_URL_ASYNC = os.getenv("DATABASE_URL_ASYNC") or os.getenv("DATABASE_URL")
if not DATABASE_URL_ASYNC:
    raise RuntimeError("DATABASE_URL_ASYNC no está definido en .env")

engine = create_async_engine(
    DATABASE_URL_ASYNC,
    connect_args={"ssl": ssl_context},  # asegura TLS para Supabase
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    # importa modelos para que metadata los conozca
    # usar import absoluto para evitar ambigüedades al ejecutar uvicorn
    from infrastructure.orm import usuario_model  # noqa: F401
    from infrastructure.orm import arquitecto_model  # noqa: F401
    from infrastructure.orm import cliente_model  # noqa: F401
    from infrastructure.orm import proyecto_model  # noqa: F401
    from infrastructure.orm import solicitud_proyecto_model  # noqa: F401
    from infrastructure.orm import moderador_model  # noqa: F401
    from infrastructure.orm import conversacion_model  # noqa: F401
    from infrastructure.orm import mensaje_model  # noqa: F401
    from infrastructure.orm import notificacion_model  # noqa: F401
    from infrastructure.orm import valoracion_model  # noqa: F401
    from infrastructure.orm import avance_model  # noqa: F401
    from infrastructure.orm import incidencia_model  # noqa: F401
    from infrastructure.orm import imagen_model  # noqa: F401
    from infrastructure.orm import imagen_asociacion_model  # noqa: F401
    from infrastructure.orm import verificacion_model  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
