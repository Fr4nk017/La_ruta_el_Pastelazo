// Componente gestión de roles - La Ruta el Pastelazo
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resetAllData, exportUserData, importUserData } from '../utils/dataInitializer';

const RoleManager = () => {
  const { users, updateUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');

  // Definición de roles y permisos
  const rolesData = {
    admin: {
      name: 'Administrador',
      description: 'Acceso completo al sistema',
      color: '#dc3545',
      icon: 'fa-user-shield',
      permissions: [
        'view_products',
        'place_orders', 
        'manage_users',
        'manage_products',
        'view_reports',
        'manage_system'
      ]
    },
    trabajador: {
      name: 'Trabajador',
      description: 'Gestión de pedidos e inventario',
      color: '#ffc107',
      icon: 'fa-user-tie',
      permissions: [
        'view_products',
        'place_orders',
        'manage_orders',
        'view_inventory',
        'update_order_status'
      ]
    },
    cliente: {
      name: 'Cliente',
      description: 'Ver productos y realizar pedidos',
      color: '#17a2b8',
      icon: 'fa-user',
      permissions: [
        'view_products',
        'place_orders',
        'view_own_orders',
        'update_profile'
      ]
    }
  };

  const permissionsData = {
    view_products: 'Ver productos del catálogo',
    place_orders: 'Realizar pedidos',
    manage_users: 'Gestionar usuarios del sistema',
    manage_products: 'Administrar productos',
    view_reports: 'Ver reportes y estadísticas',
    manage_system: 'Configuración del sistema',
    manage_orders: 'Gestionar todos los pedidos',
    view_inventory: 'Ver inventario',
    update_order_status: 'Actualizar estado de pedidos',
    view_own_orders: 'Ver mis pedidos',
    update_profile: 'Actualizar mi perfil'
  };

  // Estadísticas por rol
  const roleStats = Object.keys(rolesData).map(roleKey => ({
    key: roleKey,
    ...rolesData[roleKey],
    count: users.filter(user => user.role === roleKey).length
  }));

  const handleBulkRoleChange = async (fromRole, toRole) => {
    const usersToUpdate = users.filter(user => user.role === fromRole);
    
    if (usersToUpdate.length === 0) {
      alert('No hay usuarios con ese rol');
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de cambiar el rol de ${usersToUpdate.length} usuario(s) de ${rolesData[fromRole].name} a ${rolesData[toRole].name}?`
    );

    if (confirmed) {
      try {
        for (const user of usersToUpdate) {
          await updateUser(user.id, { 
            role: toRole,
            permissions: rolesData[toRole].permissions
          });
        }
        alert('Roles actualizados correctamente');
      } catch (error) {
        alert('Error al actualizar roles: ' + error.message);
      }
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await importUserData(file);
        alert('Datos importados correctamente. La página se recargará.');
        window.location.reload();
      } catch (error) {
        alert('Error al importar datos: ' + error.message);
      }
    }
  };

  return (
    <div className="role-manager">
      {/* Resumen de roles */}
      <div className="row mb-4">
        <div className="col-12">
          <h5 className="mb-3">
            <i className="fas fa-chart-pie me-2"></i>
            Distribución de Roles
          </h5>
        </div>
        {roleStats.map(role => (
          <div key={role.key} className="col-lg-4 col-md-6 mb-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div 
                  className="role-icon mb-3"
                  style={{ color: role.color }}
                >
                  <i className={`fas ${role.icon} fa-3x`}></i>
                </div>
                <h5 className="card-title">{role.name}</h5>
                <p className="card-text text-muted">{role.description}</p>
                <div className="mt-3">
                  <span 
                    className="badge fs-6 px-3 py-2"
                    style={{ backgroundColor: role.color, color: 'white' }}
                  >
                    {role.count} {role.count === 1 ? 'usuario' : 'usuarios'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gestión masiva de roles */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-exchange-alt me-2"></i>
                Cambio Masivo de Roles
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Permite cambiar el rol de múltiples usuarios a la vez. Esta acción actualizará automáticamente sus permisos.
              </p>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Rol actual:</label>
                  <select className="form-select" id="fromRole">
                    <option value="">Seleccionar rol origen</option>
                    {Object.entries(rolesData).map(([key, role]) => (
                      <option key={key} value={key}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Cambiar a:</label>
                  <select className="form-select" id="toRole">
                    <option value="">Seleccionar rol destino</option>
                    {Object.entries(rolesData).map(([key, role]) => (
                      <option key={key} value={key}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button 
                    className="btn btn-warning w-100"
                    onClick={() => {
                      const fromRole = document.getElementById('fromRole').value;
                      const toRole = document.getElementById('toRole').value;
                      if (fromRole && toRole && fromRole !== toRole) {
                        handleBulkRoleChange(fromRole, toRole);
                      } else {
                        alert('Selecciona roles válidos y diferentes');
                      }
                    }}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Cambiar Roles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de permisos */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-key me-2"></i>
                Matriz de Permisos por Rol
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">
                Esta tabla muestra qué permisos tiene cada rol en el sistema.
              </p>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Permiso</th>
                      {Object.entries(rolesData).map(([key, role]) => (
                        <th key={key} className="text-center" style={{ color: role.color }}>
                          <i className={`fas ${role.icon} me-1`}></i>
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissionsData).map(([permission, description]) => (
                      <tr key={permission}>
                        <td>
                          <strong>{description}</strong>
                          <br />
                          <small className="text-muted">{permission}</small>
                        </td>
                        {Object.entries(rolesData).map(([roleKey, role]) => (
                          <td key={roleKey} className="text-center">
                            {role.permissions.includes(permission) ? (
                              <i className="fas fa-check-circle text-success fs-5"></i>
                            ) : (
                              <i className="fas fa-times-circle text-muted"></i>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="fas fa-info-circle me-2 text-info"></i>
                Información sobre Roles
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Administrador:</strong> Acceso completo al sistema, puede gestionar usuarios y configuración.
                </li>
                <li className="mb-2">
                  <strong>Trabajador:</strong> Puede gestionar pedidos, inventario y ver reportes básicos.
                </li>
                <li className="mb-2">
                  <strong>Cliente:</strong> Puede navegar el catálogo y realizar pedidos.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                Consideraciones de Seguridad
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  • Los cambios de rol se aplican inmediatamente
                </li>
                <li className="mb-2">
                  • Los usuarios activos pueden necesitar reiniciar sesión
                </li>
                <li className="mb-2">
                  • No puedes cambiar tu propio rol
                </li>
                <li className="mb-2">
                  • Siempre mantén al menos un administrador activo
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-title">
                <i className="fas fa-tools me-2 text-primary"></i>
                Herramientas de Administración
              </h6>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={exportUserData}
                >
                  <i className="fas fa-download me-2"></i>
                  Exportar Datos
                </button>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="form-control form-control-sm"
                    id="importFile"
                  />
                  <label htmlFor="importFile" className="form-label mt-1">
                    <small>Importar Datos</small>
                  </label>
                </div>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={resetAllData}
                >
                  <i className="fas fa-redo me-2"></i>
                  Resetear Sistema
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManager;