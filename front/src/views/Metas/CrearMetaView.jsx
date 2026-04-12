import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeta } from '../../context/MetaContext';
import './FormMeta.css';

const CrearMetaView = () => {
    const navigate = useNavigate();
    const { crearMeta, loading, error } = useMeta();

    const [formData, setFormData] = useState({
        identificador: '',
        montoObjetivo: '',
        fechaLimite: '',
        descripcion: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            ...formData,
            montoObjetivo: parseFloat(formData.montoObjetivo),
            fechaInicio: new Date().toISOString().split('T')[0]
        };

        const resultado = await crearMeta(data);
        if (resultado) {
            navigate('/metas');
        }
    };

    return (
        <div className="form-container">
            <h1>Crear Nueva Meta</h1>
            
            <form onSubmit={handleSubmit} className="form-meta">
                <div className="form-group">
                    <label htmlFor="identificador">Nombre de la Meta *</label>
                    <input
                        type="text"
                        id="identificador"
                        name="identificador"
                        value={formData.identificador}
                        onChange={handleChange}
                        placeholder="Ej: Vacaciones 2026"
                        required
                        minLength={4}
                        maxLength={15}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="montoObjetivo">Monto Objetivo *</label>
                    <input
                        type="number"
                        id="montoObjetivo"
                        name="montoObjetivo"
                        value={formData.montoObjetivo}
                        onChange={handleChange}
                        placeholder="5000.00"
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fechaLimite">Fecha Límite *</label>
                    <input
                        type="date"
                        id="fechaLimite"
                        name="fechaLimite"
                        value={formData.fechaLimite}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción (opcional)</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="¿Por qué es importante esta meta?"
                        rows={3}
                    />
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/metas')}
                        className="btn-cancelar"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-enviar"
                    >
                        {loading ? 'Creando...' : 'Crear Meta'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearMetaView;
