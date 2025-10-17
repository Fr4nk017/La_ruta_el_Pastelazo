
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { calcOrderTotal } from '../utils/pricing';
const fmt = n => n.toLocaleString('es-CL',{style:'currency',currency:'CLP'});
export default function CartPage(){
  const { cart, add, dec, remove, clear, checkout } = useCart();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [comuna, setComuna] = useState('santiago');
  const [cupon, setCupon] = useState('');
  const navigate = useNavigate();
  const totals = calcOrderTotal(cart, { comuna, cupon });
  const onCheckout = (e)=>{
    e.preventDefault();
    if(!fecha || !hora) return;
    const id = checkout({ fecha, hora, metodo:'whatsapp', comuna, cupon });
    if(id) navigate(`/tracking?id=${id}`);
  };
  if(!cart.length){ return <div className="container"><p>Tu carrito está vacío.</p></div>; }
  return (
    <div className="container">
      <h1 className="h3">Tu Carrito</h1>
      <div className="grid" style={{gridTemplateColumns:'2fr 1fr'}}>
        <div className="card" style={{padding:'1rem'}}>
          {cart.map(it=>(
            <div key={it.id} className="cart-item" style={{marginBottom:'.5rem'}}>
              <img className="cart-thumb" src={it.img} alt="" />
              <div>
                <div style={{fontWeight:700}}>{it.name}</div>
                <div>{fmt(it.price)} · x{it.qty}</div>
                <div style={{display:'flex', gap:'.5rem', marginTop:'.35rem'}}>
                  <button className="btn" onClick={()=>dec(it.id)}>-</button>
                  <button className="btn" onClick={()=>add(it)}>+</button>
                  <button className="btn secondary" onClick={()=>remove(it.id)}>Quitar</button>
                </div>
              </div>
              <div style={{fontWeight:700}}>{fmt(it.price*it.qty)}</div>
            </div>
          ))}
          <button className="btn" onClick={clear}>Vaciar carrito</button>
        </div>
        <form className="card" style={{padding:'1rem'}} onSubmit={onCheckout}>
          <h2 className="h5">Confirmar pedido</h2>
          <label>Fecha <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required/></label>
          <label>Hora <input type="time" value={hora} onChange={e=>setHora(e.target.value)} required/></label>
          <label>Comuna
            <select value={comuna} onChange={e=>setComuna(e.target.value)}>
              <option value="santiago">Santiago</option>
              <option value="providencia">Providencia</option>
              <option value="nunoa">Ñuñoa</option>
              <option value="otras">Otras</option>
            </select>
          </label>
          <label>Cupón <input value={cupon} onChange={e=>setCupon(e.target.value.toUpperCase())} placeholder="DULCE10 / PASTEL5"/></label>
          <hr/>
          <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:'.25rem'}}>
            <span>Subtotal</span><strong>{fmt(totals.subtotal)}</strong>
            <span>Envío</span><strong>{fmt(totals.envio)}</strong>
            <span>Descuento</span><strong>-{fmt(totals.desc)}</strong>
            <span>Total</span><strong>{fmt(totals.total)}</strong>
          </div>
          <button className="btn secondary" type="submit" style={{marginTop:'1rem'}}>Confirmar por WhatsApp</button>
          <button 
            className="btn primary" 
            type="button" 
            style={{marginTop:'0.5rem'}} 
            onClick={() => window.location.href = '/checkout'}
          >
            🛒 Checkout Completo
          </button>
        </form>
      </div>
    </div>
  );
}
