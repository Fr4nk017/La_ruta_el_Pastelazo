// Debug helper - ejecutar en consola del navegador

console.log('🔍 Cart Debug Helper Loaded');

// Función para verificar el estado del carrito
window.debugCart = function() {
  console.group('🛒 Cart Debug Info');
  
  // Verificar localStorage
  const cartInStorage = localStorage.getItem('cart');
  console.log('📦 Cart in localStorage:', cartInStorage);
  console.log('📦 Parsed cart:', JSON.parse(cartInStorage || '[]'));
  
  // Verificar context si está disponible
  if (window.React && window.ReactDOM) {
    console.log('⚛️ React context may be available - check components');
  }
  
  // Verificar si hay elementos en el DOM
  const cartBadge = document.querySelector('[data-cart-count]') || 
                   document.querySelector('.badge') || 
                   document.querySelector('[class*="cart"]');
  console.log('🏷️ Cart badge in DOM:', cartBadge);
  
  console.groupEnd();
};

// Función para limpiar carrito
window.clearCart = function() {
  localStorage.removeItem('cart');
  console.log('🧹 Cart cleared from localStorage');
  window.location.reload();
};

// Función para agregar producto de prueba directamente
window.addTestProduct = function() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const testProduct = {
    _id: 'test-' + Date.now(),
    id: 'test-' + Date.now(),
    name: 'Producto Test ' + new Date().toLocaleTimeString(),
    price: Math.floor(Math.random() * 50000) + 10000,
    image: 'test.jpg',
    qty: 1
  };
  
  cart.push(testProduct);
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log('✅ Test product added:', testProduct);
  console.log('📦 New cart:', cart);
  
  // Trigger storage event to update other components
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'cart',
    newValue: JSON.stringify(cart)
  }));
  
  return testProduct;
};

console.log('🎯 Available functions: debugCart(), clearCart(), addTestProduct()');