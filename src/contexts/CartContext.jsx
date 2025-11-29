/* eslint-disable react-refresh/only-export-components */
// Context del carrito de compras - La Ruta el Pastelazo
import { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
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

  // TEMPORAL: Deshabilitar limpieza automática para debugging
  useEffect(() => {
    console.log('🔍 Cart useEffect - Current cart:', cart);
    
    const hasOldProducts = cart.some(item => 
      typeof item.id === 'string' && 
      !item.id.match(/^[0-9a-fA-F]{24}$/) && 
      !item._id // No tiene _id de MongoDB
    );
    
    if (hasOldProducts) {
      console.log('🧹 Detected old products in cart, but NOT clearing for debugging...');
      console.log('🔍 Old products detected:', cart.filter(item => 
        typeof item.id === 'string' && 
        !item.id.match(/^[0-9a-fA-F]{24}$/) && 
        !item._id
      ));
      // setCart([]); // Comentado temporalmente
    } else {
      console.log('✅ No old products detected in cart');
    }
  }, []); // Solo ejecutar una vez al montar el componente

  // Test function para debugging
  const testAdd = useCallback(() => {
    console.log('🧪 Test add function called');
    const uniqueId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const testProduct = {
      _id: uniqueId,
      id: uniqueId,
      name: `Producto de Prueba ${new Date().toLocaleTimeString()}`,
      price: 10000,
      image: "test.jpg",
      qty: 1
    };
    
    console.log('🧪 Adding test product:', testProduct);
    
    setCart(currentCart => {
      console.log('🧪 Current cart before test add:', currentCart);
      const newCart = [...currentCart, testProduct];
      console.log('🧪 New cart after test add:', newCart);
      return newCart;
    });
  }, []);

  // Agregar producto al carrito
  const add = useCallback((product) => {
    console.log('🛒 Adding product to cart:', product);
    
    setCart(currentCart => {
      console.log('🛒 Current cart before adding:', currentCart);
      
      const existingIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (existingIndex > -1) {
        const updatedCart = [...currentCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          qty: updatedCart[existingIndex].qty + 1
        };
        console.log('🛒 Updated existing item, new cart:', updatedCart);
        return updatedCart;
      }
      
      const newCart = [...currentCart, { ...product, qty: 1 }];
      console.log('🛒 Added new item, new cart:', newCart);
      return newCart;
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
    testAdd,
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
    testAdd,
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
