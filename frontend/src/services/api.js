import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_NODE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar errores
api.interceptors.response.use(response => response, error => {
  if (error.response) {
    // Manejo de errores HTTP
    const { status, data } = error.response;
    
    if (status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject({
      status,
      message: data.error || 'Error desconocido'
    });
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    return Promise.reject({
      status: 0,
      message: 'No se pudo conectar con el servidor'
    });
  } else {
    // Error al configurar la petición
    return Promise.reject({
      status: -1,
      message: 'Error en la configuración de la petición'
    });
  }
});

// API para el backend de Python
export const pythonApi = axios.create({
  baseURL: process.env.REACT_APP_PYTHON_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

pythonApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;