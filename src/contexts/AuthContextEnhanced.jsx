import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos de usuarios simulados
      const users = [
        { 
          id: 1, 
          email: 'admin@pastelazo.com', 
          password: 'admin123', 
          name: 'Administrador', 
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'manage_users', 'manage_products']
        },
        { 
          id: 2, 
          email: 'usuario@pastelazo.com', 
          password: 'user123', 
          name: 'Usuario Regular', 
          role: 'user',
          permissions: ['read']
        },
        { 
          id: 3, 
          email: 'vendedor@pastelazo.com', 
          password: 'vendor123', 
          name: 'Vendedor', 
          role: 'vendor',
          permissions: ['read', 'write', 'manage_products']
        }
      ];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Remover password del objeto usuario
        const { password: _, ...userWithoutPassword } = foundUser;
        const token = `token_${foundUser.id}_${Date.now()}`;
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        
        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', token);
        
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, error: 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Error del servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(user?.role);
    }
    return user?.role === role;
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};