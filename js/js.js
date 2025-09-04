const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s,el)];
const clp=n=>new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n||0);
const parseCLP=t=>{if(!t)return 0;const m=String(t).replace(/[^\d]/g,'');return m?+m:0};
function notify(msg,type='info'){const n=document.createElement('div');n.className=`ds-toast ds-toast-${type}`;n.textContent=msg;Object.assign(n.style,{position:'fixed',right:'1rem',bottom:'1rem',zIndex:9999,background:type==='error'?'#9b1c1c':type==='success'?'#065f46':'#334155',color:'#fff',padding:'10px 14px',borderRadius:'10px',boxShadow:'0 10px 30px rgba(0,0,0,.25)',opacity:0,transform:'translateY(8px)',transition:'all .25s ease'});document.body.appendChild(n);requestAnimationFrame(()=>{n.style.opacity=1;n.style.transform='translateY(0)'});setTimeout(()=>{n.style.opacity=0;n.style.transform='translateY(8px)';n.addEventListener('transitionend',()=>n.remove(),{once:true})},1800)}

const STORE_KEY='ms_cart_v1';
let cart=loadCart();
function loadCart(){try{return JSON.parse(localStorage.getItem(STORE_KEY))||[]}catch{return[]}}
function saveCart(){localStorage.setItem(STORE_KEY,JSON.stringify(cart));renderCart()}

document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a) return;
  const id=a.getAttribute('href'); if(id.length<=1) return;
  const t=document.querySelector(id);
  if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
});

(function initFilters(){
  const form=$('#catalogo form[aria-label="Filtros del catálogo"]');
  const grid=$('#catalogo .row.row-cols-1');
  if(!form||!grid) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const catCl=$('#catCl',form)?.checked;
    const catFr=$('#catFr',form)?.checked;
    const catCh=$('#catCh',form)?.checked;
    const tipo=$('#tipo-torta',form)?.value||'';
    const tam=$('#tamano',form)?.value||'';
    const porMin=parseInt($('#porciones',form)?.value||'0',10);
    const pMax=parseInt($('#precio-max',form)?.value||'0',10);

    $$('.col > .card',grid).forEach(card=>{
      const title=card.querySelector('h4,.h6')?.textContent?.toLowerCase()||'';
      const meta=card.querySelector('.small.text-muted')?.textContent?.toLowerCase()||'';
      const priceText=card.querySelector('.fw-semibold')?.textContent||'';
      const por=(meta.match(/porciones:\s*(\d+)/i)||[])[1]||'0';
      const price=parseCLP(priceText);
      let ok=true;

      if(catCl||catFr||catCh){
        let m=false;
        if(catCl) m=m||/clásic|clasica|torta/.test(title);
        if(catFr) m=m||/fruta|frambues|papaya|naranja|uva/.test(title);
        if(catCh) m=m||/chocolate|cacao/.test(title);
        ok=ok&&m;
      }
      if(tipo==='cuadrada') ok=ok&&/cuadrad/.test(title);
      if(tipo==='circular') ok=ok&&/circular/.test(title);
      if(tam==='8')  ok=ok&&(+por>=8);
      if(tam==='12') ok=ok&&(+por>=12);
      if(tam==='15') ok=ok&&(+por>=15);
      if(porMin) ok=ok&&(+por>=porMin);
      if(pMax)   ok=ok&&(price>0&&price<=pMax);

      card.closest('.col').style.display=ok?'':'none';
    });
    notify('Filtros aplicados','success');
  });
})();

(function bindAddFromCards(){
  const grid=$('#catalogo');
  if(!grid) return;
  grid.addEventListener('click',e=>{
    const btn=e.target.closest('.btn.btn-sm.btn-primary'); if(!btn) return;
    const card=btn.closest('.card'); if(!card) return;
    e.preventDefault();
    const name=card.querySelector('h4,.h6')?.textContent?.trim()||'Torta';
    const meta=card.querySelector('.small.text-muted')?.textContent||'';
    const por=(meta.match(/Porciones:\s*(\d+)/i)||[])[1]||'';
    const priceText=card.querySelector('.fw-semibold')?.textContent||'';
    const precio=parseCLP(priceText)||0;
    addToCart({id:'CAT-'+Date.now(),producto:name,porciones:por,relleno:'-',mensaje:'—',precio});
  });
})();

(function bindAddFromDetail(){
  const sec=$('#detalle-producto'); if(!sec) return;
  const add=sec.querySelector('a.btn.btn-primary[href="#carrito"]'); if(!add) return;
  add.addEventListener('click',e=>{
    e.preventDefault();
    const name=sec.querySelector('h3,.h5')?.textContent?.trim()||'Torta';
    const por=$('#porciones-detalle')?.value||'12';
    const relleno=$('#relleno')?.value||'Clásico (crema)';
    const mensaje=$('#mensaje')?.value?.trim()||'—';
    let precio=0;
    const match=[...$$('#catalogo .card')].find(c=>c.querySelector('h4,.h6')?.textContent?.trim()===name);
    if(match) precio=parseCLP(match.querySelector('.fw-semibold')?.textContent||'')||0;
    if(!precio){ const base=22900; const p=parseInt(por||'12',10); precio=Math.round(base*(p/12)); }
    addToCart({id:'DET-'+Date.now(),producto:name,porciones:por,relleno,mensaje,precio});
    location.hash='#carrito';
  });
})();

function addToCart(item){
  if(!item||!item.id) return;
  cart.push(item);
  saveCart();
  notify('Agregado al carrito','success');
}

function renderCart(){
  const tbody=$('#carrito tbody'); if(!tbody) return;
  const totalCell=$('#carrito tfoot tr td.fw-bold:nth-child(2)');
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

(function initTracking(){
  const form=$('#estado-pedido form[aria-label="Buscar pedido"]'); if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const id=$('#pedido-id')?.value?.trim();
    if(!id){ notify('Ingresa un ID de pedido','error'); return; }
    notify(`Pedido ${id} está “En reparto / Listo para retiro”`,'success');
  });
})();

(function initReviews(){
  const form=$('#resenas form[aria-label="Enviar reseña"]');
  const list=$('#resenas .col-12.col-lg-6:last-child ul');
  if(!form||!list) return;
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

(function injectToastStyles(){
  const css=`.ds-toast{font:500 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}`;
  const style=document.createElement('style'); style.textContent=css; document.head.appendChild(style);
})();
