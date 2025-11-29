// Panel de Administración - La Ruta el Pastelazo
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { productsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

export default function AdminPanel() {
  const { users, isAdmin, user } = useAuthAPI();
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPrice, setProductPrice] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'clasicas',
    img: ''
  });

  // Verificar si el usuario puede administrar (admin o trabajador)
  const canManage = () => {
    return user && (user.role === 'admin' || user.role === 'trabajador');
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      console.log('Products response:', response);
      const products = response.products || response.data?.products || response;
      // Filtrar productos inactivos para que no se muestren
      const activeProducts = (Array.isArray(products) ? products : []).filter(p => p.isActive !== false);
      setApiProducts(activeProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setMessage({ type: 'danger', text: 'Error al cargar productos de la base de datos' });
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleEditPrice = (product) => {
    setSelectedProduct(product);
    setProductPrice(product.price.toString());
    setShowProductModal(true);
  };

  const handleSavePrice = async () => {
    if (!selectedProduct) return;

    const newPrice = parseInt(productPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      showMessage('danger', 'Por favor ingresa un precio válido');
      return;
    }

    try {
      setSaving(true);
      await productsAPI.update(selectedProduct._id, { price: newPrice });
      showMessage('success', `Precio actualizado para ${selectedProduct.name}`);
      setShowProductModal(false);
      setSelectedProduct(null);
      setProductPrice('');
      loadProducts(); // Recargar productos
    } catch (error) {
      console.error('Error updating price:', error);
      showMessage('danger', 'Error al actualizar el precio');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      showMessage('danger', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const price = parseInt(newProduct.price);
    if (isNaN(price) || price <= 0) {
      showMessage('danger', 'Por favor ingresa un precio válido');
      return;
    }

    try {
      setSaving(true);
      const productData = {
        name: newProduct.name,
        price: price,
        description: newProduct.description,
        category: newProduct.category,
        img: newProduct.img || '/imagenes/tortas/default.png',
        isActive: true
      };

      console.log('Creating product:', productData);
      await productsAPI.create(productData);
      
      showMessage('success', `Producto "${newProduct.name}" agregado exitosamente a la base de datos`);
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: 'clasicas',
        img: ''
      });
      loadProducts(); // Recargar productos
    } catch (error) {
      console.error('Error creating product:', error);
      showMessage('danger', `Error al crear producto: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto de la base de datos?')) return;

    try {
      setSaving(true);
      await productsAPI.delete(productId);
      showMessage('success', 'Producto eliminado exitosamente de la base de datos');
      loadProducts(); // Recargar productos
    } catch (error) {
      console.error('Error deleting product:', error);
      showMessage('danger', 'Error al eliminar producto');
    } finally {
      setSaving(false);
    }
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
          <h5 className="mb-0">Gestión de Productos y Precios (MongoDB)</h5>
          <small className="text-muted">Total: {apiProducts.length} productos</small>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Cargando productos desde la base de datos...</p>
            </div>
          ) : apiProducts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No hay productos en la base de datos</p>
              <Button 
                variant="primary" 
                onClick={() => setShowAddProductModal(true)}
                disabled={saving}
              >
                Agregar Primer Producto
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Actual</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {apiProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {product.img && (
                          <img 
                            src={product.img} 
                            alt={product.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            className="rounded me-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <strong>{product.name}</strong>
                          <br />
                          <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className="text-primary">{formatPrice(product.price)}</strong>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{product.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${product.isActive !== false ? 'bg-success' : 'bg-danger'}`}>
                        {product.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditPrice(product)}
                        disabled={saving}
                      >
                        Editar Precio
                      </Button>
                      {user?.role === 'admin' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={saving}
                        >
                          Eliminar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
          <Button variant="secondary" onClick={() => setShowProductModal(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSavePrice} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              'Guardar Precio'
            )}
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
                    <option value="clasicas">Tortas Clásicas</option>
                    <option value="especiales">Especiales</option>
                    <option value="frutas">Frutales</option>
                    <option value="gourmet">Gourmet</option>
                    <option value="clasicos">Postres Clásicos</option>
                    <option value="saludables">Saludables</option>
                    <option value="veganos">Veganos</option>
                    <option value="individuales">Individuales</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL de Imagen (opcional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.img}
                    onChange={(e) => setNewProduct({...newProduct, img: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
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
          <Button variant="secondary" onClick={() => setShowAddProductModal(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleAddProduct} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creando...
              </>
            ) : (
              'Agregar Producto'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
