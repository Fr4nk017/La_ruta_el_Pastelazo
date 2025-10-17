// Aplicación principal - La Ruta el Pastelazo
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/layout';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './components/ErrorBoundary';
import { Loading } from './components/ui';
import './App.css';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Layout>
              <Suspense fallback={<Loading fullPage text="Cargando aplicación..." />}>
                <AppRouter />
              </Suspense>
            </Layout>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
