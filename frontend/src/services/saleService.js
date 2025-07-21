import api from './api.js';

export const createSale = async (saleData) => {
  try {
    const response = await api.post('/api/sales', saleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSalesBySeller = async (sellerId) => {
  try {
    const response = await api.get('/api/sales', { params: { sellerId } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSaleStatus = async (saleId, status) => {
  try {
    const response = await api.put(`/api/sales/${saleId}/status`, { estado: status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funciones para el carrito
export const getCart = async (userId) => {
  try {
    const response = await api.get('/api/cart');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCart = async (item) => {
  try {
    const response = await api.post('/api/cart/items', item);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/api/cart/items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/api/cart/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};