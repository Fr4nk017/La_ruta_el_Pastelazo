
// Utilidades de cálculo de precios - La Ruta el Pastelazo
import { DELIVERY_ZONES } from '../constants/products';

/**
 * Calcula el total de un pedido
 * @param {Array} items - Items del carrito
 * @param {Object} options - Opciones de cálculo
 * @returns {Object} Desglose del total
 */
export function calcOrderTotal(items, { comuna = null, cupon = null } = {}) {
  const subtotal = items.reduce((a, b) => a + b.qty * b.price, 0);
  const envio = comuna ? tarifaPorComuna(comuna) : 0;
  const desc = cupon ? descuentoPorCupon(cupon, subtotal) : 0;
  return { 
    subtotal, 
    envio, 
    desc, 
    total: Math.max(0, subtotal + envio - desc) 
  };
}

/**
 * Calcula tarifa de envío por comuna
 * @param {string} comuna - Comuna de destino
 * @returns {number} Tarifa de envío
 */
function tarifaPorComuna(comuna) {
  const tabla = { 
    santiago: DELIVERY_ZONES.CENTRO.price, 
    providencia: DELIVERY_ZONES.CENTRO.price, 
    nunoa: DELIVERY_ZONES.CENTRO.price, 
    otras: DELIVERY_ZONES.PERIFERIA.price 
  };
  return tabla[comuna] ?? tabla.otras;
}

/**
 * Calcula descuento por cupón
 * @param {string} code - Código del cupón
 * @param {number} subtotal - Subtotal del pedido
 * @returns {number} Monto del descuento
 */
function descuentoPorCupon(code, subtotal) {
  const cupones = { 
    DULCE10: 0.10, 
    PASTEL5: 0.05,
    PRIMERA20: 0.20,
    ESPECIAL15: 0.15
  };
  const pct = cupones[code] ?? 0; 
  return Math.round(subtotal * pct);
}

/**
 * Calcula precio con descuento por cantidad
 * @param {number} price - Precio unitario
 * @param {number} quantity - Cantidad
 * @returns {number} Precio con descuento
 */
export function calcBulkDiscount(price, quantity) {
  let discount = 0;
  if (quantity >= 10) discount = 0.15;
  else if (quantity >= 5) discount = 0.10;
  else if (quantity >= 3) discount = 0.05;
  
  return Math.round(price * quantity * (1 - discount));
}
