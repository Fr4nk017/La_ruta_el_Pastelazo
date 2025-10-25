/* eslint-disable react-refresh/only-export-components */
// Context del carrito de compras - La Ruta el Pastelazo
import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CART_STORAGE_KEY } from '../constants';
import { generateId } from '../utils/helpers';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage(CART_STORAGE_KEY, []);
  const [orders, setOrders] = useLocalStorage('orders_history', []);

  // Agregar producto al carrito
  const add = useCallback((product) => {
    setCart(currentCart => {
      const existingIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingIndex > -1) {
        const updatedCart = [...currentCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          qty: updatedCart[existingIndex].qty + 1
        };
        return updatedCart;
      }
      
      return [...currentCart, { ...product, qty: 1 }];
    });
  }, [setCart]);

  // Decrementar cantidad de un producto
  const dec = useCallback((id) => {
    setCart(currentCart => {
      return currentCart.flatMap(item => {
        if (item.id !== id) return [item];
        if (item.qty > 1) return [{ ...item, qty: item.qty - 1 }];
        return []; // Eliminar si qty es 1
      });
    });
  }, [setCart]);

  // Incrementar cantidad de un producto
  const inc = useCallback((id) => {
    setCart(currentCart => {
      return currentCart.map(item => 
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      );
    });
  }, [setCart]);

  // Remover producto del carrito
  const remove = useCallback((id) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  }, [setCart]);

  // Limpiar todo el carrito
  const clear = useCallback(() => {
    setCart([]);
  }, [setCart]);

  // Actualizar cantidad específica
  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity <= 0) {
      remove(id);
      return;
    }
    
    setCart(currentCart => {
      return currentCart.map(item => 
        item.id === id ? { ...item, qty: newQuantity } : item
      );
    });
  }, [setCart, remove]);

  // Realizar checkout
  const checkout = useCallback(({ 
    fecha, 
    hora, 
    metodo = 'whatsapp', 
    comuna = null, 
    cupon = null,
    customerInfo = {}
  } = {}) => {
    if (!cart.length) return null;
    
    const orderId = generateId();
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...cart], // Copia del carrito
      fecha,
      hora,
      metodo,
      comuna,
      cupon,
      customerInfo,
      status: 'pending'
    };
    
    setOrders(currentOrders => [...currentOrders, order]);
    setCart([]);
    return orderId;
  }, [cart, setCart, setOrders]);

  // Resumen del carrito
  const summary = useMemo(() => {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const total = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const isEmpty = cart.length === 0;
    
    return { count, total, isEmpty };
  }, [cart]);

  // Verificar si un producto está en el carrito
  const isInCart = useCallback((productId) => {
    return cart.some(item => item.id === productId);
  }, [cart]);

  // Obtener cantidad de un producto en el carrito
  const getItemQuantity = useCallback((productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.qty : 0;
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    orders,
    add,
    dec,
    inc,
    remove,
    clear,
    updateQuantity,
    checkout,
    summary,
    isInCart,
    getItemQuantity
  }), [
    cart,
    orders,
    add,
    dec,
    inc,
    remove,
    clear,
    updateQuantity,
    checkout,
    summary,
    isInCart,
    getItemQuantity
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
