// Context de autenticación - La Ruta el Pastelazo
import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('current_user', null);
  const [users, setUsers] = useLocalStorage('registered_users', []);
  const [isLoading, setIsLoading] = useState(false);

  // Registrar nuevo usuario
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const { email, password, firstName, lastName, phone } = userData;
      
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      const newUser = {
        id: generateId(),
        email,
        password, // En producción, esto debería estar hasheado
        firstName,
        lastName,
        phone,
        createdAt: new Date().toISOString(),
        preferences: {
          newsletter: true,
          promotions: true
        }
      };

      setUsers(prevUsers => [...prevUsers, newUser]);
      
      // Crear sesión automáticamente
      const userSession = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        preferences: newUser.preferences
      };
      
      setUser(userSession);
      setIsLoading(false);
      return { success: true, user: userSession };
      
    } catch (error) {
      setIsLoading(false);
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

  const value = {
    user,
    users,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}