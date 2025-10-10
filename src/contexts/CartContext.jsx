/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext(null);
export const useCart = ()=> useContext(CartContext);

export function CartProvider({ children }){
  const [cart, setCart] = useLocalStorage('ms_cart', []);
  const [, setOrders] = useLocalStorage('ms_orders', []);

  const add = useCallback((p)=> setCart(c=>{
    const i = c.findIndex(x=>x.id===p.id);
    if(i>-1){ const copy=[...c]; copy[i]={...copy[i], qty:copy[i].qty+1}; return copy; }
    return [...c, {...p, qty:1}];
  }), [setCart]);

  const dec = useCallback((id)=> setCart(c=> {
    return c.flatMap(x => {
      if (x.id !== id) return [x];
      if (x.qty > 1) return [{ ...x, qty: x.qty - 1 }];
      return [];
    });
  }), [setCart]);

  const remove = useCallback((id)=> setCart(c=> c.filter(x=>x.id!==id)), [setCart]);
  const clear = useCallback(()=> setCart([]), [setCart]);

  const checkout = useCallback(({ fecha, hora, metodo='whatsapp', comuna=null, cupon=null }={})=>{
    if(!cart.length) return null;
    const id = 'ORD-' + Date.now();
    const order = {
      id,
      createdAt: new Date().toISOString(),
      items: cart,
      fecha,
      hora,
      metodo,
      comuna,
      cupon,
    };
    setOrders(o=> [...o, order]);
    setCart([]);
    return id;
  }, [cart, setCart, setOrders]);

  const summary = useMemo(()=>{
    const count = cart.reduce((a,b)=>a+b.qty,0);
    const total = cart.reduce((a,b)=>a+b.qty*b.price,0);
    return { count, total };
  }, [cart]);

  const value = useMemo(() => ({ cart, add, dec, remove, clear, checkout, summary }), [cart, add, dec, remove, clear, checkout, summary]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
