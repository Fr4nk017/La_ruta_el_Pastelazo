// Constantes de productos - La Ruta el Pastelazo
export const PRODUCT_CATEGORIES = {
  TORTAS: 'tortas',
  POSTRES: 'postres',
  VEGANO: 'vegano',
  SIN_GLUTEN: 'sin-gluten',
  SIN_AZUCAR: 'sin-azucar',
  ESPECIALES: 'especiales'
};

export const PRODUCT_SIZES = {
  MINI: { name: 'Mini', multiplier: 0.5 },
  PERSONAL: { name: 'Personal', multiplier: 0.7 },
  MEDIANA: { name: 'Mediana', multiplier: 1 },
  GRANDE: { name: 'Grande', multiplier: 1.5 },
  FAMILIAR: { name: 'Familiar', multiplier: 2 },
  EXTRA_GRANDE: { name: 'Extra Grande', multiplier: 2.5 }
};

export const DELIVERY_ZONES = {
  CENTRO: { zone: 'Centro', price: 2000 },
  PERIFERIA: { zone: 'Periferia', price: 3500 },
  RURAL: { zone: 'Rural', price: 5000 }
};

export const PREPARATION_TIMES = {
  INMEDIATO: '30 minutos',
  RAPIDO: '1-2 horas',
  NORMAL: '4-6 horas',
  ESPECIAL: '24-48 horas'
};