<script>
  import { auth, createUserWithEmailAndPassword, createOrUpdateUser } from '$lib/firebase-auth.js';
  import { updateProfile } from 'firebase/auth'; // Importamos updateProfile
  import { goto } from '$app/navigation';
  import { user, userData } from '$lib/firebase-auth.js';

  let formData = { 
    email: '', 
    password: '', 
    confirmPassword: '', 
    displayName: '' 
  };
  let cargando = false;
  let mensajeEstado = '';
  let tipoMensaje = '';
  let mostrarPassword = false;

  async function registrarUsuario() {
    cargando = true;
    mensajeEstado = '';
    tipoMensaje = '';

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      mensajeEstado = 'Las contraseñas no coinciden.';
      tipoMensaje = 'danger';
      cargando = false;
      return;
    }

    // Validar que la contraseña cumpla con requisitos mínimos
    if (formData.password.length < 6) {
      mensajeEstado = 'La contraseña debe tener al menos 6 caracteres.';
      tipoMensaje = 'danger';
      cargando = false;
      return;
    }

    try {
      // Crear el usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const authUser = cred.user;

      // Actualizar el displayName si se proporcionó
      if (formData.displayName) {
        await updateProfile(authUser, {
          displayName: formData.displayName
        });
      }

      user.set(authUser);

      // Crear el usuario en la base de datos
      const dbUser = await createOrUpdateUser({
        ...authUser,
        displayName: formData.displayName || authUser.displayName || ''
      });
      userData.set(dbUser);

      // Agregamos logs para depuración
      console.log("Usuario registrado:", dbUser);

      mensajeEstado = `¡Registro exitoso! Bienvenido, ${dbUser.displayName || authUser.email}!`;
      tipoMensaje = 'success';

      // Redireccionar a la página principal (home) en lugar de dashboard
      goto('/');
    } catch (err) {
      console.error('Error de registro:', err);

      if (err.code === 'auth/email-already-in-use') {
        mensajeEstado = 'Este correo ya está registrado. Intenta iniciar sesión.';
      } else if (err.code === 'auth/invalid-email') {
        mensajeEstado = 'El correo electrónico no es válido.';
      } else if (err.code === 'auth/weak-password') {
        mensajeEstado = 'La contraseña es demasiado débil.';
      } else {
        mensajeEstado = 'Error al registrar usuario. Inténtalo nuevamente.';
      }

      tipoMensaje = 'danger';
    } finally {
      cargando = false;
    }
  }
</script>

<div class="container-fluid bg-dark text-light py-5">
  <div class="container text-center">
    <h1 class="display-4 mb-4">
      <i class="fas fa-user-plus me-3"></i>Registro
    </h1>
    <p class="lead">Crea una cuenta para comenzar</p>
  </div>
</div>

<div class="container py-5">
  <div class="row g-5 justify-content-center">
    <div class="col-lg-6">
      <div class="card border-0 shadow-lg">
        <div class="card-body p-4">
          <div class="d-flex justify-content-center mb-4">
            <a href="/login" class="btn btn-outline-primary me-2">
              <i class="fas fa-sign-in-alt me-2"></i>Login
            </a>
            <a href="/registro" class="btn btn-primary">
              <i class="fas fa-user-plus me-2"></i>Registro
            </a>
          </div>

          <form on:submit|preventDefault={registrarUsuario}>
            <div class="row g-4">
              <div class="col-12">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-user"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre completo"
                    bind:value={formData.displayName}
                  />
                </div>
              </div>
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
              <div class="col-12">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-lock"></i></span>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    class="form-control"
                    placeholder="Confirmar contraseña"
                    bind:value={formData.confirmPassword}
                    required
                  />
                </div>
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
                    Registrando...
                  {:else}
                    <i class="fas fa-user-plus me-2"></i>Crear cuenta
                  {/if}
                </button>
              </div>
            </div>
          </form>

          <div class="text-center mt-4">
            <p>
              ¿Ya tienes cuenta?
              <a href="/login" class="text-decoration-none">Iniciar sesión</a>
            </p>
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