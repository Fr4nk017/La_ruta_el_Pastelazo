export const PRODUCTOS = {
  'torta-circular-vainilla': {
    nombre: 'Torta Circular de Vainilla',
    descripcion: 'Deliciosa torta de vainilla con suave textura y sabor tradicional',
    precio: 'CLP $25.000',
    imagen: '/imagenes/tortas/Torta_Circular_de_Vainilla.png',
    categoria: 'circular',
    masVendido: true,
    ingredientes: ['Harina', 'Azúcar', 'Huevos', 'Mantequilla', 'Esencia de vainilla'],
    peso: '1.5 kg',
    porciones: '8-10 personas'
  },
  'torta-cuadrada-chocolate': {
    nombre: 'Torta Cuadrada de Chocolate',
    descripcion: 'Rica torta de chocolate con cobertura cremosa',
    precio: 'CLP $28.000',
    imagen: '/imagenes/tortas/Torta Cuadrada de Chocolate.png',
    categoria: 'cuadrada',
    ingredientes: ['Harina', 'Cacao', 'Azúcar', 'Huevos', 'Chocolate'],
    peso: '1.8 kg',
    porciones: '10-12 personas'
  },
  'mousse-chocolate': {
    nombre: 'Mousse de Chocolate',
    descripcion: 'Suave mousse de chocolate con textura aérea y sabor intenso',
    precio: 'CLP $18.000',
    imagen: '/imagenes/tortas/Mousse_de_Chocolate.png',
    categoria: 'individual',
    nuevo: true,
    ingredientes: ['Chocolate', 'Crema', 'Huevos', 'Azúcar'],
    peso: '0.8 kg',
    porciones: '6-8 personas'
  },
  'tiramisu-clasico': {
    nombre: 'Tiramisú Clásico',
    descripcion: 'Auténtico tiramisú italiano con café y mascarpone',
    precio: 'CLP $22.000',
    imagen: '/imagenes/tortas/Tiramisú_Clásico.png',
    categoria: 'individual',
    ingredientes: ['Mascarpone', 'Café', 'Bizcochos', 'Cacao', 'Licor'],
    peso: '1.2 kg',
    porciones: '8 personas'
  },
  'empanada-manzana': {
    nombre: 'Empanada de Manzana',
    descripcion: 'Empanada casera rellena de manzanas con canela',
    precio: 'CLP $3.500',
    imagen: '/imagenes/tortas/Empanada_de_Manzana.png',
    categoria: 'tradicional',
    ingredientes: ['Manzana', 'Canela', 'Azúcar', 'Masa de hojaldre'],
    peso: '150g',
    porciones: '1 persona'
  },
  'torta-especial-cumpleanos': {
    nombre: 'Torta Especial de Cumpleaños',
    descripcion: 'Torta personalizada para celebraciones especiales',
    precio: 'CLP $35.000',
    imagen: '/imagenes/tortas/Torta Especial de Cumpleaños.png',
    categoria: 'especial',
    ingredientes: ['Personalizable según preferencias'],
    peso: '2 kg',
    porciones: '12-15 personas'
  },
  'torta-circular-manjar': {
    nombre: 'Torta Circular de Manjar',
    descripcion: 'Irresistible torta con dulce de leche casero',
    precio: 'CLP $26.000',
    imagen: '/imagenes/tortas/Torta_Circular _de _Manjar.png',
    categoria: 'circular',
    masVendido: true,
    ingredientes: ['Harina', 'Dulce de leche', 'Huevos', 'Mantequilla'],
    peso: '1.6 kg',
    porciones: '8-10 personas'
  },
  'kuchen-frambuesa': {
    nombre: 'Kuchen de Frambuesa',
    descripción: 'Tradicional kuchen alemán con frambuesas frescas',
    precio: 'CLP $24.000',
    imagen: '/imagenes/tortas/Torta_de_kuchen_de_frambuesa.png',
    categoria: 'tradicional',
    ingredientes: ['Frambuesas', 'Masa quebrada', 'Crema pastelera'],
    peso: '1.4 kg',
    porciones: '8 personas'
  },
  'torta-papaya': {
    nombre: 'Torta de Papaya',
    descripcion: 'Refrescante torta tropical con papaya natural',
    precio: 'CLP $23.000',
    imagen: '/imagenes/tortas/Torta_de_Papaya.png',
    categoria: 'circular',
    nuevo: true,
    ingredientes: ['Papaya', 'Crema', 'Bizcocho', 'Gelatina'],
    peso: '1.3 kg',
    porciones: '8 personas'
  },
  'torta-uva-chardonnay': {
    nombre: 'Torta de Uva Chardonnay',
    descripcion: 'Elegante torta con uvas y toque de vino blanco',
    precio: 'CLP $32.000',
    imagen: '/imagenes/tortas/Torta_de_uva_Chardonnay.png',
    categoria: 'especial',
    ingredientes: ['Uvas', 'Vino Chardonnay', 'Crema', 'Bizcocho'],
    peso: '1.7 kg',
    porciones: '10 personas'
  },
  'brownie-sin-gluten': {
    nombre: 'Brownie Sin Gluten',
    descripcion: 'Delicioso brownie apto para celíacos',
    precio: 'CLP $15.000',
    imagen: '/imagenes/tortas2/brownie sin gluten.avif',
    categoria: 'singluten',
    ingredientes: ['Harina sin gluten', 'Chocolate', 'Nueces'],
    peso: '0.6 kg',
    porciones: '6 personas'
  },
  'cheesecake-sin-azucar': {
    nombre: 'Cheesecake Sin Azúcar',
    descripcion: 'Cheesecake endulzado naturalmente, ideal para diabéticos',
    precio: 'CLP $20.000',
    imagen: '/imagenes/tortas2/cheesecake sin azucar.jpg',
    categoria: 'sinazucar',
    ingredientes: ['Queso crema', 'Stevia', 'Galletas integrales'],
    peso: '1.0 kg',
    porciones: '8 personas'
  },
  'galletas-veganas': {
    nombre: 'Galletas Veganas',
    descripcion: 'Galletas 100% veganas con ingredientes naturales',
    precio: 'CLP $8.000',
    imagen: '/imagenes/tortas2/galletas veganas.jpg',
    categoria: 'vegana',
    ingredientes: ['Harina integral', 'Aceite de coco', 'Azúcar de coco'],
    peso: '300g',
    porciones: '12 unidades'
  }
}

export const CATEGORIAS = {
  cuadrada: 'Tortas Cuadradas',
  circular: 'Tortas Circulares',
  individual: 'Postres Individuales',
  sinazucar: 'Productos Sin Azúcar',
  tradicional: 'Pastelería Tradicional',
  singluten: 'Productos Sin Gluten',
  vegana: 'Productos Veganos',
  especial: 'Tortas Especiales'
}