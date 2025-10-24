import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import { ROUTES } from '../constants';

// Mock de los componentes lazy-loaded
jest.mock('../pages/Home', () => () => <div>Home Page</div>);
jest.mock('../pages/Catalog', () => () => <div>Catalog Page</div>);
jest.mock('../pages/Cart', () => () => <div>Cart Page</div>);
jest.mock('../pages/FAQ', () => () => <div>FAQ Page</div>);
jest.mock('../pages/Tracking', () => () => <div>Tracking Page</div>);
jest.mock('../pages/Profile', () => () => <div>Profile Page</div>);
jest.mock('../pages/Checkout', () => () => <div>Checkout Page</div>);
jest.mock('../pages/Reviews', () => () => <div>Reviews Page</div>);
jest.mock('../pages/NotFound', () => () => <div>404 Page</div>);

const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
      </Suspense>
    </MemoryRouter>
  );
};

describe('AppRouter', () => {
  it('debería renderizar la página de inicio en la ruta /', () => {
    renderWithRouter(ROUTES.HOME);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('debería renderizar el catálogo en la ruta /catalog', () => {
    renderWithRouter(ROUTES.CATALOG);
    expect(screen.getByText('Catalog Page')).toBeInTheDocument();
  });

  it('debería renderizar el carrito en la ruta /cart', () => {
    renderWithRouter(ROUTES.CART);
    expect(screen.getByText('Cart Page')).toBeInTheDocument();
  });

  it('debería renderizar FAQ en la ruta /faq', () => {
    renderWithRouter(ROUTES.FAQ);
    expect(screen.getByText('FAQ Page')).toBeInTheDocument();
  });

  it('debería renderizar seguimiento en la ruta /tracking', () => {
    renderWithRouter(ROUTES.TRACKING);
    expect(screen.getByText('Tracking Page')).toBeInTheDocument();
  });

  it('debería renderizar perfil en la ruta /profile', () => {
    renderWithRouter(ROUTES.PROFILE);
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });

  it('debería renderizar checkout en la ruta /checkout', () => {
    renderWithRouter(ROUTES.CHECKOUT);
    expect(screen.getByText('Checkout Page')).toBeInTheDocument();
  });

  it('debería renderizar reseñas en la ruta /reviews', () => {
    renderWithRouter(ROUTES.REVIEWS);
    expect(screen.getByText('Reviews Page')).toBeInTheDocument();
  });

  it('debería renderizar 404 para rutas no existentes', () => {
    renderWithRouter('/ruta-no-existente');
    expect(screen.getByText('404 Page')).toBeInTheDocument();
  });
});