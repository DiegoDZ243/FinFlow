import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { useEgresosViewModel } from '../../viewmodels/useEgresosViewModel';
import './EgresosList.css';

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

const EgresosList = () => {
	const [egresoPorEliminar, setEgresoPorEliminar] = useState(null);
	const location = useLocation();
	const navigate = useNavigate();
	const [egresoCreado, setEgresoCreado] = useState(() => Boolean(location.state?.egresoCreado));
	const cancelarEliminacionRef = useRef(null);
	const {
		egresos,
		egresosFiltrados,
		totalAcumulado,
		totalFiltrado,
		loading,
		error,
		mensaje,
		busqueda,
		setBusqueda,
		fechaDesde,
		setFechaDesde,
		fechaHasta,
		setFechaHasta,
		eliminandoId,
		hayFiltrosActivos,
		limpiarFiltros,
		borrarEgreso,
		fetchEgresos
	} = useEgresosViewModel();

	useEffect(() => {
		if (location.state?.egresoCreado) {
			navigate(location.pathname, { replace: true, state: null });
		}
	}, [location.pathname, location.state, navigate]);

	useEffect(() => {
		if (!egresoCreado || loading) return undefined;

		const timeoutId = window.setTimeout(() => setEgresoCreado(false), 3500);
		return () => window.clearTimeout(timeoutId);
	}, [egresoCreado, loading]);

	useEffect(() => {
		if (!egresoPorEliminar) return undefined;

		cancelarEliminacionRef.current?.focus();
		const handleKeyDown = (event) => {
			if (event.key === 'Escape' && eliminandoId === null) {
				setEgresoPorEliminar(null);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [egresoPorEliminar, eliminandoId]);

	const confirmarEliminacion = async () => {
		if (!egresoPorEliminar || eliminandoId !== null) return;

		const eliminado = await borrarEgreso(egresoPorEliminar.clave);
		if (eliminado) {
			setEgresoPorEliminar(null);
		}
	};

	if (loading && egresos.length === 0) {
		return (
			<div className="egresos-container">
				<div className="egresos-loading" role="status">Cargando egresos...</div>
			</div>
		);
	}

	const ultimoEgreso = egresos[0] || null;

	return (
		<div className="egresos-container">
			<header className="egresos-header">
				<div>
					<h1>Mis egresos</h1>
					<p>Consulta y administra tus gastos registrados.</p>
				</div>
				<Link to="/egresos/nuevo" className="btn-nuevo-egreso">
					<Icon name="plus" className="egresos-btn-icon" />
					Nuevo egreso
				</Link>
			</header>

			{egresoCreado && (
				<div className="egresos-alerta egresos-alerta-ok" role="status">
					Egreso registrado correctamente.
				</div>
			)}

			{error && !egresoPorEliminar && (
				<div className="egresos-alerta egresos-alerta-error" role="alert">
					<span>{error}</span>
					<button type="button" onClick={fetchEgresos} className="btn-reintentar-egresos">
						Reintentar
					</button>
				</div>
			)}
			{mensaje && <div className="egresos-alerta egresos-alerta-ok" role="status">{mensaje}</div>}

			<section className="egresos-resumen-grid" aria-label="Resumen de egresos">
				<article className="egresos-resumen-card egresos-resumen-card-destacada">
					<div className="egresos-resumen-card-top">
						<span className="egresos-resumen-label">Total acumulado</span>
						<span className="egresos-resumen-icon-wrap">
							<Icon name="expense" className="egresos-resumen-icon" />
						</span>
					</div>
					<p className="egresos-resumen-valor">{formatCurrency(totalAcumulado)}</p>
					<span className="egresos-resumen-subtexto">
						{egresos.length === 1
							? '1 egreso registrado'
							: `${egresos.length} egresos registrados`}
					</span>
				</article>

				<article className="egresos-resumen-card">
					<div className="egresos-resumen-card-top">
						<span className="egresos-resumen-label">
							{hayFiltrosActivos ? 'Total filtrado' : 'Último egreso'}
						</span>
						<span className="egresos-resumen-icon-wrap egresos-resumen-icon-secundario">
							<Icon name="calendar" className="egresos-resumen-icon" />
						</span>
					</div>
					<p className="egresos-resumen-valor egresos-resumen-valor-secundario">
						{hayFiltrosActivos
							? formatCurrency(totalFiltrado)
							: ultimoEgreso
								? formatCurrency(ultimoEgreso.monto)
								: formatCurrency(0)}
					</p>
					<span className="egresos-resumen-subtexto">
						{hayFiltrosActivos
							? `Mostrando ${egresosFiltrados.length} de ${egresos.length} movimientos`
							: ultimoEgreso
								? `Registrado el ${formatDateLabel(ultimoEgreso.fecha)}`
								: 'Aún no hay movimientos'}
					</span>
				</article>
			</section>

			{egresos.length > 0 && (
				<section className="egresos-filtros" aria-label="Filtros de egresos">
					<div className="egresos-filtro-grupo egresos-filtro-busqueda">
						<label htmlFor="buscar-egresos">Buscar</label>
						<div className="egresos-input-icono-contenedor">
							<Icon name="search" className="egresos-input-icono" />
							<input
								id="buscar-egresos"
								type="search"
								placeholder="Descripción o monto..."
								value={busqueda}
								onChange={(event) => setBusqueda(event.target.value)}
							/>
						</div>
					</div>

					<div className="egresos-filtro-grupo">
						<label htmlFor="egresos-fecha-desde">Desde</label>
						<input
							id="egresos-fecha-desde"
							type="date"
							value={fechaDesde}
							max={fechaHasta || undefined}
							onChange={(event) => setFechaDesde(event.target.value)}
						/>
					</div>

					<div className="egresos-filtro-grupo">
						<label htmlFor="egresos-fecha-hasta">Hasta</label>
						<input
							id="egresos-fecha-hasta"
							type="date"
							value={fechaHasta}
							min={fechaDesde || undefined}
							onChange={(event) => setFechaHasta(event.target.value)}
						/>
					</div>

					{hayFiltrosActivos && (
						<div className="egresos-filtro-acciones">
							<button
								type="button"
								onClick={limpiarFiltros}
								className="btn-limpiar-egresos-filtros"
							>
								Limpiar filtros
							</button>
						</div>
					)}
				</section>
			)}

			{egresos.length === 0 ? (
				<div className="egresos-vacios">
					<Icon name="expense" className="egresos-empty-icon" />
					<h2>No tienes egresos registrados</h2>
					<p>
						Registra tus gastos para visualizar tu historial y llevar un control claro de tus finanzas.
					</p>
					<Link to="/egresos/nuevo" className="btn-crear-primer-egreso">
						Registrar mi primer egreso
					</Link>
				</div>
			) : egresosFiltrados.length === 0 ? (
				<div className="egresos-vacios">
					<Icon name="search" className="egresos-empty-icon" />
					<h2>No se encontraron egresos</h2>
					<p>Ningún egreso coincide con tu búsqueda o con el rango de fechas seleccionado.</p>
					<button type="button" onClick={limpiarFiltros} className="btn-limpiar-egresos-filtros">
						Mostrar todos los egresos
					</button>
				</div>
			) : (
				<div className="egresos-lista" role="list">
					{egresosFiltrados.map((egreso) => {
						const tieneDescripcion = Boolean(egreso.descripcion?.trim());
						return (
							<article key={egreso.clave} className="egreso-item" role="listitem">
								<div className="egreso-item-principal">
									<div className="egreso-badge-icono" aria-hidden="true">
										<Icon name="expense" className="egreso-icono" />
									</div>
									<div className="egreso-info">
										<h2 className={`egreso-descripcion ${tieneDescripcion ? '' : 'sin-descripcion'}`}>
											{tieneDescripcion ? egreso.descripcion : 'Sin descripción'}
										</h2>
										<div className="egreso-meta">
											<Icon name="calendar" className="egreso-fecha-icono" />
											<span>{formatDateLabel(egreso.fecha)}</span>
										</div>
									</div>
								</div>

								<strong className="egreso-monto">-{formatCurrency(egreso.monto)}</strong>
								<div className="egreso-acciones">
									<Link
										to={`/egresos/${egreso.clave}/editar`}
										className="btn-editar-egreso"
										aria-label={`Editar egreso ${formatCurrency(egreso.monto)}`}
									>
										Editar
									</Link>
									<button
										type="button"
										className="btn-eliminar-egreso"
										onClick={() => setEgresoPorEliminar(egreso)}
										disabled={eliminandoId !== null}
										aria-label={`Eliminar egreso ${egreso.descripcion || egreso.clave}`}
									>
										{eliminandoId === egreso.clave ? 'Eliminando...' : 'Eliminar'}
									</button>
								</div>
							</article>
						);
					})}
				</div>
			)}

			{egresoPorEliminar && (
				<div
					className="confirmacion-egreso-overlay"
					role="presentation"
					onClick={() => eliminandoId === null && setEgresoPorEliminar(null)}
				>
					<section
						className="confirmacion-egreso-modal"
						role="alertdialog"
						aria-modal="true"
						aria-labelledby="confirmacion-egreso-titulo"
						aria-describedby="confirmacion-egreso-descripcion"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="confirmacion-egreso-icono" aria-hidden="true">
							<svg viewBox="0 0 24 24">
								<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
							</svg>
						</div>
						<h2 id="confirmacion-egreso-titulo">¿Eliminar este egreso?</h2>
						<p id="confirmacion-egreso-descripcion">
							Esta acción es permanente. El egreso se eliminará de tu historial.
						</p>
						<div className="confirmacion-egreso-detalle">
							<span className="confirmacion-egreso-nombre">
								{egresoPorEliminar.descripcion?.trim() || 'Sin descripción'}
							</span>
							<span className="confirmacion-egreso-monto">
								-{formatCurrency(egresoPorEliminar.monto)}
							</span>
							<span className="confirmacion-egreso-fecha">
								{formatDateLabel(egresoPorEliminar.fecha)}
							</span>
						</div>
						{error && <div className="confirmacion-egreso-error" role="alert">{error}</div>}
						<div className="confirmacion-egreso-acciones">
							<button
								ref={cancelarEliminacionRef}
								type="button"
								className="confirmacion-egreso-cancelar"
								onClick={() => setEgresoPorEliminar(null)}
								disabled={eliminandoId !== null}
							>
								Cancelar
							</button>
							<button
								type="button"
								className="confirmacion-egreso-confirmar"
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

export default EgresosList;
