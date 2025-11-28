// Aplicación principal - La Ruta el Pastelazo
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContextAPI'; // Cambiado a AuthContextAPI
import { CartProvider } from './contexts/CartContext';
import FixedLayout from './components/layout/FixedLayout';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './components/ErrorBoundary';
import { Loading } from './components/ui';
import { Toaster } from 'react-hot-toast'; // Agregado para notificaciones
import './App.css';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <FixedLayout>
              <Suspense fallback={<Loading />}>
                <AppRouter />
              </Suspense>
            </FixedLayout>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
      
      {/* Notificaciones globales */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '14px'
          },
          success: {
            style: {
              background: '#059669',
            }
          },
          error: {
            style: {
              background: '#DC2626',
            }
          },
          loading: {
            style: {
              background: '#F59E0B',
            }
          }
        }}
      />
    </ErrorBoundary>
  );
}
