<script>
  // Importamos auth, signInWithEmailAndPassword y createOrUpdateUser desde tu archivo personalizado
  import { auth, signInWithEmailAndPassword, createOrUpdateUser } from '$lib/firebase-auth.js';
  // Importamos signInWithPopup y los proveedores directamente desde firebase/auth
  import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { user, userData } from '$lib/firebase-auth.js';

  // Crear instancias de los proveedores
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');

  let formData = { email: '', password: '' };
  let cargando = false;
  let mensajeEstado = '';
  let tipoMensaje = '';
  let recordarme = false;
  let mostrarPassword = false;

  async function iniciarSesion() {
    cargando = true;
    mensajeEstado = '';
    tipoMensaje = '';

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const authUser = cred.user;
      user.set(authUser);

      const dbUser = await createOrUpdateUser(authUser);
      userData.set(dbUser);
      
      // Agregamos logs para depuración
      console.log("Datos de usuario:", dbUser);

      // Interpolación correcta usando template literals
      mensajeEstado = `Bienvenido, ${dbUser.displayName || authUser.email}!`;
      tipoMensaje = 'success';

      if (recordarme) {
        localStorage.setItem('userEmail', formData.email);
      } else {
        localStorage.removeItem('userEmail');
      }

      // Verificar si el usuario es un barbero y redirigir adecuadamente
      const esBarbero = 
        dbUser.rol === 'barbero' || 
        ['edison@barbershop.com', 'brayan@barbershop.com', 'fernanda@barbershop.com']
          .includes(authUser.email);
      
      // Agregamos log para verificar
      console.log("Es barbero:", esBarbero);
    
      // Redirigir basado en el rol - ELIMINADO EL TIMEOUT
      if (esBarbero) {
        goto('/agenda-barbero');
      } else {
        goto('/');
      }
    } catch (err) {
      console.error('Login error:', err);

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        mensajeEstado = 'Correo o contraseña incorrectos.';
      } else if (err.code === 'auth/too-many-requests') {
        mensajeEstado = 'Demasiados intentos. Inténtalo más tarde.';
      } else {
        mensajeEstado = 'Error al iniciar sesión. Verifica tus credenciales.';
      }

      tipoMensaje = 'danger';
    } finally {
      cargando = false;
    }
  }

  async function signInWithProvider(provider) {
    cargando = true;
    mensajeEstado = '';
    tipoMensaje = '';

    try {
      const cred = await signInWithPopup(auth, provider);
      const authUser = cred.user;
      user.set(authUser);

      const dbUser = await createOrUpdateUser(authUser);
      userData.set(dbUser);
      
      // Agregamos logs para depuración
      console.log("Datos de usuario (provider):", dbUser);

      mensajeEstado = `Bienvenido, ${dbUser.displayName || authUser.email}!`;
      tipoMensaje = 'success';

      // Verificar si el usuario es un barbero y redirigir adecuadamente
      const esBarbero = 
        dbUser.rol === 'barbero' || 
        ['edison@barbershop.com', 'brayan@barbershop.com', 'fernanda@barbershop.com']
          .includes(authUser.email);
      
      // Agregamos log para verificar
      console.log("Es barbero (provider):", esBarbero);
    
      // Redirigir basado en el rol - ELIMINADO EL TIMEOUT
      if (esBarbero) {
        goto('/agenda-barbero');
      } else {
        goto('/');
      }
    } catch (err) {
      console.error('Provider login error:', err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        mensajeEstado = 'Ya existe una cuenta con este correo y otro método.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        mensajeEstado = 'Operación cancelada por el usuario.';
      } else {
        mensajeEstado = 'Error al iniciar sesión con proveedor.';
      }
      tipoMensaje = 'danger';
    } finally {
      cargando = false;
    }
  }

  const signInWithGoogle = () => signInWithProvider(googleProvider);
  const signInWithFacebook = () => signInWithProvider(facebookProvider);
  const signInWithApple = () => signInWithProvider(appleProvider);
</script>

<div class="container-fluid bg-dark text-light py-5">
  <div class="container text-center">
    <h1 class="display-4 mb-4">
      Iniciar sesión
    </h1>
    <p class="lead">Accede a tu cuenta para continuar</p>
  </div>
</div>

<div class="container py-5">
  <div class="row g-5 justify-content-center">
    <div class="col-lg-6">
      <div class="card border-0 shadow-lg">
        <div class="card-body p-4">
          <div class="d-flex justify-content-center mb-4">
            <a href="/login" class="btn btn-primary me-2">
              <i class="fas fa-sign-in-alt me-2"></i>Login
            </a>
            <a href="/registro" class="btn btn-outline-primary">
              <i class="fas fa-user-plus me-2"></i>Registro
            </a>
          </div>

          <form on:submit|preventDefault={iniciarSesion}>
            <div class="row g-4">
              <div class="col-12">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Correo Electrónico"
                    bind:value={formData.email}
                    required
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-lock"></i></span>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    class="form-control"
                    placeholder="Contraseña"
                    bind:value={formData.password}
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    on:click={() => (mostrarPassword = !mostrarPassword)}
                  >
                    <i class={mostrarPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>
              <div class="col-12 d-flex justify-content-between align-items-center">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    bind:checked={recordarme}
                  />
                  <label class="form-check-label">Recordarme</label>
                </div>
                <a href="/recuperar-contrasena" class="text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              {#if mensajeEstado}
                <div class="col-12">
                  <div class="alert alert-{tipoMensaje}" role="alert">
                    {mensajeEstado}
                  </div>
                </div>
              {/if}
              <div class="col-12">
                <button
                  type="submit"
                  class="btn btn-primary w-100 py-3"
                  disabled={cargando}
                >
                  {#if cargando}
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  {:else}
                    <i class="fas fa-sign-in-alt me-2"></i>Iniciar sesión
                  {/if}
                </button>
              </div>
            </div>
          </form>

          <div class="my-4 position-relative">
            <hr />
            <div class="position-absolute top-50 start-50 translate-middle bg-white px-3">
              O continúa con:
            </div>
          </div>

          <div class="row g-3">
            <div class="col-4">
              <button
                class="btn btn-outline-secondary w-100"
                on:click={signInWithGoogle}
                disabled={cargando}
              >
                <i class="fab fa-google"></i>
              </button>
            </div>
            <div class="col-4">
              <button
                class="btn btn-outline-secondary w-100"
                on:click={signInWithFacebook}
                disabled={cargando}
              >
                <i class="fab fa-facebook-f"></i>
              </button>
            </div>
            <div class="col-4">
              <button
                class="btn btn-outline-secondary w-100"
                on:click={signInWithApple}
                disabled={cargando}
              >
                <i class="fab fa-apple"></i>
              </button>
            </div>
          </div>

          <div class="text-center mt-4">
            <p>
              ¿No tienes cuenta?
              <a href="/registro" class="text-decoration-none">Regístrate</a>
            </p>
            <div class="mt-3 mb-2">
              <p class="text-muted small">¿Eres barbero del equipo?</p>
              <a href="/registro-barbero" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-cut me-2"></i>Acceso para barberos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  .card {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .card:hover {
    transform: translateY(-5px);
  }
  .btn-primary {
    transition: all 0.3s;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4);
  }
</style>