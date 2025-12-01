import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, usersAPI } from '../services/api';
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
  token: null,
  users: [],
  usersLoading: false
};

// Actions del reducer
const authActions = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  SET_USERS: 'SET_USERS',
  SET_USERS_LOADING: 'SET_USERS_LOADING',
  ADD_USER: 'ADD_USER',
  UPDATE_USER_LIST: 'UPDATE_USER_LIST',
  REMOVE_USER: 'REMOVE_USER'
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

    case authActions.SET_USERS:
      return {
        ...state,
        users: action.payload,
        usersLoading: false
      };

    case authActions.SET_USERS_LOADING:
      return {
        ...state,
        usersLoading: action.payload
      };

    case authActions.ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload]
      };

    case authActions.UPDATE_USER_LIST:
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload._id ? action.payload : user
        )
      };

    case authActions.REMOVE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };

    default:
      return state;
  }
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // =============================
  // Persistencia de sesión (rehidratación)
  // =============================
  // Al montar la app, intenta recuperar el token y usuario de localStorage.
  // Si hay token, llama a /users/profile para validar y obtener el usuario actualizado.
  // Si el token es inválido o expiró, limpia todo y fuerza logout.
  // Esto permite que la sesión NO se pierda al recargar la página.
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      // El usuario guardado puede estar desactualizado, pero lo usamos para mostrar loading rápido
      const savedUser = localStorage.getItem('user');

      if (token) {
        try {
          // Llamar al backend para validar el token y obtener el usuario actualizado
          const profileResponse = await authAPI.getProfile();
          if (profileResponse && profileResponse.data) {
            const userData = profileResponse.data;
            // Guardar usuario actualizado en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            dispatch({
              type: authActions.LOGIN_SUCCESS,
              payload: {
                user: userData,
                token: token
              }
            });
          } else {
            // Token inválido o usuario no encontrado
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            dispatch({ type: authActions.LOGOUT });
          }
        } catch (error) {
          // Error al validar token (expirado, inválido, etc.)
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: authActions.LOGOUT });
        }
      } else {
        // No hay token, marcar como no autenticado
        dispatch({ type: authActions.SET_LOADING, payload: false });
      }
    };
    initializeAuth();
  }, []);

  // =============================
  // Login: guarda token y usuario en localStorage y contexto
  // =============================
  const login = async (credentials) => {
    dispatch({ type: authActions.SET_LOADING, payload: true });
    dispatch({ type: authActions.CLEAR_ERROR });

    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        // Soportar ambas estructuras: response.data o response.data.data
        const userData = response.data?.user || response.user;
        const token = response.data?.token || response.token;
        // Guardar token y usuario en localStorage para persistencia
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
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

  // =============================
  // Logout: limpia token, usuario y estado global
  // =============================
  const logout = async () => {
    dispatch({ type: authActions.SET_LOADING, payload: true });
    try {
      await authAPI.logout();
    } catch (error) {
      // Incluso si falla el logout en el servidor, limpiar datos locales
      console.error('Error al hacer logout:', error);
    } finally {
      // Limpiar localStorage y estado global
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
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

  // =====================
  // Funciones de gestión de usuarios (solo admin)
  // =====================

  // Cargar todos los usuarios
  const loadUsers = async () => {
    if (!isAdmin()) {
      toast.error('No tienes permisos para ver usuarios');
      return { success: false, error: 'Sin permisos' };
    }

    dispatch({ type: authActions.SET_USERS_LOADING, payload: true });

    try {
      const response = await usersAPI.getAll();
      console.log('👥 Users loaded:', response);
      
      // El backend devuelve { message: "...", statusCode: 200, data: { users: [...] } }
      if (response.statusCode === 200 || response.success !== false) {
        const users = response.data?.users || response.users || response.data || [];
        dispatch({
          type: authActions.SET_USERS,
          payload: Array.isArray(users) ? users : []
        });
        return { success: true, users };
      } else {
        throw new Error(response.message || 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('❌ Error loading users:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      dispatch({ type: authActions.SET_USERS_LOADING, payload: false });
      toast.error('Error al cargar usuarios: ' + errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Crear nuevo usuario
  const createUser = async (userData) => {
    if (!isAdmin()) {
      toast.error('No tienes permisos para crear usuarios');
      return { success: false, error: 'Sin permisos' };
    }

    try {
      const response = await usersAPI.create(userData);
      console.log('✅ User created:', response);
      
      if (response.statusCode === 201 || response.success !== false) {
        const newUser = response.data?.user || response.data;
        dispatch({
          type: authActions.ADD_USER,
          payload: newUser
        });
        toast.success('Usuario creado exitosamente');
        return { success: true, user: newUser };
      } else {
        throw new Error(response.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      toast.error('Error al crear usuario: ' + errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Actualizar usuario existente
  const updateUser = async (userId, userData) => {
    if (!isAdmin()) {
      toast.error('No tienes permisos para actualizar usuarios');
      return { success: false, error: 'Sin permisos' };
    }

    console.log('📝 Updating user:', { userId, userData });

    try {
      const response = await usersAPI.update(userId, userData);
      console.log('✅ User updated response:', response);
      
      if (response.statusCode === 200 || response.success !== false) {
        const updatedUser = response.data || response;
        console.log('🔄 Updated user data:', updatedUser);
        
        // Asegurar que tenga _id
        if (updatedUser._id || updatedUser.id) {
          const userWithId = {
            ...updatedUser,
            _id: updatedUser._id || updatedUser.id
          };
          
          dispatch({
            type: authActions.UPDATE_USER_LIST,
            payload: userWithId
          });
          toast.success('Usuario actualizado exitosamente');
          return { success: true, user: userWithId };
        } else {
          throw new Error('Usuario actualizado pero sin ID válido');
        }
      } else {
        throw new Error(response.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('❌ Error updating user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      toast.error('Error al actualizar usuario: ' + errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Eliminar usuario
  const deleteUser = async (userId) => {
    if (!isAdmin()) {
      toast.error('No tienes permisos para eliminar usuarios');
      return { success: false, error: 'Sin permisos' };
    }

    console.log('🗑️ Deleting user:', userId);

    try {
      const response = await usersAPI.delete(userId);
      console.log('✅ User deleted response:', response);
      
      if (response.statusCode === 200 || response.success !== false) {
        // Eliminar el usuario de la lista local
        dispatch({
          type: authActions.REMOVE_USER,
          payload: userId
        });
        toast.success('Usuario eliminado permanentemente');
        return { success: true };
      } else {
        throw new Error(response.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      toast.error('Error al eliminar usuario: ' + errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Valor del contexto
  const value = {
    // Estado
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    token: state.token,
    users: state.users,
    usersLoading: state.usersLoading,

    // Funciones de autenticación
    login,
    register,
    logout,
    updateProfile,
    clearError,

    // Funciones de gestión de usuarios (admin)
    loadUsers,
    createUser,
    updateUser,
    deleteUser,

    // Utilidades
    hasRole,
    hasPermission,
    isAdmin,
    isWorker,
    isClient,
    canAccessDashboard
  };

  // =============================
  // Pruebas manuales recomendadas:
  // 1. Inicia sesión normalmente.
  // 2. Navega a una ruta protegida.
  // 3. Recarga la página (F5).
  // 4. Confirma que sigues autenticado y NO te redirige al login.
  // 5. Haz logout y verifica que se limpia todo correctamente.
  //
  // Notas de seguridad:
  // - Nunca se guarda la contraseña en localStorage.
  // - El token solo se guarda en localStorage para persistencia de sesión.
  // - El usuario se rehidrata siempre desde el backend al cargar la app.
  //
  // =============================
  return (
    <AuthContextAPI.Provider value={value}>
      {children}
    </AuthContextAPI.Provider>
  );
};

export { AuthContextAPI };
export default AuthProvider;