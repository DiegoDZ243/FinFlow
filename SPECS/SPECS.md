# FinFlow - Especificaciones Técnicas

> **Última actualización**: Marzo 2026  
> **Metodología**: Specs Driven Development  
> **Stack**: Node.js + Express | React | PostgreSQL + Sequelize

---

## 1. Visión del Producto

**FinFlow** es una aplicación web para la gestión y seguimiento de metas financieras personales. Permite a los usuarios registrar sus ingresos, egresos, crear metas de ahorro y acceder a asesorías financieras profesionales.

### Actores del Sistema

| Actor | Descripción |
|-------|-------------|
| **Ahorrador Inteligente** | Usuario principal que gestiona sus finanzas personales |
| **Asesor Financiero** | Profesional que ofrece asesorías a los ahorradores |

---

## 2. Stack Tecnológico

### Backend
- **Runtime**: Node.js v20.20.0
- **Framework**: Express v4.19.0
- **ORM**: Sequelize v6.37.0
- **Base de datos**: PostgreSQL v18.2.1
- **Auth**: JWT (JSON Web Tokens)

### Frontend
- **Framework**: React v18.2.0
- **HTTP Client**: Axios v1.6
- **Arquitectura**: MVVM (Model-View-ViewModel)

### Herramientas
- **IDE**: Visual Studio Code v1.97
- **Cliente DB**: pgAdmin4 v9.2
- **Testing API**: Postman
- **Testing Unitario**: Jest
- **Contenedores**: Docker + Docker Compose v2.29.5
- **CI/CD**: GitHub Actions
- **Deploy**: Render (staging)

---

## 3. Arquitectura del Sistema

### Estilo Arquitectónico
- **Plataforma**: Web, multiusuario, centralizado
- **Frontend**: MVVM
- **Backend**: Cliente-Servidor en capas
- **Repositorio**: Monorepo (back/ + front/)

### Arquitectura Backend (Capas)
```
routes/ → controllers/ → services/ → models/
              ↓
         config/db.js (Sequelize → PostgreSQL)
```

### Arquitectura Frontend (MVVM)
```
views/ → viewmodels/ (hooks) → services/ → API
```

---

## 4. Modelo de Datos

### 4.1 Usuario (Ahorrador Inteligente)
```javascript
{
  id: UUID,
  email: STRING (único),
  password: STRING (hash),
  nombreCompleto: STRING,
  fechaRegistro: DATE,
  rol: ENUM('ahorrador', 'asesor')
}
```

### 4.2 MetaFinanciera
```javascript
{
  id: UUID,
  usuarioId: UUID (FK),
  nombreIdentificador: STRING(4-50),
  montoObjetivo: DECIMAL(12,2) > 0,
  montoAlcanzado: DECIMAL(12,2) >= 0,
  fechaInicio: DATE,
  fechaLimite: DATE,
  descripcion: TEXT,
  estado: BOOLEAN
}
```

### 4.3 PlanDeAhorro
```javascript
{
  id: UUID,
  metaFinancieraId: UUID (FK),
  montoAhorroMensual: DECIMAL(12,2),
  frecuencia: ENUM('semanal', 'quincenal', 'mensual'),
  fechaProximoAporte: DATE
}
```

### 4.4 Ingreso
```javascript
{
  id: UUID,
  usuarioId: UUID (FK),
  monto: DECIMAL(12,2) > 0,
  fecha: DATE,
  descripcion: STRING,
  categoría: STRING
}
```

### 4.5 Egreso
```javascript
{
  id: UUID,
  usuarioId: UUID (FK),
  monto: DECIMAL(12,2) > 0,
  fecha: DATE,
  descripcion: STRING,
  categoría: STRING
}
```

### 4.6 BalanceMensual
```javascript
{
  id: UUID,
  usuarioId: UUID (FK),
  mes: INTEGER(1-12),
  año: INTEGER,
  totalIngresos: DECIMAL(12,2),
  totalEgresos: DECIMAL(12,2),
  saldoFinal: DECIMAL(12,2)
}
```

### 4.7 Asesor
```javascript
{
  id: UUID,
  nombre: STRING,
  correoElectronico: STRING,
  tarifaPorHora: DECIMAL(8,2),
  cedulaProfesional: STRING,
  disponibilidad: JSON
}
```

### 4.8 Asesoria
```javascript
{
  id: UUID,
  ahorradorId: UUID (FK),
  asesorId: UUID (FK),
  fecha: DATE,
  hora: TIME,
  estado: ENUM('pendiente', 'confirmada', 'completada', 'cancelada')
}
```

---

## 5. Reglas de Negocio

### 5.1 Cálculos Financieros
```
Balance = Total Ingresos - Total Egresos
Progreso Meta (%) = (montoAlcanzado / montoObjetivo) * 100
```

### 5.2 Estados de Meta
```
Estado = 'Activa'      si fechaLimite >= hoy AND montoAlcanzado < montoObjetivo
Estado = 'Completada'  si montoAlcanzado >= montoObjetivo
Estado = 'Vencida'     si fechaLimite < hoy AND montoAlcanzado < montoObjetivo
```

### 5.3 Validaciones Globales
- Todos los montos deben ser > 0
- Fechas en formato: YYYY-MM-DD
- Cada usuario solo accede a sus propios datos
- Todas las respuestas son JSON
- Tiempo de respuesta esperado: <= 2 segundos

---

## 6. Casos de Uso

### 6.1 Gestionar Metas Financieras (Prioridad ALTA)
El Ahorrador Inteligente quiere seguir una meta fija que le motive a ahorrar.

**Flujo**:
1. Usuario accede al sistema
2. Sistema presenta formulario de meta (nombre, monto, fechas)
3. Usuario registra datos y confirma
4. Sistema persiste y muestra meta creada
5. Usuario puede consultar progreso, aportar y editar

### 6.2 Gestionar Ingresos
El Ahorrador registra sus ingresos (salario, bonos, etc.)

**Flujo**:
1. Usuario accede a sección de ingresos
2. Sistema presenta formulario (fecha, monto, descripción)
3. Usuario registra y confirma
4. Sistema persiste el ingreso

### 6.3 Gestionar Egresos
El Ahorrador registra sus gastos.

**Flujo**:
1. Usuario accede a sección de egresos
2. Sistema presenta formulario (fecha, monto, categoría)
3. Usuario registra y confirma
4. Sistema persiste el egreso

### 6.4 Generar Balance Mensual
El Ahorrador consulta su resumen financiero del mes.

**Flujo**:
1. Usuario solicita balance mensual
2. Sistema calcula totas de ingresos y egresos
3. Sistema presenta desglose organizado por fecha/monto/categoría
4. Sistema muestra balance final

### 6.5 Gestionar Asesorías Financieras
El Ahorrador busca asesoría profesional.

**Flujo**:
1. Usuario navega catálogo de asesores
2. Sistema muestra asesores (disponibilidad, tarifa)
3. Usuario selecciona fecha y paga
4. Sistema valida, registra y confirma asesoría

---

## 7. Endpoints API

### 7.1 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/auth/profile` | Perfil del usuario |

### 7.2 Metas Financieras
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/metas` | Crear meta |
| GET | `/api/metas` | Listar metas |
| GET | `/api/metas/:id` | Detalle de meta |
| PUT | `/api/metas/:id` | Actualizar meta |
| DELETE | `/api/metas/:id` | Eliminar meta |
| GET | `/api/metas/:id/progreso` | % de progreso |
| POST | `/api/metas/:id/aportar` | Aportar a meta |

### 7.3 Ingresos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/ingresos` | Crear ingreso |
| GET | `/api/ingresos` | Listar ingresos |
| GET | `/api/ingresos/:id` | Detalle de ingreso |
| PUT | `/api/ingresos/:id` | Actualizar ingreso |
| DELETE | `/api/ingresos/:id` | Eliminar ingreso |

### 7.4 Egresos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/egresos` | Crear egreso |
| GET | `/api/egresos` | Listar egresos |
| GET | `/api/egresos/:id` | Detalle de egreso |
| PUT | `/api/egresos/:id` | Actualizar egreso |
| DELETE | `/api/egresos/:id` | Eliminar egreso |

### 7.5 Balance
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/balance/mensual` | Balance mensual |
| GET | `/api/balance/resumen` | Resumen general |

---

## 8. Formato de Respuestas

### Éxito
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

---

## 9. Atributos de Calidad

| Atributo | Requerido | Estrategia |
|----------|-----------|------------|
| Escalabilidad | Media-baja | ExpressJS escalable en nube |
| Disponibilidad | Alta | NodeJS + ExpressJS + reconexión auto DB |
| Usabilidad | Alta | UI intuitiva con React |
| Rendimiento | Alta | PostgreSQL optimizado + async/await |
| Integridad | Alta | Transacciones Sequelize + auth |
| Confiabilidad | Alta | Persistencia PostgreSQL + backups |

---

## 10. Estructura de Carpetas

### Backend (back/)
```
back/
├── config/
│   └── db.js              # Conexión Sequelize
├── controllers/            # Lógica de negocio
├── models/                # Modelos Sequelize
├── routes/                # Endpoints REST
│   ├── Auth/
│   ├── MetasFinancieras/
│   ├── Ingresos/
│   └── Egresos/
├── middleware/            # Auth, validaciones
├── services/              # Lógica adicional
├── app.js                # Entry point
└── package.json
```

### Frontend (src/)
```
src/
├── components/            # Componentes reutilizables
│   ├── ui/              # Botones, inputs, cards
│   └── layout/          # Navbar, Sidebar
├── views/                # Vistas completas (MVVM)
│   └── metas/
├── viewmodels/           # Hooks de lógica
│   └── hooks/
├── services/             # Llamadas Axios
├── context/              # Estados globales
├── locales/              # i18n
└── assets/
```

---

## 11. Testing

### Backend
- Tests unitarios con Jest
- Validación manual con Postman
- Coverage mínimo: 70%

### Frontend
- Tests unitarios con Jest + React Testing Library
- Tests de componentes
- Tests de integración

---

## 12. Deployment

### Ambientes
1. **Desarrollo**: Local (docker-compose)
2. **Staging**: Render (auto-deploy from GitHub)
3. **Producción**: AWS t3.micro (futuro)

### CI/CD
- GitHub Actions para:
  - Lint check
  - Tests
  - Deploy automático a staging
