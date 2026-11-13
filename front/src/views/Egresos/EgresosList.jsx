import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEgresos } from '../../services/egresoService';
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
    const [egresos, setEgresos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEgresos = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await obtenerEgresos();
            setEgresos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar los egresos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEgresos();
    }, [fetchEgresos]);

    if (loading) {
        return <div className="egresos-container"><p className="egresos-message">Cargando egresos...</p></div>;
    }

    const total = egresos.reduce((sum, egreso) => sum + (Number(egreso.monto) || 0), 0);

    return (
        <section className="egresos-container">
            <header className="egresos-header">
                <div>
                    <h1>Mis Egresos</h1>
                    <p>Total registrado: {formatCurrency(total)}</p>
                </div>
            </header>

            {error && (
                <div className="egresos-error" role="alert">
                    <span>{error}</span>
                    <button type="button" onClick={fetchEgresos}>Reintentar</button>
                </div>
            )}

            {egresos.length === 0 ? (
                <div className="egresos-empty">
                    <h2>No tienes egresos registrados</h2>
                    <p>Cuando registres egresos, aparecerán aquí para que puedas consultarlos y editarlos.</p>
                </div>
            ) : (
                <div className="egresos-list" role="list">
                    {egresos.map((egreso) => (
                        <article className="egreso-card" key={egreso.clave} role="listitem">
                            <div className="egreso-card-info">
                                <strong>-{formatCurrency(egreso.monto)}</strong>
                                <span>{formatDateLabel(egreso.fecha)}</span>
                                <p>{egreso.descripcion?.trim() || 'Sin descripción'}</p>
                            </div>
                            <Link
                                to={`/egresos/${egreso.clave}/editar`}
                                className="egreso-edit-link"
                                aria-label={`Editar egreso ${formatCurrency(egreso.monto)}`}
                            >
                                Editar
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default EgresosList;
