import api from './api.js';

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      const response = await api.get(`/api/users/${user.id}`);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};