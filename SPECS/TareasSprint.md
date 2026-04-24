# FinFlow - Tareas por Sprint

> **Sprint 1**: Auth + Metas CRUD  
> **Duración**: 2 semanas  
> **Estado**: En progreso

---

## Diagrama de Dependencias

```
═══════════════════════════════════════════════════════════════════════════════════════
                                    EQUIPO BACKEND
═══════════════════════════════════════════════════════════════════════════════════════

    ┌──────────────┐
    │    B-01     │  Configurar .env
    │  (Setup)    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    B-02     │  Modelo Usuario
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │            │
     ▼            │
┌──────────┐      │
│   B-03   │      │  POST /auth/register
└────┬─────┘      │
     │            │
     ▼            │
┌──────────┐      │
│   B-04   │      │  POST /auth/login (JWT)
└────┬─────┘      │
     │            │
     ▼            │
┌──────────┐      │
│   B-05   │      │  Middleware JWT
└────┬─────┘      │
     │            │
     ▼            ▼
┌──────────────────────────────────────────────┐
│                  B-13                        │  Tests Auth
│            (depende de B-05)                │
└──────────────────────────────────────────────┘

           ▲
           │  B-01 debe estar listo antes
           │
    ┌──────┴───────┐
    │    B-06      │  Completar MetaFinanciera
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    B-07     │  PlanDeAhorro
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    B-08     │  CRUD /api/metas
    └──────┬───────┘
           │
     ┌─────┴─────┬────────────┐
     │           │            │
     ▼           ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│   B-09   │ │   B-10   │ │   B-11   │
│    PUT   │ │  DELETE  │ │ Progreso │
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │           │            │
     └─────┬─────┘            │
           │                  │
           ▼                  │
    ┌──────────────┐          │
    │    B-12     │          │
    │   Aportar   │          │
    └──────┬───────┘          │
           │                  │
           └────────┬─────────┘
                    ▼
           ┌──────────────────┐
           │      B-14        │  Tests Metas
           │  (depende B-12)  │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │      B-15        │  Documentar API
           └──────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════
                                   EQUIPO FRONTEND
═══════════════════════════════════════════════════════════════════════════════════════

    ┌──────────────┐
    │    F-01     │  Setup React + MVVM
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-02     │  Axios + base URL
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-03     │  AuthContext
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-04     │  authService.js
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-05     │  LoginView
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-06     │  Navbar + Layout
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-07     │  metaService.js
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-08     │  MetaContext
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-09     │  ListaMetasView
    │  + CardMeta │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌──────────┐ ┌──────────┐
│   F-10   │ │   F-12   │
│  Crear   │ │ Barra    │
│   Meta   │ │ Progreso │
└────┬─────┘ └────┬─────┘
     │           │
     └─────┬─────┘
           │
           ▼
    ┌──────────────┐
    │    F-11     │  DetalleMetaView
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │    F-13     │  Tests unitarios
    └──────────────┘


═══════════════════════════════════════════════════════════════════════════════════════
                          COORDINACIÓN ENTRE EQUIPOS
═══════════════════════════════════════════════════════════════════════════════════════

  BACKEND                        FRONTEND
  ───────                        ────────

  B-01 ──────┐
              │
  B-02 ──────┼──┐
              │  │
  B-03 ──────┼──┼──┐
  B-04 ──────┼──┼──┼──┐
  B-05 ──────┼──┼──┼──┼──┐
              │  │  │  │  │                   │
              │  │  │  │  │    ◄── Frontend necesita que B-04 y B-05
              │  │  │  │  │        estén listos antes de F-03
              │  │  │  │  │
              │  │  │  │  │                   F-03 ──► F-04 ──► F-05
              │  │  │  │  │                   (Auth listo)
              │  │  │  │  │
              │  │  │  │  │                   F-07 ──► F-08 ──► F-09
              │  │  │  │  │                   (Metas listo)
              │  │  │  │  │
              ▼  ▼  ▼  ▼  ▼                   F-06 puede empezar después
         ┌────────────────────┐               de F-05 (layout necesita auth)
         │   API ENDPOINTS    │
         │   COMPLETAMENTE    │
         │     FUNCIONALES    │
         └────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════
                                    LEYENDA
═══════════════════════════════════════════════════════════════════════════════════════

    ───►  Dependencia directa (debe completarse primero)
    
    ┌─────┐
    │ B-01│  Tarea Backend
    └─────┘
    
    ┌─────┐
    │ F-01│  Tarea Frontend
    └─────┘
```

---

## Tareas por Equipo

---

## EQUIPO BACKEND

### Fase 1: Setup y Configuración
- [x] **B-01**: Configurar .env + variables entorno  
  *Asignado a*: Tech Lead  
  *Depende de*: -  
  *Story Points*: 1

### Fase 2: Modelo Usuario
- [x] **B-02**: Crear modelo Usuario (email, password, rol)  
  *Asignado a*: Dev Backend 2  
  *Depende de*: B-01  
  *Story Points*: 2

### Fase 3: Autenticación
- [x] **B-03**: Endpoint POST /api/ahorradores/registrar  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-02  
  *Story Points*: 2

- [x] **B-04**: Endpoint POST /api/ahorradores/login (JWT)  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-03  
  *Story Points*: 3

- [x] **B-05**: Middleware JWT auth  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-04  
  *Story Points*: 2

### Fase 4: Modelo Metas
- [x] **B-06**: Completar modelo MetaFinanciera (montoObjetivo, montoAlcanzado)  
  *Asignado a*: Dev Backend 2  
  *Depende de*: B-01  
  *Story Points*: 2

- [x] **B-07**: Modelo PlanDeAhorro  
  *Asignado a*: Dev Backend 2  
  *Depende de*: B-06  
  *Story Points*: 2

### Fase 5: CRUD Metas
- [x] **B-08**: CRUD /api/metas (create, getAll, getById)  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-06  
  *Story Points*: 3

- [x] **B-09**: PUT /api/metas/:id  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-08  
  *Story Points*: 2

- [x] **B-10**: DELETE /api/metas/:id  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-08  
  *Story Points*: 1

- [x] **B-11**: GET /api/metas/:id/progreso  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-08  
  *Story Points*: 2

- [x] **B-12**: POST /api/metas/:id/aportar  
  *Asignado a*: Dev Backend 1  
  *Depende de*: B-08  
  *Story Points*: 3

### Fase 6: Testing y Docs
- [ ] **B-13**: Tests unitarios Auth  
  *Asignado a*: Dev Backend 3  
  *Depende de*: B-05  
  *Story Points*: 3

- [ ] **B-14**: Tests unitarios Metas  
  *Asignado a*: Dev Backend 3  
  *Depende de*: B-12  
  *Story Points*: 3

- [ ] **B-15**: Documentar API (Postman)  
  *Asignado a*: Dev Backend 3  
  *Depende de*: B-12  
  *Story Points*: 2

---

**Progreso Backend**: 12/15 tareas completadas

---

## EQUIPO FRONTEND

### Fase 1: Setup
- [x] **F-01**: Setup React + carpetas MVVM  
  *Asignado a*: Tech Lead  
  *Depende de*: -  
  *Story Points*: 2

- [x] **F-02**: Configurar Axios + base URL  
  *Asignado a*: Tech Lead  
  *Depende de*: F-01  
  *Story Points*: 1

### Fase 2: Autenticación
- [x] **F-03**: AuthContext (login/logout)  
  *Asignado a*: Dev Frontend 2  
  *Depende de*: F-02 + B-04, B-05  
  *Story Points*: 3

- [x] **F-04**: ahorradorService.js  
  *Asignado a*: Dev Frontend 2  
  *Depende de*: F-03  
  *Story Points*: 2

- [x] **F-05**: LoginView  
  *Asignado a*: Dev Frontend 1  
  *Depende de*: F-04  
  *Story Points*: 3

- [x] **F-06**: Navbar + Layout base  
  *Asignado a*: Dev Frontend 1  
  *Depende de*: F-05  
  *Story Points*: 2

### Fase 3: Servicio y Context de Metas
- [x] **F-07**: metaService.js  
  *Asignado a*: Dev Frontend 2  
  *Depende de*: F-02 + B-08  
  *Story Points*: 2

- [x] **F-08**: MetaContext  
  *Asignado a*: Dev Frontend 2  
  *Depende de*: F-07  
  *Story Points*: 2

### Fase 4: Vistas de Metas
- [x] **F-09**: ListaMetasView + CardMeta  
  *Asignado a*: Dev Frontend 1  
  *Depende de*: F-08  
  *Story Points*: 5

- [x] **F-10**: CrearMetaView (formulario)  
  *Asignado a*: Dev Frontend 1  
  *Depende de*: F-09  
  *Story Points*: 5

- [x] **F-11**: DetalleMetaView  
  *Asignado a*: Dev Frontend 1  
  *Depende de*: F-09  
  *Story Points*: 4

- [x] **F-12**: BarraProgreso component  
  *Asignado a*: Dev Frontend 1  
  *Depende de*: F-09  
  *Story Points*: 2

### Fase 5: Testing
- [ ] **F-13**: Tests unitarios componentes  
  *Asignado a*: Dev Frontend 3  
  *Depende de*: F-12  
  *Story Points*: 3

---

**Progreso Frontend**: 11/13 tareas completadas

---

## Resumen de Rutas Críticas

| Equipo | Ruta Crítica | Total Tasks | SP Totales |
|--------|--------------|-------------|------------|
| **Backend** | B-01 → B-02 → B-03 → B-04 → B-05 | 5 tareas | 10 |
| **Frontend** | F-01 → F-02 → F-03 → F-04 → F-05 → F-06 | 6 tareas | 13 |

---

## Hitos del Sprint

| Hito | Descripción | Tareas Requeridas |
|------|-------------|-------------------|
| 🎯 **Setup Completo** | Infraestructura lista | B-01, B-02, F-01, F-02 |
| 🔐 **Auth Funcional** | Login/registro funcionando | B-03, B-04, B-05, F-03, F-04, F-05 |
| 💰 **Metas Backend** | API de metas completa | B-06 a B-12 | ✅ Completado |
| 📱 **Metas Frontend** | UI de metas completa | F-06 a F-12 |
| ✅ **Sprint Completo** | Todo funcional y testeado | B-13, B-14, B-15, F-13 |

---

## Notas del Sprint

*Espacio para observaciones del equipo durante el desarrollo...*

---

## Historial de Actualización

| Fecha | Actualización | Por |
|-------|---------------|-----|
| 07/04/2026 | Setup Completo: B-01, B-02, F-01, F-02 | opencode |
| 07/04/2026 | Auth Funcional: B-03, B-04, B-05, F-03, F-04, F-05 | opencode |
| 12/04/2026 | Metas Backend: B-06 a B-12 | opencode |
| 12/04/2026 | Metas Frontend: F-06 a F-12 Completado + Branch: feature/metas-frontend | opencode |
| | | |
