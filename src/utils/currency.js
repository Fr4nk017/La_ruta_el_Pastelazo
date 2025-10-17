// Utilidades de formateo de moneda
import { CURRENCY } from '../constants';

/**
 * Formatea un precio según la configuración regional
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `${CURRENCY.SYMBOL}0`;
  }
  
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatea un número como moneda sin el símbolo
 * @param {number} value - El valor a formatear
 * @returns {string} El valor formateado
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat(CURRENCY.LOCALE).format(value);
};

/**
 * Calcula el precio total con descuentos aplicados
 * @param {number} price - Precio base
 * @param {number} quantity - Cantidad
 * @param {number} discount - Descuento en porcentaje (0-100)
 * @returns {number} Precio total con descuento
 */
export const calculateTotalPrice = (price, quantity = 1, discount = 0) => {
  const subtotal = price * quantity;
  const discountAmount = (subtotal * discount) / 100;
  return subtotal - discountAmount;
};

/**
 * Calcula el precio por tamaño
 * @param {number} basePrice - Precio base
 * @param {number} multiplier - Multiplicador de tamaño
 * @returns {number} Precio calculado
 */
export const calculateSizePrice = (basePrice, multiplier = 1) => {
  return Math.round(basePrice * multiplier);
};
