
import { useState } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge } from 'react-bootstrap';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';

export default function Catalog() {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'Todos', count: products.length },
    { key: 'clasicas', label: 'Tortas Clásicas', count: products.filter(p => p.category === 'clasicas').length },
    { key: 'especiales', label: 'Especiales', count: products.filter(p => p.category === 'especiales').length },
    { key: 'frutas', label: 'Frutas', count: products.filter(p => p.category === 'frutas').length },
    { key: 'gourmet', label: 'Gourmet', count: products.filter(p => p.category === 'gourmet').length },
    { key: 'clasicos', label: 'Postres Clásicos', count: products.filter(p => p.category === 'clasicos').length },
    { key: 'saludables', label: 'Saludables', count: products.filter(p => p.category === 'saludables').length },
    { key: 'veganos', label: 'Veganos', count: products.filter(p => p.category === 'veganos').length },
    { key: 'individuales', label: 'Individuales', count: products.filter(p => p.category === 'individuales').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <main className="container py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 fw-bold text-center mb-3">Catálogo Completo</h1>
          <p className="lead text-center text-muted">
            Explora toda nuestra selección de postres artesanales
          </p>
        </Col>
      </Row>
      
      {/* Filtros por categoría */}
      <Row className="mb-4">
        <Col>
          <Nav variant="pills" className="justify-content-center flex-wrap">
            {categories.map(category => (
              <Nav.Item key={category.key} className="mb-2">
                <Nav.Link
                  active={selectedCategory === category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className="me-2"
                >
                  {category.label} <Badge bg="secondary">{category.count}</Badge>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
      </Row>
      
      <Row className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id} md={6} lg={4} xl={3}>
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={product.img} 
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6">{product.name}</Card.Title>
                <Card.Text className="small text-muted mb-2">
                  {product.description}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="h6 mb-0 text-primary fw-bold">
                      {formatPrice(product.price)}
                    </span>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => add(product)}
                    >
                      Agregar
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {filteredProducts.length === 0 && (
        <Row>
          <Col className="text-center py-5">
            <p className="text-muted">No hay productos disponibles en esta categoría.</p>
          </Col>
        </Row>
      )}
      
      <Row className="mt-5">
        <Col className="text-center">
          <p className="text-muted">
            Total de productos: <Badge bg="primary">{filteredProducts.length}</Badge>
          </p>
        </Col>
      </Row>
    </main>
  );
}
