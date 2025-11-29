// Componente formulario de usuario - La Ruta el Pastelazo
import { useState, useEffect } from 'react';

const UserForm = ({ user, isEditing, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'cliente',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '', // No mostrar contraseña actual
        confirmPassword: '',
        role: user.role || 'cliente',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    // Nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    // Apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Contraseña (solo requerida para nuevos usuarios)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else if (formData.password) {
      // Si está editando y quiere cambiar la contraseña
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    // Teléfono: exactamente 9 dígitos
    if (formData.phone && !/^\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener exactamente 9 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo actual
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = { ...formData };
      // Siempre enviar el campo 'role' aunque no se cambie
      if (!submitData.role) {
        submitData.role = 'cliente';
      }
      // Si está editando y no cambió la contraseña, no incluirla
      if (isEditing && !formData.password) {
        delete submitData.password;
        delete submitData.confirmPassword;
      }
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'cliente', label: 'Cliente', description: 'Puede ver productos y realizar pedidos' },
    { value: 'trabajador', label: 'Trabajador', description: 'Puede gestionar pedidos e inventario' },
    { value: 'admin', label: 'Administrador', description: 'Acceso completo al sistema' }
  ];

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`fas ${isEditing ? 'fa-user-edit' : 'fa-user-plus'} me-2`}></i>
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              disabled={isSubmitting}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Información personal */}
                <div className="col-12">
                  <h6 className="text-muted border-bottom pb-2">
                    <i className="fas fa-user me-2"></i>
                    Información Personal
                  </h6>
                </div>
                
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="firstName">Nombre *</label>
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="lastName">Apellido *</label>
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="email">Email *</label>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <label htmlFor="phone">Teléfono</label>
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                </div>

                {/* Seguridad */}
                <div className="col-12 mt-4">
                  <h6 className="text-muted border-bottom pb-2">
                    <i className="fas fa-lock me-2"></i>
                    {isEditing ? 'Cambiar Contraseña (opcional)' : 'Seguridad'}
                  </h6>
                </div>
                
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      required={!isEditing}
                    />
                    <label htmlFor="password">
                      Contraseña {!isEditing && '*'}
                    </label>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isEditing || formData.password}
                    />
                    <label htmlFor="confirmPassword">
                      Confirmar contraseña {!isEditing && '*'}
                    </label>
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>
                </div>

                {/* Rol y permisos */}
                <div className="col-12 mt-4">
                  <h6 className="text-muted border-bottom pb-2">
                    <i className="fas fa-user-tag me-2"></i>
                    Rol y Permisos
                  </h6>
                </div>
                
                <div className="col-12">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="role">Rol del usuario *</label>
                  </div>
                  <div className="mt-2">
                    {roleOptions.map(option => (
                      formData.role === option.value && (
                        <small key={option.value} className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          {option.description}
                        </small>
                      )
                    ))}
                  </div>
                </div>

                {/* Estado */}
                <div className="col-12 mt-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      <strong>Usuario activo</strong>
                      <br />
                      <small className="text-muted">
                        Los usuarios inactivos no pueden iniciar sesión
                      </small>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <i className="fas fa-times me-2"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} me-2`}></i>
                    {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;