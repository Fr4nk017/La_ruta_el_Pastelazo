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

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.agregar-carrito').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.id;
        const nombre = this.dataset.nombre;
        const precio = parseInt(this.dataset.precio, 10);

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const idx = carrito.findIndex(item => item.id === id);

        if (idx > -1) {
          carrito[idx].cantidad += 1;
        } else {
          carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`${nombre} agregado al carrito`);
      });
    });
  });

  // Mostrar carrito en carrito.html
  if (window.location.pathname.endsWith('carrito.html')) {
    const lista = document.getElementById('carrito-lista');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
      lista.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
      lista.innerHTML = '<ul class="list-group">' +
        carrito.map(item =>
          `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.nombre} x${item.cantidad}
            <span>$${item.precio * item.cantidad}</span>
          </li>`
        ).join('') +
        '</ul>';
    }

    document.getElementById('comprar-btn').onclick = function () {
      alert('¡Compra realizada con éxito!');
      localStorage.removeItem('carrito');
      window.location.reload();
    };
  }

  // Registro de usuario
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registro-form');
    if (form) {
      form.onsubmit = function (e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        localStorage.setItem('usuario', JSON.stringify({ nombre, email }));
        document.getElementById('registro-msg').innerHTML = `<div class="alert alert-success">¡Perfil creado correctamente!</div>`;
        form.reset();
      };
    }
  });

  // Agregar al carrito desde detalle.html
  document.addEventListener('DOMContentLoaded', function () {
    const btnDetalle = document.getElementById('agregar-detalle-carrito');
    if (btnDetalle) {
      btnDetalle.onclick = function () {
        const id = this.dataset.id;
        const nombre = this.dataset.nombre;
        const precio = parseInt(this.dataset.precio, 10);

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const idx = carrito.findIndex(item => item.id === id);

        if (idx > -1) {
          carrito[idx].cantidad += 1;
        } else {
          carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`${nombre} agregado al carrito`);
      };
    }
  });

  // Comentarios en detalle.html y reseñas.html
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('comentario-form');
    const lista = document.getElementById('comentarios-lista');
    if (form && lista) {
      // Identificador único por página (por producto o general)
      let pageKey = 'comentarios_generales';
      if (window.location.pathname.endsWith('detalle.html')) {
        const params = new URLSearchParams(window.location.search);
        pageKey = 'comentarios_' + (params.get('id') || 'detalle');
      }

      // Mostrar comentarios existentes
      function mostrarComentarios() {
        const comentarios = JSON.parse(localStorage.getItem(pageKey) || '[]');
        if (comentarios.length === 0) {
          lista.innerHTML = '<p class="text-muted">No hay comentarios aún.</p>';
        } else {
          lista.innerHTML = comentarios.map(c =>
            `<div class="border rounded p-2 mb-2">
              <strong>${c.nombre}</strong> <span class="text-muted small">${c.fecha}</span>
              <div>${c.texto}</div>
            </div>`
          ).join('');
        }
      }

      mostrarComentarios();

      // Guardar nuevo comentario
      form.onsubmit = function (e) {
        e.preventDefault();
        const nombre = document.getElementById('comentario-nombre').value.trim();
        const texto = document.getElementById('comentario-texto').value.trim();
        if (!nombre || !texto) return;
        const nuevo = {
          nombre,
          texto,
          fecha: new Date().toLocaleString('es-CL')
        };
        const comentarios = JSON.parse(localStorage.getItem(pageKey) || '[]');
        comentarios.unshift(nuevo);
        localStorage.setItem(pageKey, JSON.stringify(comentarios));
        form.reset();
        mostrarComentarios();
      };
    }
  });

})();
