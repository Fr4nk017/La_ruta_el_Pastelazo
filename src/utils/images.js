// Utilidades para manejo de imágenes - La Ruta el Pastelazo

/**
 * Codifica la URL de una imagen para evitar problemas con caracteres especiales
 * @param {string} imagePath - Ruta de la imagen
 * @returns {string} URL codificada
 */
export const encodeImagePath = (imagePath) => {
  if (!imagePath) return '/imagenes/placeholder.svg';
  
  // Dividir la ruta en partes
  const pathParts = imagePath.split('/');
  
  // Codificar solo el nombre del archivo (última parte)
  const fileName = pathParts[pathParts.length - 1];
  const encodedFileName = encodeURIComponent(fileName);
  
  // Reconstruir la ruta
  pathParts[pathParts.length - 1] = encodedFileName;
  
  return pathParts.join('/');
};

/**
 * Obtiene la URL de una imagen con fallback
 * @param {string} imagePath - Ruta de la imagen
 * @returns {string} URL de la imagen o placeholder
 */
export const getImageUrl = (imagePath) => {
  try {
    return encodeImagePath(imagePath);
  } catch (error) {
    console.warn('Error al procesar imagen:', imagePath, error);
    return '/imagenes/placeholder.svg';
  }
};

/**
 * Maneja el error de carga de imagen
 * @param {Event} event - Evento de error
 */
export const handleImageError = (event) => {
  if (event.target.src !== '/imagenes/placeholder.svg') {
    event.target.src = '/imagenes/placeholder.svg';
  }
};