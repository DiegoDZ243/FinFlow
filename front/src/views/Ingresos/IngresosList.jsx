import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { useIngresosViewModel } from '../../viewmodels/useIngresosViewModel';
import './IngresosList.css';

const formatCurrency = (amount) => {
    const numeric = Number(amount);
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(Number.isFinite(numeric) ? numeric : 0);
};

const formatDateLabel = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return 'Sin fecha';

    return parsed.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
    });
};

const IngresosList = () => {
    const [ingresoPorEliminar, setIngresoPorEliminar] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [ingresoCreado, setIngresoCreado] = useState(() => Boolean(location.state?.ingresoCreado));
    const cancelarEliminacionRef = useRef(null);
    const {
        ingresos,
        ingresosFiltrados,
        totalAcumulado,
        totalFiltrado,
        loading,
        error,
        busqueda,
        setBusqueda,
        fechaDesde,
        setFechaDesde,
        fechaHasta,
        setFechaHasta,
        eliminandoId,
        hayFiltrosActivos,
        limpiarFiltros,
        eliminarIngreso,
        fetchIngresos
    } = useIngresosViewModel();

    useEffect(() => {
        if (location.state?.ingresoCreado) {
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.pathname, location.state, navigate]);

    useEffect(() => {
        if (!ingresoCreado || loading) return undefined;

        const timeoutId = window.setTimeout(() => setIngresoCreado(false), 3500);
        return () => window.clearTimeout(timeoutId);
    }, [ingresoCreado, loading]);

    useEffect(() => {
        if (!ingresoPorEliminar) return undefined;

        cancelarEliminacionRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && eliminandoId === null) {
                setIngresoPorEliminar(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [ingresoPorEliminar, eliminandoId]);

    const confirmarEliminacion = async () => {
        if (!ingresoPorEliminar || eliminandoId !== null) return;

        const eliminado = await eliminarIngreso(ingresoPorEliminar.clave);
        if (eliminado) {
            setIngresoPorEliminar(null);
        }
    };

    if (loading && ingresos.length === 0) {
        return (
            <div className="ingresos-container">
                <div className="loading">Cargando ingresos...</div>
            </div>
        );
    }

    const ultimoIngreso = ingresos[0] || null;

    return (
        <div className="ingresos-container">
            <div className="ingresos-header">
                <h1>Mis Ingresos</h1>
                <Link to="/ingresos/nuevo" className="btn-nuevo-ingreso">
                    <Icon name="plus" className="btn-icon" />
                    Nuevo Ingreso
                </Link>
            </div>

            {ingresoCreado && (
                <div className="ingreso-success-message" role="status">
                    Ingreso registrado correctamente.
                </div>
            )}

            {error && !ingresoPorEliminar && (
                <div className="error-message" role="alert">
                    <span>{error}</span>
                    <button type="button" onClick={fetchIngresos} className="btn-reintentar">
                        Reintentar
                    </button>
                </div>
            )}

            <section className="ingresos-resumen-grid" aria-label="Resumen de ingresos">
                <article className="resumen-card resumen-card-destacada">
                    <div className="resumen-card-top">
                        <span className="resumen-label">Total Acumulado</span>
                        <span className="resumen-icon-wrap">
                            <Icon name="income" className="resumen-icon" />
                        </span>
                    </div>
                    <p className="resumen-valor">{formatCurrency(totalAcumulado)}</p>
                    <span className="resumen-subtexto">
                        {ingresos.length === 1
                            ? '1 ingreso registrado'
                            : `${ingresos.length} ingresos registrados`}
                    </span>
                </article>

                <article className="resumen-card">
                    <div className="resumen-card-top">
                        <span className="resumen-label">
                            {hayFiltrosActivos ? 'Total Filtrado' : 'Último Ingreso'}
                        </span>
                        <span className="resumen-icon-wrap resumen-icon-secundario">
                            <Icon name="calendar" className="resumen-icon" />
                        </span>
                    </div>
                    <p className="resumen-valor resumen-valor-secundario">
                        {hayFiltrosActivos
                            ? formatCurrency(totalFiltrado)
                            : ultimoIngreso
                                ? formatCurrency(ultimoIngreso.monto)
                                : formatCurrency(0)}
                    </p>
                    <span className="resumen-subtexto">
                        {hayFiltrosActivos
                            ? `Mostrando ${ingresosFiltrados.length} de ${ingresos.length} movimientos`
                            : ultimoIngreso
                                ? `Registrado el ${formatDateLabel(ultimoIngreso.fecha)}`
                                : 'Aún no hay movimientos'}
                    </span>
                </article>
            </section>

            {ingresos.length > 0 && (
                <section className="ingresos-filtros" aria-label="Filtros de ingresos">
                    <div className="filtro-grupo filtro-busqueda">
                        <label htmlFor="buscar-ingresos">Buscar</label>
                        <div className="input-icono-contenedor">
                            <Icon name="search" className="input-icono" />
                            <input
                                id="buscar-ingresos"
                                type="search"
                                placeholder="Descripción o monto..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filtro-grupo">
                        <label htmlFor="fecha-desde">Desde</label>
                        <input
                            id="fecha-desde"
                            type="date"
                            value={fechaDesde}
                            max={fechaHasta || undefined}
                            onChange={(e) => setFechaDesde(e.target.value)}
                        />
                    </div>

                    <div className="filtro-grupo">
                        <label htmlFor="fecha-hasta">Hasta</label>
                        <input
                            id="fecha-hasta"
                            type="date"
                            value={fechaHasta}
                            min={fechaDesde || undefined}
                            onChange={(e) => setFechaHasta(e.target.value)}
                        />
                    </div>

                    {hayFiltrosActivos && (
                        <div className="filtro-acciones">
                            <button
                                type="button"
                                onClick={limpiarFiltros}
                                className="btn-limpiar-filtros"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </section>
            )}

            {ingresos.length === 0 ? (
                <div className="ingresos-vacios">
                    <Icon name="income" className="empty-icon" />
                    <h2>No tienes ingresos registrados</h2>
                    <p>
                        Registra tus entradas de dinero para visualizar tu historial y llevar un control claro de tus finanzas.
                    </p>
                    <Link to="/ingresos/nuevo" className="btn-crear-primero">
                        Registrar Mi Primer Ingreso
                    </Link>
                </div>
            ) : ingresosFiltrados.length === 0 ? (
                <div className="ingresos-vacios">
                    <Icon name="search" className="empty-icon" />
                    <h2>No se encontraron ingresos</h2>
                    <p>
                        Ningún ingreso coincide con tu búsqueda o con el rango de fechas seleccionado.
                    </p>
                    <button type="button" onClick={limpiarFiltros} className="btn-limpiar-filtros">
                        Mostrar todos los ingresos
                    </button>
                </div>
            ) : (
                <div className="ingresos-lista" role="list">
                    {ingresosFiltrados.map((ingreso) => {
                        const tieneDescripcion = Boolean(ingreso.descripcion && ingreso.descripcion.trim());
                        return (
                            <article key={ingreso.clave} className="ingreso-item" role="listitem">
                                <div className="ingreso-item-principal">
                                    <div className="ingreso-badge-icono" aria-hidden="true">
                                        <Icon name="income" className="ingreso-icono" />
                                    </div>
                                    <div className="ingreso-info">
                                        <h3 className={`ingreso-descripcion ${tieneDescripcion ? '' : 'sin-descripcion'}`}>
                                            {tieneDescripcion ? ingreso.descripcion : 'Sin descripción'}
                                        </h3>
                                        <div className="ingreso-meta">
                                            <Icon name="calendar" className="ingreso-fecha-icono" />
                                            <span>{formatDateLabel(ingreso.fecha)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ingreso-monto">
                                    +{formatCurrency(ingreso.monto)}
                                </div>
                                <button
                                    type="button"
                                    className="btn-eliminar-ingreso"
                                    onClick={() => setIngresoPorEliminar(ingreso)}
                                    disabled={eliminandoId === ingreso.clave}
                                    aria-label={`Eliminar ingreso ${ingreso.descripcion || ingreso.clave}`}
                                >
                                    {eliminandoId === ingreso.clave ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}

            {ingresoPorEliminar && (
                <div
                    className="confirmacion-ingreso-overlay"
                    role="presentation"
                    onClick={() => eliminandoId === null && setIngresoPorEliminar(null)}
                >
                    <section
                        className="confirmacion-ingreso-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="confirmacion-ingreso-titulo"
                        aria-describedby="confirmacion-ingreso-descripcion"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="confirmacion-ingreso-icono" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                            </svg>
                        </div>
                        <h2 id="confirmacion-ingreso-titulo">¿Eliminar este ingreso?</h2>
                        <p id="confirmacion-ingreso-descripcion">
                            Esta acción es permanente. El ingreso se eliminará de tu historial.
                        </p>
                        <div className="confirmacion-ingreso-detalle">
                            <span className="confirmacion-ingreso-nombre">
                                {ingresoPorEliminar.descripcion?.trim() || 'Sin descripción'}
                            </span>
                            <span className="confirmacion-ingreso-monto">
                                {formatCurrency(ingresoPorEliminar.monto)}
                            </span>
                            <span className="confirmacion-ingreso-fecha">
                                {formatDateLabel(ingresoPorEliminar.fecha)}
                            </span>
                        </div>
                        {error && <div className="confirmacion-ingreso-error" role="alert">{error}</div>}
                        <div className="confirmacion-ingreso-acciones">
                            <button
                                ref={cancelarEliminacionRef}
                                type="button"
                                className="confirmacion-ingreso-cancelar"
                                onClick={() => setIngresoPorEliminar(null)}
                                disabled={eliminandoId !== null}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="confirmacion-ingreso-confirmar"
                                onClick={confirmarEliminacion}
                                disabled={eliminandoId !== null}
                            >
                                {eliminandoId !== null ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default IngresosList;
