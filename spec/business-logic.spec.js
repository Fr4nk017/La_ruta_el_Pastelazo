// Pruebas Jasmine puras (sin DOM)
describe('Pastelería - Pruebas de Lógica de Negocio', function() {
  
  describe('Cálculos de Precios', function() {
    function calculateDiscount(price, discountPercent) {
      if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('El descuento debe estar entre 0 y 100');
      }
      return price * (1 - discountPercent / 100);
    }

    function calculateTax(price, taxRate = 0.19) {
      return price * taxRate;
    }

    function calculateTotal(price, discountPercent = 0, taxRate = 0.19) {
      const discountedPrice = calculateDiscount(price, discountPercent);
      const tax = calculateTax(discountedPrice, taxRate);
      return discountedPrice + tax;
    }

    it('debería calcular descuentos correctamente', function() {
      expect(calculateDiscount(1000, 10)).toBe(900);
      expect(calculateDiscount(1000, 0)).toBe(1000);
      expect(calculateDiscount(1000, 50)).toBe(500);
    });

    it('debería rechazar descuentos inválidos', function() {
      expect(function() { calculateDiscount(1000, -10); }).toThrow();
      expect(function() { calculateDiscount(1000, 110); }).toThrow();
    });

    it('debería calcular impuestos correctamente', function() {
      expect(calculateTax(1000, 0.19)).toBe(190);
      expect(calculateTax(1000, 0.10)).toBe(100);
    });

    it('debería calcular total con descuento e impuestos', function() {
      // Precio: 1000, Descuento: 10%, Impuesto: 19%
      // 1000 - 100 = 900, 900 * 0.19 = 171, 900 + 171 = 1071
      expect(calculateTotal(1000, 10, 0.19)).toBe(1071);
    });
  });

  describe('Validación de Datos de Productos', function() {
    function validateProduct(product) {
      const errors = [];
      
      if (!product.name || product.name.trim().length === 0) {
        errors.push('Nombre es requerido');
      }
      
      if (!product.price || product.price <= 0) {
        errors.push('Precio debe ser mayor a 0');
      }
      
      if (!product.category || product.category.trim().length === 0) {
        errors.push('Categoría es requerida');
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors
      };
    }

    it('debería validar productos correctos', function() {
      const validProduct = {
        name: 'Torta de Chocolate',
        price: 15000,
        category: 'Tortas'
      };

      const result = validateProduct(validProduct);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('debería detectar productos inválidos', function() {
      const invalidProduct = {
        name: '',
        price: -100,
        category: ''
      };

      const result = validateProduct(invalidProduct);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(3);
      expect(result.errors).toContain('Nombre es requerido');
      expect(result.errors).toContain('Precio debe ser mayor a 0');
      expect(result.errors).toContain('Categoría es requerida');
    });
  });

  describe('Utilidades de Fecha', function() {
    function formatDate(date) {
      return date.toLocaleDateString('es-CL');
    }

    function isWorkingDay(date) {
      const day = date.getDay();
      return day >= 1 && day <= 5; // Lunes a Viernes
    }

    function addBusinessDays(date, days) {
      let result = new Date(date);
      let addedDays = 0;
      
      while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        if (isWorkingDay(result)) {
          addedDays++;
        }
      }
      
      return result;
    }

    it('debería formatear fechas correctamente', function() {
      const date = new Date(2024, 0, 15); // 15 de enero 2024
      expect(formatDate(date)).toContain('2024');
    });

    it('debería identificar días laborales', function() {
      const monday = new Date(2024, 0, 15); // Lunes
      const saturday = new Date(2024, 0, 13); // Sábado
      
      expect(isWorkingDay(monday)).toBe(true);
      expect(isWorkingDay(saturday)).toBe(false);
    });

    it('debería agregar días laborales correctamente', function() {
      const friday = new Date(2024, 0, 12); // Viernes
      const result = addBusinessDays(friday, 1); // +1 día laboral
      
      // El siguiente día laboral después del viernes debería ser lunes
      expect(result.getDay()).toBe(1); // 1 = Lunes
    });
  });

  describe('Algoritmos de Ordenamiento', function() {
    function sortProductsByPrice(products, ascending = true) {
      return products.slice().sort((a, b) => {
        return ascending ? a.price - b.price : b.price - a.price;
      });
    }

    function sortProductsByName(products) {
      return products.slice().sort((a, b) => a.name.localeCompare(b.name));
    }

    it('debería ordenar productos por precio ascendente', function() {
      const products = [
        { name: 'Torta', price: 15000 },
        { name: 'Cupcake', price: 3000 },
        { name: 'Pastel', price: 25000 }
      ];

      const sorted = sortProductsByPrice(products, true);
      
      expect(sorted[0].price).toBe(3000);
      expect(sorted[1].price).toBe(15000);
      expect(sorted[2].price).toBe(25000);
    });

    it('debería ordenar productos por precio descendente', function() {
      const products = [
        { name: 'Torta', price: 15000 },
        { name: 'Cupcake', price: 3000 },
        { name: 'Pastel', price: 25000 }
      ];

      const sorted = sortProductsByPrice(products, false);
      
      expect(sorted[0].price).toBe(25000);
      expect(sorted[1].price).toBe(15000);
      expect(sorted[2].price).toBe(3000);
    });

    it('debería ordenar productos por nombre alfabéticamente', function() {
      const products = [
        { name: 'Torta' },
        { name: 'Cupcake' },
        { name: 'Brownie' }
      ];

      const sorted = sortProductsByName(products);
      
      expect(sorted[0].name).toBe('Brownie');
      expect(sorted[1].name).toBe('Cupcake');
      expect(sorted[2].name).toBe('Torta');
    });
  });
});