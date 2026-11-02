import { useCallback, useEffect, useState } from 'react';
import { eliminarEgreso, obtenerEgresos } from '../services/egresoService';

export const useEgresosViewModel = () => {
	const [egresos, setEgresos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [eliminandoId, setEliminandoId] = useState(null);
	const [error, setError] = useState('');
	const [mensaje, setMensaje] = useState('');

	const fetchEgresos = useCallback(async () => {
		setLoading(true);
		setError('');
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

	const borrarEgreso = useCallback(async (id) => {
		setEliminandoId(id);
		setError('');
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

	return { egresos, loading, eliminandoId, error, mensaje, fetchEgresos, borrarEgreso };
};
