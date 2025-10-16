import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy loading de páginas para code splitting
const Home = lazy(() => import('../pages/Home'));
const Catalog = lazy(() => import('../pages/Catalog'));
const CartPage = lazy(() => import('../pages/Cart'));
const Faq = lazy(() => import('../pages/FAQ'));
const Tracking = lazy(() => import('../pages/Tracking'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Componente de carga mientras se descarga el chunk
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

export default function AppRouter(){
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/catalog" element={<Catalog/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/faq" element={<Faq/>} />
        <Route path="/tracking" element={<Tracking/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Suspense>
  );
}
