import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerIngresos } from '../../services/ingresoService';
import './Ingresos.css';

const formatoMoneda = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
});

const formatoFecha = (fecha) => {
    const fechaLocal = new Date(`${String(fecha).split('T')[0]}T12:00:00`);
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(fechaLocal);
};

const IngresosList = () => {
    const [ingresos, setIngresos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarIngresos = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setIngresos(await obtenerIngresos());
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudieron cargar los ingresos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarIngresos();
    }, [cargarIngresos]);

    return (
        <section className="ingresos-container">
            <header className="ingresos-header">
                <div>
                    <h1>Mis ingresos</h1>
                    <p>Consulta y actualiza los ingresos registrados.</p>
                </div>
            </header>

            {error && (
                <div className="ingresos-error" role="alert">
                    <span>{error}</span>
                    <button type="button" onClick={cargarIngresos}>Reintentar</button>
                </div>
            )}

            {loading ? (
                <p className="ingresos-message" role="status">Cargando ingresos...</p>
            ) : ingresos.length === 0 ? (
                <div className="ingresos-empty">
                    <h2>Aún no hay ingresos registrados</h2>
                    <p>Cuando tengas ingresos registrados, podrás consultarlos y editarlos aquí.</p>
                </div>
            ) : (
                <div className="ingresos-list">
                    {ingresos.map((ingreso) => (
                        <article className="ingreso-card" key={ingreso.clave}>
                            <div className="ingreso-card-info">
                                <strong>{formatoMoneda.format(Number(ingreso.monto))}</strong>
                                <span>{formatoFecha(ingreso.fecha)}</span>
                                <p>{ingreso.descripcion || 'Sin descripción'}</p>
                            </div>
                            <Link className="ingreso-edit-link" to={`/ingresos/${ingreso.clave}/editar`}>
                                Editar
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default IngresosList;
