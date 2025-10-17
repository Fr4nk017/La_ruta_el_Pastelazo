// Página de catálogo - La Ruta el Pastelazo
import { useState, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge, Card, Modal } from 'react-bootstrap';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currency';

export default function Catalog() {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Función debounce simple
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Categorías disponibles
  const categories = [
    'Todas las categorías',
    'Tortas Clásicas',
    'Especiales', 
    'Frutas',
    'Gourmet',
    'Postres Clásicos',
    'Saludables',
    'Veganos',
    'Individuales'
  ];

  // Mapeo de categorías del UI a categorías de datos
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

  // Filtrado de productos
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
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product && (
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  // Debounce para búsqueda
  const debouncedSearch = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const clearFilters = () => {
    setSelectedCategory('Todas las categorías');
    setSearchTerm('');
    // Limpiar también el input de búsqueda
    const searchInput = document.querySelector('input[placeholder="Buscar productos..."]');
    if (searchInput) searchInput.value = '';
  };

  const handleAddToCart = (product) => {
    try {
      if (!product) {
        console.error('Producto no válido:', product);
        return;
      }
      
      add({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.img,
        qty: 1
      });
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const handleShowDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  // Verificar que los productos estén disponibles
  if (!products || !Array.isArray(products)) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-5">
          <div className="text-center">
            <h4>❌ Error al cargar el catálogo</h4>
            <p>No se pudieron cargar los productos</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
            >
              🔄 Recargar página
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className="bg-light min-vh-100">
        <Container className="py-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="display-6 fw-bold mb-2" style={{ color: '#8B4513' }}>
              🍰 Nuestro Catálogo
            </h1>
            <p className="text-muted">
              Descubre nuestra amplia variedad de productos artesanales
            </p>
            <Badge bg="primary" className="fs-6">
              {filteredProducts.length} productos disponibles
            </Badge>
          </div>

          {/* Controles de filtrado */}
          <Row className="mb-4">
            <Col lg={4}>
              <Form.Group>
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group>
                <Form.Label>Buscar productos</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar productos..."
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col lg={2} className="d-flex align-items-end">
              <Button
                variant="outline-secondary"
                onClick={clearFilters}
                disabled={selectedCategory === 'Todas las categorías' && !searchTerm}
                className="w-100"
              >
                🔄 Limpiar
              </Button>
            </Col>
          </Row>

          {/* Resultados */}
          {filteredProducts.length > 0 ? (
            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.id} lg={4} md={6}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={product.img}
                      alt={product.name}
                      style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleShowDetail(product)}
                      onError={(e) => {
                        e.target.src = '/public/imagenes/Logo la ruta el pastelazo.png';
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5">{product.name}</Card.Title>
                      <Card.Text className="text-muted flex-grow-1">
                        {product.description}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold fs-5 text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleShowDetail(product)}
                          >
                            👁️ Ver
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
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
            <div className="text-center py-5">
              <div className="display-1 mb-3">🔍</div>
              <h4>No se encontraron productos</h4>
              <p className="text-muted mb-3">
                {searchTerm 
                  ? `No hay productos que coincidan con "${searchTerm}"`
                  : `No hay productos en la categoría "${selectedCategory}"`
                }
              </p>
              <Button variant="primary" onClick={clearFilters}>
                Ver todos los productos
              </Button>
            </div>
          )}

          {/* Información adicional */}
          <div className="text-center mt-5 pt-4 border-top">
            <Row>
              <Col md={3}>
                <div className="mb-3">
                  <div className="display-6 fw-bold text-primary">
                    {products?.length || 0}
                  </div>
                  <small className="text-muted">Productos totales</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-3">
                  <div className="display-6 fw-bold text-success">
                    {categories.length - 1}
                  </div>
                  <small className="text-muted">Categorías</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-3">
                  <div className="display-6 fw-bold text-info">
                    50+
                  </div>
                  <small className="text-muted">Años de experiencia</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="mb-3">
                  <div className="display-6 fw-bold text-warning">
                    ⭐
                  </div>
                  <small className="text-muted">Calidad garantizada</small>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Modal de Detalle del Producto */}
      <Modal show={showDetailModal} onHide={handleCloseDetail} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Row>
              <Col md={6}>
                <img 
                  src={selectedProduct.img} 
                  alt={selectedProduct.name}
                  className="img-fluid rounded"
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/public/imagenes/Logo la ruta el pastelazo.png';
                  }}
                />
              </Col>
              <Col md={6}>
                <h4 className="mb-3">{selectedProduct.name}</h4>
                <p className="text-muted mb-3">{selectedProduct.description}</p>
                
                {/* Precio */}
                <div className="mb-4">
                  <h5 className="text-primary fw-bold">
                    {formatPrice(selectedProduct.price)}
                  </h5>
                </div>

                {/* Información adicional */}
                <div className="mb-4">
                  <h6>🏷️ Categoría:</h6>
                  <Badge bg="secondary" className="mb-2">
                    {categories.find(cat => categoryMapping[cat] === selectedProduct.category) || selectedProduct.category}
                  </Badge>
                </div>

                {/* Ingredientes si están disponibles */}
                {selectedProduct.ingredients && (
                  <div className="mb-4">
                    <h6>🍯 Ingredientes principales:</h6>
                    <ul className="list-unstyled">
                      {selectedProduct.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-muted">• {ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tamaños si están disponibles */}
                {selectedProduct.sizes && (
                  <div className="mb-4">
                    <h6>📏 Tamaños disponibles:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, index) => (
                        <Badge key={index} bg="outline-primary" className="p-2">
                          {size.name} - {formatPrice(selectedProduct.price * size.multiplier)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

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
                  >
                    🛒 Agregar al Carrito
                  </Button>
                  <Button variant="outline-secondary" onClick={handleCloseDetail}>
                    Cerrar
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}