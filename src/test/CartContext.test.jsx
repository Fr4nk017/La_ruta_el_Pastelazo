import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider, useCart } from '../context/CartContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  const wrapper = ({ children }) => (
    <CartProvider>{children}</CartProvider>
  )

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.cart).toEqual([])
    expect(result.current.getCartTotal()).toBe(0)
    expect(result.current.getCartItemsCount()).toBe(0)
  })

  it('adds product to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: 1,
      name: 'Torta de Chocolate',
      price: 15000,
      image: '/images/torta.jpg'
    }
    
    act(() => {
      result.current.addToCart(product)
    })
    
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]).toEqual({
      ...product,
      quantity: 1
    })
  })

  it('increases quantity when adding existing product', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: 1,
      name: 'Torta de Chocolate',
      price: 15000
    }
    
    act(() => {
      result.current.addToCart(product)
      result.current.addToCart(product)
    })
    
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(2)
  })

  it('updates product quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: 1,
      name: 'Torta de Chocolate',
      price: 15000
    }
    
    act(() => {
      result.current.addToCart(product)
      result.current.updateQuantity(1, 5)
    })
    
    expect(result.current.cart[0].quantity).toBe(5)
  })

  it('removes product from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: 1,
      name: 'Torta de Chocolate',
      price: 15000
    }
    
    act(() => {
      result.current.addToCart(product)
      result.current.removeFromCart(1)
    })
    
    expect(result.current.cart).toHaveLength(0)
  })

  it('clears entire cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product1 = { id: 1, name: 'Torta', price: 15000 }
    const product2 = { id: 2, name: 'Cupcake', price: 3000 }
    
    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product2)
      result.current.clearCart()
    })
    
    expect(result.current.cart).toHaveLength(0)
  })

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product1 = { id: 1, name: 'Torta', price: 15000 }
    const product2 = { id: 2, name: 'Cupcake', price: 3000 }
    
    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product1) // quantity = 2
      result.current.addToCart(product2) // quantity = 1
    })
    
    // 2 * 15000 + 1 * 3000 = 33000
    expect(result.current.getCartTotal()).toBe(33000)
  })

  it('counts cart items correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product1 = { id: 1, name: 'Torta', price: 15000 }
    const product2 = { id: 2, name: 'Cupcake', price: 3000 }
    
    act(() => {
      result.current.addToCart(product1)
      result.current.addToCart(product1) // quantity = 2
      result.current.addToCart(product2) // quantity = 1
    })
    
    // 2 + 1 = 3 items total
    expect(result.current.getCartItemsCount()).toBe(3)
  })

  it('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const product = {
      id: 1,
      name: 'Torta de Chocolate',
      price: 15000
    }
    
    act(() => {
      result.current.addToCart(product)
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([{ ...product, quantity: 1 }])
    )
  })
})