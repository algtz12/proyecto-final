import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { useCart } from '../../contexts/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(page, perPage);
        setProducts(data.data);
        setPagination(data.pagination);
        setError('');
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.producto_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.nombre}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.descripcion}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary">
                  {formatCurrency(product.precio)}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm"
                >
                  Agregar
                </button>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50">
              <Link 
                to={`/products/${product.producto_id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      )}
      
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-2 rounded-l-md border ${
                page === 1 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            
            {[...Array(pagination.pages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => handlePageChange(idx + 1)}
                className={`px-3 py-2 border-t border-b ${
                  page === idx + 1
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.pages}
              className={`px-3 py-2 rounded-r-md border ${
                page === pagination.pages
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductList;