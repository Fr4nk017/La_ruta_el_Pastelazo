/**
 * Configuración de rendimiento de la aplicación
 */

// Configuración de lazy loading
export const LAZY_LOAD_CONFIG = {
  // Tiempo de delay antes de mostrar el loader (evita flash)
  minLoadingTime: 200,
  // Timeout máximo para carga de chunks
  maxLoadingTime: 10000,
};

// Configuración de imágenes
export const IMAGE_CONFIG = {
  // Lazy loading habilitado por defecto
  loading: 'lazy',
  // Calidad de las imágenes (1-100)
  quality: 85,
  // Tamaños predefinidos para diferentes contextos
  sizes: {
    small: 300,
    medium: 600,
    large: 1200,
  },
};

// Configuración de cache
export const CACHE_CONFIG = {
  // Tiempo de vida del cache en localStorage (ms)
  ttl: 1000 * 60 * 60 * 24, // 24 horas
  // Máximo de items en cache
  maxItems: 100,
};

// Configuración de debounce/throttle
export const TIMING_CONFIG = {
  searchDebounce: 300,
  scrollThrottle: 100,
  resizeDebounce: 250,
};

export default {
  LAZY_LOAD_CONFIG,
  IMAGE_CONFIG,
  CACHE_CONFIG,
  TIMING_CONFIG,
};
