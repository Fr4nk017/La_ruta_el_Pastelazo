// Página de catálogo - Pastelería 1000 Sabores
import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge, Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ui';
import { debounce } from '../utils/helpers';

export default function Catalog() {
  const { add } = useCart();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Manejar query parameters para producto específico
  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId) {
      // Buscar el producto por ID
      const product = products?.find(p => p.id === productId);
      if (product) {
        setSearchTerm(product.name);
      }
    }
  }, [searchParams]);

  // Categorías disponibles con información adicional (con validación)
  const categoryOptions = [
    { key: 'all', name: 'Todas las categorías', icon: '🍰' },
    ...Object.entries(categories || {}).map(([key, category]) => ({
      key,
      name: category?.name || key,
      icon: category?.icon || '🍰',
      description: category?.description || ''
    }))
  ];

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [];
    }

    let filtered = products;

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product && product.category === selectedCategory
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
    setSelectedCategory('all');
    setSearchTerm('');
    // Limpiar también el input de búsqueda
    const searchInput = document.querySelector('input[placeholder="Buscar productos..."]');
    if (searchInput) searchInput.value = '';
  };

  const handleAddToCart = (product) => {
    try {
      if (!product) return;
      
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

  // Verificar si los datos necesarios están disponibles
  if (!products || !Array.isArray(products)) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-4">
          <div className="text-center">
            <h3>Error al cargar el catálogo</h3>
            <p>No se pudieron cargar los productos. Por favor, recarga la página.</p>
            <Button onClick={() => window.location.reload()}>
              Recargar página
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold mb-2 font-pacifico" style={{ color: '#8B4513' }}>
            🍰 Nuestro Catálogo
          </h1>
          <p className="text-muted">
            Descubre nuestra amplia variedad de productos artesanales
          </p>
          <Badge bg="primary" className="fs-6">
            {filteredProducts.length} productos disponibles
          </Badge>
        </div>

        {/* Filtros */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col md={6}>
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categoryOptions.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Buscar</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar productos..."
                    onChange={handleSearchChange}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <div className="d-grid">
                  <Button
                    variant="outline-secondary"
                    onClick={clearFilters}
                    disabled={selectedCategory === 'all' && !searchTerm}
                  >
                    🔄 Limpiar
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Información de categoría seleccionada */}
        {selectedCategory !== 'all' && (
          <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: '#f8f4e6' }}>
            <Card.Body>
              <div className="d-flex align-items-center">
                <span className="fs-2 me-3">
                  {categories[selectedCategory]?.icon}
                </span>
                <div>
                  <h5 className="mb-1 font-pacifico" style={{ color: '#8B4513' }}>
                    {categories[selectedCategory]?.name}
                  </h5>
                  <p className="text-muted mb-0">
                    {categories[selectedCategory]?.description}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Productos */}
        {filteredProducts.length > 0 ? (
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id} lg={4} md={6}>
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  showDescription={true}
                  imageHeight="250px"
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="text-center py-5 border-0 shadow-sm">
            <Card.Body>
              <div className="display-1 mb-3">🔍</div>
              <h4>No se encontraron productos</h4>
              <p className="text-muted mb-3">
                {searchTerm 
                  ? `No hay productos que coincidan con "${searchTerm}"`
                  : 'No hay productos en esta categoría'
                }
              </p>
              <Button variant="primary" onClick={clearFilters}>
                Ver todos los productos
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Estadísticas del catálogo */}
        <Card className="mt-5 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body>
            <Row className="text-center">
              <Col md={3}>
                <div className="display-6 fw-bold text-primary">
                  {products.length}
                </div>
                <small className="text-muted">Productos totales</small>
              </Col>
              <Col md={3}>
                <div className="display-6 fw-bold text-success">
                  {Object.keys(categories).length}
                </div>
                <small className="text-muted">Categorías</small>
              </Col>
              <Col md={3}>
                <div className="display-6 fw-bold text-info">
                  50+
                </div>
                <small className="text-muted">Años de experiencia</small>
              </Col>
              <Col md={3}>
                <div className="display-6 fw-bold text-warning">
                  ⭐
                </div>
                <small className="text-muted">Calidad garantizada</small>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}