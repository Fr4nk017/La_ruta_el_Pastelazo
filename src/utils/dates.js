// Utilidades de fechas
/**
 * Formatea una fecha en español chileno
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha con hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calcula la fecha de entrega estimada
 * @param {number} preparationHours - Horas de preparación
 * @returns {Date} Fecha de entrega
 */
export const calculateDeliveryDate = (preparationHours = 24) => {
  const now = new Date();
  const deliveryDate = new Date(now.getTime() + (preparationHours * 60 * 60 * 1000));
  return deliveryDate;
};

/**
 * Verifica si una fecha es válida para pedidos
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} True si es válida
 */
export const isValidOrderDate = (date) => {
  const orderDate = new Date(date);
  const now = new Date();
  const maxDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días
  
  return orderDate >= now && orderDate <= maxDate;
};