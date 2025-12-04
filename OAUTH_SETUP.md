# 🔐 Guía de Implementación - Login con Google y Facebook

## Estado Actual
✅ La interfaz ya está lista con los botones de Google y Facebook
✅ Las funciones base están creadas
⏳ Pendiente: Integración completa de OAuth

---

## 📋 Requisitos Previos

1. **Node.js** y **npm** instalados
2. Acceso a **Google Cloud Console**
3. Acceso a **Facebook Developers**
4. Backend que maneje tokens OAuth

---

## 🔵 GOOGLE OAUTH

### Paso 1: Configurar Google Cloud Console

1. Ve a https://console.cloud.google.com
2. Crea un nuevo proyecto (nombre: "La Ruta el Pastelazo")
3. Ve a "APIs y servicios" > "Biblioteca"
4. Busca "Google+ API" y habilítala
5. Ve a "Credenciales"
6. Click en "Crear credenciales" > "ID de cliente OAuth"
7. Selecciona "Aplicación web"
8. Añade estas URIs autorizadas:
   - `http://localhost:5173`
   - `http://localhost:5173/login`
   - `http://localhost:5173/register`
   - Tu dominio en producción (ej: `https://tudominio.com`)
9. Click en "Crear"
10. Copia tu **Client ID**

### Paso 2: Instalar dependencias

```bash
npm install @react-oauth/google
npm install jwt-decode
```

### Paso 3: Configurar variables de entorno

En `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=tu_client_id_aqui
```

### Paso 4: Implementar en Login.jsx

```jsx
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// En el componente, reemplaza el botón de Google por:
<GoogleLogin
  onSuccess={(credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Usuario:', decoded);
    // Llamar a tu backend para crear/actualizar usuario
    handleSocialLogin('Google', credentialResponse.credential);
  }}
  onError={() => {
    toast.error('Error al iniciar sesión con Google');
  }}
/>
```

### Paso 5: Envolver la app con GoogleOAuthProvider

En `main.jsx`:
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>,
)
```

---

## 🔵 FACEBOOK LOGIN

### Paso 1: Configurar Facebook Developers

1. Ve a https://developers.facebook.com
2. Crea una nueva aplicación
3. Tipo: "Consumidor"
4. Ve a Configuración > Básica
5. Copia tu **App ID**
6. Ve a "Configuración > Dominios de la aplicación"
7. Añade:
   - `localhost`
   - Tu dominio en producción
8. Ve a "Productos" y añade "Facebook Login"

### Paso 2: Instalar dependencias

```bash
npm install react-facebook-login
```

### Paso 3: Configurar variables de entorno

En `.env.local`:
```
VITE_FACEBOOK_APP_ID=tu_app_id_aqui
```

### Paso 4: Implementar en Login.jsx

```jsx
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

// En el componente:
<FacebookLogin
  appId={import.meta.env.VITE_FACEBOOK_APP_ID}
  autoLoad={false}
  fields="name,email,picture"
  scope="public_profile,email"
  callback={(response) => {
    console.log('Usuario Facebook:', response);
    handleSocialLogin('Facebook', response.accessToken);
  }}
  render={(renderProps) => (
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={renderProps.onClick}
    >
      <i className="fab fa-facebook-f"></i>
    </button>
  )}
/>
```

---

## 🔐 BACKEND - Verificar Tokens

Tu backend necesita validar los tokens recibidos:

### Para Google:
```python
from google.auth.transport import requests
from google.oauth2 import id_token

def verify_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        return {
            'email': idinfo['email'],
            'name': idinfo['name'],
            'picture': idinfo['picture']
        }
    except ValueError:
        return None
```

### Para Facebook:
```python
import requests

def verify_facebook_token(access_token, app_id, app_secret):
    url = f"https://graph.facebook.com/me?access_token={access_token}&fields=id,name,email,picture"
    response = requests.get(url)
    data = response.json()
    
    # Validar que el app_id coincida
    # ...
    return data
```

---

## 📝 Flujo Completo

1. Usuario hace click en botón Google/Facebook
2. Se abre el diálogo de OAuth
3. Usuario autoriza la aplicación
4. Se recibe el token
5. Se envía el token al backend
6. Backend verifica el token con Google/Facebook
7. Backend busca o crea el usuario
8. Se devuelve token JWT del sistema
9. Se guarda en localStorage
10. Usuario es redirigido a la página principal

---

## 🧪 Pruebas

Después de implementar, prueba:

```bash
# 1. En desarrollo
npm run dev

# 2. Abre http://localhost:5173/login

# 3. Haz click en Google o Facebook

# 4. Autoriza la aplicación

# 5. Verifica en la consola del navegador los datos del usuario
```

---

## 🚀 Deployment (Producción)

1. Añade tus dominios de producción en Google Cloud Console
2. Añade tus dominios de producción en Facebook Developers
3. Actualiza las variables de entorno en tu hosting
4. Implementa la validación de tokens en el backend

---

## 📚 Links Útiles

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [react-facebook-login](https://www.npmjs.com/package/react-facebook-login)

---

## ❓ Preguntas Frecuentes

**P: ¿Qué si el usuario no está registrado?**
R: El backend crea automáticamente una nueva cuenta con los datos de Google/Facebook

**P: ¿Es seguro guardar el token en localStorage?**
R: Para producción, usa httpOnly cookies junto con localStorage para mayor seguridad

**P: ¿Qué datos recibo de Google/Facebook?**
R: Email, nombre, foto de perfil (y otros campos que autorices)

