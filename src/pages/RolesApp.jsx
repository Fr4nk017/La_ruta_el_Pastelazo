// Página de gestión de roles y usuarios - La Ruta el Pastelazo
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RoleRoute from '../auth/RoleRoute';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import RoleManager from '../components/RoleManager';
import '../styles/RolesApp.css';

const RolesApp = () => {
  const { users, isAdmin, createUser, updateUser, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estadísticas de usuarios
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    workers: users.filter(u => u.role === 'trabajador').length,
    clients: users.filter(u => u.role === 'cliente').length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const result = await deleteUser(userId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleSubmitUser = async (userData) => {
    let result;
    if (isEditing) {
      result = await updateUser(selectedUser.id, userData);
    } else {
      result = await createUser(userData);
    }

    if (result.success) {
      setShowUserForm(false);
      setSelectedUser(null);
      setIsEditing(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <RoleRoute allowedRoles={['admin']}>
      <div className="roles-app">
        <div className="container-fluid mt-4">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-0">
                    <i className="fas fa-users-cog me-2"></i>
                    Gestión de Roles y Usuarios
                  </h1>
                  <p className="text-muted">Panel de administración - La Ruta el Pastelazo</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateUser}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Nuevo Usuario
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="row mb-4">
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="stat-card bg-primary">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>{userStats.total}</h3>
                  <p>Total Usuarios</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="stat-card bg-danger">
                <div className="stat-icon">
                  <i className="fas fa-user-shield"></i>
                </div>
                <div className="stat-info">
                  <h3>{userStats.admins}</h3>
                  <p>Administradores</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="stat-card bg-warning">
                <div className="stat-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="stat-info">
                  <h3>{userStats.workers}</h3>
                  <p>Trabajadores</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="stat-card bg-info">
                <div className="stat-icon">
                  <i className="fas fa-user"></i>
                </div>
                <div className="stat-info">
                  <h3>{userStats.clients}</h3>
                  <p>Clientes</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="stat-card bg-success">
                <div className="stat-icon">
                  <i className="fas fa-user-check"></i>
                </div>
                <div className="stat-info">
                  <h3>{userStats.active}</h3>
                  <p>Activos</p>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="stat-card bg-secondary">
                <div className="stat-icon">
                  <i className="fas fa-user-times"></i>
                </div>
                <div className="stat-info">
                  <h3>{userStats.inactive}</h3>
                  <p>Inactivos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <ul className="nav nav-tabs card-header-tabs" role="tablist">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                      >
                        <i className="fas fa-users me-2"></i>
                        Gestión de Usuarios
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roles')}
                      >
                        <i className="fas fa-user-tag me-2"></i>
                        Gestión de Roles
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-body">
                  {activeTab === 'users' && (
                    <UserList
                      users={users}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                    />
                  )}
                  {activeTab === 'roles' && (
                    <RoleManager />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal para formulario de usuario */}
        {showUserForm && (
          <UserForm
            user={selectedUser}
            isEditing={isEditing}
            onSubmit={handleSubmitUser}
            onCancel={() => {
              setShowUserForm(false);
              setSelectedUser(null);
              setIsEditing(false);
            }}
          />
        )}
      </div>
    </RoleRoute>
  );
};

export default RolesApp;