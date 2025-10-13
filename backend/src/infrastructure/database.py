# src/infrastructure/database.py
import ssl
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base


ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
load_dotenv()

DATABASE_URL_ASYNC = os.getenv("DATABASE_URL")
if not DATABASE_URL_ASYNC:
    raise RuntimeError("DATABASE_URL_ASYNC no está definido en .env")

engine = create_async_engine(
    DATABASE_URL_ASYNC,
    connect_args={"ssl": ssl_context} # asegura TLS para Supabase
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, autoflush=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    # importa modelos para que metadata los conozca
    from infrastructure.orm import arquitecto_model  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
