"""
Script para generar el schema GraphQL completo.
Ejecutar: python generar_schema.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from main import schema

# Generar el schema en formato SDL (Schema Definition Language)
schema_sdl = schema.as_str()

# Guardar en archivo
output_path = Path(__file__).parent / "schema.graphql"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(schema_sdl)

print(f"✅ Schema GraphQL generado exitosamente en: {output_path}")
print(f"📊 Tamaño del schema: {len(schema_sdl)} caracteres")
