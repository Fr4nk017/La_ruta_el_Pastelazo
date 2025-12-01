// Context de autenticación - La Ruta el Pastelazo
import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  // Limpiar usuarios locales antiguos al cargar el contexto (solo una vez)
  // Esto evita confusión: ahora el registro es solo vía backend, no localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('registered_users');
  }
  const [user, setUser] = useLocalStorage('current_user', null);
  const [users, setUsers] = useLocalStorage('registered_users', []);
  const [isLoading, setIsLoading] = useState(false);

  // Registrar nuevo usuario usando la API real del backend
  // Antes: este método solo guardaba usuarios en localStorage, por eso el registro fallaba y no se creaba el usuario en MongoDB.
  // Ahora: hace una petición POST a /api/auth/register y maneja la respuesta del backend.
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Ajusta la URL según tu entorno (puede ser /api/auth/register si usas proxy en dev, o http://localhost:3001/api/auth/register)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        // El backend devuelve status 400/409/500 con mensaje
        throw new Error(data.message || 'Error al registrar usuario');
      }

      // El backend responde con { success, user, token, ... }
      const userSession = {
        id: data.user._id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phone: data.user.phone,
        role: data.user.role,
        permissions: data.user.permissions,
        isActive: data.user.isActive,
        preferences: data.user.preferences
      };

      setUser(userSession); // Guarda la sesión en localStorage
      setIsLoading(false);
      return { success: true, user: userSession };
    } catch (error) {
      setIsLoading(false);
      // Devuelve el mensaje de error del backend o error de red
      return { success: false, error: error.message };
    }
  };

  // Iniciar sesión
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const { email, password } = credentials;
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        throw new Error('Email o contraseña incorrectos');
      }

      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        phone: foundUser.phone,
        role: foundUser.role,
        permissions: foundUser.permissions,
        isActive: foundUser.isActive,
        preferences: foundUser.preferences
      };

      setUser(userSession);
      setIsLoading(false);
      return { success: true, user: userSession };
      
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
  };

  // Actualizar perfil
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'No hay sesión activa' };
    
    try {
      // Actualizar en la lista de usuarios
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id ? { ...u, ...updates } : u
        )
      );
      
      // Actualizar sesión actual
      setUser(prevUser => ({ ...prevUser, ...updates }));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Funciones para gestión de roles y permisos
  const hasRole = (allowedRoles) => {
    if (!user || !user.role) return false;
    if (typeof allowedRoles === 'string') return user.role === allowedRoles;
    return allowedRoles.includes(user.role);
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const isAdmin = () => hasRole('admin');
  const isWorker = () => hasRole('trabajador');
  const isClient = () => hasRole('cliente');

  // Crear usuario (solo para admins)
  const createUser = async (userData) => {
    if (!isAdmin()) {
      return { success: false, error: 'No tienes permisos para crear usuarios' };
    }

    try {
      const { email, password, firstName, lastName, phone, role = 'cliente' } = userData;
      
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Definir permisos según el rol
      let permissions = [];
      switch (role) {
        case 'admin':
          permissions = [
            'view_products', 
            'place_orders', 
            'manage_users', 
            'manage_products', 
            'view_reports', 
            'manage_system',
            'update_prices',
            'add_products',
            'delete_products'
          ];
          break;
        case 'trabajador':
          permissions = [
            'view_products', 
            'place_orders', 
            'manage_orders', 
            'view_inventory',
            'update_order_status',
            'manage_products',
            'update_prices',
            'add_products'
          ];
          break;
        default:
          permissions = ['view_products', 'place_orders', 'view_own_orders', 'update_profile'];
      }

      const newUser = {
        id: generateId(),
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
        permissions,
        isActive: true,
        createdAt: new Date().toISOString(),
        preferences: {
          newsletter: true,
          promotions: true
        }
      };

      setUsers(prevUsers => [...prevUsers, newUser]);
      return { success: true, user: newUser };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Actualizar usuario (solo para admins)
  const updateUser = async (userId, updates) => {
    if (!isAdmin()) {
      return { success: false, error: 'No tienes permisos para actualizar usuarios' };
    }

    try {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u
        )
      );

      // Si se está actualizando el usuario actual, actualizar también la sesión
      if (userId === user?.id) {
        setUser(prevUser => ({ ...prevUser, ...updates }));
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Eliminar usuario (solo para admins)
  const deleteUser = async (userId) => {
    if (!isAdmin()) {
      return { success: false, error: 'No tienes permisos para eliminar usuarios' };
    }

    if (userId === user?.id) {
      return { success: false, error: 'No puedes eliminar tu propio usuario' };
    }

    try {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    users,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    hasRole,
    hasPermission,
    isAdmin,
    isWorker,
    isClient,
    createUser,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}