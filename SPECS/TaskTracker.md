# FinFlow - Task Tracker

> **Última actualización**: Marzo 2026  
> **Metodología**: Scrumban (Scrum + Kanban)  
> **Duración Sprint**: 2 semanas  
> **Herramienta**: GitHub Projects  

---

## 1. Configuración General

| Parámetro | Valor |
|-----------|-------|
| Metodología | Scrumban |
| Duración Sprint | 2 semanas |
| Herramienta | GitHub Projects |
| Estructura | Monorepo (back/ + front/) |
| Coordinación | Async (Slack/Discord dedicado) |

---

## 2. Estructura de Equipos

### EQUIPO BACKEND (3-4 devs)

| Rol | Responsabilidad |
|-----|-----------------|
| Tech Lead | Arquitectura, code review, despliegue |
| Dev Backend 1 | Controllers + Routes |
| Dev Backend 2 | Models + Validations |
| Dev Backend 3 | Testing + Documentation |

### EQUIPO FRONTEND (3-4 devs)

| Rol | Responsabilidad |
|-----|-----------------|
| Tech Lead | Arquitectura, code review, despliegue |
| Dev Frontend 1 | Views + Components |
| Dev Frontend 2 | ViewModels + Services |
| Dev Frontend 3 | Styling + Testing |

---

## 3. Kanban Board

### Columnas y WIP Limits

```
┌─────────────────┬──────────────────────┬──────────────────────┬─────────────────┬─────────────────┐
│    BACKLOG      │   TO DO             │   IN PROGRESS       │   IN REVIEW     │     DONE        │
├─────────────────┼──────────────────────┼──────────────────────┼─────────────────┼─────────────────┤
│ [Prioridad Alta]│ [Listo para devs]   │ [Desarrollando]     │ [Code Review]   │ [Completado]    │
│ [Prioridad Media]│                     │                      │                  │                 │
│ [Prioridad Baja]│ [WIP: 5]           │ [WIP: 3]            │ [WIP: 2]        │                 │
├─────────────────┼──────────────────────┼──────────────────────┼─────────────────┼─────────────────┤
│ Issues abiertos │ Asignar = in charge  │ Dev + Reviewer      │ PR: 1 approval  │ Tests passing   │
│ sin asignar     │ por un dev           │                      │                  │ QA aprobado     │
└─────────────────┴──────────────────────┴──────────────────────┴─────────────────┴─────────────────┘
```

### WIP Limits
- **TO DO**: 5 tareas máximo
- **IN PROGRESS**: 3 tareas máximo por persona
- **IN REVIEW**: 2 tareas máximo

---

## 4. Estructura del Sprint

### Ciclo Semanal (2 Semanas)

```
╔═══════════════════════════════════════════════════════════════════╗
║                    CICLO SCRUMBAN (2 semanas)                  ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  SEMANA 1                      SEMANA 2                        ║
║  ─────────                      ────────                        ║
║  Lunes: Planning                Lunes: Backlog Grooming         ║
║  Mar-Jue: Kanban Flow          Mar-Jue: Kanban Flow           ║
║  Vier: Mid-sprint review       Vier: Sprint Review + Retro    ║
║                                                                    ║
║  DAILY (9:30 AM): Standup async en canal #daily-updates      ║
║  - Cada dev posta: ✅ Ayer | 🎯 Hoy | ⚠️ Blocker              ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝
```

### Reuniones

| Reunión | Día | Hora | Duración | Tipo |
|---------|-----|------|----------|------|
| Sprint Planning | Lunes (Semana 1) | 9:00 AM | 1-2 horas | Sync |
| Daily Standup | Diario | 9:30 AM | 15 min | Async |
| Backlog Grooming | Lunes (Semana 2) | 9:00 AM | 1 hora | Sync |
| Sprint Review | Viernes (Semana 2) | 3:00 PM | 1 hora | Sync |
| Retrospective | Viernes (Semana 2) | 4:00 PM | 1 hora | Sync |

---

## 5. Template de Tarea

```markdown
## Tarea #[NÚMERO]
**Título**: [Nombre descriptivo]
**Módulo**: [Backend | Frontend | Shared]
**Sprint**: [S#]
**Prioridad**: [Crítica | Alta | Media | Baja]
**Story Points**: [1-5]
**Asignado a**: [Nombre del dev]
**Reviewer**: [Nombre]

### Descripción
[Qué se debe hacer]

### Criterios de Aceptación (Definition of Done)
- [ ] Código escrito y funcional
- [ ] Tests unitarios pasando
- [ ] PR aprobado por reviewer
- [ ] Desplegado a staging
- [ ] Validado en Postman/UI

### Dependencias
- Requiere: Tarea #[X]

### Notas
[Observaciones del equipo]
```

---

## 6. Git Flow

```
1. Crear branch desde develop:
   git checkout -b feature/T#-descripcion-corta

2. Desarrollar y commitear:
   git add .
   git commit -m "T#: descripción de los cambios"

3. Push y crear Pull Request:
   git push -u origin feature/T#-descripcion-corta

4. Asignar reviewer en GitHub

5. После approval → Merge a develop
```

### Nomenclatura de Branches

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Feature | `feature/T#-descripcion` | `feature/B-05-middleware-jwt` |
| Bugfix | `fix/T#-descripcion` | `fix/T#-fix-login-error` |
| Hotfix | `hotfix/T#-descripcion` | `hotfix/T#-critical-auth-bug` |

### Formato de Commits

```
T#[NUMERO]: [Descripción breve]

Ejemplos:
T#05: Agregar middleware de autenticación JWT
T#12: Implementar endpoint GET /api/metas
T#23: Fix en validación de monto negativo
```

---

## 7. Definition of Done (DoD)

| Categoría | Criterio |
|-----------|----------|
| **Código** | Funcional, sigue convenciones del proyecto |
| **Tests** | Unitarios pasando (>70% coverage) |
| **Review** | PR aprobado por al menos 1 reviewer |
| **Documentación** | Comentarios en código + endpoints documentados |
| **Deploy** | Desplegado a ambiente de staging |
| **Validación** | Funcionalidad probada y aprobada |

---

## 8. Sprint Backlog

### SPRINT 1: Auth + Metas CRUD
**Duración**: 2 semanas  
**Objetivo**: Backend completo + UI básica de Metas

#### BACKEND TASKS (B-01 a B-15)

| # | Task | Prioridad | SP | Asignado | Depende | Labels |
|---|------|-----------|-----|----------|---------|--------|
| B-01 | Configurar .env + variables entorno | 🔴 Crítica | 1 | Tech Lead | - | `setup` |
| B-02 | Modelo Usuario (email, password, rol) | 🔴 Crítica | 2 | Dev 2 | B-01 | `model` |
| B-03 | Endpoint POST /auth/register | 🔴 Crítica | 2 | Dev 1 | B-02 | `endpoint` |
| B-04 | Endpoint POST /auth/login (JWT) | 🔴 Crítica | 3 | Dev 1 | B-03 | `endpoint` |
| B-05 | Middleware JWT auth | 🔴 Crítica | 2 | Dev 1 | B-04 | `middleware` |
| B-06 | Completar modelo MetaFinanciera | 🔴 Crítica | 2 | Dev 2 | B-01 | `model` |
| B-07 | Modelo PlanDeAhorro | 🟠 Alta | 2 | Dev 2 | B-06 | `model` |
| B-08 | CRUD /api/metas (create, getAll, getById) | 🟠 Alta | 3 | Dev 1 | B-06 | `endpoint` |
| B-09 | PUT /api/metas/:id | 🟠 Alta | 2 | Dev 1 | B-08 | `endpoint` |
| B-10 | DELETE /api/metas/:id | 🟠 Alta | 1 | Dev 1 | B-08 | `endpoint` |
| B-11 | GET /api/metas/:id/progreso | 🟠 Alta | 2 | Dev 1 | B-08 | `endpoint` |
| B-12 | POST /api/metas/:id/aportar | 🟠 Alta | 3 | Dev 1 | B-08 | `endpoint` |
| B-13 | Tests unitarios Auth | 🟠 Alta | 3 | Dev 3 | B-05 | `test` |
| B-14 | Tests unitarios Metas | 🟠 Alta | 3 | Dev 3 | B-12 | `test` |
| B-15 | Documentar API (Postman) | 🟡 Media | 2 | Dev 3 | B-12 | `docs` |

**Story Points Backend**: 33 pts | **Capacidad estimada**: 28 pts

#### FRONTEND TASKS (F-01 a F-13)

| # | Task | Prioridad | SP | Asignado | Depende | Labels |
|---|------|-----------|-----|----------|---------|--------|
| F-01 | Setup React + carpetas MVVM | 🔴 Crítica | 2 | Tech Lead | - | `setup` |
| F-02 | Configurar Axios + base URL | 🔴 Crítica | 1 | Tech Lead | - | `setup` |
| F-03 | AuthContext (login/logout) | 🔴 Crítica | 3 | Dev 2 | F-02 | `context` |
| F-04 | authService.js | 🔴 Crítica | 2 | Dev 2 | F-03 | `service` |
| F-05 | LoginView | 🔴 Crítica | 3 | Dev 1 | F-04 | `view` |
| F-06 | Navbar + Layout base | 🔴 Crítica | 2 | Dev 1 | F-05 | `component` |
| F-07 | metaService.js | 🟠 Alta | 2 | Dev 2 | F-02 | `service` |
| F-08 | MetaContext | 🟠 Alta | 2 | Dev 2 | F-07 | `context` |
| F-09 | ListaMetasView + CardMeta | 🟠 Alta | 5 | Dev 1 | F-08 | `view` |
| F-10 | CrearMetaView (formulario) | 🟠 Alta | 5 | Dev 1 | F-09 | `view` |
| F-11 | DetalleMetaView | 🟠 Alta | 4 | Dev 1 | F-09 | `view` |
| F-12 | BarraProgreso component | 🟠 Alta | 2 | Dev 1 | F-09 | `component` |
| F-13 | Tests unitarios componentes | 🟡 Media | 3 | Dev 3 | F-12 | `test` |

**Story Points Frontend**: 36 pts | **Capacidad estimada**: 30 pts

---

## 9. Roadmap de Sprints

### SPRINT 1: Auth + Metas CRUD
**Objetivo**: Sistema de autenticación + CRUD completo de metas con UI básica

### SPRINT 2: Ingresos + Egresos + Balance
**Objetivo**: Gestión de transacciones y dashboard financiero

```
Backend:
- CRUD Ingresos
- CRUD Egresos
- Endpoint Balance mensual
- Endpoint Resumen

Frontend:
- Dashboard con resumen
- Gráficos de finanzas
- Filtros por fecha/categoría
```

### SPRINT 3: Sistema de Asesores
**Objetivo**: Módulo de asesorías financieras

```
Backend:
- CRUD Asesores
- Gestión de disponibilidad
- Agendamiento de citas
- Historial de asesorías

Frontend:
- Catálogo de asesores
- Calendario de disponibilidad
- Sistema de reservas
```

### SPRINT 4: Polish + Testing + Deploy
**Objetivo**: Producto listo para producción

```
- Testing E2E
- Documentación final
- Deploy a producción
- Bug fixes
- Optimización de performance
- UX improvements
```

---

## 10. Canales de Comunicación

| Canal | Propósito | Frecuencia |
|-------|-----------|------------|
| `#backend-dev` | Discusión técnica backend | Daily async |
| `#frontend-dev` | Discusión técnica frontend | Daily async |
| `#daily-updates` | Standup diario | Daily |
| `#blockers` | Problemas que necesitan ayuda | Cuando ocurra |
| `#sprint-planning` | Decisiones de sprint | Semanal |

---

## 11. GitHub Project Setup

### Vistas Recomendadas
- **Sprint Board**: Kanban principal
- **Backlog**: Lista de tareas sin sprint
- **Metrics**: Seguimiento de progreso

### Automatizaciones Sugeridas
- Cuando se crea issue → Agregar a Backlog
- Cuando PR se mergea → Mover a Done
- Recordatorio semanal de tareas stale

---

## 12. Métricas de Seguimiento

| Métrica | Descripción |
|---------|-------------|
| **Velocity** | Story points completados por sprint |
| **Burndown** | Progreso vs tiemporemaining |
| **WIP** | Tareas en progreso vs límite |
| **Cycle Time** | Tiempo desde To Do hasta Done |
| **Blockers** | Cantidad de bloqueadores activos |

---

## 13. Checklist de Code Review

### Para el Autor
- [ ] Código formateado
- [ ] Sin console.logs/debug
- [ ] Tests incluidos
- [ ] Documentación actualizada
- [ ] Branch actualizada con develop

### Para el Reviewer
- [ ] Lógica de negocio correcta
- [ ] Convenciones seguidas
- [ ] Validaciones apropiadas
- [ ] No hay código duplicado
- [ ] Performance adecuada
- [ ] Seguridad considerada

---

## 14. Prioridades de Tareas

| Nivel | Color | Descripción |
|-------|-------|-------------|
| 🔴 Crítica | Rojo | Blocker del proyecto, debe hacerse primero |
| 🟠 Alta | Naranja | Feature core, debe completarse en sprint actual |
| 🟡 Media | Amarillo | Importante pero no urgente |
| 🟢 Baja | Verde | Nice to have, hacer si hay tiempo |

---

## 15. Story Points (Fibonacci)

| Puntos | Descripción | Ejemplo |
|--------|-------------|---------|
| 1 | Muy simple | Fix trivial, docs |
| 2 | Simple | Endpoint básico, componente simple |
| 3 | Medio | CRUD completo, view con form |
| 5 | Complejo | Integración de servicios, múltiples views |
| 8 | Muy complejo | Sistema completo nuevo |
| 13 | Epic | Módulo completo (dividir en tareas) |
