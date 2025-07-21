import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCart, 
  addToCart as addToCartService, 
  updateCartItem as updateCartItemService,
  removeFromCart as removeFromCartService
} from '../services/saleService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar carrito al iniciar
  const initializeCart = async (userId) => {
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar al carrito
  const addToCart = async (product) => {
    const item = {
      productoId: product.producto_id,
      nombre: product.nombre,
      cantidad: 1,
      precioUnitario: product.precio
    };

    try {
      const updatedCart = await addToCartService(item);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Actualizar cantidad
  const updateCartItem = async (itemId, quantity) => {
    try {
      const updatedCart = await updateCartItemService(itemId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  // Eliminar del carrito
  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = await removeFromCartService(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // Calcular total
  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce(
      (total, item) => total + (item.precioUnitario * item.cantidad), 
      0
    );
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      calculateTotal,
      itemCount: cart ? cart.items.length : 0,
      initializeCart // Exportamos esta función para que pueda ser llamada después de login
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);