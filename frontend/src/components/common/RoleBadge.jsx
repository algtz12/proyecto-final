import React from 'react';

const roleColors = {
  administrador: 'bg-purple-600 text-white',
  vendedor: 'bg-blue-600 text-white',
  consultor: 'bg-green-600 text-white',
  usuario: 'bg-gray-600 text-white'
};

const roleNames = {
  administrador: 'Admin',
  vendedor: 'Vendedor',
  consultor: 'Consultor',
  usuario: 'Usuario'
};

const RoleBadge = ({ role }) => {
  if (!role || !roleColors[role]) return null;
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${roleColors[role]}`}>
      {roleNames[role]}
    </span>
  );
};

export default RoleBadge;