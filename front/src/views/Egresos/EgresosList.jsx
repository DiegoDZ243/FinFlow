import { Link } from 'react-router-dom';
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
	const { egresos, loading, eliminandoId, error, mensaje, fetchEgresos, borrarEgreso } = useEgresosViewModel();

	const handleDelete = async (egreso) => {
		const descripcion = egreso.descripcion?.trim() || 'este egreso';
		if (!window.confirm(`¿Seguro que quieres eliminar "${descripcion}" por ${formatCurrency(egreso.monto)}?`)) {
			return;
		}
		await borrarEgreso(egreso.clave);
	};

	return (
		<section className="egresos-container">
			<header className="egresos-header">
				<div>
					<h1>Mis egresos</h1>
					<p>Consulta y elimina tus gastos registrados.</p>
				</div>
				<Link to="/egresos/nuevo" className="btn-nuevo-egreso">Registrar egreso</Link>
				<div className="egresos-total">
					<span>{egresos.length} {egresos.length === 1 ? 'egreso' : 'egresos'}</span>
					<strong>{formatCurrency(egresos.reduce((total, egreso) => total + Number(egreso.monto || 0), 0))}</strong>
				</div>
			</header>

			{error && (
				<div className="egresos-alerta egresos-alerta-error" role="alert">
					<span>{error}</span>
					<button type="button" onClick={fetchEgresos}>Reintentar</button>
				</div>
			)}
			{mensaje && <div className="egresos-alerta egresos-alerta-ok" role="status">{mensaje}</div>}

			{loading && egresos.length === 0 ? (
				<div className="egresos-vacios" role="status">Cargando egresos...</div>
			) : egresos.length === 0 ? (
				<div className="egresos-vacios">
					<Icon name="calendar" className="egresos-icono-vacio" />
					<h2>No tienes egresos registrados</h2>
					<p>Cuando registres egresos, aparecerán aquí para que puedas consultarlos y eliminarlos.</p>
				</div>
			) : (
				<div className="egresos-lista" role="list">
					{egresos.map((egreso) => {
						const tieneDescripcion = Boolean(egreso.descripcion?.trim());
						return (
							<article key={egreso.clave} className="egreso-item" role="listitem">
								<div className="egreso-info">
									<h2 className={tieneDescripcion ? '' : 'egreso-sin-descripcion'}>
										{tieneDescripcion ? egreso.descripcion : 'Sin descripción'}
									</h2>
									<div className="egreso-fecha">
										<Icon name="calendar" className="egreso-fecha-icono" />
										<span>{formatDateLabel(egreso.fecha)}</span>
									</div>
								</div>
								<strong className="egreso-monto">-{formatCurrency(egreso.monto)}</strong>
								<button
									type="button"
									className="btn-eliminar-egreso"
									onClick={() => handleDelete(egreso)}
									disabled={eliminandoId !== null}
									aria-label={`Eliminar egreso ${egreso.descripcion || egreso.clave}`}
								>
									{eliminandoId === egreso.clave ? 'Eliminando...' : 'Eliminar'}
								</button>
							</article>
						);
					})}
				</div>
			)}
		</section>
	);
};

export default EgresosList;
