"""
Script de prueba para verificar que todas las importaciones funcionan correctamente.
"""
import sys
from pathlib import Path

# Configurar path
sys.path.insert(0, str(Path(__file__).resolve().parent))

def test_imports():
    """Prueba que todas las importaciones funcionen correctamente."""
    print("🔍 Probando importaciones de la nueva estructura modular...\n")
    
    # Test 1: Tipos
    print("📦 1. Importando tipos...")
    try:
        from graphql_types.perfil_completo_arquitecto import PerfilCompletoArquitecto
        from graphql_types.dashboard_proyecto import DashboardProyecto
        from graphql_types.historial_conversacion import HistorialConversacion
        from graphql_types.estadisticas_arquitecto import EstadisticasArquitecto, ProyectosPorTipo
        from graphql_types.kpis_plataforma import KPIsPlataforma, UsuariosPorRol
        from graphql_types.metricas_proyecto import MetricasProyecto
        print("   ✅ Todos los tipos importados correctamente")
    except Exception as e:
        print(f"   ❌ Error importando tipos: {e}")
        return False
    
    # Test 2: Queries Agregación
    print("\n📊 2. Importando queries de agregación...")
    try:
        from queries.agregacion.perfil_completo_arquitecto import resolver_perfil_completo_arquitecto
        from queries.agregacion.dashboard_proyecto import resolver_dashboard_proyecto
        from queries.agregacion.historial_conversacion import resolver_historial_conversacion
        print("   ✅ Queries de agregación importadas correctamente")
    except Exception as e:
        print(f"   ❌ Error importando queries de agregación: {e}")
        return False
    
    # Test 3: Queries Métricas
    print("\n📈 3. Importando queries de métricas...")
    try:
        from queries.metricas.estadisticas_arquitecto import resolver_estadisticas_arquitecto
        from queries.metricas.kpis_plataforma import resolver_kpis_plataforma
        from queries.metricas.metricas_proyecto import resolver_metricas_proyecto
        print("   ✅ Queries de métricas importadas correctamente")
    except Exception as e:
        print(f"   ❌ Error importando queries de métricas: {e}")
        return False
    
    # Test 4: Queries Búsqueda
    print("\n🔍 4. Importando queries de búsqueda...")
    try:
        from queries.busqueda.buscar_arquitectos import resolver_buscar_arquitectos
        from queries.busqueda.buscar_proyectos import resolver_buscar_proyectos
        from queries.busqueda.buscar_conversaciones import resolver_buscar_conversaciones
        print("   ✅ Queries de búsqueda importadas correctamente")
    except Exception as e:
        print(f"   ❌ Error importando queries de búsqueda: {e}")
        return False
    
    # Test 5: Main
    print("\n🚀 5. Importando main.py y schema...")
    try:
        from main import Query, schema
        print("   ✅ Main y schema importados correctamente")
        print(f"   ℹ️  Schema tiene {len(schema.query_type.fields)} queries")
    except Exception as e:
        print(f"   ❌ Error importando main: {e}")
        return False
    
    print("\n✨ ¡Todas las importaciones exitosas!")
    print("\n📋 Resumen de la nueva estructura:")
    print("   - 6 tipos personalizados en archivos separados")
    print("   - 9 queries especializadas organizadas por categoría")
    print("   - 3 categorías: agregacion, metricas, busqueda")
    print("   - Sin archivos CRUD innecesarios")
    
    return True

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)
