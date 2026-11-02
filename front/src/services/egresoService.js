import api from '../config/axios';

const config = () => ({
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
});

export const obtenerEgresos = async () => {
	const response = await api.get('/egresos', config());
	return response.data;
};

export const crearEgreso = async (data) => {
	const response = await api.post('/egresos', data, config());
	return response.data;
};

export const eliminarEgreso = async (id) => {
	const response = await api.delete(`/egresos/${id}`, config());
	return response.data;
};