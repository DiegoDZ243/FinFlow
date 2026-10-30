import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearIngreso } from '../../services/ingresoService';
import './FormIngreso.css';

const obtenerFechaLocal = () => {
	const ahora = new Date();
	ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
	return ahora.toISOString().slice(0, 10);
};

const RegistroIngreso = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		monto: '',
		fecha: obtenerFechaLocal(),
		descripcion: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((previous) => ({ ...previous, [name]: value }));
		setError('');
		setSuccess('');
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');
		setSuccess('');

		const monto = Number(formData.monto);
		if (!formData.monto || !Number.isFinite(monto) || monto <= 0) {
			setError('El monto debe ser mayor a 0.');
			return;
		}
		if (!formData.fecha) {
			setError('La fecha es obligatoria.');
			return;
		}

		setLoading(true);
		try {
			await crearIngreso({
				monto,
				fecha: formData.fecha,
				descripcion: formData.descripcion.trim() || null,
			});
			setSuccess('Ingreso registrado correctamente.');
			setFormData({
				monto: '',
				fecha: obtenerFechaLocal(),
				descripcion: '',
			});
		} catch (requestError) {
			setError(requestError.response?.data?.error || 'No se pudo registrar el ingreso.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="form-container">
			<h1>Registrar ingreso</h1>

			<form onSubmit={handleSubmit} className="form-meta" noValidate>
				<div className="form-group">
					<label htmlFor="monto">Monto *</label>
					<input
						type="number"
						id="monto"
						name="monto"
						value={formData.monto}
						onChange={handleChange}
						min="0.01"
						step="0.01"
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="fecha">Fecha *</label>
					<input
						type="date"
						id="fecha"
						name="fecha"
						value={formData.fecha}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="descripcion">Descripción</label>
					<textarea
						id="descripcion"
						name="descripcion"
						value={formData.descripcion}
						onChange={handleChange}
						rows={3}
					/>
				</div>

				{error && <div className="form-error" role="alert">{error}</div>}
				{success && <div className="form-success" role="status">{success}</div>}

				<div className="form-actions">
					<button type="button" className="btn-cancelar" onClick={() => navigate('/ingresos')}>
						Cancelar
					</button>
					<button type="submit" className="btn-enviar" disabled={loading}>
						{loading ? 'Guardando...' : 'Registrar ingreso'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegistroIngreso;
