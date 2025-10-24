// Pruebas para Karma - JavaScript puro
describe('Karma Testing Framework', function() {
  
  describe('Operaciones Matemáticas', function() {
    function add(a, b) {
      return a + b;
    }
    
    function multiply(a, b) {
      return a * b;
    }
    
    function divide(a, b) {
      if (b === 0) throw new Error('División por cero');
      return a / b;
    }

    it('debería sumar números correctamente', function() {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 0)).toBe(0);
    });

    it('debería multiplicar números correctamente', function() {
      expect(multiply(3, 4)).toBe(12);
      expect(multiply(-2, 5)).toBe(-10);
      expect(multiply(0, 100)).toBe(0);
    });

    it('debería dividir números correctamente', function() {
      expect(divide(10, 2)).toBe(5);
      expect(divide(7, 2)).toBe(3.5);
    });

    it('debería lanzar error al dividir por cero', function() {
      expect(function() { divide(5, 0); }).toThrow();
    });
  });

  describe('Manipulación de Arrays', function() {
    function filterEven(numbers) {
      return numbers.filter(n => n % 2 === 0);
    }
    
    function sumArray(numbers) {
      return numbers.reduce((sum, n) => sum + n, 0);
    }
    
    function findMax(numbers) {
      return Math.max.apply(null, numbers);
    }

    it('debería filtrar números pares', function() {
      expect(filterEven([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
      expect(filterEven([1, 3, 5])).toEqual([]);
      expect(filterEven([])).toEqual([]);
    });

    it('debería sumar elementos de array', function() {
      expect(sumArray([1, 2, 3, 4])).toBe(10);
      expect(sumArray([])).toBe(0);
      expect(sumArray([-1, 1])).toBe(0);
    });

    it('debería encontrar el máximo', function() {
      expect(findMax([1, 5, 3, 9, 2])).toBe(9);
      expect(findMax([-5, -1, -10])).toBe(-1);
    });
  });

  describe('Validaciones de String', function() {
    function isPalindrome(str) {
      const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleaned === cleaned.split('').reverse().join('');
    }
    
    function capitalizeWords(str) {
      return str.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    function countVowels(str) {
      return (str.match(/[aeiou]/gi) || []).length;
    }

    it('debería detectar palíndromos', function() {
      expect(isPalindrome('racecar')).toBe(true);
      expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
      expect(isPalindrome('hello')).toBe(false);
    });

    it('debería capitalizar palabras', function() {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('la ruta el pastelazo')).toBe('La Ruta El Pastelazo');
    });

    it('debería contar vocales', function() {
      expect(countVowels('hello')).toBe(2);
      expect(countVowels('AEIOU')).toBe(5);
      expect(countVowels('xyz')).toBe(0);
    });
  });

  describe('Objetos y Clases', function() {
    function Product(name, price, category) {
      this.name = name;
      this.price = price;
      this.category = category;
    }
    
    Product.prototype.getDiscountedPrice = function(discount) {
      return this.price * (1 - discount / 100);
    };
    
    Product.prototype.toString = function() {
      return this.name + ' - $' + this.price;
    };

    it('debería crear productos correctamente', function() {
      var product = new Product('Torta', 15000, 'Postres');
      
      expect(product.name).toBe('Torta');
      expect(product.price).toBe(15000);
      expect(product.category).toBe('Postres');
    });

    it('debería calcular precio con descuento', function() {
      var product = new Product('Torta', 1000, 'Postres');
      
      expect(product.getDiscountedPrice(10)).toBe(900);
      expect(product.getDiscountedPrice(0)).toBe(1000);
      expect(product.getDiscountedPrice(50)).toBe(500);
    });

    it('debería convertir a string correctamente', function() {
      var product = new Product('Cupcake', 3000, 'Postres');
      
      expect(product.toString()).toBe('Cupcake - $3000');
    });
  });

  describe('Funciones Asíncronas Simuladas', function() {
    function delayedOperation(value, delay, callback) {
      setTimeout(function() {
        callback(null, value * 2);
      }, delay);
    }
    
    it('debería manejar operaciones con callback', function(done) {
      delayedOperation(5, 10, function(error, result) {
        expect(error).toBeNull();
        expect(result).toBe(10);
        done();
      });
    });
  });
});