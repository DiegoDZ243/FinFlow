import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actualizarEgreso, obtenerEgresoPorId } from '../../services/egresoService';
import '../Ingresos/FormIngreso.css';

const EditarEgresoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ monto: '', fecha: '', descripcion: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarEgreso = async () => {
            setLoading(true);
            setError('');
            try {
                const egreso = await obtenerEgresoPorId(id);
                setFormData({
                    monto: String(egreso.monto),
                    fecha: egreso.fecha ? String(egreso.fecha).split('T')[0] : '',
                    descripcion: egreso.descripcion || ''
                });
            } catch (err) {
                setError(err.response?.data?.error || 'No se pudo cargar el egreso.');
            } finally {
                setLoading(false);
            }
        };

        cargarEgreso();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const monto = Number(formData.monto);
        if (!Number.isFinite(monto) || monto <= 0) {
            setError('El monto debe ser mayor a 0.');
            return;
        }
        if (!formData.fecha || Number.isNaN(new Date(formData.fecha).getTime())) {
            setError('Ingresa una fecha válida.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await actualizarEgreso(id, {
                monto,
                fecha: formData.fecha,
                descripcion: formData.descripcion.trim() || null
            });
            navigate('/egresos');
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo actualizar el egreso.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="form-container"><p className="loading">Cargando egreso...</p></div>;
    }

    return (
        <div className="form-container">
            <h1>Editar egreso</h1>
            {error && !formData.monto ? (
                <div className="form-error" role="alert">
                    {error} <Link to="/egresos">Volver a egresos</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="form-meta" noValidate>
                    <div className="form-group">
                        <label htmlFor="monto">Monto *</label>
                        <input
                            id="monto"
                            name="monto"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={formData.monto}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha">Fecha *</label>
                        <input
                            id="fecha"
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={handleChange}
                            required
                            disabled={saving}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción (opcional)</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={3}
                            disabled={saving}
                        />
                    </div>
                    {error && <div className="form-error" role="alert">{error}</div>}
                    <div className="form-actions">
                        <button type="button" className="btn-cancelar" onClick={() => navigate('/egresos')} disabled={saving}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-enviar" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditarEgresoView;
