import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import Tracking from '../pages/Tracking'
import Reviews from '../pages/Reviews'
import Profile from '../pages/Profile'
import Login from '../pages/Login'
import ProductDetail from '../pages/ProductDetail'
import NotFound from '../pages/NotFound'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/estado" element={<Tracking />} />
      <Route path="/reseñas" element={<Reviews />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="/ingresar" element={<Login />} />
      <Route path="/detalle/:id" element={<ProductDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter