import { useCallback, useEffect, useMemo, useState } from 'react';
import { eliminarEgreso, obtenerEgresos } from '../services/egresoService';
import { calcularTotalEgresos, filtrarEgresos } from './egresosHelpers';

export const useEgresosViewModel = () => {
	const [egresos, setEgresos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [eliminandoId, setEliminandoId] = useState(null);
	const [error, setError] = useState(null);
	const [mensaje, setMensaje] = useState('');
	const [busqueda, setBusqueda] = useState('');
	const [fechaDesde, setFechaDesde] = useState('');
	const [fechaHasta, setFechaHasta] = useState('');

	const fetchEgresos = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await obtenerEgresos();
			if (!Array.isArray(data)) {
				throw new Error('La respuesta del servidor no contiene una lista de egresos');
			}
			setEgresos(data);
		} catch (requestError) {
			setError(requestError.response?.data?.error || requestError.message || 'Error al cargar los egresos');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchEgresos();
	}, [fetchEgresos]);

	const egresosFiltrados = useMemo(
		() => filtrarEgresos(egresos, { busqueda, fechaDesde, fechaHasta }),
		[egresos, busqueda, fechaDesde, fechaHasta]
	);

	const totalAcumulado = useMemo(() => calcularTotalEgresos(egresos), [egresos]);
	const totalFiltrado = useMemo(() => calcularTotalEgresos(egresosFiltrados), [egresosFiltrados]);
	const hayFiltrosActivos = Boolean(busqueda.trim() || fechaDesde || fechaHasta);

	const limpiarFiltros = useCallback(() => {
		setBusqueda('');
		setFechaDesde('');
		setFechaHasta('');
	}, []);

	const borrarEgreso = useCallback(async (id) => {
		setEliminandoId(id);
		setError(null);
		setMensaje('');
		try {
			await eliminarEgreso(id);
			setEgresos((egresosActuales) => egresosActuales.filter((egreso) => egreso.clave !== id));
			setMensaje('Egreso eliminado correctamente.');
			return true;
		} catch (requestError) {
			setError(requestError.response?.data?.error || 'No se pudo eliminar el egreso.');
			return false;
		} finally {
			setEliminandoId(null);
		}
	}, []);

	return {
		egresos,
		egresosFiltrados,
		totalAcumulado,
		totalFiltrado,
		loading,
		eliminandoId,
		error,
		mensaje,
		busqueda,
		setBusqueda,
		fechaDesde,
		setFechaDesde,
		fechaHasta,
		setFechaHasta,
		hayFiltrosActivos,
		limpiarFiltros,
		fetchEgresos,
		borrarEgreso
	};
};
