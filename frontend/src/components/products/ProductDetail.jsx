import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { useCart } from '../../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setError('');
      } catch (err) {
        setError('Error al cargar el producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, cantidad: quantity });
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

  if (!product) {
    return <div className="text-center py-12">Producto no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-6">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
          </div>
          
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl font-bold mb-2">{product.nombre}</h1>
            <p className="text-primary text-2xl font-bold mb-4">
              {formatCurrency(product.precio)}
            </p>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700">{product.descripcion}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Detalles</h2>
              <ul className="text-gray-700">
                <li><strong>ID:</strong> {product.producto_id}</li>
                <li><strong>Categoría:</strong> {product.categoria_id}</li>
                <li><strong>Stock:</strong> {product.stock} unidades</li>
                <li><strong>Fecha creación:</strong> {product.fecha_creacion}</li>
              </ul>
            </div>
            
            <div className="flex items-center mb-6">
              <label className="mr-3 font-medium">Cantidad:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}

                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
              />
              <span className="ml-2 text-gray-500">Máx: {product.stock}</span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition"
            >
              Agregar al Carrito
            </button>
            
            <div className="mt-4 flex justify-center">
              <Link 
                to="/products" 
                className="text-blue-600 hover:text-blue-800"
              >
                Volver a productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;