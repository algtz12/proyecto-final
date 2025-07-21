import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createSale } from '../../services/saleService';
import { formatCurrency } from '../../utils/helpers';
import { calculateTotalWithTaxes } from '../../utils/helpers';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, calculateTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const subtotal = calculateTotal();
  const taxes = subtotal * 0.16;
  const total = calculateTotalWithTaxes(subtotal);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!shippingAddress) {
      setError('Por favor ingresa la dirección de envío');
      setLoading(false);
      return;
    }
    
    try {
      const saleData = {
        clienteId: currentUser.id,
        items: cart.items.map(item => ({
          productoId: item.productoId,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario
        })),
        metodoPago: paymentMethod,
        direccionEnvio: shippingAddress
      };
      
      await createSale(saleData);
      clearCart();
      navigate('/sales/success');
    } catch (err) {
      setError('Error al procesar la venta');
    } finally {
      setLoading(false);
    }
  };
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6">
          No hay productos para procesar el pago.
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
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('tarjeta')}
                className={`py-4 px-4 border rounded-lg text-center ${
                  paymentMethod === 'tarjeta'
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-300'
                }`}
              >
                Tarjeta de Crédito
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`py-4 px-4 border rounded-lg text-center ${
                  paymentMethod === 'paypal'
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-300'
                }`}
              >
                PayPal
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('transferencia')}
                className={`py-4 px-4 border rounded-lg text-center ${
                  paymentMethod === 'transferencia'
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-300'
                }`}
              >
                Transferencia
              </button>
            </div>
            
            {paymentMethod === 'tarjeta' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Datos de la Tarjeta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Nombre en la tarjeta"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Dirección de Envío</h3>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Ingresa la dirección completa de envío"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
            
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
            
            {error && <ErrorAlert message={error} />}
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg text-center transition disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Confirmar Compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;