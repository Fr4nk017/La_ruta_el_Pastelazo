import { formatPrice } from '../utils/currency';

describe('formatPrice', () => {
  it('debería formatear 0 correctamente', () => {
    expect(formatPrice(0)).toBe('$0');
  });

  it('debería formatear números enteros correctamente', () => {
    expect(formatPrice(1000)).toBe('$1.000');
    expect(formatPrice(25000)).toBe('$25.000');
    expect(formatPrice(999999)).toBe('$999.999');
  });

  it('debería redondear números decimales', () => {
    expect(formatPrice(12990.5)).toBe('$12.991');
    expect(formatPrice(9999.1)).toBe('$9.999');
    expect(formatPrice(1500.8)).toBe('$1.501');
  });

  it('debería manejar números grandes correctamente', () => {
    expect(formatPrice(1000000)).toBe('$1.000.000');
    expect(formatPrice(2500500)).toBe('$2.500.500');
  });

  it('debería manejar valores negativos', () => {
    expect(formatPrice(-1000)).toBe('-$1.000');
    expect(formatPrice(-25000.5)).toBe('-$25.001');
  });

  it('debería manejar valores inválidos', () => {
    expect(formatPrice(null)).toBe('$0');
    expect(formatPrice(undefined)).toBe('$0');
    expect(formatPrice(Number.NaN)).toBe('$0');
    expect(formatPrice('1000')).toBe('$0');
    expect(formatPrice({})).toBe('$0');
  });

  describe('formato chileno', () => {
    it('debería usar punto como separador de miles', () => {
      const formatted = formatPrice(1234567);
      expect(formatted).toMatch(/\d{1,3}(\.\d{3})+$/);
    });

    it('debería mostrar el símbolo $ al inicio', () => {
      const formatted = formatPrice(1000);
      expect(formatted.startsWith('$')).toBeTrue();
    });

    it('no debería mostrar decimales', () => {
      const formatted = formatPrice(1000.99);
      expect(formatted).not.toContain(',');
      expect(formatted).toBe('$1.001');
    });
  });

  describe('rendimiento', () => {
    it('debería manejar muchas llamadas rápidas', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        formatPrice(i * 1000);
      }
      const end = performance.now();
      const duration = end - start;
      
      // La operación debería tomar menos de 100ms para 1000 llamadas
      expect(duration).toBeLessThan(100);
    });
  });
});