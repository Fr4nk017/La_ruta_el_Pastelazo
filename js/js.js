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
    if (e.target.matches('.btn-primary, .catalogo-btn') && e.target.textContent.match(/Agregar al carrito/i)) {
      e.preventDefault();
      const card = e.target.closest('.card, .catalogo-item, .row');
      if (card) {
        // Extraer datos del producto
        const nombre = card.querySelector('.card-title, .catalogo-nombre, h2')?.textContent || '';
        const precioTxt = card.querySelector('.fw-semibold, .catalogo-precio, .fw-bold.fs-4')?.textContent || '';
        const precio = parseInt(precioTxt.replace(/\D/g, '')) || 0;
        const img = card.querySelector('img')?.src || '';
        const id = (location.search.match(/id=([A-Z0-9]+)/i) || [])[1] || nombre.replace(/\s/g, '').toUpperCase();
        // Personalización (mensaje especial)
        const mensaje = card.querySelector('input[name="mensaje"]')?.value || '';
        carrito.agregar({ id, nombre, precio, cantidad: 1, mensaje, img });
        alert('Producto agregado al carrito');
      }
    }
  });

  // --- Renderizar carrito en carrito.html ---
  if (location.pathname.endsWith('carrito.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const tbody = document.querySelector('tbody');
      const resumen = document.querySelector('#resumen-carrito');
      const items = carrito.obtener();
      let total = 0;
      tbody.innerHTML = '';
      items.forEach((prod, i) => {
        const subtotal = prod.precio * prod.cantidad;
        total += subtotal;
        tbody.innerHTML += `
          <tr>
            <td><img src="${prod.img}" alt="" style="width:48px;height:48px;border-radius:8px;"> ${prod.nombre}${prod.mensaje ? `<br><small>Mensaje: ${prod.mensaje}</small>` : ''}</td>
            <td>
              <input type="number" min="1" value="${prod.cantidad}" data-idx="${i}" class="form-control form-control-sm cantidad-carrito" style="width:70px;">
            </td>
            <td>${money(prod.precio)}</td>
            <td>${money(subtotal)}</td>
            <td><button class="btn btn-sm btn-outline-danger quitar-carrito" data-idx="${i}">&times;</button></td>
          </tr>
        `;
      });
      // Descuento
      const usuario = obtenerUsuario();
      const totalConDescuento = calcularDescuento(usuario, total);
      resumen.innerHTML = `
        <div class="fw-bold">Total: ${money(total)}</div>
        ${total !== totalConDescuento ? `<div class="text-success">Descuento aplicado: ${money(total - totalConDescuento)}</div>` : ''}
        <div class="fw-bold fs-5">Total a pagar: ${money(totalConDescuento)}</div>
      `;

      // Cambiar cantidad
      tbody.querySelectorAll('.cantidad-carrito').forEach(input => {
        input.addEventListener('change', e => {
          const idx = +e.target.dataset.idx;
          const items = carrito.obtener();
          items[idx].cantidad = Math.max(1, +e.target.value);
          carrito.guardar(items);
          location.reload();
        });
      });
      // Quitar producto
      tbody.querySelectorAll('.quitar-carrito').forEach(btn => {
        btn.addEventListener('click', e => {
          const idx = +e.target.dataset.idx;
          carrito.quitar(idx);
          location.reload();
        });
      });
    });
  }

  // --- Filtros y búsqueda en catálogo ---
  if (location.pathname.endsWith('catalogo.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const lista = document.querySelector('.catalogo-lista');
      const filtro = document.querySelector('select.form-select');
      const busqueda = document.querySelector('input[type="search"]');
      // Puedes cargar productos desde un array JS o desde el HTML
      // Aquí solo ejemplo de filtro visual
      if (filtro) {
        filtro.addEventListener('change', () => {
          const val = filtro.value.toLowerCase();
          lista.querySelectorAll('.catalogo-item').forEach(item => {
            item.style.display = val === 'categoría' || item.textContent.toLowerCase().includes(val) ? '' : 'none';
          });
        });
      }
      if (busqueda) {
        busqueda.addEventListener('input', () => {
          const val = busqueda.value.toLowerCase();
          lista.querySelectorAll('.catalogo-item').forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(val) ? '' : 'none';
          });
        });
      }
    });
  }

  // --- Guardar usuario al registrarse (ejemplo simple) ---
  if (location.pathname.endsWith('Ingresar.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('submit', e => {
          e.preventDefault();
          const correo = form.querySelector('#correo')?.value || '';
          const edad = +(form.querySelector('#edad')?.value || 0);
          const codigo = form.querySelector('#codigo')?.value || '';
          const cumple = form.querySelector('#cumple')?.value || '';
          guardarUsuario({ correo, edad, codigo, cumple });
          alert('Usuario registrado. ¡Tus descuentos se aplicarán automáticamente!');
          location.href = '../index.html';
        });
      }
    });
  }

  // --- Formulario de ingreso/registro (nuevo) ---
  if (location.pathname.endsWith('Ingresar.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form[aria-label="Ingresar"]');
      if (form) {
        form.addEventListener('submit', e => {
          e.preventDefault();
          const correo = form.querySelector('#correo')?.value || '';
          const edad = +(form.querySelector('#edad')?.value || 0);
          const codigo = form.querySelector('#codigo')?.value || '';
          const cumple = form.querySelector('#cumple')?.value || '';
          guardarUsuario({ correo, edad, codigo, cumple });
          alert('Usuario registrado. ¡Tus descuentos se aplicarán automáticamente!');
          location.href = '../index.html';
        });
      }
    });
  }

  // Utilidad para obtener la ruta correcta de imagen según la página
  function getImgPath(img) {
    // Si estamos en la raíz (index.html), no agregamos '../'
    if (location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname === '/index.html') {
      return img.replace('../imagenes/', 'imagenes/').replace('../imagenes2/', 'imagenes2/');
    }
    // Si estamos en /Menu/ o subcarpetas, usamos la ruta tal cual
    return img;
  }

  // Ejemplo de renderizado en catálogo
  if (location.pathname.endsWith('catalogo.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const lista = document.querySelector('.catalogo-lista');
      if (!lista) return;
      lista.innerHTML = TORTAS.map(torta => `
        <div class="col-md-4 mb-4">
          <div class="card h-100 text-center">
            <img src="${getImgPath(torta.imagen)}" class="card-img-top" alt="${torta.nombre}">
            <div class="card-body">
              <h5 class="card-title">${torta.nombre}</h5>
              <p class="card-text">${torta.descripcion}</p>
              <div class="fw-semibold mb-2">${money(torta.precio)}</div>
              <button class="btn btn-primary btn-sm agregar-carrito" data-id="${torta.id}">Agregar al carrito</button>
            </div>
          </div>
        </div>
      `).join('');
      // ...eventos...
    });
  }

  // Ejemplo de renderizado en index.html (tortas más vendidas)
  if (location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname === '/index.html') {
    document.addEventListener('DOMContentLoaded', () => {
      const vendidas = document.querySelector('.tortas-vendidas');
      if (!vendidas) return;
      vendidas.innerHTML = TORTAS.slice(0, 3).map(torta => `
        <div class="col">
          <div class="card h-100 text-center">
            <img src="${getImgPath(torta.imagen)}" class="card-img-top" alt="${torta.nombre}">
            <div class="card-body">
              <h5 class="card-title">${torta.nombre}</h5>
              <p class="card-text">${torta.descripcion}</p>
              <a href="Menu/detalle.html?id=${torta.id}" class="btn btn-primary btn-sm">Ver detalle</a>
            </div>
          </div>
        </div>
      `).join('');
    });
  }

})();
