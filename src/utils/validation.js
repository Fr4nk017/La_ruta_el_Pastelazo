// Utilidades de validación
/**
 * Valida si un email tiene formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un teléfono chileno es válido
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export const isValidChileanPhone = (phone) => {
  const phoneRegex = /^(\+56|56)?[ -]?[9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida si un RUT chileno es válido
 * @param {string} rut - RUT a validar
 * @returns {boolean} True si es válido
 */
export const isValidRUT = (rut) => {
  if (!rut || typeof rut !== 'string') return false;
  
  // Limpiar RUT
  const cleanRut = rut.replace(/[.-]/g, '');
  
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;
  
  const body = cleanRut.slice(0, -1);
  const checkDigit = cleanRut.slice(-1).toLowerCase();
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  const calculatedDigit = remainder < 2 ? remainder.toString() : 'k';
  
  return checkDigit === calculatedDigit;
};

/**
 * Valida si una cantidad es válida
 * @param {number} quantity - Cantidad a validar
 * @returns {boolean} True si es válida
 */
export const isValidQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 100;
};