import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  // Mock de producto para pruebas
  const mockProduct = {
    id: 1,
    name: 'Pastel de Chocolate',
    price: 25000,
    img: '/img/pastel.jpg',
    description: 'Delicioso pastel de chocolate'
  };

  // Mock de la función onAddToCart
  const mockAddToCart = jasmine.createSpy('onAddToCart');

  let container;
  let getByText;
  let getByRole;

  beforeEach(() => {
    // Renderizamos el componente antes de cada prueba
    const renderResult = render(
      <ProductCard 
        product={mockProduct}
        onAddToCart={mockAddToCart}
      />
    );

    // Obtenemos las funciones de utilidad que necesitamos
    container = renderResult.container;
    getByText = renderResult.getByText;
    getByRole = renderResult.getByRole;
  });

  it('debería mostrar el nombre del producto', () => {
    const productName = getByText('Pastel de Chocolate');
    expect(productName).toBeTruthy();
  });

  it('debería mostrar el precio correctamente formateado', () => {
    // Buscamos el precio con el formato $25.000
    const price = getByText('$25.000');
    expect(price).toBeTruthy();
  });

  it('debería tener una imagen con alt text apropiado', () => {
    const image = container.querySelector('img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('Pastel de Chocolate');
    expect(image.src).toContain('pastel.jpg');
  });

  it('debería llamar onAddToCart con el producto correcto al hacer clic en Agregar', () => {
    // Buscamos el botón de agregar
    const addButton = getByRole('button');
    
    // Hacemos clic en el botón
    fireEvent.click(addButton);

    // Verificamos que se llamó la función con el producto correcto
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar la descripción del producto', () => {
    const description = getByText('Delicioso pastel de chocolate');
    expect(description).toBeTruthy();
  });

  it('debería tener las clases de estilo correctas', () => {
    const card = container.querySelector('.card');
    expect(card).toBeTruthy();
    expect(card.classList.contains('h-100')).toBeTrue();
  });

  describe('Comportamiento de hover', () => {
    it('debería tener efecto de hover en la imagen', () => {
      const imageContainer = container.querySelector('.card-img-top');
      expect(imageContainer).toBeTruthy();
      
      // Simulamos el hover
      fireEvent.mouseEnter(imageContainer);
      
      // Verificamos que se aplican las clases o estilos de hover
      // Nota: esto dependerá de cómo esté implementado el efecto de hover
      const image = imageContainer.querySelector('img');
      expect(image).toBeTruthy();
    });
  });

  describe('Accesibilidad', () => {
    it('debería tener el botón de agregar con texto accesible', () => {
      const button = getByRole('button');
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-label')).toBe('Agregar al carrito Pastel de Chocolate');
    });

    it('debería tener estructura semántica correcta', () => {
      const article = container.querySelector('article');
      expect(article).toBeTruthy();
      expect(article.role).toBe('listitem');
    });
  });
});