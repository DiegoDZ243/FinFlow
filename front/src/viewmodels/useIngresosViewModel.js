import { useState, useCallback, useEffect, useMemo } from 'react';
import { eliminarIngreso as eliminarIngresoApi, obtenerIngresos } from '../services/ingresoService';
import { calcularTotalIngresos, filtrarIngresos } from './ingresosHelpers';

export const useIngresosViewModel = () => {
    const [ingresos, setIngresos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');

    const fetchIngresos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerIngresos();
            const lista = Array.isArray(data) ? data : [];
            setIngresos(lista);
            return lista;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar los ingresos');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIngresos();
    }, [fetchIngresos]);

    const ingresosFiltrados = useMemo(
        () => filtrarIngresos(ingresos, { busqueda, fechaDesde, fechaHasta }),
        [ingresos, busqueda, fechaDesde, fechaHasta]
    );

    const totalAcumulado = useMemo(() => calcularTotalIngresos(ingresos), [ingresos]);
    const totalFiltrado = useMemo(() => calcularTotalIngresos(ingresosFiltrados), [ingresosFiltrados]);

    const hayFiltrosActivos = Boolean(busqueda.trim() || fechaDesde || fechaHasta);

    const limpiarFiltros = useCallback(() => {
        setBusqueda('');
        setFechaDesde('');
        setFechaHasta('');
    }, []);

    const eliminarIngreso = useCallback(async (id) => {
        setEliminandoId(id);
        setError(null);
        try {
            await eliminarIngresoApi(id);
            setIngresos((actuales) => actuales.filter((ingreso) => ingreso.clave !== id));
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar el ingreso');
            return false;
        } finally {
            setEliminandoId(null);
        }
    }, []);

    return {
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
    };
};
