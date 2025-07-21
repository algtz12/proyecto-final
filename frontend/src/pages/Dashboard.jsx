import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import RoleBadge from '../components/common/RoleBadge';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();

  const renderDashboardContent = () => {
    if (!currentUser) return null;

    switch (currentUser.rol) {
      case 'administrador':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard 
              title="Usuarios" 
              description="Gestiona todos los usuarios del sistema"
              link="/admin/users"
              linkText="Ver usuarios"
              bgColor="bg-purple-100"
            />
            <DashboardCard 
              title="Productos" 
              description="Administra el catálogo de productos"
              link="/admin/products"
              linkText="Ver productos"
              bgColor="bg-blue-100"
            />
            <DashboardCard 
              title="Reportes" 
              description="Genera reportes avanzados"
              link="/reports"
              linkText="Ver reportes"
              bgColor="bg-green-100"
            />
            <DashboardCard 
              title="Ventas" 
              description="Consulta el historial de ventas"
              link="/sales"
              linkText="Ver ventas"
              bgColor="bg-yellow-100"
            />
          </div>
        );
      
      case 'vendedor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DashboardCard 
              title="Nueva Venta" 
              description="Crea una nueva venta"
              link="/checkout"
              linkText="Crear venta"
              bgColor="bg-blue-100"
            />
            <DashboardCard 
              title="Mis Ventas" 
              description="Consulta tu historial de ventas"
              link="/sales"
              linkText="Ver ventas"
              bgColor="bg-green-100"
            />
          </div>
        );
      
      case 'consultor':
        return (
          <div className="mb-8">
            <DashboardCard 
              title="Reportes" 
              description="Genera reportes de ventas y productos"
              link="/reports"
              linkText="Ver reportes"
              bgColor="bg-green-100"
              fullWidth
            />
          </div>
        );
      
      default: // usuario
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DashboardCard 
              title="Productos" 
              description="Explora nuestro catálogo"
              link="/products"
              linkText="Ver productos"
              bgColor="bg-blue-100"
            />
            <DashboardCard 
              title="Mis Compras" 
              description="Revisa tu historial de compras"
              link="/profile/purchases"
              linkText="Ver compras"
              bgColor="bg-green-100"
            />
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
        <div className="flex items-center">
          <p className="text-gray-600 mr-2">Bienvenido, {currentUser?.username}</p>
          {currentUser && <RoleBadge role={currentUser.rol} />}
        </div>
      </div>
      
      {renderDashboardContent()}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
        <p className="text-gray-600">Aquí se mostrará tu actividad reciente en el sistema...</p>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, link, linkText, bgColor, fullWidth = false }) => {
  return (
    <div className={`${fullWidth ? 'col-span-full' : ''} ${bgColor} rounded-lg shadow-md p-6`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <Link 
        to={link} 
        className="inline-block bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
      >
        {linkText}
      </Link>
    </div>
  );
};

export default Dashboard;