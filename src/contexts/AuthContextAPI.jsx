import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

// Contexto de autenticación que usa API real
const AuthContextAPI = createContext();

// Hook para usar el contexto
export const useAuthAPI = () => {
  const context = useContext(AuthContextAPI);
  if (!context) {
    throw new Error('useAuthAPI debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Estados del reducer
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: null
};

// Actions del reducer
const authActions = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case authActions.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };

    case authActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case authActions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case authActions.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isLoading: false
      };

    default:
      return state;
  }
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay un token guardado al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verificar si el token es válido obteniendo el perfil
          const profileResponse = await authAPI.getProfile();
          if (profileResponse.success) {
            dispatch({
              type: authActions.LOGIN_SUCCESS,
              payload: {
                user: profileResponse.data,
                token: token
              }
            });
          } else {
            // Token inválido, limpiar datos
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            dispatch({ type: authActions.LOGOUT });
          }
        } catch (error) {
          // Error al verificar token, limpiar datos
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: authActions.LOGOUT });
        }
      } else {
        dispatch({ type: authActions.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    dispatch({ type: authActions.SET_LOADING, payload: true });
    dispatch({ type: authActions.CLEAR_ERROR });

    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        // Soportar ambas estructuras: response.data o response.data.data
        const userData = response.data?.user || response.user;
        const token = response.data?.token || response.token;
        
        dispatch({
          type: authActions.LOGIN_SUCCESS,
          payload: {
            user: userData,
            token: token
          }
        });
        
        toast.success(`¡Bienvenido, ${userData.firstName}!`);
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Error de autenticación');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      dispatch({ type: authActions.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función de registro
  const register = async (userData) => {
    dispatch({ type: authActions.SET_LOADING, payload: true });
    dispatch({ type: authActions.CLEAR_ERROR });

    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        // Después del registro exitoso, hacer login automáticamente
        const loginResult = await login({
          email: userData.email,
          password: userData.password
        });
        
        if (loginResult.success) {
          toast.success('¡Cuenta creada exitosamente!');
          return { success: true, user: loginResult.user };
        }
      } else {
        throw new Error(response.message || 'Error al crear cuenta');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      dispatch({ type: authActions.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Función de logout
  const logout = async () => {
    dispatch({ type: authActions.SET_LOADING, payload: true });

    try {
      await authAPI.logout();
    } catch (error) {
      // Incluso si falla el logout en el servidor, limpiar datos locales
      console.error('Error al hacer logout:', error);
    } finally {
      dispatch({ type: authActions.LOGOUT });
      toast.success('Sesión cerrada correctamente');
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (userData) => {
    dispatch({ type: authActions.SET_LOADING, payload: true });
    dispatch({ type: authActions.CLEAR_ERROR });

    try {
      const response = await authAPI.updateProfile(userData);
      
      if (response.success) {
        dispatch({
          type: authActions.UPDATE_USER,
          payload: response.data
        });
        
        // Actualizar datos en localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        
        toast.success('Perfil actualizado correctamente');
        return { success: true, user: response.data };
      } else {
        throw new Error(response.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      dispatch({ type: authActions.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Utilidades para verificar roles y permisos
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const hasPermission = (permission) => {
    return state.user?.permissions?.includes(permission) || false;
  };

  const isAdmin = () => hasRole('admin');
  const isWorker = () => hasRole('trabajador');
  const isClient = () => hasRole('cliente');

  // Verificar si puede acceder al dashboard
  const canAccessDashboard = () => {
    return isAdmin() || isWorker();
  };

  // Limpiar errores
  const clearError = () => {
    dispatch({ type: authActions.CLEAR_ERROR });
  };

  // Valor del contexto
  const value = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    token: state.token,

    // Funciones
    login,
    register,
    logout,
    updateProfile,
    clearError,

    // Utilidades
    hasRole,
    hasPermission,
    isAdmin,
    isWorker,
    isClient,
    canAccessDashboard
  };

  return (
    <AuthContextAPI.Provider value={value}>
      {children}
    </AuthContextAPI.Provider>
  );
};

export { AuthContextAPI };
export default AuthProvider;