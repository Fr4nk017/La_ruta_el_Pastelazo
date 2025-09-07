/* =========================
   Utilidades
========================= */
const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const clp = n => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n||0);
const parseCLP = t => { if(!t) return 0; const m = String(t).replace(/[^\d]/g,''); return m ? +m : 0; };

function notify(msg,type='info'){
  const n=document.createElement('div');
  n.className=`ds-toast ds-toast-${type}`;
  n.textContent=msg;
  Object.assign(n.style,{
    position:'fixed',right:'1rem',bottom:'1rem',zIndex:9999,
    background:type==='error'?'#9b1c1c':type==='success'?'#065f46':'#334155',
    color:'#fff',padding:'10px 14px',borderRadius:'10px',
    boxShadow:'0 10px 30px rgba(0,0,0,.25)',opacity:0,transform:'translateY(8px)',
    transition:'all .25s ease'
  });
  document.body.appendChild(n);
  requestAnimationFrame(()=>{n.style.opacity=1;n.style.transform='translateY(0)';});
  setTimeout(()=>{
    n.style.opacity=0;n.style.transform='translateY(8px)';
    n.addEventListener('transitionend',()=>n.remove(),{once:true});
  },1800);
}

/* =========================
   Datos del catálogo (usa tus imágenes reales)
========================= */
window.PRODUCTS = [
  { code:'TL001', nombre:'Torta Tres Leches', precio:22900, porciones:12,
    img:'imagenes/tortas/TRES-LECHES-1.webp',
    descripcion:'Bizcocho húmedo con leche evaporada y condensada, y crema.' },

  { code:'TN001', nombre:'Torta Naranja', precio:27990, porciones:15,
    img:'imagenes/tortas/torta-naranjax.webp',
    descripcion:'Bizcocho blanco con jugo de naranja, chantilly y crema de naranja.' },

  { code:'TP001', nombre:'Torta de Papaya', precio:24500, porciones:10,
    img:'imagenes/tortas/Torta_de_Papaya.png',
    descripcion:'Relleno de papaya natural con crema pastelera.' },

  { code:'TC001', nombre:'Torta Cuadrada de Chocolate', precio:45000, porciones:12,
    img:'imagenes/tortas/Torta Cuadrada de Chocolate.png',
    descripcion:'Deliciosa torta de chocolate con ganache y toque de avellanas.' },

  { code:'TT001', nombre:'Torta Circular de Vainilla', precio:40000, porciones:12,
    img:'imagenes/tortas/Torta Circular de Vainilla.png',
    descripcion:'Bizcocho de vainilla con crema pastelera y glaseado dulce.' },

  { code:'CH001', nombre:'Torta de uva Chardonnay', precio:28000, porciones:12,
    img:'imagenes/tortas/Torta_de_uva_Chardonnay.png',
    descripcion:'Crema de uva Chardonnay y cobertura de frutas frescas.' },

  { code:'KF001', nombre:'Torta de kuchen de frambuesa', precio:21900, porciones:8,
    img:'imagenes/tortas/Torta_de_kuchen_de_frambuesa.png',
    descripcion:'Kuchen tradicional con frambuesas frescas.' }
];

/* =========================
   Carrito (localStorage)
========================= */
const STORE_KEY='ms_cart_v1';
let cart=loadCart();
function loadCart(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY))||[] }catch{ return [] } }
function saveCart(){ localStorage.setItem(STORE_KEY, JSON.stringify(cart)); renderCart(); }

/* =========================
   Navegación con hash (scroll suave) – NO intercepta links reales
========================= */
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a) return;
  const id=a.getAttribute('href');
  if (id === '#' || id.length<=1) return; // evita subir arriba
  const t=document.querySelector(id);
  if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
});

/* =========================
   Detalle.html: render dinámico por ?id=
========================= */
(function initDetailPage(){
  // Solo corre dentro de /Menu/detalle.html
  if (!/\/detalle\.html(\?|$)/i.test(location.pathname)) return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const prod = (window.PRODUCTS || []).find(p => String(p.code) === String(id));

  const cont = document.querySelector('#detalle') || document.querySelector('.detalle-container');
  const fb   = document.querySelector('#fallback');

  if (!cont) { console.warn('No se encontró #detalle'); return; }
  if (!prod) { if (fb) fb.style.display = 'block'; return; }

  const imgPath = prod.img?.startsWith('../') ? prod.img : `../${prod.img}`;

  cont.innerHTML = `
    <img src="${imgPath}" alt="${prod.nombre}" class="detalle-img">
    <div id="detalle-producto">
      <div class="detalle-nombre">${prod.nombre}</div>
      <div class="detalle-descripcion">${prod.descripcion || ''}</div>
      <div class="detalle-precio">${clp(prod.precio || 0)}</div>

      <div style="display:flex;gap:.5rem;align-items:center;margin:.5rem 0 1rem">
        <label for="porciones-detalle" class="muted">Porciones:</label>
        <select id="porciones-detalle">
          <option value="8">8</option>
          <option value="10">10</option>
          <option value="12" selected>12</option>
          <option value="15">15</option>
        </select>
      </div>

      <div style="display:grid;gap:.5rem;max-width:420px;margin:.75rem 0">
        <label class="muted" for="relleno">Relleno</label>
        <select id="relleno">
          <option>Clásico (crema)</option>
          <option>Manjar</option>
          <option>Chocolate</option>
          <option>Frambuesa</option>
        </select>

        <label class="muted" for="mensaje">Mensaje en la torta</label>
        <input id="mensaje" placeholder="¡Feliz Cumpleaños!">
      </div>

      <a href="./carrito.html" class="detalle-btn btn btn-primary" id="addCartBtn">Agregar al carrito</a>
      <div style="margin-top:.75rem"><a href="../index.html#catalogo" class="muted">← Volver al catálogo</a></div>
    </div>
  `;

  const add = document.getElementById('addCartBtn');
  if (add) {
    add.addEventListener('click', () => {
      const por = document.getElementById('porciones-detalle')?.value || '12';
      const relleno = document.getElementById('relleno')?.value || 'Clásico (crema)';
      const mensaje = document.getElementById('mensaje')?.value?.trim() || '—';
      addToCart({
        id: 'DET-' + Date.now(),
        producto: prod.nombre,
        porciones: por,
        relleno,
        mensaje,
        precio: prod.precio || 0
      });
    });
  }
})();

/* =========================
   Carrito
========================= */
function addToCart(item){
  if(!item||!item.id) return;
  cart.push(item);
  saveCart();
  notify('Agregado al carrito','success');
}

function renderCart(){
  const tbody=$('#carrito tbody'); if(!tbody) return;
  const totalCell=$('#carrito tfoot .fw-bold:nth-child(2)') || $('#carrito tfoot td.fw-bold');
  tbody.innerHTML='';
  let total=0;
  cart.forEach((it,idx)=>{
    total+=Number(it.precio||0);
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${it.producto||'Torta'}</td>
      <td>${it.porciones||'-'}</td>
      <td>${it.relleno||'-'}</td>
      <td>${it.mensaje||'—'}</td>
      <td>${clp(it.precio||0)}</td>
      <td>
        <div class="d-flex gap-2">
          <button class="btn btn-link p-0 text-decoration-none link-danger" data-action="remove" data-idx="${idx}">Eliminar</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });
  if(totalCell) totalCell.textContent=clp(total);
  $$('button[data-action="remove"]',tbody).forEach(b=>{
    b.addEventListener('click',()=>{
      const i=+b.dataset.idx;
      cart.splice(i,1);
      saveCart();
      notify('Elemento eliminado','info');
    });
  });
}
renderCart();

/* =========================
   Checkout
========================= */
(function initCheckout(){
  const form=$('#checkout form[aria-label="Checkout"]'); if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!cart.length){ notify('Tu carrito está vacío','error'); return; }
    const fecha=$('#fecha')?.value||'(sin fecha)';
    const hora=$('#hora')?.value||'(sin hora)';
    const metodo=$('#metodo-pago')?.value||'Tarjeta';
    const cupon=$('#cupon')?.value?.trim();
    let total=cart.reduce((a,i)=>a+(i.precio||0),0);
    if(/^SABOR10$/i.test(cupon)) total=Math.max(0,Math.round(total*0.9));
    const orderId='MS-'+new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14);
    notify(`Pedido ${orderId} confirmado para ${fecha} ${hora}. Total: ${clp(total)}`,'success');
    cart=[]; saveCart();
    location.hash='#estado-pedido';
    const input=$('#pedido-id'); if(input) input.value=orderId;
  });
})();

/* =========================
   Tracking
========================= */
(function initTracking(){
  const form=$('#estado-pedido form[aria-label="Buscar pedido"]'); if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const id=$('#pedido-id')?.value?.trim();
    if(!id){ notify('Ingresa un ID de pedido','error'); return; }
    notify(`Pedido ${id} está “En reparto / Listo para retiro”`,'success');
  });
})();

/* =========================
   Reseñas
========================= */
(function initReviews(){
  const form=$('#resenas form[aria-label="Enviar reseña"]');
  const list=$('#resenas ul'); if(!form||!list) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const producto=$('#producto-resena')?.value?.trim()||'Producto';
    const rating=$('#rating')?.value||'★★★★★';
    const comentario=$('#comentario')?.value?.trim()||'(sin comentario)';
    const li=document.createElement('li');
    li.innerHTML=`<strong>Tú</strong> – ${rating} – “${comentario}”`;
    list.appendChild(li);
    notify('¡Gracias por tu reseña!','success');
    form.reset();
  });
})();

/* =========================
   Toast CSS mínimo
========================= */
(function injectToastStyles(){
  const css=`.ds-toast{font:500 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}`;
  const style=document.createElement('style'); style.textContent=css; document.head.appendChild(style);
})();
