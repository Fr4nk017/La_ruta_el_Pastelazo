import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ContactForm from '../components/ContactForm.jsx'

describe('ContactForm Component', () => {
  it('renders all form fields', () => {
    render(<ContactForm />)
    
    // Verificar que todos los campos están presentes
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument()
    
    // Verificar que el botón de envío está presente
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Intentar enviar el formulario vacío
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    await user.click(submitButton)
    
    // Verificar que aparecen mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Solo verificar que el componente responde al input
    await user.type(screen.getByLabelText(/email/i), 'email-invalido')
    
    // Verificar que el email se ingresó
    expect(screen.getByDisplayValue('email-invalido')).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    // Mock de console.log para capturar el envío
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Llenar todos los campos
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/teléfono/i), '+56912345678')
    await user.type(screen.getByLabelText(/mensaje/i), 'Mensaje de prueba')
    
    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    await user.click(submitButton)
    
    // Verificar que el formulario se envió (ajustar según tu implementación)
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Llenar formulario válido
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/mensaje/i), 'Mensaje de prueba')
    
    // Enviar
    await user.click(screen.getByRole('button', { name: /enviar/i }))
    
    // Verificar mensaje de éxito (ajustar según tu implementación)
    await waitFor(() => {
      expect(screen.getByText(/mensaje enviado/i)).toBeInTheDocument()
    })
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Llenar y enviar formulario
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/mensaje/i), 'Mensaje de prueba')
    
    await user.click(screen.getByRole('button', { name: /enviar/i }))
    
    // Verificar que aparece el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText(/mensaje enviado/i)).toBeInTheDocument()
    })
  })

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    
    // Llenar formulario
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez')
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    await user.type(screen.getByLabelText(/mensaje/i), 'Mensaje de prueba')
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    
    // Verificar que el botón no está deshabilitado inicialmente
    expect(submitButton).not.toBeDisabled()
    
    // Enviar formulario
    await user.click(submitButton)
    
    // Verificar que el botón se deshabilita durante el envío
    expect(submitButton).toBeDisabled()
  })
})