import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext'
import { ProfileProvider } from './contexts/ProfileContext'
import AppRouter from './routes/AppRouter'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
        <CartProvider>
          <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1">
              <AppRouter />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </ProfileProvider>
    </BrowserRouter>
  )
}

export default App