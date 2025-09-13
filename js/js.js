/* ===== Pastelería Mil Sabores – JS de catálogo/carrito ===== */
(function(){
  // Lazy a todas las imágenes de productos
  document.querySelectorAll('.card-img-top').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });

  // Utilidad: formateo CLP simple
  const money = n => new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(n);

  // --- Carrito persistente ---
  const carrito = {
    obtener: () => JSON.parse(localStorage.getItem('carrito') || '[]'),
    guardar: items => localStorage.setItem('carrito', JSON.stringify(items)),
    agregar: prod => {
      const items = carrito.obtener();
      // Si ya existe el producto (por id y personalización), suma cantidad
      const idx = items.findIndex(p => p.id === prod.id && p.mensaje === prod.mensaje);
      if (idx >= 0) {
        items[idx].cantidad += prod.cantidad;
      } else {
        items.push(prod);
      }
      carrito.guardar(items);
    },
    quitar: idx => {
      const items = carrito.obtener();
      items.splice(idx, 1);
      carrito.guardar(items);
    },
    limpiar: () => localStorage.removeItem('carrito')
  };

  // --- Descuentos automáticos ---
  function calcularDescuento(usuario, total) {
    if (!usuario) return total;
    if (usuario.edad >= 50) return total * 0.5;
    if (usuario.codigo === "FELICES50") return total * 0.9;
    if (usuario.correo && usuario.correo.endsWith("@duocuc.cl") && usuario.cumple) {
      const hoy = new Date();
      const cumple = new Date(usuario.cumple);
      if (hoy.getMonth() === cumple.getMonth() && hoy.getDate() === cumple.getDate()) {
        return 0; // torta gratis en cumpleaños
      }
    }
    return total;
  }

  // --- Guardar usuario en localStorage ---
  function guardarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }
  function obtenerUsuario() {
    return JSON.parse(localStorage.getItem('usuario') || 'null');
  }

  // Referencias del carrito
  const tbody = document.querySelector('#carrito tbody');
  const totalCell = document.getElementById('total-carrito');

  function recomputeTotal(){
    let total = 0;
    tbody.querySelectorAll('tr').forEach(tr=>{
      const sub = tr.querySelector('[data-subtotal]');
      total += Number(sub?.dataset.subtotal || 0);
    });
    if (totalCell) totalCell.textContent = money(total);
  }

  // Manejar clicks en "Agregar"
  document.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('a.btn.btn-sm.btn-primary');
    if(!btn) return;

    // Solo interceptamos si apunta a #carrito (no rompemos otros enlaces)
    if (btn.getAttribute('href') === '#carrito'){
      ev.preventDefault();

      const card = btn.closest('.card');
      if(!card) return;

      const titulo = card.querySelector('h4')?.textContent?.trim() || 'Producto';
      const codigo = card.querySelector('p.small strong')?.textContent?.trim() || 'SIN-COD';
      const precioTxt = card.querySelector('.fw-semibold')?.textContent || '';
      const precio = parsePrecio(precioTxt);

      // Valores por defecto
      const porciones = 12; // base de cálculo
      const relleno = 'Clásico';
      const mensaje = '';

      // Crear fila
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><strong>${titulo}</strong><br><small class="text-muted">Código: ${codigo}</small></td>
        <td>
          <input type="number" class="form-control form-control-sm" value="${porciones}" min="6" step="2" data-porciones />
        </td>
        <td>
          <select class="form-select form-select-sm" data-relleno>
            <option${relleno==='Clásico'?' selected':''}>Clásico</option>
            <option${relleno==='Crema'?' selected':''}>Crema</option>
            <option${relleno==='Manjar'?' selected':''}>Manjar</option>
            <option${relleno==='Chocolate'?' selected':''}>Chocolate</option>
          </select>
        </td>
        <td>
          <input type="text" class="form-control form-control-sm" placeholder="Feliz Cumple..." value="${mensaje}" data-mensaje />
        </td>
        <td data-subtotal data-precio-base="${precio}" data-porciones-base="12">${money(precio)}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" type="button" data-remove>Quitar</button>
        </td>
      `;

      tbody.appendChild(tr);
      recomputeTotal();
      // Navegar hacia el carrito para feedback visual
      document.querySelector(btn.getAttribute('href'))?.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });

  // Cambios en porciones → recalcular subtotal
  tbody?.addEventListener('input', (ev)=>{
    const input = ev.target;
    if (input.matches('[data-porciones]')){
      const tr = input.closest('tr');
      const sub = tr.querySelector('[data-subtotal]');
      const base = Number(sub.dataset.precioBase || 0);
      const porcionesBase = Number(sub.dataset.porcionesBase || 12);

      const porciones = Math.max(6, Number(input.value || porcionesBase));
      const factor = porciones / porcionesBase;
      const subtotal = Math.round(base * factor);

      sub.dataset.subtotal = String(subtotal);
      sub.textContent = money(subtotal);
      recomputeTotal();
    }
  });

  // Quitar ítems
  tbody?.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('[data-remove]');
    if (!btn) return;
    btn.closest('tr')?.remove();
    recomputeTotal();
  });

  // (Opcional) manejar envío de checkout
  const checkout = document.querySelector('#checkout form');
  checkout?.addEventListener('submit', (_ev)=>{
    // Aquí podrías validar datos, aplicar cupones, etc.
  });

  // --- Interacción: Agregar al carrito desde catálogo/detalle ---
  document.addEventListener('click', e => {
    // Botón agregar al carrito (catálogo o detalle)
    if (
      e.target.matches('.btn.btn-primary.btn-sm') &&
      e.target.textContent.match(/Agregar al carrito/i)
    ) {
      e.preventDefault();
      const card = e.target.closest('.catalogo-item, .row, .card');
      if (card) {
        // Extraer datos del producto
        const nombre = card.querySelector('.catalogo-nombre, .card-title, h2')?.textContent?.trim() || '';
        const precioTxt = card.querySelector('.catalogo-precio, .fw-semibold, .fw-bold.fs-4')?.textContent || '';
        const precio = parseInt(precioTxt.replace(/\D/g, '')) || 0;
        const img = card.querySelector('img')?.getAttribute('src') || '';
        // Obtener el id desde el enlace de detalle o desde la URL
        let id = '';
        const detalleLink = card.querySelector('a.catalogo-btn, a[href*="detalle.html"]');
        if (detalleLink) {
          const match = detalleLink.href.match(/id=([A-Z0-9]+)/i);
          if (match) id = match[1];
        }
        if (!id) return alert('ID de producto no encontrado');

        // Agregar al carrito (sin duplicar código)
        const item = { id, nombre, precio, img, cantidad: 1 };
        const items = carrito.obtener();
        const idx = items.findIndex(p => p.id === item.id);
        if (idx >= 0) {
          items[idx].cantidad += 1;
        } else {
          items.push(item);
        }
        carrito.guardar(items);
        alert('Producto agregado al carrito');
      }
    }
  });

  // Función para buscar producto por ID
  function buscarProductoPorId(id) {
    return (typeof TORTAS !== 'undefined' ? TORTAS : []).find(p => p.id === id);
  }

  // Evento global para agregar al carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('agregar-carrito')) {
      e.preventDefault();
      const id = e.target.getAttribute('data-id');
      const producto = buscarProductoPorId(id);
      if (producto) {
        // Puedes agregar personalización aquí si lo deseas
        const item = { ...producto, cantidad: 1 };
        // Lógica para agregar al carrito
        const items = carrito.obtener();
        const idx = items.findIndex(p => p.id === item.id);
        if (idx >= 0) {
          items[idx].cantidad += 1;
        } else {
          items.push(item);
        }
        carrito.guardar(items);
        alert('Producto agregado al carrito');
      } else {
        alert('No se encontró el producto');
      }
    }
  });

})();
