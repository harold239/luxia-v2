<script>
  import { auth, createUserWithEmailAndPassword, createOrUpdateUser } from '$lib/firebase-auth.js';
  import { goto } from '$app/navigation';
  import { user, userData } from '$lib/firebase-auth.js';

  let formData = { 
    email: '', 
    password: '', 
    confirmPassword: '',
    nombre: '',
    apellido: '',
    telefono: '',
    experiencia: '',
    especialidad: '' 
  };
  let cargando = false;
  let mensajeEstado = '';
  let tipoMensaje = '';
  let mostrarPassword = false;

  async function registrarBarbero() {
    cargando = true;
    mensajeEstado = '';
    tipoMensaje = '';

    if (formData.password !== formData.confirmPassword) {
      mensajeEstado = 'Las contraseñas no coinciden';
      tipoMensaje = 'danger';
      cargando = false;
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const authUser = cred.user;
      user.set(authUser);

      // Añadir datos específicos del barbero
      const dbUser = await createOrUpdateUser(authUser, {
        displayName: `${formData.nombre} ${formData.apellido}`,
        telefono: formData.telefono,
        experiencia: formData.experiencia,
        especialidad: formData.especialidad,
        role: 'barbero'  // Rol especial para barberos
      });
      userData.set(dbUser);

      mensajeEstado = `¡Registro exitoso! Bienvenido, ${dbUser.displayName}!`;
      tipoMensaje = 'success';

      setTimeout(() => goto('/'), 2000);
    } catch (err) {
      console.error('Registro error:', err);

      if (err.code === 'auth/email-already-in-use') {
        mensajeEstado = 'Este correo electrónico ya está registrado.';
      } else if (err.code === 'auth/weak-password') {
        mensajeEstado = 'La contraseña es demasiado débil.';
      } else {
        mensajeEstado = 'Error al registrar usuario.';
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
      <i class="fas fa-cut me-3"></i>Registro para Barberos
    </h1>
    <p class="lead">Únete a nuestro equipo de profesionales</p>
  </div>
</div>

<div class="container py-5">
  <div class="row g-5 justify-content-center">
    <div class="col-lg-8">
      <div class="card border-0 shadow-lg">
        <div class="card-body p-4">
          <div class="d-flex justify-content-center mb-4">
            <a href="/login" class="btn btn-outline-primary me-2">
              <i class="fas fa-sign-in-alt me-2"></i>Login
            </a>
            <a href="/registro" class="btn btn-outline-primary me-2">
              <i class="fas fa-user-plus me-2"></i>Registro
            </a>
            <a href="/registro-barbero" class="btn btn-primary">
              <i class="fas fa-cut me-2"></i>Registro Barbero
            </a>
          </div>

          <form on:submit|preventDefault={registrarBarbero}>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-user"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre"
                    bind:value={formData.nombre}
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-user"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Apellido"
                    bind:value={formData.apellido}
                    required
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
                  <span class="input-group-text"><i class="fas fa-phone"></i></span>
                  <input
                    type="tel"
                    class="form-control"
                    placeholder="Teléfono"
                    bind:value={formData.telefono}
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-scissors"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Especialidad"
                    bind:value={formData.especialidad}
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-star"></i></span>
                  <select class="form-select" bind:value={formData.experiencia} required>
                    <option value="" disabled selected>Años de experiencia</option>
                    <option value="0-1">Menos de 1 año</option>
                    <option value="1-3">1-3 años</option>
                    <option value="3-5">3-5 años</option>
                    <option value="5+">Más de 5 años</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-lock"></i></span>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    class="form-control"
                    placeholder="Contraseña"
                    bind:value={formData.password}
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="input-group">
                  <span class="input-group-text"><i class="fas fa-lock"></i></span>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    class="form-control"
                    placeholder="Confirmar Contraseña"
                    bind:value={formData.confirmPassword}
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
                    Procesando registro...
                  {:else}
                    <i class="fas fa-cut me-2"></i>Registrarme como Barbero
                  {/if}
                </button>
              </div>
            </div>
          </form>

          <div class="text-center mt-4">
            <p>
              ¿Ya tienes cuenta?
              <a href="/login" class="text-decoration-none">Inicia sesión</a>
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