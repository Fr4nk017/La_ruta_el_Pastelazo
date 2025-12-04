// Router principal - La Ruta el Pastelazo
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../constants';

// Lazy loading de páginas para code splitting y mejor performance
const Home = lazy(() => import('../pages/Home'));
const Catalog = lazy(() => import('../pages/Catalog'));
const CartPage = lazy(() => import('../pages/Cart'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Tracking = lazy(() => import('../pages/Tracking'));
const Profile = lazy(() => import('../pages/Profile'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Reviews = lazy(() => import('../pages/Reviews'));
const RolesApp = lazy(() => import('../pages/RolesApp'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const TestAPIConnection = lazy(() => import('../pages/TestAPIConnection'));

const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));

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
      <Route path="/test-api" element={<TestAPIConnection />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
