import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { actualizarIngreso, obtenerIngresoPorId } from '../../services/ingresoService';
import './Ingresos.css';

const EditarIngresoView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ monto: '', fecha: '', descripcion: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarIngreso = async () => {
            setLoading(true);
            setError('');
            try {
                const ingreso = await obtenerIngresoPorId(id);
                setFormData({
                    monto: String(ingreso.monto),
                    fecha: ingreso.fecha ? String(ingreso.fecha).split('T')[0] : '',
                    descripcion: ingreso.descripcion || ''
                });
            } catch (err) {
                setError(err.response?.data?.error || 'No se pudo cargar el ingreso.');
            } finally {
                setLoading(false);
            }
        };

        cargarIngreso();
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
            await actualizarIngreso(id, {
                monto,
                fecha: formData.fecha,
                descripcion: formData.descripcion.trim() || null
            });
            navigate('/ingresos');
        } catch (err) {
            setError(err.response?.data?.error || 'No se pudo actualizar el ingreso.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className="ingresos-message" role="status">Cargando ingreso...</p>;
    }

    return (
        <section className="ingresos-container ingreso-form-container">
            <h1>Editar ingreso</h1>
            <form className="ingreso-form" onSubmit={handleSubmit}>
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

                <label htmlFor="descripcion">Descripción (opcional)</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={saving}
                />

                {error && <div className="ingresos-error" role="alert">{error}</div>}

                <div className="ingreso-form-actions">
                    <button type="button" className="ingreso-cancel-button" onClick={() => navigate('/ingresos')} disabled={saving}>
                        Cancelar
                    </button>
                    <button type="submit" className="ingreso-save-button" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default EditarIngresoView;
