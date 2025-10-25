// Router principal sin lazy loading - La Ruta el Pastelazo
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants';

// Importaciones directas para debugging
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import CartPage from '../pages/Cart';
import FAQ from '../pages/FAQ';
import Tracking from '../pages/Tracking';
import Profile from '../pages/Profile';
import Checkout from '../pages/Checkout';
import Reviews from '../pages/Reviews';
import RolesApp from '../pages/RolesApp';
import AdminPanel from '../pages/AdminPanel';
import NotFound from '../pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.CATALOG} element={<Catalog />} />
      <Route path={ROUTES.CART} element={<CartPage />} />
      <Route path={ROUTES.FAQ} element={<FAQ />} />
      <Route path={ROUTES.TRACKING} element={<Tracking />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
      <Route path={ROUTES.REVIEWS} element={<Reviews />} />
      <Route path={ROUTES.ROLES_APP} element={<RolesApp />} />
      <Route path={ROUTES.ADMIN} element={<AdminPanel />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}