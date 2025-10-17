// Versión simplificada del catálogo para diagnosticar problemas
import { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Badge, Card } from 'react-bootstrap';
import { products, categories } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { getImageUrl, handleImageError } from '../utils';

export default function CatalogSimple() {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Verificar datos básicos
  console.log('Products loaded:', products?.length || 0);
  console.log('Categories loaded:', Object.keys(categories || {}).length);
  
  // Categorías disponibles con validación
  const categoryOptions = [
    { key: 'all', name: 'Todas las categorías', icon: '🍰' },
    ...Object.entries(categories || {}).map(([key, category]) => ({
      key,
      name: category?.name || key,
      icon: category?.icon || '🍰'
    }))
  ];

  // Filtrado de productos con validación
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      console.error('Products no es un array válido:', products);
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

  // Verificar si los datos necesarios están disponibles
  if (!products || !Array.isArray(products)) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-4">
          <div className="text-center">
            <h3>Error al cargar el catálogo</h3>
            <p>No se pudieron cargar los productos. Datos recibidos:</p>
            <pre>{JSON.stringify(products, null, 2)}</pre>
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
          <h1 className="display-6 fw-bold mb-2" style={{ color: '#8B4513' }}>
            🍰 Catálogo Simplificado
          </h1>
          <Badge bg="primary" className="fs-6">
            {filteredProducts.length} productos disponibles
          </Badge>
        </div>

        {/* Filtros básicos */}
        <Row className="mb-4">
          <Col md={6}>
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
            <Form.Control
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
            >
              Limpiar
            </Button>
          </Col>
        </Row>

        {/* Productos con tarjetas básicas */}
        {filteredProducts.length > 0 ? (
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id} lg={4} md={6}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={getImageUrl(product.img)}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5">{product.name}</Card.Title>
                    <Card.Text className="text-muted small flex-grow-1">
                      {product.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="h5 mb-0 text-primary">
                        ${product.price?.toLocaleString() || '0'}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                      >
                        Agregar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="text-center py-5">
            <Card.Body>
              <h4>No se encontraron productos</h4>
              <p className="text-muted">
                {searchTerm 
                  ? `No hay productos que coincidan con "${searchTerm}"`
                  : 'No hay productos en esta categoría'
                }
              </p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}