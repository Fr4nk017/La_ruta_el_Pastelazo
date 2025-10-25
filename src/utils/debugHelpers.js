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

// Exposer funciones globalmente para debugging
if (typeof window !== 'undefined') {
  window.resetLocalStorage = resetLocalStorage;
  window.checkLocalStorageStatus = checkLocalStorageStatus;
}