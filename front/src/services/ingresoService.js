import api from '../config/axios';

const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

export const obtenerIngresos = async () => {
    const response = await api.get('/ingresos', config());
    return response.data;
};

export const obtenerIngresoPorId = async (id) => {
    const response = await api.get(`/ingresos/${id}`, config());
    return response.data;
};

export const actualizarIngreso = async (id, data) => {
    const response = await api.put(`/ingresos/${id}`, data, config());
    return response.data;
};