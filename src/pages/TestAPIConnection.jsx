import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProductsAPI';
import { useAuthAPI } from '../contexts/AuthContextAPI';
import { authAPI, productsAPI, ordersAPI, utilsAPI } from '../services/api';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Table, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const TestAPIConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [backendInfo, setBackendInfo] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [runningTests, setRunningTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  
  const { 
    products, 
    loading: productsLoading, 
    error: productsError,
    loadProducts 
  } = useProducts();
  
  const { 
    user, 
    isAuthenticated, 
    login,
    logout,
    isLoading: authLoading 
  } = useAuthAPI();

  // Tests disponibles
  const availableTests = {
    health: 'Health Check',
    products: 'Cargar Productos', 
    auth: 'Autenticación',
    orders: 'Órdenes API',
    crud: 'CRUD Productos (Admin)'
  };

  // Probar conexión al cargar
  useEffect(() => {
    runBasicConnection();
  }, []);

  const runBasicConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await utilsAPI.healthCheck();
      if (response.success) {
        setBackendInfo(response);
        setConnectionStatus('connected');
        toast.success('✅ Backend conectado');
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('❌ Error de conexión');
    }
  };

  // Test individual de health check
  const testHealthCheck = async () => {
    try {
      const response = await utilsAPI.healthCheck();
      return {
        success: true,
        message: 'Backend respondiendo correctamente',
        data: response,
        details: `Timestamp: ${new Date(response.timestamp).toLocaleString()}`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Backend no responde',
        error: error.message,
        details: 'Verificar que el servidor esté ejecutándose en puerto 5000'
      };
    }
  };

  // Test de productos
  const testProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      return {
        success: true,
        message: `${response.products?.length || 0} productos obtenidos`,
        data: response,
        details: response.products?.length > 0 ? 
          `Primer producto: ${response.products[0].name}` : 
          'No hay productos en la base de datos'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al cargar productos',
        error: error.message,
        details: 'Verificar conexión a MongoDB y datos seed'
      };
    }
  };

  // Test de autenticación
  const testAuth = async () => {
    try {
      const credentials = {
        email: 'cliente@example.com',
        password: 'cliente123'
      };
      
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        // Obtener perfil para verificar token
        const profile = await authAPI.getProfile();
        
        // Limpiar después del test
        setTimeout(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }, 2000);
        
        return {
          success: true,
          message: 'Autenticación funcionando',
          data: profile.data,
          details: `Usuario: ${profile.data?.firstName} ${profile.data?.lastName}`
        };
      } else {
        throw new Error(response.message || 'Login falló');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        success: false,
        message: 'Error en autenticación',
        error: error.message,
        details: 'Verificar usuarios seed en la base de datos'
      };
    }
  };

  // Test de órdenes
  const testOrders = async () => {
    try {
      // Login primero
      const loginResponse = await authAPI.login({
        email: 'cliente@example.com',
        password: 'cliente123'
      });

      if (!loginResponse.success) {
        throw new Error('No se pudo autenticar');
      }

      // Obtener órdenes
      const orders = await ordersAPI.getUserOrders();
      
      // Limpiar
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return {
        success: true,
        message: `API de órdenes funcionando`,
        data: orders,
        details: `${orders?.length || 0} órdenes encontradas`
      };
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        success: false,
        message: 'Error en API de órdenes',
        error: error.message,
        details: 'Verificar endpoints de órdenes'
      };
    }
  };

  // Test CRUD de productos (admin)
  const testCRUD = async () => {
    try {
      // Login como admin
      const loginResponse = await authAPI.login({
        email: 'admin@larutaelpastelazo.cl',
        password: 'admin123'
      });

      if (!loginResponse.success) {
        throw new Error('No se pudo autenticar como admin');
      }

      // Crear producto de prueba
      const testProduct = {
        name: `Test Product ${Date.now()}`,
        description: 'Producto de prueba para testing',
        price: 1000,
        category: 'test',
        img: 'test.jpg',
        stock: 1,
        isActive: true
      };

      const createResponse = await productsAPI.create(testProduct);
      
      if (!createResponse.success) {
        throw new Error('No se pudo crear producto');
      }

      // Intentar eliminar
      let deleteSuccess = false;
      if (createResponse.data?._id) {
        try {
          const deleteResponse = await productsAPI.delete(createResponse.data._id);
          deleteSuccess = deleteResponse.success;
        } catch (deleteError) {
          console.warn('Error al eliminar producto de prueba:', deleteError);
        }
      }

      // Limpiar
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      return {
        success: true,
        message: 'CRUD funcionando correctamente',
        data: createResponse.data,
        details: `Producto creado${deleteSuccess ? ' y eliminado' : ' (no se pudo eliminar)'} exitosamente`
      };
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        success: false,
        message: 'Error en CRUD',
        error: error.message,
        details: 'Verificar permisos de admin y endpoints CRUD'
      };
    }
  };

  // Ejecutar test individual
  const runSingleTest = async (testType) => {
    setSelectedTest(testType);
    setRunningTests(true);
    
    let result;
    switch (testType) {
      case 'health':
        result = await testHealthCheck();
        break;
      case 'products':
        result = await testProducts();
        break;
      case 'auth':
        result = await testAuth();
        break;
      case 'orders':
        result = await testOrders();
        break;
      case 'crud':
        result = await testCRUD();
        break;
      default:
        result = { success: false, message: 'Test no encontrado' };
    }
    
    setTestResults(prev => ({
      ...prev,
      [testType]: result
    }));
    
    if (result.success) {
      toast.success(`✅ ${availableTests[testType]} - OK`);
    } else {
      toast.error(`❌ ${availableTests[testType]} - FAIL`);
    }
    
    setRunningTests(false);
    setSelectedTest(null);
  };

  // Ejecutar todos los tests
  const runAllTests = async () => {
    setRunningTests(true);
    setTestResults({});
    
    for (const testType of Object.keys(availableTests)) {
      await runSingleTest(testType);
      // Pequeña pausa entre tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setRunningTests(false);
    toast.success('🎉 Todos los tests completados');
  };

  const getStatusBadge = (success) => {
    return (
      <Badge bg={success ? 'success' : 'danger'}>
        {success ? '✅ PASS' : '❌ FAIL'}
      </Badge>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="text-center mb-4">
            <h1 className="display-5 fw-bold text-primary mb-3">
              🧪 Test Completo del Backend
            </h1>
            <p className="lead text-muted">
              Verificación exhaustiva de todos los endpoints y funcionalidades
            </p>
          </div>

          {/* Estado General */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📡 Estado de Conexión General</h5>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={runBasicConnection}
                disabled={connectionStatus === 'testing'}
              >
                {connectionStatus === 'testing' ? <Spinner size="sm" /> : '🔄'} Verificar
              </Button>
            </Card.Header>
            <Card.Body>
              {connectionStatus === 'testing' && (
                <Alert variant="info">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Verificando conexión con el backend...
                </Alert>
              )}
              
              {connectionStatus === 'connected' && (
                <Alert variant="success">
                  ✅ Backend conectado y funcionando
                  {backendInfo && (
                    <div className="mt-2">
                      <small>
                        <strong>Mensaje:</strong> {backendInfo.message}<br />
                        <strong>Timestamp:</strong> {new Date(backendInfo.timestamp).toLocaleString()}
                      </small>
                    </div>
                  )}
                </Alert>
              )}
              
              {connectionStatus === 'error' && (
                <Alert variant="danger">
                  ❌ Error de conexión. Verificar que el backend esté ejecutándose en puerto 5000
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Panel de Control de Tests */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🎮 Panel de Control de Tests</h5>
              <Button 
                variant="success" 
                onClick={runAllTests} 
                disabled={runningTests}
              >
                {runningTests ? <Spinner size="sm" className="me-2" /> : '🚀'}
                {runningTests ? 'Ejecutando Tests...' : 'Ejecutar Todos los Tests'}
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                {Object.entries(availableTests).map(([key, name]) => (
                  <Col md={6} lg={4} key={key} className="mb-3">
                    <div className="d-grid">
                      <Button
                        variant={testResults[key] ? 
                          (testResults[key].success ? 'outline-success' : 'outline-danger') : 
                          'outline-primary'
                        }
                        onClick={() => runSingleTest(key)}
                        disabled={runningTests}
                      >
                        {selectedTest === key ? <Spinner size="sm" className="me-2" /> : null}
                        {testResults[key] ? 
                          (testResults[key].success ? '✅' : '❌') : 
                          '⚪'
                        } {name}
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Resultados de Tests */}
          {Object.keys(testResults).length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">📊 Resultados Detallados</h5>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Estado</th>
                      <th>Mensaje</th>
                      <th>Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(testResults).map(([key, result]) => (
                      <tr key={key}>
                        <td>
                          <strong>{availableTests[key]}</strong>
                        </td>
                        <td>
                          {getStatusBadge(result.success)}
                        </td>
                        <td>
                          {result.message}
                          {result.error && (
                            <div className="text-danger small mt-1">
                              Error: {result.error}
                            </div>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {result.details || 'N/A'}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Estado Actual del Usuario */}
          {(isAuthenticated || authLoading) && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">👤 Estado de Sesión</h5>
              </Card.Header>
              <Card.Body>
                {authLoading ? (
                  <Alert variant="info">
                    <Spinner size="sm" className="me-2" />
                    Verificando sesión...
                  </Alert>
                ) : isAuthenticated && user ? (
                  <Alert variant="success">
                    ✅ Usuario autenticado: <strong>{user.firstName} {user.lastName}</strong>
                    <div className="mt-2">
                      <small>
                        <strong>Email:</strong> {user.email}<br />
                        <strong>Rol:</strong> <Badge bg="secondary">{user.role}</Badge>
                      </small>
                    </div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="mt-2"
                      onClick={logout}
                    >
                      Cerrar Sesión
                    </Button>
                  </Alert>
                ) : null}
              </Card.Body>
            </Card>
          )}

          {/* Vista Previa de Productos */}
          {products.length > 0 && (
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">🍰 Vista Previa de Productos</h5>
                <Badge bg="primary">{products.length} productos</Badge>
              </Card.Header>
              <Card.Body>
                <Row>
                  {products.slice(0, 4).map((product) => (
                    <Col md={6} lg={3} key={product._id} className="mb-3">
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Body className="p-3">
                          <Card.Title className="h6 mb-2">
                            {product.name}
                          </Card.Title>
                          <Card.Text className="text-muted small mb-2">
                            {product.description.substring(0, 50)}...
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                            <Badge bg="light" text="dark" className="small">
                              {product.category}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Información Técnica */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">🔧 Información Técnica</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>🌐 URLs del Sistema</h6>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Backend:</strong>{' '}
                      <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer">
                        http://localhost:5000
                      </a>
                    </li>
                    <li>
                      <strong>API:</strong>{' '}
                      <a href="http://localhost:5000/api" target="_blank" rel="noopener noreferrer">
                        http://localhost:5000/api
                      </a>
                    </li>
                    <li>
                      <strong>Health:</strong>{' '}
                      <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer">
                        http://localhost:5000/health
                      </a>
                    </li>
                    <li>
                      <strong>Frontend:</strong>{' '}
                      <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">
                        http://localhost:5173
                      </a>
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6>👥 Usuarios de Prueba</h6>
                  <Table size="sm">
                    <tbody>
                      <tr>
                        <td><Badge bg="danger">Admin</Badge></td>
                        <td>
                          <small>
                            admin@larutaelpastelazo.cl<br />
                            <code>admin123</code>
                          </small>
                        </td>
                      </tr>
                      <tr>
                        <td><Badge bg="warning">Trabajador</Badge></td>
                        <td>
                          <small>
                            trabajador@larutaelpastelazo.cl<br />
                            <code>trabajador123</code>
                          </small>
                        </td>
                      </tr>
                      <tr>
                        <td><Badge bg="info">Cliente</Badge></td>
                        <td>
                          <small>
                            cliente@example.com<br />
                            <code>cliente123</code>
                          </small>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestAPIConnection;