// --- Catálogo de productos ---
const PRODUCTOS = {
  "TC001": {
    nombre: "Torta Cuadrada de Chocolate",
    imagen: "../imagenes/tortas/Torta Cuadrada de Chocolate.png",
    descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.",
    precio: "$45.000"
  },
  "TC002": {
    nombre: "Torta Cuadrada de Frutas",
    imagen: "../imagenes/tortas2/torta cuadrada de frutas.jpg",
    descripcion: "Bizcocho relleno con crema pastelera y frutas de temporada, cubierta con glasé natural.",
    precio: "$50.000"
  },
  "TT001": {
    nombre: "Torta Circular de Vainilla",
    imagen: "../imagenes/tortas/Torta Circular de Vainilla.png",
    descripcion: "Bizcocho esponjoso de vainilla con relleno de crema pastelera y cobertura de glasé.",
    precio: "$40.000"
  },
  "TT002": {
    nombre: "Torta Circular de Manjar",
    imagen: "../imagenes/tortas/Torta_Circular _de _Manjar.png",
    descripcion: "Bizcocho de vainilla relleno de manjar y crema, cubierta de merengue flameado.",
    precio: "$42.000"
  },
  "PI001": {
    nombre: "Mousse de Chocolate",
    imagen: "../imagenes/tortas2/mousse de chocolate.jpg",
    descripcion: "Mousse cremoso de chocolate amargo con toques de café, servido en porción individual.",
    precio: "$5.000"
  },
  "PI002": {
    nombre: "Tiramisú Clásico",
    imagen: "../imagenes/tortas2/tiramisu clasico.jpg",
    descripcion: "Postre italiano elaborado con bizcochos empapados en café, crema de mascarpone y cacao espolvoreado.",
    precio: "$5.500"
  },
  "PSA001": {
    nombre: "Torta Sin Azúcar de Naranja",
    imagen: "../imagenes/tortas2/torta sin azucar de naranja.webp",
    descripcion: "Torta esponjosa con jugo de naranja natural, endulzada con stevia. Ideal para diabéticos.",
    precio: "$48.000"
  },
  "PSA002": {
    nombre: "Cheesecake Sin Azúcar",
    imagen: "../imagenes/tortas2/cheesecake sin azucar.jpg",
    descripcion: "Cheesecake con base de galleta integral y endulzado sin azúcar. Suave y delicioso.",
    precio: "$47.000"
  },
  "PT001": {
    nombre: "Empanada de Manzana",
    imagen: "../imagenes/tortas/Empanada_de_Manzana.png",
    descripcion: "Masa fina rellena de manzana caramelizada con un toque de canela.",
    precio: "$3.000"
  },
  "PT002": {
    nombre: "Tarta de Santiago",
    imagen: "../imagenes/tortas2/TARTA-DE-SANTIAGO.jpg",
    descripcion: "Clásica tarta gallega de almendra con azúcar glas y cruz de Santiago.",
    precio: "$6.000"
  },
  "PG001": {
    nombre: "Brownie Sin Gluten",
    imagen: "../imagenes/tortas2/brownie sin gluten.avif",
    descripcion: "Brownie de chocolate intenso elaborado con harina sin gluten.",
    precio: "$4.000"
  },
  "PG002": {
    nombre: "Pan Sin Gluten",
    imagen: "../imagenes/tortas2/Pan-sin-gluten.jpg",
    descripcion: "Pan artesanal elaborado con mezcla de harinas sin gluten, suave y esponjoso.",
    precio: "$3.500"
  },
  "PV001": {
    nombre: "Torta Vegana de Chocolate",
    imagen: "../imagenes/tortas2/torta-vegana-chocolate-arandanos.jpg",
    descripcion: "Bizcocho húmedo de cacao elaborado sin productos de origen animal.",
    precio: "$50.000"
  },
  "PV002": {
    nombre: "Galletas Veganas de Avena",
    imagen: "../imagenes/tortas2/galletas veganas.jpg",
    descripcion: "Crujientes galletas veganas de avena y pasas, sin huevo ni lácteos.",
    precio: "$4.500"
  },
  "TE001": {
    nombre: "Torta Especial de Cumpleaños",
    imagen: "../imagenes/tortas/Torta Especial de Cumpleaños.png",
    descripcion: "Torta de varias capas, rellena de crema, frutas y cubierta con fondant personalizado.",
    precio: "$55.000"
  },
  "TE002": {
    nombre: "Torta Especial de Boda",
    imagen: "../imagenes/tortas2/torta-especial-de-boda.jpg",
    descripcion: "Elegante torta de varios pisos decorada con flores de azúcar. Ideal para celebraciones de boda.",
    precio: "$60.000"
  },
  "TL001": {
    nombre: "Torta Tres Leches",
    imagen: "../imagenes/tortas/TRES-LECHES-1.webp",
    descripcion: "Bizcocho suave empapado en tres tipos de leche, cubierto con merengue y frutas.",
    precio: "$22.900"
  },
  "TN001": {
    nombre: "Torta Naranja",
    imagen: "../imagenes/tortas2/torta-naranja.jpg",
    descripcion: "Bizcocho esponjoso de naranja con relleno de crema y cobertura de glasé.",
    precio: "$27.990"
  },
  "TP001": {
    nombre: "Torta de Papaya",
    imagen: "../imagenes/tortas/Torta_de_Papaya.png",
    descripcion: "Bizcocho relleno de crema y papaya natural, decorado con frutas frescas.",
    precio: "$24.500"
  }
};

// --- Renderizar detalle de producto y comentarios ---
window.renderizarDetalleProducto = function() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const cont = document.getElementById('detalle-producto');
  const error = document.getElementById('detalle-error');
  if (!cont) return;
  if (id && PRODUCTOS[id]) {
    const prod = PRODUCTOS[id];
    cont.innerHTML = `
      <div class="col-md-5 text-center">
        <img src="${prod.imagen}" alt="${prod.nombre}" class="img-fluid rounded-4 shadow" style="max-width:340px;">
      </div>
      <div class="col-md-7">
        <h2 class="mb-3" style="font-family: 'Pacifico', cursive;">${prod.nombre}</h2>
        <p class="mb-3">${prod.descripcion}</p>
        <p class="fw-bold fs-4" style="color:#B26673;">${prod.precio}</p>
        <form id="form-personalizacion" class="mb-3">
          <div class="mb-2">
            <label for="tamano" class="form-label">Tamaño:</label>
            <select id="tamano" class="form-select" required>
              <option value="">Selecciona tamaño</option>
              <option value="Pequeño">Pequeño (8 porciones)</option>
              <option value="Mediano">Mediano (12 porciones)</option>
              <option value="Grande">Grande (20 porciones)</option>
            </select>
          </div>
          <div class="mb-2">
            <label for="relleno" class="form-label">Relleno:</label>
            <select id="relleno" class="form-select" required>
              <option value="">Selecciona relleno</option>
              <option value="Manjar">Manjar</option>
              <option value="Crema Pastelera">Crema Pastelera</option>
              <option value="Frutas">Frutas</option>
              <option value="Chocolate">Chocolate</option>
              <option value="Sin relleno">Sin relleno</option>
            </select>
          </div>
          <div class="mb-2">
            <label for="mensaje" class="form-label">Mensaje personalizado (opcional):</label>
            <input type="text" id="mensaje" class="form-control" maxlength="40" placeholder="Feliz Cumpleaños, Te quiero, etc.">
          </div>
          <button type="submit" class="btn btn-primary">Agregar al carrito</button>
          <a href="catalogo.html" class="btn btn-outline-primary ms-2">Volver al catálogo</a>
        </form>
        <div id="alerta-detalle" class="alert alert-success d-none" role="alert"></div>
      </div>
    `;
    // Personalización y agregar al carrito
    document.getElementById('form-personalizacion').addEventListener('submit', function(e) {
      e.preventDefault();
      const tamano = document.getElementById('tamano').value;
      const relleno = document.getElementById('relleno').value;
      const mensaje = document.getElementById('mensaje').value.trim();
      if (!tamano || !relleno) return;
      const precioNum = Number(prod.precio.replace(/[^\d]/g, ''));
      const item = {
        id: id,
        nombre: prod.nombre + ` (${tamano}, ${relleno}${mensaje ? ', \"' + mensaje + '\"' : ''})`,
        precio: precioNum,
        cantidad: 1,
        tamano,
        relleno,
        mensaje
      };
      if (window.carrito && typeof window.carrito.agregar === 'function') {
        window.carrito.agregar(item);
      } else {
        let items = [];
        try { items = JSON.parse(localStorage.getItem('carrito') || '[]'); } catch(e) { items = []; }
        items.push(item);
        localStorage.setItem('carrito', JSON.stringify(items));
      }
      const alerta = document.getElementById('alerta-detalle');
      alerta.textContent = '¡Producto personalizado agregado al carrito!';
      alerta.classList.remove('d-none','alert-danger');
      alerta.classList.add('alert-success');
      setTimeout(() => { alerta.classList.add('d-none'); }, 2000);
    });
  } else if (error) {
    error.classList.remove('d-none');
  }
  // Comentarios por producto
  const idProd = id;
  const lista = document.getElementById('lista-comentarios');
  const form = document.getElementById('form-comentario');
  function renderComentarios() {
    if (!lista) return;
    const comentarios = JSON.parse(localStorage.getItem('comentarios_' + idProd) || '[]');
    lista.innerHTML = comentarios.map(c => `<li class="list-group-item">${c}</li>`).join('');
  }
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const txt = document.getElementById('comentario').value.trim();
    if (txt) {
      const comentarios = JSON.parse(localStorage.getItem('comentarios_' + idProd) || '[]');
      comentarios.push(txt);
      localStorage.setItem('comentarios_' + idProd, JSON.stringify(comentarios));
      document.getElementById('comentario').value = '';
      renderComentarios();
    }
  });
  renderComentarios();
};
/* ===== Pastelería Mil Sabores – JS de catálogo/carrito ===== */
(function(){
  // Renderizar carrito en la tabla (para carrito.html)
  function renderizarCarritoHTML() {
    const tbody = document.getElementById('carrito');
    const totalCell = document.getElementById('total-carrito');
    const resumen = document.getElementById('resumen-carrito');
    const money = n => new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(n);
    let total = 0;
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem('carrito') || '[]');
    } catch(e) { items = []; }
    if (!tbody) return;
    tbody.innerHTML = '';
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Tu carrito está vacío. <a href='catalogo.html'>Ir al catálogo</a></td></tr>`;
      if (resumen) resumen.innerHTML = '';
      if (totalCell) totalCell.textContent = money(0);
      return;
    }
    items.forEach((item, idx) => {
      const subtotal = (item.precio || 0) * (item.cantidad || 1);
      total += subtotal;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          ${item.imagen ? `<img src="${item.imagen}" alt="img" style="width:48px;height:48px;object-fit:cover;border-radius:8px;margin-right:8px;">` : ''}
          <strong>${item.nombre || ''}</strong>
        </td>
        <td><input type="number" min="1" value="${item.cantidad || 1}" class="form-control form-control-sm cantidad-carrito" data-idx="${idx}"></td>
        <td>${item.relleno ? item.relleno : '-'}</td>
        <td>${item.mensaje ? item.mensaje : '-'}</td>
        <td>${money(subtotal)}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="quitarDelCarrito(${idx})">Quitar</button></td>
      `;
      tbody.appendChild(tr);
    });
    if (totalCell) totalCell.textContent = money(total);
    if (resumen) {
      resumen.innerHTML = `<div class="alert alert-info">Total productos: <b>${items.length}</b> &nbsp;|&nbsp; Total a pagar: <b>${money(total)}</b></div>
      <button class="btn btn-outline-danger btn-sm" id="vaciar-carrito">Vaciar carrito</button>`;
      document.getElementById('vaciar-carrito').onclick = function() {
        localStorage.removeItem('carrito');
        renderizarCarritoHTML();
        document.dispatchEvent(new CustomEvent('producto-quitado'));
      };
    }
    // Permitir editar cantidad
    tbody.querySelectorAll('.cantidad-carrito').forEach(input => {
      input.addEventListener('change', function() {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 1) val = 1;
        items[this.dataset.idx].cantidad = val;
        localStorage.setItem('carrito', JSON.stringify(items));
        renderizarCarritoHTML();
      });
    });
  }

  // Quitar producto del carrito y recargar
  window.quitarDelCarrito = function(idx) {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem('carrito') || '[]');
    } catch(e) { items = []; }
    items.splice(idx, 1);
    localStorage.setItem('carrito', JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('producto-quitado'));
    setTimeout(() => location.reload(), 800);
  }

  // Exponer la función para que pueda ser llamada desde carrito.html
  window.renderizarCarritoHTML = renderizarCarritoHTML;
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
  // (Evento duplicado eliminado, solo se usa el de .agregar-carrito)

  // Función para buscar producto por ID
  function buscarProductoPorId(id) {
    return (typeof TORTAS !== 'undefined' ? TORTAS : []).find(p => p.id === id);
  }

  // Evento global para agregar al carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('agregar-carrito')) {
      e.preventDefault();
      const id = e.target.getAttribute('data-id');
      let producto = buscarProductoPorId(id);
      // Si no existe TORTAS o no se encuentra el producto, obtener datos del HTML
      if (!producto) {
        const card = e.target.closest('.catalogo-item');
        if (card) {
          const nombre = card.querySelector('.catalogo-nombre')?.textContent?.trim() || '';
          const precioTxt = card.querySelector('.catalogo-precio')?.textContent || '';
          const precio = parseInt(precioTxt.replace(/\D/g, '')) || 0;
          const img = card.querySelector('img')?.getAttribute('src') || '';
          producto = { id, nombre, precio, img };
        }
      }
      if (producto) {
        const item = { ...producto, cantidad: 1 };
        const items = carrito.obtener();
        const idx = items.findIndex(p => p.id === item.id);
        if (idx >= 0) {
          items[idx].cantidad += 1;
        } else {
          items.push(item);
        }
        carrito.guardar(items);
        // Feedback visual: lanzar evento personalizado
        document.dispatchEvent(new CustomEvent('producto-agregado'));
      } else {
        alert('No se encontró el producto');
      }
    }
  });

})();
