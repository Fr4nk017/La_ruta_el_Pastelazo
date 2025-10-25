// Componente lista de usuarios - La Ruta el Pastelazo
import { useState, useMemo } from 'react';

const UserList = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === '' || user.role === roleFilter;
      const matchesStatus = statusFilter === '' || 
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'trabajador': return 'role-badge trabajador';
      case 'cliente': return 'role-badge cliente';
      default: return 'role-badge';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'trabajador': return 'Trabajador';
      case 'cliente': return 'Cliente';
      default: return role;
    }
  };

  return (
    <div>
      {/* Filtros y búsqueda */}
      <div className="search-filters">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="searchTerm"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <label htmlFor="searchTerm">
                <i className="fas fa-search me-2"></i>
                Buscar usuarios...
              </label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-floating">
              <select
                className="form-select"
                id="roleFilter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="trabajador">Trabajador</option>
                <option value="cliente">Cliente</option>
              </select>
              <label htmlFor="roleFilter">Filtrar por rol</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-floating">
              <select
                className="form-select"
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
              <label htmlFor="statusFilter">Filtrar por estado</label>
            </div>
          </div>
          <div className="col-md-2 d-flex align-items-center">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
            >
              <i className="fas fa-times me-2"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0">
          Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
        </p>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Usuarios por página:</span>
          <span className="badge bg-primary">{usersPerPage}</span>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="table-responsive">
        <table className="table table-hover users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3 d-block"></i>
                  <p className="text-muted">No se encontraron usuarios</p>
                </td>
              </tr>
            ) : (
              currentUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar me-3">
                        <div className="avatar-placeholder">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="fw-bold">{user.firstName} {user.lastName}</div>
                        <small className="text-muted">ID: {user.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'No especificado'}</td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      <span className="status-indicator"></span>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-action btn-edit"
                        onClick={() => onEdit(user)}
                        title="Editar usuario"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-action btn-delete"
                        onClick={() => onDelete(user.id)}
                        title="Eliminar usuario"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <nav aria-label="Paginación de usuarios">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </li>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            })}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}

      <style jsx>{`
        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default UserList;