import { useState, useEffect } from 'react';

/**
 * Hook para cargar imágenes con lazy loading optimizado
 * @param {string} src - URL de la imagen
 * @param {string} placeholder - URL de placeholder opcional
 * @returns {object} Estado de la imagen y URL a usar
 */
export const useOptimizedImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return {
    src: imageSrc,
    isLoading,
    hasError,
  };
};

/**
 * Hook para detectar si un elemento está visible en el viewport
 * Útil para lazy loading manual
 * @param {object} ref - Referencia al elemento DOM
 * @param {object} options - Opciones de IntersectionObserver
 * @returns {boolean} Si el elemento es visible
 */
export const useInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isInView;
};

export default { useOptimizedImage, useInView };
