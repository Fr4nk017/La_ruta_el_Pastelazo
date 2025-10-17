
// Página de catálogo - La Ruta el Pastelazo
import { useState, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ui';
import { debounce } from '../utils/helpers';

export default function Catalog() {
  const { add } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todas las categorías');
  const [searchTerm, setSearchTerm] = useState('');

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
    let filtered = products;

    // Filtro por categoría
    const mappedCategory = categoryMapping[selectedCategory];
    if (mappedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === mappedCategory);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div style={{ backgroundColor: '#fff5e6', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 
            className="display-6 fw-bold mb-2"
            style={{ 
              color: '#8B4513',
              fontFamily: 'cursive',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Explora nuestras categorías
          </h1>
        </div>
        
        {/* Filtros */}
        <Row className="mb-4 align-items-end">
          <Col md={4}>
            <Form.Group>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  backgroundColor: 'white',
                  border: '2px solid #D2B48C',
                  borderRadius: '8px'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={5}>
            <Form.Group>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar productos..."
                  onChange={handleSearchChange}
                  style={{ 
                    backgroundColor: 'white',
                    border: '2px solid #D2B48C',
                    borderRight: 'none'
                  }}
                />
                <InputGroup.Text 
                  style={{ 
                    backgroundColor: '#F5DEB3',
                    border: '2px solid #D2B48C',
                    borderLeft: 'none'
                  }}
                >
                  🔍
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <div className="d-grid">
              <Button 
                variant="outline-secondary"
                onClick={clearFilters}
                style={{ 
                  color: '#8B4513',
                  borderColor: '#8B4513',
                  borderRadius: '8px'
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </Col>
        </Row>

        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product}
                  onAddToCart={add}
                  imageHeight="220px"
                  showDescription={true}
                  buttonText="Agregar al carrito"
                />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <div className="display-1 mb-3">🔍</div>
            <h3 style={{ color: '#8B4513' }}>No se encontraron productos</h3>
            <p className="text-muted mb-4">
              {searchTerm 
                ? `No encontramos productos que coincidan con "${searchTerm}"`
                : `No hay productos disponibles en la categoría "${selectedCategory}"`
              }
            </p>
            <Button 
              variant="primary"
              onClick={clearFilters}
              style={{ 
                backgroundColor: '#8B4513', 
                borderColor: '#8B4513' 
              }}
            >
              Ver todos los productos
            </Button>
          </div>
        )}
        
        {/* Footer de información */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-5 pt-4 border-top">
            <p className="text-muted mb-2">
              Mostrando <strong>{filteredProducts.length}</strong> de{' '}
              <strong>{products.length}</strong> productos
            </p>
            <small style={{ color: '#8B4513' }}>
              ✨ Todos nuestros productos son preparados frescos diariamente con ingredientes premium
            </small>
          </div>
        )}
      </Container>
    </div>
  );
}
