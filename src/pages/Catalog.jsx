// Página de catálogo - La Ruta el Pastelazo
import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge, Alert } from 'react-bootstrap';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ui';
import { debounce } from '../utils/helpers';

export default function Catalog() {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar que los productos estén disponibles
  useEffect(() => {
    try {
      if (!products || !Array.isArray(products) || products.length === 0) {
        throw new Error('No se pudieron cargar los productos');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

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

  // Estados de carga y error
  if (loading) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <h3>Cargando catálogo...</h3>
            <p className="text-muted">Por favor espera mientras cargamos nuestros productos</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-5">
          <div className="text-center">
            <Alert variant="danger" className="d-inline-block">
              <h4>❌ Error al cargar el catálogo</h4>
              <p>{error}</p>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
              >
                🔄 Recargar página
              </Button>
            </Alert>
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
  );
}