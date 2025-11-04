# 🚀 GitHub Actions CI/CD Workflows

Este directorio contiene los workflows de CI/CD automatizados para el proyecto ArquiPro.

## 📋 Workflows Disponibles

### 1. **Frontend CI/CD** (`frontend-ci.yml`)

Pipeline completo para el frontend React + TypeScript + Vite.

#### Triggers
- Push a branches: `main`, `develop`, `merge`
- Pull requests a: `main`, `develop`
- Solo cuando hay cambios en `frontend/**`

#### Jobs

##### 🔍 **Lint & Type Check**
- ✅ ESLint para validar estilo de código
- ✅ TypeScript type checking
- ✅ Falla si hay errores críticos

##### 🧪 **Tests**
- ✅ Ejecuta suite de tests con coverage
- ✅ Sube reportes a Codecov
- ✅ Continúa aunque falle (no bloquea)

##### 🏗️ **Build**
- ✅ Compila el proyecto para producción
- ✅ Valida que no hay errores de build
- ✅ Sube artifacts (dist/) por 7 días

##### 📊 **Analyze Bundle**
- ✅ Analiza tamaño del bundle
- ✅ Lista archivos JS generados
- ✅ Ayuda a detectar bundle bloat

##### 🔒 **Security Scan**
- ✅ npm audit para vulnerabilidades
- ✅ Snyk scan (opcional, requiere token)
- ✅ Threshold: moderate/high severity

##### 🔦 **Lighthouse**
- ✅ Performance check automático
- ✅ Accesibilidad y best practices
- ✅ Solo en PRs
- ✅ Genera reporte JSON

##### 🌐 **Deploy Preview**
- ✅ Placeholder para Vercel/Netlify
- ✅ Comenta en el PR con link
- ✅ Solo en PRs

##### 📢 **Notify Status**
- ✅ Resume resultados de todos los jobs
- ✅ Puede integrarse con Slack/Discord

---

### 2. **Backend CI/CD** (`backend-ci.yml`)

Pipeline para los 3 servicios del backend: Rails, GraphQL (Python) y WebSocket (NestJS).

#### Triggers
- Push a branches: `main`, `develop`, `merge`
- Pull requests a: `main`, `develop`
- Solo cuando hay cambios en `backend/**`

#### Jobs

##### 🛤️ **Rails API Test**
- ✅ Setup PostgreSQL como service
- ✅ RuboCop linter
- ✅ Brakeman security scan
- ✅ Rails tests con base de datos

##### 🔮 **GraphQL API Test**
- ✅ Setup Python 3.11
- ✅ Black formatter check
- ✅ Flake8 linter
- ✅ Pylint analysis
- ✅ Pytest con coverage

##### 🔌 **WebSocket Test**
- ✅ Setup Node.js 20
- ✅ ESLint para NestJS
- ✅ Jest tests con coverage
- ✅ Build verification

##### 🐳 **Docker Build**
- ✅ Test de construcción de imágenes
- ✅ Verifica que containers funcionen
- ✅ Solo en PRs

##### 🔒 **Security Scan**
- ✅ Trivy vulnerability scanner
- ✅ Sube resultados a GitHub Security tab
- ✅ Escanea filesystem completo

##### 🔗 **Integration Test**
- ✅ Tests de integración entre servicios
- ✅ Setup de PostgreSQL
- ✅ Solo en PRs

##### 📢 **Notify Status**
- ✅ Resume resultados
- ✅ Notifica en caso de fallo

---

## 🔧 Configuración Necesaria

### Secrets Requeridos (Opcional)

Agrega estos secrets en: **Settings → Secrets and variables → Actions**

```yaml
# Para coverage reports
CODECOV_TOKEN: <tu-token-de-codecov>

# Para security scanning (opcional)
SNYK_TOKEN: <tu-token-de-snyk>
```

### Variables de Entorno

Los workflows usan estas variables por defecto:
- `NODE_VERSION`: 20
- `RUBY_VERSION`: 3.2.2
- `PYTHON_VERSION`: 3.11
- `POSTGRES_VERSION`: 15

---

## 📊 Badges de Estado

Agrega estos badges al README principal:

```markdown
[![Frontend CI](https://github.com/D0G0X/arqui-pro/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/D0G0X/arqui-pro/actions/workflows/frontend-ci.yml)

[![Backend CI](https://github.com/D0G0X/arqui-pro/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/D0G0X/arqui-pro/actions/workflows/backend-ci.yml)
```

---

## 🚀 Uso

### Desarrollo Normal
Los workflows se ejecutan automáticamente en cada push/PR. No requiere acción manual.

### Ejecutar Manualmente
1. Ve a **Actions** tab en GitHub
2. Selecciona el workflow
3. Click en "Run workflow"
4. Selecciona la branch
5. Click en "Run workflow" verde

### Ver Resultados
1. Ve a **Actions** tab
2. Click en el workflow run
3. Expande cada job para ver logs
4. Descarga artifacts si están disponibles

---

## 📈 Performance Optimizations

### Caché de Dependencias
- ✅ **npm**: Caché automático de node_modules
- ✅ **pip**: Caché automático de paquetes Python
- ✅ **bundler**: Caché automático de gems Ruby

### Parallelización
- ✅ Lint y Tests corren en paralelo
- ✅ Build corre después de lint (depende)
- ✅ Security scans en paralelo con builds

### Artifacts
- ✅ Build artifacts guardados por 7 días
- ✅ Lighthouse reports guardados por 7 días
- ✅ Coverage reports subidos a Codecov

---

## 🔍 Troubleshooting

### El workflow falla en "Install dependencies"
**Solución**: Verifica que `package-lock.json` o `Gemfile.lock` existan y estén committed.

### Tests fallan pero pasan localmente
**Solución**: Verifica variables de entorno y servicios (PostgreSQL, etc.).

### Build falla con "out of memory"
**Solución**: Agrega `NODE_OPTIONS: --max-old-space-size=4096` en el job de build.

### Lighthouse no genera reporte
**Solución**: Verifica que el puerto 3000 esté libre y que serve esté instalado.

---

## 🎯 Mejoras Futuras

### Corto Plazo
- [ ] Agregar E2E tests con Playwright/Cypress
- [ ] Deploy automático a staging en merge a develop
- [ ] Notificaciones a Slack/Discord
- [ ] Performance budgets con Lighthouse CI

### Mediano Plazo
- [ ] Deploy automático a producción en merge a main
- [ ] Visual regression testing
- [ ] Automated dependency updates (Dependabot)
- [ ] API contract testing

### Largo Plazo
- [ ] Multi-environment deployments (dev/staging/prod)
- [ ] Blue-green deployments
- [ ] Canary deployments
- [ ] Automated rollback on failures

---

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Available Actions](https://github.com/marketplace?type=actions)

---

## 🤝 Contribución

Para modificar o agregar nuevos workflows:

1. Crea una nueva rama desde `develop`
2. Edita o crea el archivo `.yml` en `.github/workflows/`
3. Haz commit y push
4. Abre un PR para revisar los cambios
5. Los workflows se ejecutarán en el PR para validar

---

**Última actualización**: 4 de Noviembre, 2025
