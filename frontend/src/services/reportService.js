import { pythonApi } from './api.js';

export const getSalesReport = async (params) => {
  try {
    const response = await pythonApi.get('/api/reports/sales', {
      params: {
        ...params,
        format: params.format || 'json'
      },
      responseType: params.format === 'json' ? 'json' : 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsReport = async () => {
  try {
    const response = await pythonApi.get('/api/reports/products');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para descargar archivos
export const downloadFile = (data, filename, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};