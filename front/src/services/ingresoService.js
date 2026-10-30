import api from '../config/axios';

const config = () => ({
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
});

export const obtenerIngresos = async (params = {}) => {
	const response = await api.get('/ingresos', {
		...config(),
		params
	});
	return response.data;
};

export const obtenerIngresoPorId = async (id) => {
	const response = await api.get(`/ingresos/${id}`, config());
	return response.data;
};

export const crearIngreso = async (data) => {
	const response = await api.post('/ingresos', data, config());
	return response.data;
};

export const eliminarIngreso = async (id) => {
	const response = await api.delete(`/ingresos/${id}`, config());
	return response.data;
};
