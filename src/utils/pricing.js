
export function calcOrderTotal(items, { comuna=null, cupon=null }={}){
  const subtotal = items.reduce((a,b)=> a + b.qty*b.price, 0);
  const envio = comuna ? tarifaPorComuna(comuna) : 0;
  const desc = cupon ? descuentoPorCupon(cupon, subtotal) : 0;
  return { subtotal, envio, desc, total: Math.max(0, subtotal + envio - desc) };
}
function tarifaPorComuna(comuna){
  const tabla = { santiago: 3500, providencia: 3000, nunoa: 3000, otras: 4500 };
  return tabla[comuna] ?? tabla.otras;
}
function descuentoPorCupon(code, subtotal){
  const cupones = { DULCE10: 0.10, PASTEL5: 0.05 };
  const pct = cupones[code] ?? 0; return Math.round(subtotal*pct);
}
