import { createContext, useContext, useState, useCallback } from 'react';
import { 
    obtenerMetas, 
    crearMeta, 
    actualizarMeta, 
    eliminarMeta,
    obtenerMetaPorId,
    obtenerProgreso,
    aportarMeta 
} from '../services/metaService';

const MetaContext = createContext();

export const useMeta = () => {
    const context = useContext(MetaContext);
    if (!context) {
        throw new Error('useMeta debe usarse dentro de MetaProvider');
    }
    return context;
};

export const MetaProvider = ({ children }) => {
    const [metas, setMetas] = useState([]);
    const [metaActual, setMetaActual] = useState(null);
    const [progreso, setProgreso] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMetas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerMetas();
            setMetas(data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar las metas');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMetaPorId = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerMetaPorId(id);
            setMetaActual(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar la meta');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchProgreso = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerProgreso(id);
            setProgreso(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar el progreso');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const crearNuevaMeta = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const nuevaMeta = await crearMeta(data);
            setMetas(prev => [...prev, nuevaMeta]);
            return nuevaMeta;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la meta');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const actualizarMetaExistente = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const metaActualizada = await actualizarMeta(id, data);
            setMetas(prev => prev.map(m => m.clave === id ? metaActualizada : m));
            if (metaActual?.clave === id) {
                setMetaActual(metaActualizada);
            }
            return metaActualizada;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar la meta');
            return null;
        } finally {
            setLoading(false);
        }
    }, [metaActual]);

    const eliminarMetaExistente = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await eliminarMeta(id);
            setMetas(prev => prev.filter(m => m.clave !== id));
            if (metaActual?.clave === id) {
                setMetaActual(null);
            }
            return true;
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar la meta');
            return false;
        } finally {
            setLoading(false);
        }
    }, [metaActual]);

    const aportarAMeta = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const resultado = await aportarMeta(id, data);
            await fetchMetaPorId(id);
            return resultado;
        } catch (err) {
            // 1. Extraemos el mensaje de error del backend, o ponemos el tuyo por defecto
            const mensajeError = err.response?.data?.error || 'No se puede exceder a la cantidad de meta total';
            
            // 2. Lanzamos la alerta nativa del navegador (igual a la de tu imagen)
            window.alert(mensajeError);
            
            // 3. Guardamos el error en el estado por si acaso
            setError(mensajeError);
            return null;
        } finally {
            setLoading(false);
        }
    }, [fetchMetaPorId]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        metas,
        metaActual,
        progreso,
        loading,
        error,
        fetchMetas,
        fetchMetaPorId,
        fetchProgreso,
        crearMeta: crearNuevaMeta,
        actualizarMeta: actualizarMetaExistente,
        eliminarMeta: eliminarMetaExistente,
        aportarMeta: aportarAMeta,
        clearError
    };

    return (
        <MetaContext.Provider value={value}>
            {children}
        </MetaContext.Provider>
    );
};
