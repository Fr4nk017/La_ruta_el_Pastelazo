// Página de catálogo ROBUSTA - La Ruta el Pastelazo
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge, Card, Modal, Spinner, Alert } from 'react-bootstrap';
import { products as defaultProducts } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currency';
import { getImageUrl, handleImageError } from '../utils/images';

export default function Catalog() {
  // Estados principales
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [products, setProducts] = useState([]);

  // Hook del carrito
  const { add } = useCart();

  // Función debounce optimizada
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Inicialización con manejo de errores
  useEffect(() => {
    const initializeCatalog = async () => {
      try {
        setLoading(true);
        
        // Cargar productos del localStorage o usar productos por defecto
        const savedProducts = localStorage.getItem('products_data');
        let loadedProducts;
        
        if (savedProducts) {
          loadedProducts = JSON.parse(savedProducts);
        } else {
          loadedProducts = defaultProducts;
          localStorage.setItem('products_data', JSON.stringify(defaultProducts));
        }
        
        // Verificar que los productos estén disponibles
        if (!loadedProducts || !Array.isArray(loadedProducts) || loadedProducts.length === 0) {
          throw new Error('No se pudieron cargar los productos del catálogo');
        }

        setProducts(loadedProducts);
        
        // Simular carga para mejor UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setError(null);
      } catch (err) {
        console.error('Error inicializando catálogo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeCatalog();
  }, []);

  // Categorías disponibles con iconos
  const categories = [
    { key: 'Todas las categorías', icon: '🍰', count: products?.length || 0 },
    { key: 'Tortas Clásicas', icon: '🎂', count: products?.filter(p => p.category === 'clasicas').length || 0 },
    { key: 'Especiales', icon: '✨', count: products?.filter(p => p.category === 'especiales').length || 0 },
    { key: 'Frutas', icon: '🍓', count: products?.filter(p => p.category === 'frutas').length || 0 },
    { key: 'Gourmet', icon: '👑', count: products?.filter(p => p.category === 'gourmet').length || 0 },
    { key: 'Postres Clásicos', icon: '🍮', count: products?.filter(p => p.category === 'clasicos').length || 0 },
    { key: 'Saludables', icon: '🥗', count: products?.filter(p => p.category === 'saludables').length || 0 },
    { key: 'Veganos', icon: '🌱', count: products?.filter(p => p.category === 'veganos').length || 0 },
    { key: 'Individuales', icon: '🧁', count: products?.filter(p => p.category === 'individuales').length || 0 }
  ];

  // Mapeo de categorías UI a datos
  const categoryMapping = {
    'Todas las categorías': 'all',
    'Tortas Clásicas': 'clasicas',
    'Especiales': 'especiales',
    'Frutas': 'frutas',
    'Gourmet': 'gourmet',
    'Postres Clásicos': 'clasicos',
    'Saludables': 'saludables',
    'Veganos': 'veganos',
    'Individuales': 'individuales'
  };

  // Filtrado optimizado de productos
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [];
    }

    let filtered = products;

    // Filtro por categoría
    const mappedCategory = categoryMapping[selectedCategory];
    if (mappedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product && product.category === mappedCategory
      );
    }

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product && (
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower)
        )
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  // Búsqueda con debounce
  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    [debounce]
  );

  // Handlers
  const handleSearchChange = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const clearFilters = useCallback(() => {
    setSelectedCategory('Todas las categorías');
    setSearchTerm('');
    // Limpiar input
    const searchInput = document.querySelector('input[placeholder*="Buscar"]');
    if (searchInput) searchInput.value = '';
  }, []);

  const handleAddToCart = useCallback((product) => {
    try {
      if (!product || !product.id) {
        throw new Error('Producto no válido');
      }
      
      add({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.img,
        qty: 1
      });

      // Mostrar feedback visual (opcional)
      // toast.success(`${product.name} agregado al carrito`);
      
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      // toast.error('Error al agregar producto');
    }
  }, [add]);

  const handleShowDetail = useCallback((product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  }, []);

  const handleImageErrorInternal = useCallback((e, productId) => {
    handleImageError(e);
    setImageErrors(prev => new Set([...prev, productId]));
  }, []);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <div className="text-center">
            <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
            <h4 className="mb-2">🍰 Cargando catálogo...</h4>
            <p className="text-muted">Preparando nuestros deliciosos productos para ti</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Alert variant="danger" className="text-center shadow">
                <div className="display-4 mb-3">😕</div>
                <h4>Error al cargar el catálogo</h4>
                <p className="mb-3">{error}</p>
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.reload()}
                    style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                  >
                    🔄 Recargar página
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => window.history.back()}
                  >
                    ← Volver atrás
                  </Button>
                </div>
              </Alert>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light min-vh-100">
        <Container className="py-4">
          {/* Header mejorado */}
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3" style={{ color: '#8B4513' }}>
              🍰 Nuestro Catálogo Artesanal
            </h1>
            <p className="lead text-muted mb-3">
              Descubre nuestra exquisita selección de postres hechos con amor y los mejores ingredientes
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Badge bg="primary" className="fs-6 px-3 py-2">
                {filteredProducts.length} productos encontrados
              </Badge>
              <Badge bg="success" className="fs-6 px-3 py-2">
                ✨ Calidad artesanal
              </Badge>
              <Badge bg="info" className="fs-6 px-3 py-2">
                🚚 Delivery disponible
              </Badge>
            </div>
          </div>

          {/* Controles de filtrado mejorados */}
          <Card className="mb-4 shadow-sm border-0">
            <Card.Body>
              <Row className="g-3">
                <Col lg={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      🏷️ Categoría
                    </Form.Label>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="form-select-lg"
                    >
                      {categories.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.icon} {category.key} ({category.count})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      🔍 Buscar productos
                    </Form.Label>
                    <InputGroup size="lg">
                      <InputGroup.Text>🔍</InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, descripción o categoría..."
                        onChange={handleSearchChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={2} className="d-flex align-items-end">
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    onClick={clearFilters}
                    disabled={selectedCategory === 'Todas las categorías' && !searchTerm}
                    className="w-100"
                  >
                    🔄 Limpiar
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Grid de productos */}
          {filteredProducts.length > 0 ? (
            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.id} xl={4} lg={6} md={6}>
                  <Card className="h-100 shadow-sm border-0 position-relative overflow-hidden product-card">
                    {/* Badge de categoría */}
                    <div className="position-absolute top-0 start-0 m-2 z-index-1">
                      <Badge 
                        bg="dark" 
                        className="bg-opacity-75"
                        style={{ fontSize: '0.7em' }}
                      >
                        {categories.find(cat => categoryMapping[cat.key] === product.category)?.icon || '🍰'} 
                        {categories.find(cat => categoryMapping[cat.key] === product.category)?.key || 'Producto'}
                      </Badge>
                    </div>

                    {/* Imagen del producto */}
                    <div 
                      className="position-relative overflow-hidden"
                      style={{ height: '280px', cursor: 'pointer' }}
                      onClick={() => handleShowDetail(product)}
                    >
                      <Card.Img
                        variant="top"
                        src={getImageUrl(product.img)}
                        alt={product.name}
                        className="h-100 w-100 object-fit-cover transition-transform"
                        style={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => handleImageErrorInternal(e, product.id)}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      {/* Overlay de hover */}
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-0 d-flex align-items-center justify-content-center transition-all hover-overlay">
                        <Button variant="light" className="opacity-0">
                          👁️ Ver detalle
                        </Button>
                      </div>
                    </div>

                    <Card.Body className="d-flex flex-column p-3">
                      <div className="flex-grow-1">
                        <Card.Title className="h5 mb-2 fw-bold">
                          {product.name}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-3 line-clamp-2">
                          {product.description}
                        </Card.Text>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="h5 mb-0 fw-bold text-primary">
                            {formatPrice(product.price)}
                          </div>
                          <small className="text-muted">Precio base</small>
                        </div>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowDetail(product)}
                            className="d-flex align-items-center gap-1"
                          >
                            👁️ Ver
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                            className="d-flex align-items-center gap-1"
                          >
                            🛒 Agregar
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            // Estado vacío mejorado
            <div className="text-center py-5">
              <div className="mb-4">
                <div className="display-1 mb-3">🔍</div>
                <h4 className="mb-3">No se encontraron productos</h4>
                <p className="text-muted mb-4 lead">
                  {searchTerm.trim() 
                    ? `No hay productos que coincidan con "${searchTerm}"`
                    : `No hay productos en la categoría "${selectedCategory}"`
                  }
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button 
                    variant="primary" 
                    onClick={clearFilters}
                    style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                  >
                    🍰 Ver todos los productos
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSelectedCategory('Tortas Clásicas')}
                  >
                    🎂 Ver tortas clásicas
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Estadísticas del catálogo */}
          <Card className="mt-5 border-0 shadow-sm bg-gradient">
            <Card.Body className="py-4">
              <h5 className="text-center mb-4 fw-bold">📊 Nuestro Catálogo en Números</h5>
              <Row className="text-center">
                <Col md={3} className="mb-3">
                  <div className="display-6 fw-bold text-primary">
                    {products?.length || 0}
                  </div>
                  <small className="text-muted fw-semibold">Productos únicos</small>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="display-6 fw-bold text-success">
                    {categories.length - 1}
                  </div>
                  <small className="text-muted fw-semibold">Categorías</small>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="display-6 fw-bold text-info">
                    50+
                  </div>
                  <small className="text-muted fw-semibold">Años de experiencia</small>
                </Col>
                <Col md={3} className="mb-3">
                  <div className="display-6 fw-bold text-warning">
                    ⭐
                  </div>
                  <small className="text-muted fw-semibold">Calidad garantizada</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Modal de Detalle Mejorado */}
      <Modal 
        show={showDetailModal} 
        onHide={handleCloseDetail} 
        size="xl"
        centered
        className="product-detail-modal"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="h4 fw-bold">
            {selectedProduct?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedProduct && (
            <Row className="g-4">
              <Col lg={6}>
                <div className="position-relative">
                  <img 
                    src={getImageUrl(selectedProduct.img)} 
                    alt={selectedProduct.name}
                    className="img-fluid rounded-3 shadow"
                    style={{ 
                      width: '100%', 
                      maxHeight: '500px', 
                      objectFit: 'cover' 
                    }}
                    onError={handleImageError}
                  />
                  <Badge 
                    bg="dark" 
                    className="position-absolute top-0 start-0 m-3 bg-opacity-75"
                  >
                    {categories.find(cat => categoryMapping[cat.key] === selectedProduct.category)?.icon || '🍰'} 
                    {categories.find(cat => categoryMapping[cat.key] === selectedProduct.category)?.key || 'Producto'}
                  </Badge>
                </div>
              </Col>
              <Col lg={6}>
                <div className="h-100 d-flex flex-column">
                  <div className="flex-grow-1">
                    <h3 className="mb-3 fw-bold">{selectedProduct.name}</h3>
                    <p className="text-muted mb-4 lead">
                      {selectedProduct.description}
                    </p>
                    
                    {/* Precio destacado */}
                    <div className="mb-4 p-3 bg-light rounded-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="text-primary fw-bold mb-1">
                            {formatPrice(selectedProduct.price)}
                          </h4>
                          <small className="text-muted">Precio base</small>
                        </div>
                        <div className="text-end">
                          <div className="small text-success fw-semibold">✅ Disponible</div>
                          <div className="small text-muted">Entrega en 24-48hrs</div>
                        </div>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-2">🏷️ Detalles del producto:</h6>
                      <ul className="list-unstyled">
                        <li className="mb-1">
                          <strong>Categoría:</strong> {categories.find(cat => categoryMapping[cat.key] === selectedProduct.category)?.key || 'General'}
                        </li>
                        <li className="mb-1">
                          <strong>ID:</strong> {selectedProduct.id}
                        </li>
                        <li className="mb-1">
                          <strong>Disponibilidad:</strong> <span className="text-success">En stock</span>
                        </li>
                      </ul>
                    </div>

                    {/* Ingredientes si están disponibles */}
                    {selectedProduct.ingredients && (
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-2">🍯 Ingredientes principales:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedProduct.ingredients.map((ingredient, index) => (
                            <Badge key={index} bg="light" text="dark" className="px-2 py-1">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tamaños si están disponibles */}
                    {selectedProduct.sizes && (
                      <div className="mb-4">
                        <h6 className="fw-semibold mb-2">📏 Tamaños disponibles:</h6>
                        <Row className="g-2">
                          {selectedProduct.sizes.map((size, index) => (
                            <Col key={index} sm={6}>
                              <div className="border rounded p-2 text-center">
                                <div className="fw-semibold">{size.name}</div>
                                <div className="text-primary fw-bold">
                                  {formatPrice(selectedProduct.price * size.multiplier)}
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        handleCloseDetail();
                      }}
                      style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
                      className="fw-semibold"
                    >
                      🛒 Agregar al Carrito - {formatPrice(selectedProduct.price)}
                    </Button>
                    <div className="row g-2">
                      <div className="col">
                        <Button 
                          variant="outline-primary" 
                          className="w-100"
                          onClick={() => {
                            // Función para compartir producto
                            if (navigator.share) {
                              navigator.share({
                                title: selectedProduct.name,
                                text: selectedProduct.description,
                                url: window.location.href
                              });
                            }
                          }}
                        >
                          📤 Compartir
                        </Button>
                      </div>
                      <div className="col">
                        <Button 
                          variant="outline-secondary" 
                          className="w-100"
                          onClick={handleCloseDetail}
                        >
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>

      {/* Estilos CSS inline para animaciones */}
      <style jsx>{`
        .product-card:hover .hover-overlay {
          background-color: rgba(0,0,0,0.1) !important;
        }
        .product-card:hover .hover-overlay .btn {
          opacity: 1 !important;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .transition-transform {
          transition: transform 0.3s ease;
        }
        .bg-gradient {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
      `}</style>
    </>
  );
}