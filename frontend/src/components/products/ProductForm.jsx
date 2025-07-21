import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/productService';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    descripcion: product?.descripcion || '',
    precio: product?.precio || '',
    stock: product?.stock || '',
    categoria_id: product?.categoria_id || '',
    imagen_url: product?.imagen_url || '',
    activo: product?.activo ?? true
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setError('');
      } catch (err) {
        setError('Error al cargar categorías');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar datos
    if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria_id) {
      setError('Por favor completa los campos requeridos');
      return;
    }
    
    // Convertir a números
    const productToSave = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      categoria_id: parseInt(formData.categoria_id)
    };
    
    onSave(productToSave);
  };

  if (loading) {
    return <LoadingSpinner size="sm" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorAlert message={error} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category.categoria_id} value={category.categoria_id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de la Imagen
        </label>
        <input
          type="url"
          name="imagen_url"
          value={formData.imagen_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
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
          Producto Activo
        </label>
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
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
        >
          {product ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;