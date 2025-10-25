// Script de utilidad para resetear localStorage
export const resetLocalStorage = () => {
  // Limpiar datos existentes
  localStorage.removeItem('current_user');
  localStorage.removeItem('registered_users');
  localStorage.removeItem('products_data');
  localStorage.removeItem('cart_items');
  
  console.log('✅ LocalStorage limpiado correctamente');
  console.log('🔄 Recarga la página para inicializar datos por defecto');
  
  // Opcional: recargar la página automáticamente
  window.location.reload();
};

// Función para verificar el estado actual del localStorage
export const checkLocalStorageStatus = () => {
  const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
  const products = JSON.parse(localStorage.getItem('products_data') || '[]');
  const cart = JSON.parse(localStorage.getItem('cart_items') || '[]');
  
  console.log('📊 Estado del LocalStorage:');
  console.log(`👥 Usuarios registrados: ${users.length}`);
  console.log(`👤 Usuario actual: ${currentUser ? currentUser.email : 'Ninguno'}`);
  console.log(`🍰 Productos: ${products.length}`);
  console.log(`🛒 Carrito: ${cart.length} items`);
  
  if (users.length > 0) {
    console.log('\n🔑 Credenciales disponibles:');
    users.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.password}`);
    });
  }
};

// Función para actualizar email del trabajador
export const updateWorkerEmail = () => {
  const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
  
  // Buscar el usuario trabajador y actualizar su email
  const updatedUsers = users.map(user => {
    if (user.role === 'trabajador') {
      return {
        ...user,
        email: 'obrero@trabajador.com'
      };
    }
    return user;
  });
  
  // Guardar usuarios actualizados
  localStorage.setItem('registered_users', JSON.stringify(updatedUsers));
  
  console.log('✅ Email del trabajador actualizado a: obrero@trabajador.com');
  console.log('📋 Nuevas credenciales:');
  updatedUsers.forEach(user => {
    console.log(`${user.role}: ${user.email} / ${user.password}`);
  });
  
  return updatedUsers;
};

// Exposer funciones globalmente para debugging
if (typeof window !== 'undefined') {
  window.resetLocalStorage = resetLocalStorage;
  window.checkLocalStorageStatus = checkLocalStorageStatus;
  window.updateWorkerEmail = updateWorkerEmail;
}