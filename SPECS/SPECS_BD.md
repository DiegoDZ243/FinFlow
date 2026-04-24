# Especificación de la Base de Datos: FinFlow

Este documento describe la arquitectura de la base de datos **FinFlow**, diseñada para soportar una aplicación de gestión financiera personal, seguimiento de ingresos/egresos y cumplimiento de metas de ahorro.

## 1. Descripción General
La base de datos centraliza la información de los usuarios (ahorradores), su planificación de metas y sus movimientos financieros diarios.

## 2. Diccionario de Datos

### 2.1 Tabla: `ahorradoresInteligentes`
Entidad principal que almacena las credenciales y el perfil del usuario.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `clave` | SERIAL | PRIMARY KEY | Identificador único autoincremental. |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Correo electrónico de acceso. |
| `password` | VARCHAR(255) | NOT NULL | Contraseña encriptada. |
| `fechaRegistro` | TIMESTAMPTZ | NOT NULL | Fecha y hora de creación de la cuenta. |

### 2.2 Tabla: `ingresos`
Registra las entradas de capital de cada usuario.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `clave` | SERIAL | PRIMARY KEY | Identificador único del ingreso. |
| `monto` | NUMERIC | NOT NULL | Cantidad de dinero recibida. |
| `fecha` | TIMESTAMPTZ | NOT NULL | Fecha y hora del ingreso. |
| `descripcion` | TEXT | - | Concepto o fuente del ingreso. |
| `ahorradorId` | INTEGER | FOREIGN KEY | Referencia a `ahorradoresInteligentes(clave)`. |

### 2.3 Tabla: `egresos`
Registra los gastos realizados por el usuario.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `clave` | SERIAL | PRIMARY KEY | Identificador único del egreso. |
| `monto` | NUMERIC | NOT NULL | Cantidad de dinero gastada. |
| `fecha` | TIMESTAMPTZ | NOT NULL | Fecha y hora del movimiento. |
| `descripcion` | TEXT | - | Detalle del gasto. |
| `ahorradorId` | INTEGER | FOREIGN KEY | Referencia a `ahorradoresInteligentes(clave)`. |

### 2.4 Tabla: `metasFinancieras`
Define los objetivos de ahorro específicos.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `clave` | UUID | PRIMARY KEY | Identificador único universal (UUID). |
| `identificador` | VARCHAR(255) | NOT NULL | Nombre o título de la meta. |
| `fechaInicio` | TIMESTAMPTZ | - | Fecha de inicio del ahorro. |
| `fechaLimite` | TIMESTAMPTZ | - | Fecha objetivo de cumplimiento. |
| `montoObjetivo` | NUMERIC(12,2) | NOT NULL | Cantidad total a ahorrar. |
| `montoAlcanzado` | NUMERIC(12,2) | DEFAULT 0 | Progreso acumulado. |
| `descripcion` | TEXT | - | Notas adicionales sobre la meta. |
| `estado` | BOOLEAN | - | Estado de la meta (activa/completada). |
| `ahorradorId` | INTEGER | FOREIGN KEY | Referencia a `ahorradoresInteligentes(clave)`. |

### 2.5 Tabla: `planesDeAhorro`
Estructura la estrategia periódica para alcanzar una meta.

| Campo | Tipo de Datos | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `clave` | UUID | PRIMARY KEY | Identificador único del plan. |
| `meta_id` | UUID | FOREIGN KEY | Referencia a `metasFinancieras(clave)`. |
| `montoMensual` | NUMERIC(12,2) | - | Cuota de ahorro mensual sugerida. |
| `mesesEstimados` | INTEGER | - | Plazo previsto en meses. |
| `fechaInicio` | TIMESTAMPTZ | - | Fecha de activación del plan. |
| `estado` | BOOLEAN | - | Indica si el plan está vigente. |
| `ahorradorId` | INTEGER | FOREIGN KEY | Referencia a `ahorradoresInteligentes(clave)`. |

## 3. Relaciones y Cardinalidad

- **Ahorradores a Transacciones (1:N):** Un ahorrador posee múltiples registros de ingresos y egresos.
- **Ahorradores a Metas (1:N):** Un ahorrador puede gestionar diversos objetivos financieros.
- **Ahorradores a Planes (1:N):** El usuario es el propietario de sus planes de ahorro.
- **Metas a Planes (1:N):** Una meta financiera puede tener asociados uno o más planes (para ajustes o refinanciamiento).

