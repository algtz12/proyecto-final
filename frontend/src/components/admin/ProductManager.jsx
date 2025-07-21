import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
import { useAuthorization } from '../../hooks/useAuthorization';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { isAdmin } = useAuthorization();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Obtener todos los productos sin paginación (para administración)
        const data = await getProducts(1, 1000);
        setProducts(data.data);
        setError('');
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleProductUpdated = (updatedProduct) => {
    if (selectedProduct) {
      setProducts(products.map(p => p.producto_id === updatedProduct.producto_id ? updatedProduct : p));
    } else {
      setProducts([...products, updatedProduct]);
    }
    handleCloseForm();
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(p => p.producto_id !== productId));
      } catch (err) {
        setError('Error al eliminar el producto');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <ErrorAlert message="No tienes permiso para acceder a esta sección" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <button
          onClick={handleAddProduct}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg"
        >
          Agregar Producto
        </button>
      </div>
      
      {error && <ErrorAlert message={error} />}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.producto_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                      <div className="text-sm text-gray-500">ID: {product.producto_id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(product.precio)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.producto_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            <ProductForm 
              product={selectedProduct} 
              onSave={handleProductUpdated} 
              onCancel={handleCloseForm} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;