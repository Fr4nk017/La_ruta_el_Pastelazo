// Aplicación de diagnóstico - La Ruta el Pastelazo
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import SimpleNavbar from './components/layout/SimpleNavbar';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Layout con Navbar original para testing
function TestLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <SimpleNavbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <footer className="bg-light py-3">
        <div className="container text-center">
          <small>&copy; 2025 La Ruta el Pastelazo</small>
        </div>
      </footer>
    </div>
  );
}

// Componente de prueba simple
function TestComponent() {
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1>🍰 La Ruta el Pastelazo</h1>
        <p>Layout con Navbar original</p>
        <div className="alert alert-info">
          🧪 Probando si el Navbar causa problemas
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <TestLayout>
              <TestComponent />
            </TestLayout>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}