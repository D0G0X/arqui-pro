# src/main.py
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import strawberry
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from strawberry.fastapi import GraphQLRouter

# resolvers
from adapters.graphql.resolvers.usuario_resolver import QueryUsuario, MutationUsuario

# importar explicitamente los tipos/inputs para que Strawberry los registre
from adapters.graphql.schemas.usuario_schema import UsuarioType, UsuarioInput

from infrastructure.database import init_db

RootQuery = type("Query", (QueryUsuario,), {})
RootMutation = type("Mutation", (MutationUsuario,), {})

# registrar tipos explícitamente evita "Unknown type 'UsuarioInput'"
schema = strawberry.Schema(
    query=RootQuery,
    mutation=RootMutation,
    types=[UsuarioType, UsuarioInput],
)

graphql_app = GraphQLRouter(schema)

app = FastAPI(title="Arquitectos / Usuarios GraphQL Service")

@app.on_event("startup")
async def on_startup():
    await init_db()

app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
async def root():
    return RedirectResponse(url="/graphql")
