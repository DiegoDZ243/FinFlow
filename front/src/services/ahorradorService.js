import api from '../config/axios';

export const registrar = async (email, password) => {
    const response = await api.post('/ahorradores/registrar', { email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/ahorradores/login', { email, password });
    return response.data;
};
