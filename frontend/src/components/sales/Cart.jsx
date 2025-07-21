import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { calculateTotalWithTaxes } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const Cart = () => {
  const { 
    cart, 
    loading, 
    updateCartItem, 
    removeFromCart,
    calculateTotal,
    itemCount
  } = useCart();
  
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState('');
  
  const subtotal = calculateTotal();
  const taxes = subtotal * 0.16;
  const total = subtotal + taxes;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setUpdating({ ...updating, [itemId]: true });
    setError('');
    
    try {
      await updateCartItem(itemId, newQuantity);
    } catch (err) {
      setError('Error al actualizar el carrito');
    } finally {
      setUpdating({ ...updating, [itemId]: false });
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating({ ...updating, [itemId]: true });
    setError('');
    
    try {
      await removeFromCart(itemId);
    } catch (err) {
      setError('Error al eliminar el producto');
    } finally {
      setUpdating({ ...updating, [itemId]: false });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6">
          Explora nuestros productos y añade algo especial a tu carrito.
        </p>
        <Link 
          to="/products" 
          className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Ver Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>
      
      {error && <ErrorAlert message={error} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
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
                      Cantidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.nombre}</div>
                            <div className="text-sm text-gray-500">ID: {item.productoId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.precioUnitario)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {updating[item._id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value) || 1;
                              handleUpdateQuantity(item._id, newQuantity);
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.precioUnitario * item.cantidad)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={updating[item._id]}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos (16%):</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-3 mt-3">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout"
              className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg text-center transition"
            >
              Proceder al Pago
            </Link>
            
            <div className="mt-4 text-center">
              <Link 
                to="/products" 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;