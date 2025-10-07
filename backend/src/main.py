# src/main.py
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import strawberry
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from adapters.graphql.resolvers.arquitecto_resolver import Query, Mutation

schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)

app = FastAPI(title="Arquitectos GraphQL Service")

app.include_router(graphql_app, prefix="/graphql")
