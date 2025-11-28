import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Hook personalizado para gestionar productos desde la API
 * @param {Object} initialFilters - Filtros iniciales
 * @returns {Object} Estado y funciones para gestionar productos
 */
export const useProducts = (initialFilters = {}) => {
  // Estado
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [categories, setCategories] = useState([]);

  // Cache simple para evitar requests repetidos
  const [cache, setCache] = useState(new Map());

  /**
   * Cargar productos desde la API
   */
  const loadProducts = useCallback(async (newFilters = null) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = newFilters || filters;
      const cacheKey = JSON.stringify(currentFilters);

      // Verificar cache primero
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        // Usar cache si es reciente (menos de 2 minutos)
        if (Date.now() - cachedData.timestamp < 2 * 60 * 1000) {
          setProducts(cachedData.products);
          setCategories(cachedData.categories);
          setLoading(false);
          return cachedData.products;
        }
      }

      // Hacer request a la API
      const response = await productsAPI.getAll(currentFilters);
      
      // El backend devuelve { products: [...], pagination: {...} }
      const productsData = response.products || [];
      
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(productsData.map(p => p.category))];
      const categoriesWithAll = ['Todas las categorías', ...uniqueCategories];

      // Actualizar estado
      setProducts(productsData);
      setCategories(categoriesWithAll);

      // Guardar en cache
      const newCache = new Map(cache);
      newCache.set(cacheKey, {
        products: productsData,
        categories: categoriesWithAll,
        timestamp: Date.now()
      });
      
      // Limpiar cache antiguo (mantener solo últimos 5 items)
      if (newCache.size > 5) {
        const firstKey = newCache.keys().next().value;
        newCache.delete(firstKey);
      }
      
      setCache(newCache);

      return productsData;
    } catch (err) {
      console.error('Error al cargar productos:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar productos';
      setError(errorMessage);
      setProducts([]);
      setCategories(['Todas las categorías']);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [filters, cache]);

  /**
   * Obtener producto por ID
   */
  const getProductById = useCallback(async (id) => {
    try {
      // Buscar primero en productos ya cargados
      const existingProduct = products.find(p => p._id === id || p.id === id);
      if (existingProduct) {
        return existingProduct;
      }

      // Si no está, hacer request individual
      const product = await productsAPI.getById(id);
      return product;
    } catch (err) {
      console.error('Error al obtener producto:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener producto';
      toast.error(errorMessage);
      throw err;
    }
  }, [products]);

  /**
   * Actualizar filtros y recargar productos
   */
  const updateFilters = useCallback(async (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    return await loadProducts(updatedFilters);
  }, [filters, loadProducts]);

  /**
   * Buscar productos por texto
   */
  const searchProducts = useCallback(async (searchTerm) => {
    return await updateFilters({ search: searchTerm, page: 1 });
  }, [updateFilters]);

  /**
   * Filtrar por categoría
   */
  const filterByCategory = useCallback(async (category) => {
    const categoryFilter = category === 'Todas las categorías' ? '' : category;
    return await updateFilters({ category: categoryFilter, page: 1 });
  }, [updateFilters]);

  /**
   * Limpiar filtros
   */
  const clearFilters = useCallback(async () => {
    setFilters({});
    return await loadProducts({});
  }, [loadProducts]);

  /**
   * Refrescar productos (limpiar cache)
   */
  const refreshProducts = useCallback(async () => {
    setCache(new Map()); // Limpiar cache
    return await loadProducts(filters);
  }, [filters, loadProducts]);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []); // Solo ejecutar una vez al montar

  // Información derivada
  const hasProducts = products.length > 0;
  const isEmpty = !loading && products.length === 0;
  const isFiltered = Object.keys(filters).some(key => 
    filters[key] && filters[key] !== '' && filters[key] !== 'Todas las categorías'
  );

  // Funciones para gestión de productos (admin/trabajador)
  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      const response = await productsAPI.create(productData);
      
      if (response.success) {
        await refreshProducts(); // Recargar lista
        toast.success('Producto creado exitosamente');
        return response.data;
      } else {
        throw new Error(response.message || 'Error al crear producto');
      }
    } catch (err) {
      console.error('Error al crear producto:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al crear producto';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      setLoading(true);
      const response = await productsAPI.update(id, productData);
      
      if (response.success) {
        await refreshProducts(); // Recargar lista
        toast.success('Producto actualizado exitosamente');
        return response.data;
      } else {
        throw new Error(response.message || 'Error al actualizar producto');
      }
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar producto';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await productsAPI.delete(id);
      
      if (response.success) {
        await refreshProducts(); // Recargar lista
        toast.success('Producto eliminado exitosamente');
        return true;
      } else {
        throw new Error(response.message || 'Error al eliminar producto');
      }
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar producto';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshProducts]);

  return {
    // Estado
    products,
    loading,
    error,
    filters,
    categories,

    // Acciones principales
    loadProducts,
    refreshProducts,
    updateFilters,
    clearFilters,
    searchProducts,
    filterByCategory,

    // Producto individual
    getProductById,

    // Gestión de productos (admin/trabajador)
    createProduct,
    updateProduct,
    deleteProduct,

    // Información útil
    hasProducts,
    isEmpty,
    isFiltered,

    // Utilidades
    retry: () => loadProducts(filters)
  };
};

// Alias para mantener compatibilidad con imports existentes
export const useProductsAPI = useProducts;