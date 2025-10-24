import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// Prueba simple para verificar que el testing funciona
describe('Simple Test', () => {
  it('should render a simple component', () => {
    render(<div>Hola Mundo</div>)
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument()
  })

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4)
  })

  it('should work with arrays', () => {
    const fruits = ['manzana', 'banana', 'naranja']
    expect(fruits).toHaveLength(3)
    expect(fruits).toContain('banana')
  })
})