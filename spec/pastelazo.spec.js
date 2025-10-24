// Pruebas unitarias usando Jasmine para funciones utilitarias
describe('Utilidades de Precios', function() {
  
  // Mock de la función formatPrice
  function formatPrice(price) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }

  describe('formatPrice', function() {
    it('debería formatear precios correctamente', function() {
      expect(formatPrice(1000)).toContain('1.000');
      expect(formatPrice(15000)).toContain('15.000');
      expect(formatPrice(0)).toContain('0');
    });

    it('debería manejar números grandes', function() {
      expect(formatPrice(1000000)).toContain('1.000.000');
    });

    it('debería manejar decimales', function() {
      expect(formatPrice(1500.50)).toBeDefined();
    });
  });
});

describe('Validaciones de Formulario', function() {
  
  // Mock de funciones de validación
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateRequired(value) {
    return value != null && value !== undefined && typeof value === 'string' && value.trim().length > 0;
  }

  describe('validateEmail', function() {
    it('debería validar emails correctos', function() {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
    });

    it('debería rechazar emails incorrectos', function() {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validateRequired', function() {
    it('debería validar campos requeridos', function() {
      expect(validateRequired('texto válido')).toBe(true);
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });
});

describe('Operaciones del Carrito', function() {
  
  // Mock de clase Cart
  function Cart() {
    this.items = [];
  }

  Cart.prototype.addItem = function(item) {
    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({...item, quantity: 1});
    }
  };

  Cart.prototype.removeItem = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  Cart.prototype.getTotal = function() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  Cart.prototype.getItemsCount = function() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  };

  describe('Cart Operations', function() {
    let cart;

    beforeEach(function() {
      cart = new Cart();
    });

    it('debería agregar items al carrito', function() {
      const item = { id: 1, name: 'Torta', price: 15000 };
      cart.addItem(item);
      
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(1);
    });

    it('debería incrementar cantidad si el item ya existe', function() {
      const item = { id: 1, name: 'Torta', price: 15000 };
      cart.addItem(item);
      cart.addItem(item);
      
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
    });

    it('debería remover items del carrito', function() {
      const item = { id: 1, name: 'Torta', price: 15000 };
      cart.addItem(item);
      cart.removeItem(1);
      
      expect(cart.items.length).toBe(0);
    });

    it('debería calcular el total correctamente', function() {
      cart.addItem({ id: 1, name: 'Torta', price: 15000 });
      cart.addItem({ id: 2, name: 'Cupcake', price: 3000 });
      
      expect(cart.getTotal()).toBe(18000);
    });

    it('debería contar items correctamente', function() {
      cart.addItem({ id: 1, name: 'Torta', price: 15000 });
      cart.addItem({ id: 1, name: 'Torta', price: 15000 }); // quantity = 2
      cart.addItem({ id: 2, name: 'Cupcake', price: 3000 }); // quantity = 1
      
      expect(cart.getItemsCount()).toBe(3);
    });
  });
});