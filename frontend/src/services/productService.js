import { pythonApi } from './api.js';

export const getProducts = async (page = 1, perPage = 20) => {
  try {
    const response = await pythonApi.get('/api/products', {
      params: { page, per_page: perPage }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await pythonApi.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await pythonApi.post('/api/products', productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await pythonApi.put(`/api/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await pythonApi.delete(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await pythonApi.get('/api/products/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};