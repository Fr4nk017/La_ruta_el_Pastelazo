/**
 * Formatea un precio en pesos chilenos (CLP)
 * @param {number} price - El precio a formatear
 * @returns {string} El precio formateado
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);
};

/**
 * Formatea un número como moneda sin el símbolo
 * @param {number} value - El valor a formatear
 * @returns {string} El valor formateado
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CL').format(value);
};
