import React, { useState } from 'react';
import { assignRole, deactivateUser } from '../../services/userService';
import ErrorAlert from '../common/ErrorAlert';

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    rol: user?.rol || 'usuario',
    activo: user?.activo ?? true,
    metadata: user?.metadata || {
      nombreCompleto: '',
      telefono: '',
      direccion: {
        calle: '',
        ciudad: '',
        codigoPostal: ''
      }
    }
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'rol') {
      setFormData({ ...formData, rol: value });
    } else if (name === 'activo') {
      setFormData({ ...formData, activo: checked });
    } else if (name.startsWith('metadata.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          [field]: value
        }
      });
    } else if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          direccion: {
            ...formData.metadata.direccion,
            [field]: value
          }
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Actualizar el usuario
      // En este ejemplo, asumimos que onSave maneja la actualización
      onSave(formData);
    } catch (err) {
      setError('Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (role) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await assignRole(user.id, role);
      setFormData({ ...formData, rol: role });
    } catch (err) {
      setError('Error al asignar rol');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await deactivateUser(user.id);
      setFormData({ ...formData, activo: !formData.activo });
    } catch (err) {
      setError('Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorAlert message={error} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol
        </label>
        <div className="flex space-x-2">
          {['usuario', 'vendedor', 'consultor', 'administrador'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleAssignRole(role)}
              className={`px-3 py-1 rounded-md text-sm ${
                formData.rol === role
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="activo"
          name="activo"
          checked={formData.activo}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="activo" className="text-sm font-medium text-gray-700">
          Activo
        </label>
        {user && (
          <button
            type="button"
            onClick={handleToggleActive}
            className="ml-4 text-sm text-blue-600 hover:text-blue-800"
          >
            {formData.activo ? 'Desactivar' : 'Activar'}
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Información Personal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="metadata.nombreCompleto"
              value={formData.metadata.nombreCompleto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="metadata.telefono"
              value={formData.metadata.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Dirección</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calle
            </label>
            <input
              type="text"
              name="direccion.calle"
              value={formData.metadata.direccion.calle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              name="direccion.ciudad"
              value={formData.metadata.direccion.ciudad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal
            </label>
            <input
              type="text"
              name="direccion.codigoPostal"
              value={formData.metadata.direccion.codigoPostal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;