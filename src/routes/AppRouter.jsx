
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import CartPage from '../pages/Cart';
import Faq from '../pages/FAQ';
import Tracking from '../pages/Tracking';
import NotFound from '../pages/NotFound';

export default function AppRouter(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/catalog" element={<Catalog/>} />
      <Route path="/cart" element={<CartPage/>} />
  <Route path="/faq" element={<Faq/>} />
      <Route path="/tracking" element={<Tracking/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}
