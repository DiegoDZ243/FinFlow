import { useState, useCallback, useEffect, useMemo } from 'react';
import { obtenerIngresos } from '../services/ingresoService';
import { calcularTotalIngresos, filtrarIngresos } from './ingresosHelpers';

export const useIngresosViewModel = () => {
    const [ingresos, setIngresos] = useState([]);
    const [loading, setLoading] = useState(false);
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
        hayFiltrosActivos,
        limpiarFiltros,
        fetchIngresos
    };
};
