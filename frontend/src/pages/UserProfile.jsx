import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, updateUser } from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import RoleBadge from '../components/common/RoleBadge';

const UserProfile = () => {
  const { currentUser, updateUser: updateAuthUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    metadata: {
      nombreCompleto: '',
      telefono: '',
      direccion: {
        calle: '',
        ciudad: '',
        codigoPostal: ''
      }
    }
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await getUserById(currentUser.id);
        setUserData(data);
        setFormData({
          username: data.username,
          email: data.email,
          metadata: data.metadata || {
            nombreCompleto: '',
            telefono: '',
            direccion: {
              calle: '',
              ciudad: '',
              codigoPostal: ''
            }
          }
        });
        setError('');
      } catch (err) {
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('metadata.')) {
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
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const updatedUser = await updateUser(currentUser.id, formData);
      setUserData(updatedUser);
      updateAuthUser({
        username: updatedUser.username,
        email: updatedUser.email
      });
      setIsEditing(false);
    } catch (err) {
      setError('Error al actualizar el perfil');
    }
  };
  
  if (loading) {
    return <LoadingSpinner size="lg" />;
  }
  
  if (!userData) {
    return <div className="text-center py-12">Usuario no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
          <RoleBadge role={userData.rol} />
        </div>
        
        {error && <ErrorAlert message={error} />}
        
        {!isEditing ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{userData.username}</h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Información Personal</h3>
                <p><strong>Nombre completo:</strong> {userData.metadata?.nombreCompleto || 'No especificado'}</p>
                <p><strong>Teléfono:</strong> {userData.metadata?.telefono || 'No especificado'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Dirección</h3>
                <p><strong>Calle:</strong> {userData.metadata?.direccion?.calle || 'No especificada'}</p>
                <p><strong>Ciudad:</strong> {userData.metadata?.direccion?.ciudad || 'No especificada'}</p>
                <p><strong>Código Postal:</strong> {userData.metadata?.direccion?.codigoPostal || 'No especificado'}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
            >
              Editar Perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
            
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
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
              >
                Guardar Cambios
              </button>
              
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;