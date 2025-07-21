import api from './api.js';

export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignRole = async (id, role) => {
  try {
    const response = await api.put(`/api/users/${id}/role`, { rol: role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (id) => {
  try {
    const response = await api.put(`/api/users/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};