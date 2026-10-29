import api from '../config/axios';

const config = () => ({
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
});

export const crearIngreso = async (data) => {
	const response = await api.post('/ingresos', data, config());
	return response.data;
};
