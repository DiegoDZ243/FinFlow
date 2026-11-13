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

export const obtenerEgresoPorId = async (id) => {
    const response = await api.get(`/egresos/${id}`, config());
    return response.data;
};

export const actualizarEgreso = async (id, data) => {
    const response = await api.put(`/egresos/${id}`, data, config());
    return response.data;
};