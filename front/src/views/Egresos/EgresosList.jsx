import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEgresos, eliminarEgreso } from '../../services/egresoService';
import '../Ingresos/IngresosList.css';

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
    const [deletingId, setDeletingId] = useState(null);

    const cargarEgresos = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await obtenerEgresos();
            setEgresos(response || []);
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudieron cargar los egresos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEgresos();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Deseas eliminar este egreso?')) {
            return;
        }

        setDeletingId(id);
        try {
            await eliminarEgreso(id);
            await cargarEgresos();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo eliminar el egreso.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <div className="ingresos-container"><div className="loading">Cargando egresos...</div></div>;
    }

    return (
        <div className="ingresos-container">
            <div className="ingresos-header">
                <h1>Mis Egresos</h1>
                <Link to="/egresos/nuevo" className="btn-nuevo-ingreso">
                    Nuevo Egreso
                </Link>
            </div>

            {error && <div className="error-message" role="alert">{error}</div>}

            {egresos.length === 0 ? (
                <div className="empty-state">
                    <p>Aún no tienes egresos registrados.</p>
                    <Link to="/egresos/nuevo" className="btn-nuevo-ingreso">Agregar egreso</Link>
                </div>
            ) : (
                <div className="ingresos-table-wrapper">
                    <table className="ingresos-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {egresos.map((egreso) => (
                                <tr key={egreso.clave}>
                                    <td>{formatDateLabel(egreso.fecha)}</td>
                                    <td>{egreso.descripcion || 'Sin descripción'}</td>
                                    <td>{formatCurrency(egreso.monto)}</td>
                                    <td>
                                        <div className="acciones-row">
                                            <Link to={`/egresos/${egreso.clave}/editar`} className="btn-editar">Editar</Link>
                                            <button type="button" className="btn-eliminar" onClick={() => handleDelete(egreso.clave)} disabled={deletingId === egreso.clave}>
                                                {deletingId === egreso.clave ? 'Eliminando...' : 'Eliminar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EgresosList;
