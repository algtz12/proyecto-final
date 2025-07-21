import { useAuth } from '../contexts/AuthContext';

export const useAuthorization = (allowedRoles = []) => {
  const { currentUser } = useAuth();
  
  // Verificar si el usuario tiene los roles requeridos
  const isAuthorized = () => {
    if (!currentUser) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(currentUser.rol);
  };
  
  // Verificar si el usuario es administrador
  const isAdmin = () => {
    return currentUser?.rol === 'administrador';
  };
  
  return {
    isAuthorized,
    isAdmin,
    currentRole: currentUser?.rol
  };
};