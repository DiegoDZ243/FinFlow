import api from '../config/axios';

const getToken = () => localStorage.getItem('token');

const config = () => ({
    headers: {
        Authorization: getToken() ? `Bearer ${getToken()}` : ''
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

export const crearEgreso = async (data) => {
    const response = await api.post('/egresos', data, config());
    return response.data;
};

export const actualizarEgreso = async (id, data) => {
    const response = await api.put(`/egresos/${id}`, data, config());
    return response.data;
};

export const eliminarEgreso = async (id) => {
    const response = await api.delete(`/egresos/${id}`, config());
    return response.data;
};
