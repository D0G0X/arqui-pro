# src/main.py
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import strawberry
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from strawberry.fastapi import GraphQLRouter

# resolvers
from adapters.resolvers.usuario_resolver import QueryUsuario, MutationUsuario
from adapters.resolvers.arquitecto_resolver import QueryArquitecto, MutationArquitecto
from adapters.resolvers.cliente_resolver import QueryCliente, MutationCliente
from adapters.resolvers.proyecto_resolver import QueryProyecto, MutationProyecto
from adapters.resolvers.solicitud_proyecto_resolver import QuerySolicitudProyecto, MutationSolicitudProyecto
from adapters.resolvers.moderador_resolver import QueryModerador, MutationModerador
from adapters.resolvers.conversacion_resolver import QueryConversacion, MutationConversacion
from adapters.resolvers.mensaje_resolver import QueryMensaje, MutationMensaje
from adapters.resolvers.notificacion_resolver import QueryNotificacion, MutationNotificacion
from adapters.resolvers.valoracion_resolver import QueryValoracion, MutationValoracion
from adapters.resolvers.avance_resolver import QueryAvance, MutationAvance
from adapters.resolvers.incidencia_resolver import QueryIncidencia, MutationIncidencia
from adapters.resolvers.imagen_resolver import QueryImagen, MutationImagen
from adapters.resolvers.imagen_asociacion_resolver import QueryImagenAsociacion, MutationImagenAsociacion
from adapters.resolvers.verificacion_resolver import QueryVerificacion, MutationVerificacion


@strawberry.type
class Query(
    QueryUsuario,
    QueryArquitecto,
    QueryCliente,
    QueryProyecto,
    QuerySolicitudProyecto,
    QueryModerador,
    QueryConversacion,
    QueryMensaje,
    QueryNotificacion,
    QueryValoracion,
    QueryAvance,
    QueryIncidencia,
    QueryImagen,
    QueryImagenAsociacion,
    QueryVerificacion,
):
    pass


@strawberry.type
class Mutation(
    MutationUsuario,
    MutationArquitecto,
    MutationCliente,
    MutationProyecto,
    MutationSolicitudProyecto,
    MutationModerador,
    MutationConversacion,
    MutationMensaje,
    MutationNotificacion,
    MutationValoracion,
    MutationAvance,
    MutationIncidencia,
    MutationImagen,
    MutationImagenAsociacion,
    MutationVerificacion,
):
    pass

schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)  # lo usaremos solo para la UI

app = FastAPI(title="Arquitectos / Usuarios GraphQL Service")

# POST personalizado para controlar status HTTP según errores
@app.post("/graphql")
async def graphql_post(request: Request):
    body = await request.json()
    query = body.get("query")
    variables = body.get("variables")
    operation_name = body.get("operationName")

    # ejecutar la operación con el schema de Strawberry
    result = await schema.execute(
        query,
        variable_values=variables,
        context_value={"request": request},
        operation_name=operation_name,
    )

    # preparar lista de errores y calcular severidad
    errors_out = []
    severity = 0  # 0 -> 200, 4 -> 400, 5 -> 500
    if result.errors:
        for e in result.errors:
            ext = getattr(e, "extensions", None) or {}
            code = str(ext.get("code", "")) if ext else ""
            # si no hay extensions asumimos error servidor (500)
            if not ext:
                severity = max(severity, 5)
            elif code.startswith("4"):
                severity = max(severity, 4)
            elif code.startswith("5"):
                severity = max(severity, 5)
            # business codes como 202 o 300 no aumentan severity (se quedan 0 / 200) a menos que haya otros errores
            errors_out.append({
                "message": getattr(e, "message", str(e)),
                "extensions": ext or None,
            })

    # mapear severity a status HTTP
    status_code = 200
    if severity == 4:
        status_code = 400
    elif severity == 5:
        status_code = 500

    payload = {}
    payload["data"] = result.data if result.data is not None else None
    if errors_out:
        payload["errors"] = errors_out

    return JSONResponse(content=payload, status_code=status_code)

# Añadir GET para redirigir a la UI y evitar 405 al abrir /graphql en el navegador
@app.get("/graphql")
async def graphql_get():
    return RedirectResponse(url="/graphql/ui")

# Mantener UI (GraphiQL) en /graphql/ui para evitar conflicto de rutas POST
app.include_router(graphql_app, prefix="/graphql/ui")

@app.get("/")
async def root():
    return RedirectResponse(url="/graphql/ui")
