
import './index.css'
import { CartProvider } from './contexts/CartContext'
import AppNavbar from './components/layout/Navbar'
import AppRouter from './routes/AppRouter'
import Footer from './components/Footer'

export default function App(){
  return (
    <CartProvider>
      <AppNavbar/>
      <AppRouter/>
      <Footer/>
    </CartProvider>
  )
}
