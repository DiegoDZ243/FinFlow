import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMeta } from '../../context/MetaContext';
import BarraProgreso from '../../components/BarraProgreso';
import './DetalleMetaView.css';

const DetalleMetaView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { metaActual, progreso, fetchMetaPorId, fetchProgreso, aportarMeta, eliminarMeta, loading } = useMeta();
    const [showAportar, setShowAportar] = useState(false);
    const [aportacion, setAportacion] = useState({ montoAportado: '', tipo: 'unico', notas: '' });

    useEffect(() => {
        fetchMetaPorId(id);
        fetchProgreso(id);
    }, [id, fetchMetaPorId, fetchProgreso]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleAportar = async (e) => {
        e.preventDefault();
        const resultado = await aportarMeta(id, {
            montoAportado: parseFloat(aportacion.montoAportado),
            tipo: aportacion.tipo,
            notas: aportacion.notas
        });
        if (resultado) {
            setShowAportar(false);
            setAportacion({ montoAportado: '', tipo: 'unico', notas: '' });
            fetchProgreso(id);
        }
    };

    const handleEliminar = async () => {
        if (window.confirm('¿Estás seguro de eliminar esta meta?')) {
            const success = await eliminarMeta(id);
            if (success) {
                navigate('/metas');
            }
        }
    };

    if (loading && !metaActual) {
        return <div className="detalle-loading">Cargando...</div>;
    }

    if (!metaActual) {
        return <div className="detalle-error">Meta no encontrada</div>;
    }

    const montoActual = parseFloat(metaActual.montoAlcanzado);
    const montoObjetivo = parseFloat(metaActual.montoObjetivo);
    const estaCompletada = montoActual >= montoObjetivo;

    return (
        <div className="detalle-container">
            <div className="detalle-header">
                <Link to="/metas" className="btn-volver">← Volver a Metas</Link>
            </div>

            <div className="detalle-card">
                <div className="detalle-titulo">
                    <h1>{metaActual.identificador}</h1>
                    {estaCompletada && <span className="badge-completada">Completada</span>}
                </div>

                {metaActual.descripcion && (
                    <p className="detalle-descripcion">{metaActual.descripcion}</p>
                )}

                <div className="detalle-progreso">
                    <BarraProgreso actual={montoActual} objetivo={montoObjetivo} />
                </div>

                <div className="detalle-stats">
                    <div className="stat">
                        <span className="stat-label">Aportado</span>
                        <span className="stat-value">{formatCurrency(montoActual)}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Objetivo</span>
                        <span className="stat-value">{formatCurrency(montoObjetivo)}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Restante</span>
                        <span className="stat-value">{formatCurrency(Math.max(0, montoObjetivo - montoActual))}</span>
                    </div>
                </div>

                <div className="detalle-info">
                    <div className="info-row">
                        <span>Fecha de inicio:</span>
                        <span>{formatDate(metaActual.fechaInicio)}</span>
                    </div>
                    <div className="info-row">
                        <span>Fecha límite:</span>
                        <span>{formatDate(metaActual.fechaLimite)}</span>
                    </div>
                    {progreso && (
                        <div className="info-row">
                            <span>Días restantes:</span>
                            <span>{progreso.progreso.diasRestantes} días</span>
                        </div>
                    )}
                </div>

                {progreso && (
                    <div className="detalle-estadisticas">
                        <h3>Estadísticas</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-num">{progreso.estadisticas.totalAportaciones}</span>
                                <span className="stat-desc">Total aportaciones</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">{progreso.estadisticas.aportacionesMensuales}</span>
                                <span className="stat-desc">Mensuales</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">{progreso.estadisticas.aportacionesExtras}</span>
                                <span className="stat-desc">Extraordinarias</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">${progreso.estadisticas.promedioAportacion}</span>
                                <span className="stat-desc">Promedio</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="detalle-acciones">
                    {!showAportar ? (
                        <button 
                            onClick={() => setShowAportar(true)}
                            className="btn-aportar"
                            disabled={estaCompletada}
                        >
                            {estaCompletada ? 'Meta Completada' : '+ Aportar'}
                        </button>
                    ) : (
                        <form onSubmit={handleAportar} className="form-aportar">
                            <input
                                type="number"
                                placeholder="Monto a aportar"
                                value={aportacion.montoAportado}
                                onChange={(e) => setAportacion(prev => ({...prev, montoAportado: e.target.value}))}
                                required
                                min="0.01"
                                step="0.01"
                            />
                            <select
                                value={aportacion.tipo}
                                onChange={(e) => setAportacion(prev => ({...prev, tipo: e.target.value}))}
                            >
                                <option value="unico">Único</option>
                                <option value="mensual">Mensual</option>
                                <option value="extraordinario">Extraordinario</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Notas (opcional)"
                                value={aportacion.notas}
                                onChange={(e) => setAportacion(prev => ({...prev, notas: e.target.value}))}
                            />
                            <div className="form-aportar-actions">
                                <button type="button" onClick={() => setShowAportar(false)} className="btn-cancelar">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-confirmar">
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="detalle-botones">
                    <Link to={`/metas/${id}/editar`} className="btn-editar">
                        Editar Meta
                    </Link>
                    <button onClick={handleEliminar} className="btn-eliminar">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalleMetaView;
