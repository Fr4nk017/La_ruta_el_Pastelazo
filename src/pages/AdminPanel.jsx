// Panel de Administración - La Ruta el Pastelazo
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { formatPrice } from '../utils/currency';
import { generateId } from '../utils/helpers';

export default function AdminPanel() {
  const { users, isAdmin, user } = useAuthAPI();
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPrice, setProductPrice] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [localProducts, setLocalProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'tortas',
    image: ''
  });

  // Verificar si el usuario puede administrar (admin o trabajador)
  const canManage = () => {
    return user && (user.role === 'admin' || user.role === 'trabajador');
  };

  useEffect(() => {
    const savedProducts = localStorage.getItem('products_data');
    if (savedProducts) {
      setLocalProducts(JSON.parse(savedProducts));
    } else {
      setLocalProducts(products);
      localStorage.setItem('products_data', JSON.stringify(products));
    }
  }, []);

  const handleEditPrice = (product) => {
    setSelectedProduct(product);
    setProductPrice(product.price.toString());
    setShowProductModal(true);
  };

  const handleSavePrice = () => {
    if (!selectedProduct) return;

    const newPrice = parseInt(productPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      setMessage({ type: 'danger', text: 'Por favor ingresa un precio válido' });
      return;
    }

    const updatedProducts = localProducts.map(p =>
      p.id === selectedProduct.id ? { ...p, price: newPrice } : p
    );

    setLocalProducts(updatedProducts);
    localStorage.setItem('products_data', JSON.stringify(updatedProducts));

    setMessage({ type: 'success', text: `Precio actualizado para ${selectedProduct.name}` });
    setShowProductModal(false);
    setSelectedProduct(null);
    setProductPrice('');

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      setMessage({ type: 'danger', text: 'Por favor completa todos los campos obligatorios' });
      return;
    }

    const price = parseInt(newProduct.price);
    if (isNaN(price) || price <= 0) {
      setMessage({ type: 'danger', text: 'Por favor ingresa un precio válido' });
      return;
    }

    const productToAdd = {
      id: generateId(),
      name: newProduct.name,
      price: price,
      description: newProduct.description,
      category: newProduct.category,
      image: newProduct.image || '/imagenes/tortas/default.png',
      featured: false
    };

    const updatedProducts = [...localProducts, productToAdd];
    setLocalProducts(updatedProducts);
    localStorage.setItem('products_data', JSON.stringify(updatedProducts));

    setMessage({ type: 'success', text: `Producto "${newProduct.name}" agregado exitosamente` });
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: 'tortas',
      image: ''
    });

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteProduct = (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    const updatedProducts = localProducts.filter(p => p.id !== productId);
    setLocalProducts(updatedProducts);
    localStorage.setItem('products_data', JSON.stringify(updatedProducts));

    setMessage({ type: 'success', text: 'Producto eliminado exitosamente' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };  if (!canManage()) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>🔒 Acceso Restringido</h2>
          <p>Solo los administradores y trabajadores pueden acceder a esta página.</p>
          <Button as={Link} to="/" variant="primary">Volver al Inicio</Button>
        </div>
      </Container>
    );
  }

  const userStats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    workers: users?.filter(u => u.role === 'trabajador').length || 0,
    clients: users?.filter(u => u.role === 'cliente').length || 0
  };

  return (
    <Container fluid className="py-4">
      {message.text && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Panel de Administración</h1>
          <p className="text-muted">
            Gestión de productos y precios - {user?.role === 'admin' ? 'Administrador' : 'Trabajador'}
          </p>
        </div>
        <div>
          <Button 
            variant="success" 
            className="me-2"
            onClick={() => setShowAddProductModal(true)}
          >
            + Agregar Producto
          </Button>
          {user?.role === 'admin' && (
            <Button as={Link} to="/roles-app" variant="primary">
              Gestión de Usuarios
            </Button>
          )}
        </div>
      </div>

      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-primary">
            <Card.Body className="text-center">
              <h5>Total Usuarios</h5>
              <h2 className="text-primary">{userStats.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-danger">
            <Card.Body className="text-center">
              <h5>Administradores</h5>
              <h2 className="text-danger">{userStats.admins}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-warning">
            <Card.Body className="text-center">
              <h5>Trabajadores</h5>
              <h2 className="text-warning">{userStats.workers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-success">
            <Card.Body className="text-center">
              <h5>Clientes</h5>
              <h2 className="text-success">{userStats.clients}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Gestión de Productos y Precios</h5>
          <small className="text-muted">Total: {localProducts.length} productos</small>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Actual</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {localProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div>
                      <strong>{product.name}</strong>
                      <br />
                      <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                    </div>
                  </td>
                  <td>
                    <strong className="text-primary">{formatPrice(product.price)}</strong>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{product.category}</span>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditPrice(product)}
                    >
                      Editar Precio
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {localProducts.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No hay productos disponibles</p>
              <Button 
                variant="primary" 
                onClick={() => setShowAddProductModal(true)}
              >
                Agregar Primer Producto
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para editar precio */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Precio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form>
              <h5>{selectedProduct.name}</h5>
              <p className="text-muted">{selectedProduct.description}</p>
              <p>Precio actual: <strong>{formatPrice(selectedProduct.price)}</strong></p>
              <Form.Group className="mb-3">
                <Form.Label>Nuevo Precio (CLP) *</Form.Label>
                <Form.Control
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="Ingresa el nuevo precio"
                  min="1"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSavePrice}>
            Guardar Precio
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para agregar producto */}
      <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ej: Torta de Chocolate"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio (CLP) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="15000"
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                placeholder="Describe el producto, ingredientes, características especiales..."
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="tortas">Tortas</option>
                    <option value="pasteles">Pasteles</option>
                    <option value="cupcakes">Cupcakes</option>
                    <option value="postres">Postres</option>
                    <option value="especiales">Especiales</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de Imagen (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="/imagenes/tortas/mi-torta.png"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="bg-light p-3 rounded">
              <h6>Vista Previa:</h6>
              <p><strong>Nombre:</strong> {newProduct.name || 'Sin nombre'}</p>
              <p><strong>Precio:</strong> {newProduct.price ? formatPrice(parseInt(newProduct.price)) : 'Sin precio'}</p>
              <p><strong>Categoría:</strong> {newProduct.category}</p>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAddProduct}>
            Agregar Producto
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
