import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RoleBadge from './RoleBadge';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'border-b-2 border-primary' : '';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Sistema de Ventas
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/" 
            className={`py-2 ${isActive('/')}`}
          >
            Inicio
          </Link>
          
          <Link 
            to="/products" 
            className={`py-2 ${isActive('/products')}`}
          >
            Productos
          </Link>
          
          {isAuthenticated && (
            <Link 
              to="/profile" 
              className={`py-2 ${isActive('/profile')}`}
            >
              Perfil
            </Link>
          )}
          
          {isAuthenticated && currentUser?.rol === 'consultor' && (
            <Link 
              to="/reports" 
              className={`py-2 ${isActive('/reports')}`}
            >
              Reportes
            </Link>
          )}
          
          {isAuthenticated && currentUser?.rol === 'administrador' && (
            <>
              <Link 
                to="/admin/users" 
                className={`py-2 ${isActive('/admin/users')}`}
              >
                Usuarios
              </Link>
              <Link 
                to="/admin/products" 
                className={`py-2 ${isActive('/admin/products')}`}
              >
                Productos
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">{currentUser.username}</span>
                <RoleBadge role={currentUser.rol} />
              </div>
              <button 
                onClick={logout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;