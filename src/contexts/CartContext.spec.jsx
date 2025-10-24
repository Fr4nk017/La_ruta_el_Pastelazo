import React from 'react';
import { render, act } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';

// Componente de prueba que usa el contexto
import PropTypes from 'prop-types';

const TestComponent = ({ onRender }) => {
  const cart = useCart();
  onRender(cart);
  return null;
};

TestComponent.propTypes = {
  onRender: PropTypes.func.isRequired
};

describe('CartContext', () => {
  // Mock de productos para pruebas
  const mockProduct1 = {
    id: 1,
    name: 'Pastel de Chocolate',
    price: 25000,
  };

  const mockProduct2 = {
    id: 2,
    name: 'Torta Tres Leches',
    price: 30000,
  };

  let renderedCart;
  let onRender;

  beforeEach(() => {
    // Limpiamos localStorage antes de cada prueba
    localStorage.clear();

    // Creamos un spy para capturar el estado del carrito
    onRender = jasmine.createSpy('onRender').and.callFake((cart) => {
      renderedCart = cart;
    });

    // Renderizamos el componente de prueba
    render(
      <CartProvider>
        <TestComponent onRender={onRender} />
      </CartProvider>
    );
  });

  describe('estado inicial', () => {
    it('debería iniciar con el carrito vacío', () => {
      expect(renderedCart.cart).toEqual([]);
      expect(renderedCart.summary.isEmpty).toBeTrue();
      expect(renderedCart.summary.count).toBe(0);
      expect(renderedCart.summary.total).toBe(0);
    });
  });

  describe('agregar productos', () => {
    it('debería agregar un nuevo producto al carrito', () => {
      act(() => {
        renderedCart.add(mockProduct1);
      });

      expect(renderedCart.cart.length).toBe(1);
      expect(renderedCart.cart[0]).toEqual({
        ...mockProduct1,
        qty: 1
      });
      expect(renderedCart.summary.count).toBe(1);
      expect(renderedCart.summary.total).toBe(25000);
    });

    it('debería incrementar la cantidad si el producto ya existe', () => {
      act(() => {
        renderedCart.add(mockProduct1);
        renderedCart.add(mockProduct1);
      });

      expect(renderedCart.cart.length).toBe(1);
      expect(renderedCart.cart[0].qty).toBe(2);
      expect(renderedCart.summary.count).toBe(2);
      expect(renderedCart.summary.total).toBe(50000);
    });

    it('debería mantener productos separados', () => {
      act(() => {
        renderedCart.add(mockProduct1);
        renderedCart.add(mockProduct2);
      });

      expect(renderedCart.cart.length).toBe(2);
      expect(renderedCart.summary.count).toBe(2);
      expect(renderedCart.summary.total).toBe(55000);
    });
  });

  describe('modificar cantidades', () => {
    beforeEach(() => {
      act(() => {
        renderedCart.add(mockProduct1);
        renderedCart.add(mockProduct2);
      });
    });

    it('debería incrementar la cantidad de un producto', () => {
      act(() => {
        renderedCart.inc(mockProduct1.id);
      });

      expect(renderedCart.getItemQuantity(mockProduct1.id)).toBe(2);
      expect(renderedCart.summary.count).toBe(3);
    });

    it('debería decrementar la cantidad de un producto', () => {
      act(() => {
        renderedCart.add(mockProduct1);
        renderedCart.dec(mockProduct1.id);
      });

      expect(renderedCart.getItemQuantity(mockProduct1.id)).toBe(1);
    });

    it('debería eliminar el producto cuando la cantidad llega a cero', () => {
      act(() => {
        renderedCart.dec(mockProduct1.id);
      });

      expect(renderedCart.isInCart(mockProduct1.id)).toBeFalse();
    });
  });

  describe('eliminar productos', () => {
    beforeEach(() => {
      act(() => {
        renderedCart.add(mockProduct1);
        renderedCart.add(mockProduct2);
      });
    });

    it('debería eliminar un producto específico', () => {
      act(() => {
        renderedCart.remove(mockProduct1.id);
      });

      expect(renderedCart.cart.length).toBe(1);
      expect(renderedCart.isInCart(mockProduct1.id)).toBeFalse();
      expect(renderedCart.isInCart(mockProduct2.id)).toBeTrue();
    });

    it('debería limpiar todo el carrito', () => {
      act(() => {
        renderedCart.clear();
      });

      expect(renderedCart.cart).toEqual([]);
      expect(renderedCart.summary.isEmpty).toBeTrue();
      expect(renderedCart.summary.count).toBe(0);
      expect(renderedCart.summary.total).toBe(0);
    });
  });

  describe('persistencia', () => {
    it('debería persistir el carrito en localStorage', () => {
      act(() => {
        renderedCart.add(mockProduct1);
      });

      // Verificamos el localStorage
      const stored = JSON.parse(localStorage.getItem('cart'));
      expect(stored).toBeDefined();
      expect(stored.length).toBe(1);
      expect(stored[0]).toEqual({
        ...mockProduct1,
        qty: 1
      });
    });

    it('debería recuperar el carrito desde localStorage', () => {
      // Simulamos un carrito existente en localStorage
      const existingCart = [{
        ...mockProduct1,
        qty: 2
      }];
      localStorage.setItem('cart', JSON.stringify(existingCart));

      // Re-renderizamos el componente
      render(
        <CartProvider>
          <TestComponent onRender={onRender} />
        </CartProvider>
      );

      expect(renderedCart.cart).toEqual(existingCart);
      expect(renderedCart.summary.count).toBe(2);
    });
  });

  describe('utilidades', () => {
    beforeEach(() => {
      act(() => {
        renderedCart.add(mockProduct1);
        renderedCart.add(mockProduct1);
      });
    });

    it('debería verificar si un producto está en el carrito', () => {
      expect(renderedCart.isInCart(mockProduct1.id)).toBeTrue();
      expect(renderedCart.isInCart(mockProduct2.id)).toBeFalse();
    });

    it('debería obtener la cantidad de un producto', () => {
      expect(renderedCart.getItemQuantity(mockProduct1.id)).toBe(2);
      expect(renderedCart.getItemQuantity(mockProduct2.id)).toBe(0);
    });
  });
});