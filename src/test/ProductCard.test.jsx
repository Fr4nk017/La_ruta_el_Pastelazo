import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ProductCard from '../components/ProductCard.jsx'

// Mock del contexto de carrito
const mockAddToCart = vi.fn()
const mockCartContext = {
  addToCart: mockAddToCart
}

vi.mock('../context/CartContext.jsx', () => ({
  useCart: () => mockCartContext
}))

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Torta de Chocolate',
    price: 15000,
    image: '/images/torta-chocolate.jpg',
    description: 'Deliciosa torta de chocolate artesanal'
  }

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />)
    
    // Verificar que se muestra el nombre del producto
    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
    
    // Verificar que se muestra el precio formateado
    expect(screen.getByText('$15.000')).toBeInTheDocument()
    
    // Verificar que se muestra la descripción
    expect(screen.getByText('Deliciosa torta de chocolate artesanal')).toBeInTheDocument()
    
    // Verificar que se muestra la imagen (solo que existe el elemento)
    const image = screen.getByAltText('Torta de Chocolate')
    expect(image).toBeInTheDocument()
  })

  it('calls addToCart when "Agregar al Carrito" button is clicked', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />)
    
    // Buscar y hacer clic en el botón "Agregar" (texto real del botón)
    const addButton = screen.getByText(/agregar$/i)
    fireEvent.click(addButton)
    
    // Verificar que se llamó la función addToCart con el producto correcto
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('formats price correctly', () => {
    const productWithDifferentPrice = {
      ...mockProduct,
      price: 25500
    }
    
    render(<ProductCard product={productWithDifferentPrice} onAddToCart={mockAddToCart} />)
    
    // Verificar formato de precio con miles
    expect(screen.getByText('$25.500')).toBeInTheDocument()
  })

  it('handles missing image gracefully', () => {
    const productWithoutImage = {
      ...mockProduct,
      image: undefined
    }
    
    render(<ProductCard product={productWithoutImage} onAddToCart={mockAddToCart} />)
    
    // Verificar que el componente no falla sin imagen
    expect(screen.getByText('Torta de Chocolate')).toBeInTheDocument()
  })
})