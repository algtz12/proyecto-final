import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from '../services/auth';



const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const user = await getCurrentUser();
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Iniciar sesión
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      rol: userData.rol
    }));
    setCurrentUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      rol: userData.rol
    });
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Actualizar usuario
  const updateUser = (userData) => {
    setCurrentUser({ ...currentUser, ...userData });
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...userData }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      logout,
      updateUser,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);