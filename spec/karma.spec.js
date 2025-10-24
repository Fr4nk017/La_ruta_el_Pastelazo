// Pruebas específicas para Karma (testing en navegador)
describe('Pastelería - Pruebas de Integración', function() {
  
  describe('Simulación de DOM', function() {
    let mockElement;

    beforeEach(function() {
      // Crear elementos DOM para testing
      mockElement = document.createElement('div');
      mockElement.id = 'test-container';
      document.body.appendChild(mockElement);
    });

    afterEach(function() {
      // Limpiar después de cada test
      if (mockElement.parentNode) {
        mockElement.parentNode.removeChild(mockElement);
      }
    });

    it('debería poder crear elementos en el DOM', function() {
      const button = document.createElement('button');
      button.textContent = 'Agregar al Carrito';
      button.className = 'btn-primary';
      
      mockElement.appendChild(button);
      
      expect(mockElement.children.length).toBe(1);
      expect(button.textContent).toBe('Agregar al Carrito');
    });

    it('debería poder manejar eventos', function() {
      const button = document.createElement('button');
      let clicked = false;
      
      button.addEventListener('click', function() {
        clicked = true;
      });
      
      mockElement.appendChild(button);
      
      // Simular click
      button.click();
      
      expect(clicked).toBe(true);
    });
  });

  describe('LocalStorage Mock', function() {
    let originalLocalStorage;

    beforeEach(function() {
      // Mock localStorage
      originalLocalStorage = window.localStorage;
      window.localStorage = {
        data: {},
        getItem: function(key) {
          return this.data[key] || null;
        },
        setItem: function(key, value) {
          this.data[key] = value;
        },
        removeItem: function(key) {
          delete this.data[key];
        },
        clear: function() {
          this.data = {};
        }
      };
    });

    afterEach(function() {
      window.localStorage = originalLocalStorage;
    });

    it('debería guardar datos en localStorage', function() {
      const cartData = JSON.stringify([
        { id: 1, name: 'Torta', quantity: 2 }
      ]);
      
      localStorage.setItem('cart', cartData);
      
      expect(localStorage.getItem('cart')).toBe(cartData);
    });

    it('debería recuperar datos de localStorage', function() {
      const cartData = { id: 1, name: 'Torta', quantity: 2 };
      localStorage.setItem('cart', JSON.stringify(cartData));
      
      const retrieved = JSON.parse(localStorage.getItem('cart'));
      
      expect(retrieved.id).toBe(1);
      expect(retrieved.name).toBe('Torta');
      expect(retrieved.quantity).toBe(2);
    });
  });

  describe('Async Operations', function() {
    it('debería manejar operaciones asíncronas', function(done) {
      // Simular envío de formulario asíncrono
      function submitForm(data, callback) {
        setTimeout(function() {
          callback(null, { success: true, id: 123 });
        }, 100);
      }

      const formData = {
        nombre: 'Juan',
        email: 'juan@example.com',
        mensaje: 'Quiero una torta'
      };

      submitForm(formData, function(error, result) {
        expect(error).toBeNull();
        expect(result.success).toBe(true);
        expect(result.id).toBe(123);
        done();
      });
    });

    it('debería manejar promesas', function(done) {
      function fetchProducts() {
        return new Promise(function(resolve) {
          setTimeout(function() {
            resolve([
              { id: 1, name: 'Torta Chocolate', price: 15000 },
              { id: 2, name: 'Cupcake Vainilla', price: 3000 }
            ]);
          }, 50);
        });
      }

      fetchProducts().then(function(products) {
        expect(products.length).toBe(2);
        expect(products[0].name).toBe('Torta Chocolate');
        done();
      });
    });
  });
});