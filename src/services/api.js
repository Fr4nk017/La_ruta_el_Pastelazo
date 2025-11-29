import axios from 'axios';

// Configuración base de la API (usando variables de entorno de Vite)
const API_ORIGIN = import.meta?.env?.VITE_API_ORIGIN || 'http://localhost:3000';
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || `${API_ORIGIN}/api`;

console.log('🔧 API Configuration:', { API_ORIGIN, API_BASE_URL, env: import.meta.env });

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 API Error:', error);
    
    // Error de red (no hay respuesta del servidor)
    if (!error.response) {
      console.error('❌ Network Error - No response from server');
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
    }
    
    // Error de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// =====================
// Servicios de Autenticación
// =====================
export const authAPI = {
  // Registro de usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    console.log('🔐 Attempting login with:', credentials.email);
    console.log('🌐 Making request to:', `${API_BASE_URL}/auth/login`);
    
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login response received:', response.status);
      
      if (response.data.success) {
        const token = response.data.data?.token || response.data.token;
        const user = response.data.data?.user || response.data.user;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return response.data;
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

// =====================
// Servicios de Productos
// =====================
export const productsAPI = {
  // Obtener todos los productos
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data.data; // Extraer data del response
  },

  // Obtener producto por ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  // Crear producto (admin/trabajador)
  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Actualizar producto (admin/trabajador)
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Eliminar producto (admin)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// =====================
// Servicios de Órdenes
// =====================
export const ordersAPI = {
  // Crear nueva orden
  create: async (orderData) => {
    console.log('🛒 Creating order with data:', orderData);
    console.log('🌐 Making request to:', `${API_BASE_URL}/orders`);
    
    try {
      const response = await api.post('/orders', orderData);
      console.log('✅ Order created successfully:', response.status);
      console.log('📦 Order response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Order creation failed:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Obtener órdenes del usuario
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data.data;
  },

  // Obtener todas las órdenes (admin/trabajador)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/orders?${params.toString()}`);
    return response.data.data;
  },

  // Obtener orden por ID
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  // Actualizar estado de orden (admin/trabajador)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // Cancelar orden
  cancel: async (id) => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  }
};

// =====================
// Servicios de Usuarios (admin)
// =====================
export const usersAPI = {
  // Obtener todos los usuarios
  getAll: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  // Obtener usuario por ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Crear nuevo usuario (admin)
  create: async (userData) => {
    console.log('🆕 Creating user with data:', userData);
    try {
      const response = await api.post('/users', userData);
      console.log('✅ User created successfully:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ User creation failed:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Actualizar usuario
  update: async (id, userData) => {
    console.log('📝 Updating user:', id, 'with data:', userData);
    try {
      const response = await api.put(`/users/${id}`, userData);
      console.log('✅ User updated successfully:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ User update failed:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  },

  // Eliminar usuario
  delete: async (id) => {
    console.log('🗑️ Deleting user:', id);
    try {
      const response = await api.delete(`/users/${id}`);
      console.log('✅ User deleted successfully:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ User deletion failed:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }
};

// =====================
// Utilidades
// =====================
export const utilsAPI = {
  // Health check
  healthCheck: async () => {
    const response = await axios.get(`${API_ORIGIN}/health`);
    return response.data;
  },

  // Estadísticas (admin/trabajador)
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  }
};

export default api;