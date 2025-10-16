import './index.css'
import { CartProvider } from './contexts/CartContext'
import AppNavbar from './components/layout/Navbar'
import AppRouter from './routes/AppRouter'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'

export default function App(){
  return (
    <ErrorBoundary>
      <CartProvider>
        <AppNavbar/>
        <AppRouter/>
        <Footer/>
      </CartProvider>
    </ErrorBoundary>
  )
}
