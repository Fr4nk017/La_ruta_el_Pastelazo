import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()

  if (cart.length === 0) {
    return <div>Tu carrito está vacío</div>
  }

  return (
    <div>
      <h2>Carrito de Compras</h2>
      
      {cart.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>${item.price.toLocaleString()}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="1"
          />
          <button onClick={() => removeFromCart(item.id)}>
            Eliminar
          </button>
        </div>
      ))}
      
      <div>
        <p>Total: ${getCartTotal().toLocaleString()}</p>
      </div>
      
      <button onClick={clearCart}>
        Vaciar carrito
      </button>
    </div>
  )
}

export default Cart