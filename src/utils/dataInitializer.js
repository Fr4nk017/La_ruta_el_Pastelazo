// Script para inicializar datos por defecto - La Ruta el Pastelazo
import { generateId } from '../utils';

export const initializeDefaultData = () => {
  // Verificar si ya existen usuarios
  const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  
  // Si no hay usuarios, crear usuario administrador por defecto
  if (existingUsers.length === 0) {
    const defaultAdmin = {
      id: generateId(),
      email: 'gusty@admin.com',
      password: 'admin123', // En producción, esto debería estar hasheado
      firstName: 'Gustavo',
      lastName: 'Gutierrez',
      phone: '+56912345678',
      role: 'admin',
      permissions: [
        'view_products',
        'place_orders', 
        'manage_users',
        'manage_products',
        'view_reports',
        'manage_system',
        'update_prices',
        'add_products',
        'delete_products'
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      preferences: {
        newsletter: true,
        promotions: true
      }
    };

    const defaultWorker = {
      id: generateId(),
      email: 'trabajador@larutaelpastelazo.cl',
      password: 'worker123',
      firstName: 'Francisco',
      lastName: 'Levipil',
      phone: '+56987654321',
      role: 'trabajador',
      permissions: [
        'view_products',
        'place_orders',
        'manage_orders',
        'view_inventory',
        'update_order_status',
        'manage_products',
        'update_prices',
        'add_products'
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      preferences: {
        newsletter: true,
        promotions: false
      }
    };

    const defaultClient = {
      id: generateId(),
      email: 'cliente@larutaelpastelazo.cl',
      password: 'client123',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+56945678912',
      role: 'cliente',
      permissions: [
        'view_products',
        'place_orders',
        'view_own_orders',
        'update_profile'
      ],
      isActive: true,
      createdAt: new Date().toISOString(),
      preferences: {
        newsletter: true,
        promotions: true
      }
    };

    const defaultUsers = [defaultAdmin, defaultWorker, defaultClient];
    
    localStorage.setItem('registered_users', JSON.stringify(defaultUsers));
    
    console.log('Usuarios por defecto creados:');
    console.log('Admin: gusty@admin.com / admin123');
    console.log('Trabajador: trabajador@larutaelpastelazo.cl / worker123');
    console.log('Cliente: cliente@larutaelpastelazo.cl / client123');
    
    return defaultUsers;
  }
  
  return existingUsers;
};

// Función para resetear datos (útil para desarrollo)
export const resetAllData = () => {
  const confirmed = window.confirm(
    '¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.'
  );
  
  if (confirmed) {
    localStorage.removeItem('registered_users');
    localStorage.removeItem('current_user');
    localStorage.removeItem('cart_items');
    localStorage.removeItem('user_preferences');
    
    // Reinicializar con datos por defecto
    initializeDefaultData();
    
    // Recargar la página
    window.location.reload();
  }
};

// Función para exportar datos (útil para backup)
export const exportUserData = () => {
  const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
  
  const exportData = {
    users,
    currentUser,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `pastelazo-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

// Función para importar datos
export const importUserData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (importData.users && Array.isArray(importData.users)) {
          localStorage.setItem('registered_users', JSON.stringify(importData.users));
          
          if (importData.currentUser) {
            localStorage.setItem('current_user', JSON.stringify(importData.currentUser));
          }
          
          console.log(`Importados ${importData.users.length} usuarios exitosamente`);
          resolve(importData.users);
        } else {
          throw new Error('Formato de archivo inválido');
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
};