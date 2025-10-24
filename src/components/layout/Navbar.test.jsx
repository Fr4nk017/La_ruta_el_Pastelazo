import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  let container;
  let utils;

  // Configuración inicial antes de cada prueba
  beforeEach(() => {
    // Instalamos el reloj simulado de Jasmine para manejar temporizadores
    jasmine.clock().install();

    // Renderizamos el componente con el Router
    const utils = render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Desestructuramos las utilidades que necesitamos
    container = utils.container;
    getByTestId = utils.getByTestId;
    queryByRole = utils.queryByRole;
    getByLabelText = utils.getByLabelText;
    getByRole = utils.getByRole;
  });

  // Limpieza después de cada prueba
  afterEach(() => {
    jasmine.clock().uninstall();
  });

  // Prueba 1: Verificar que el Navbar se renderiza correctamente
  it('should render with the correct structure', () => {
    const header = container.querySelector('header');
    expect(header).toBeTruthy();
    expect(header.className).toContain('sticky-top');
  });

  // Prueba 2: Verificar el comportamiento del menú móvil
  it('should toggle mobile menu correctly', () => {
    const toggleButton = getByLabelText('Toggle navigation');
    const navMenu = container.querySelector('.navbar-collapse');

    // Inicialmente el menú debe estar cerrado
    expect(navMenu.classList.contains('show')).toBe(false);

    // Hacemos clic en el botón de toggle
    fireEvent.click(toggleButton);
    jasmine.clock().tick(350); // Esperamos la animación

    // El menú debe estar abierto
    expect(navMenu.classList.contains('show')).toBe(true);
  });

  // Prueba 3: Verificar el comportamiento del modal de login
  it('should handle modal state transitions correctly', () => {
    const loginButton = container.querySelector('[data-testid="auth-login-button"]');

    // Inicialmente no debe haber modal
    expect(queryByRole('dialog')).toBeFalsy();

    // Abrimos el modal de login
    fireEvent.click(loginButton);
    jasmine.clock().tick(100);

    // Debe aparecer el modal
    const modal = queryByRole('dialog');
    expect(modal).toBeTruthy();

    // Cerramos el modal
    const closeButton = modal.querySelector('.btn-close');
    fireEvent.click(closeButton);
    jasmine.clock().tick(100);

    // El modal debe desaparecer
    expect(queryByRole('dialog')).toBeFalsy();
  });

  // Prueba 4: Verificar que los enlaces de navegación están presentes
  it('should render navigation links', () => {
    const nav = container.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav.className).toContain('navbar-collapse');
  });
});
});
});