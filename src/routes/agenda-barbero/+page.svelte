<script>
  import { onMount } from 'svelte';
  import { user, userData } from '$lib/firebase-auth.js';
  import { obtenerCitasBarbero, marcarCitaCompletada, actualizarCita } from '$lib/firebase-reservas.js';
  import { goto } from '$app/navigation';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/themes/material_blue.css';
  import { Spanish } from 'flatpickr/dist/l10n/es.js';
  
  // Estado del componente
  let barberoActual = '';
  let fechaSeleccionada = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD para hoy
  let citas = [];
  let cargando = true;
  let error = '';
  let datepicker;
  let flatpickrInstance;
  let autenticado = false;
  let esBarbero = false;
  
  // Estado para edición de citas
  let editandoCita = null;
  let citaEnEdicion = {
    nombre: '',
    telefono: '',
    hora: '',
    servicio: '',
    completada: false
  };
  
  // Formatos para mostrar hora
  function formatoHora(hora) {
    // Convierte formato 24h (14:30) a 12h (2:30 PM)
    if (!hora) return '';
    
    const [horas, minutos] = hora.split(':').map(Number);
    const periodo = horas >= 12 ? 'PM' : 'AM';
    const hora12 = horas > 12 ? horas - 12 : (horas === 0 ? 12 : horas);
    
    return `${hora12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
  }
  
  function formatoFecha(fecha) {
    if (!fecha) return '';
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }
  
  // Función para verificar si el usuario es un barbero autorizado
  function verificarPermisosBarbero(usuario) {
    if (!usuario) {
      return false;
    }
    
    // Verificar si el usuario tiene el rol de barbero en sus datos
    if ($userData && ($userData.rol === 'barbero' || $userData.role === 'barbero')) {
      barberoActual = $userData.nombre || $userData.displayName || usuario.displayName;
      return true;
    }
    
    // Verificar si el email del usuario coincide con algún barbero
    const emailsBarberos = [
      'edison@barbershop.com',
      'brayan@barbershop.com',
      'fernanda@barbershop.com'
    ];
    
    const esBarberoAutorizado = emailsBarberos.includes(usuario.email);
    
    if (esBarberoAutorizado) {
      // Extraer el nombre del barbero del email (parte antes del @)
      barberoActual = usuario.email.split('@')[0];
      // Capitalizar la primera letra
      barberoActual = barberoActual.charAt(0).toUpperCase() + barberoActual.slice(1);
    }
    
    return esBarberoAutorizado;
  }
  
  // Cargar las citas
  async function cargarCitas() {
    cargando = true;
    error = '';
    
    try {
      if (!barberoActual || !fechaSeleccionada) {
        citas = [];
        return;
      }
      
      citas = await obtenerCitasBarbero(barberoActual, fechaSeleccionada);
      
      // Ordenar citas por hora
      citas.sort((a, b) => {
        return a.hora.localeCompare(b.hora);
      });
      
      console.log("Citas cargadas:", citas);
    } catch (err) {
      console.error("Error al cargar citas:", err);
      error = 'Error al cargar las citas. Por favor intenta nuevamente.';
    } finally {
      cargando = false;
    }
  }
  
  // Función para marcar una cita como completada
  async function marcarCompletada(citaId) {
    try {
      await marcarCitaCompletada(citaId);
      // Actualizar la cita en la lista local
      citas = citas.map(cita => {
        if (cita.id === citaId) {
          return { ...cita, completada: true };
        }
        return cita;
      });
    } catch (err) {
      console.error("Error al marcar cita como completada:", err);
      alert('Error al actualizar el estado de la cita.');
    }
  }
  
  // Funciones para edición de citas
  function iniciarEdicion(cita) {
    editandoCita = cita.id;
    citaEnEdicion = { ...cita };
  }
  
  function cancelarEdicion() {
    editandoCita = null;
    citaEnEdicion = {
      nombre: '',
      telefono: '',
      hora: '',
      servicio: '',
      completada: false
    };
  }
  
  async function guardarCambiosCita() {
    try {
      await actualizarCita(editandoCita, citaEnEdicion);
      
      // Actualizar la cita en la lista local
      citas = citas.map(cita => {
        if (cita.id === editandoCita) {
          return { ...citaEnEdicion, id: editandoCita };
        }
        return cita;
      });
      
      cancelarEdicion();
    } catch (err) {
      console.error("Error al actualizar la cita:", err);
      alert('Error al guardar los cambios de la cita.');
    }
  }
  
  // Inicializar calendario
  function inicializarCalendario() {
    if (!datepicker) return;
    
    if (flatpickrInstance) {
      flatpickrInstance.destroy();
    }
    
    flatpickrInstance = flatpickr(datepicker, {
      dateFormat: 'Y-m-d',
      locale: Spanish,
      defaultDate: fechaSeleccionada,
      inline: true, // Importante: Mostrar el calendario siempre visible
      onChange: (selectedDates) => {
        if (selectedDates && selectedDates[0]) {
          fechaSeleccionada = selectedDates[0].toISOString().split('T')[0];
          cargarCitas();
        }
      }
    });
  }
  
  // Redirigir a login si no está autenticado
  function redirigirLogin() {
    sessionStorage.setItem('returnTo', '/agenda');
    goto('/login');
  }

  // Suscribirse a cambios de usuario
  onMount(() => {
    const unsubscribe = user.subscribe(currentUser => {
      autenticado = !!currentUser;
      
      if (currentUser) {
        esBarbero = verificarPermisosBarbero(currentUser);
        
        if (esBarbero) {
          setTimeout(() => {
            inicializarCalendario();
            cargarCitas();
          }, 300);
        }
      }
    });
    
    return () => {
      unsubscribe();
      if (flatpickrInstance) {
        flatpickrInstance.destroy();
      }
    };
  });
  
  // Recargar cuando cambie la fecha
  $: if (fechaSeleccionada && barberoActual && esBarbero) {
    cargarCitas();
  }
</script>

<div class="container-fluid bg-dark text-light py-5">
  <div class="container text-center">
    <h1 class="display-4 mb-4">
      <i class="fas fa-calendar-alt me-3"></i>Mi Agenda
    </h1>
    <p class="lead">Gestiona tus citas y horarios</p>
  </div>
</div>

<div class="container py-5">
  {#if !autenticado}
    <div class="card border-0 shadow-lg">
      <div class="card-body p-4 text-center">
        <i class="fas fa-lock fa-3x text-warning mb-3"></i>
        <h3>Acceso Restringido</h3>
        <p>Necesitas iniciar sesión para acceder a la agenda de citas.</p>
        <button class="btn btn-primary" on:click={redirigirLogin}>
          <i class="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
        </button>
      </div>
    </div>
  {:else if !esBarbero}
    <div class="card border-0 shadow-lg">
      <div class="card-body p-4 text-center">
        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
        <h3>Acceso Denegado</h3>
        <p>Lo sentimos, solo los barberos pueden acceder a esta página.</p>
        <button class="btn btn-secondary" on:click={() => goto('/')}>
          <i class="fas fa-home me-2"></i>Regresar al inicio
        </button>
      </div>
    </div>
  {:else}
    <div class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-lg mb-4">
          <div class="card-body p-4">
            <h2 class="card-title text-primary"><i class="fas fa-user-circle me-2"></i>Bienvenido, {barberoActual}</h2>
            <p class="card-text">Selecciona una fecha para ver y gestionar tus citas agendadas.</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card border-0 shadow-lg">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0 fs-5"><i class="fas fa-calendar me-2"></i>Selecciona Fecha</h3>
          </div>
          <div class="card-body p-3">
            <!-- Importante: El calendario se muestra aquí -->
            <div bind:this={datepicker} class="calendario-datepicker w-100"></div>
          </div>
        </div>
      </div>
      
      <div class="col-md-8">
        <div class="card border-0 shadow-lg">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 class="mb-0 fs-5"><i class="fas fa-clipboard-list me-2"></i>Citas para {formatoFecha(fechaSeleccionada)}</h3>
          </div>
          <div class="card-body p-3">
            {#if error}
              <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>{error}
              </div>
            {/if}
            
            {#if cargando}
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3">Cargando citas...</p>
              </div>
            {:else if citas.length === 0}
              <div class="text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <h5>No tienes citas programadas para esta fecha</h5>
                <p class="text-muted">Las citas que recibas aparecerán aquí</p>
              </div>
            {:else}
              <div class="lista-citas">
                {#each citas as cita (cita.id)}
                  <div class="card mb-3 border-left-primary {cita.completada ? 'border-success bg-light' : ''}">
                    <div class="card-body p-3">
                      {#if editandoCita === cita.id}
                        <!-- Formulario de edición de cita -->
                        <div class="row g-3">
                          <div class="col-md-6">
                            <label for="nombre" class="form-label">Nombre del cliente</label>
                            <input 
                              type="text" 
                              class="form-control" 
                              id="nombre"
                              bind:value={citaEnEdicion.nombre}
                            >
                          </div>
                          <div class="col-md-6">
                            <label for="telefono" class="form-label">Teléfono</label>
                            <input 
                              type="tel" 
                              class="form-control" 
                              id="telefono"
                              bind:value={citaEnEdicion.telefono}
                            >
                          </div>
                          <div class="col-md-6">
                            <label for="hora" class="form-label">Hora</label>
                            <input 
                              type="time" 
                              class="form-control" 
                              id="hora"
                              bind:value={citaEnEdicion.hora}
                            >
                          </div>
                          <div class="col-md-6">
                            <label for="servicio" class="form-label">Servicio</label>
                            <input 
                              type="text" 
                              class="form-control" 
                              id="servicio"
                              bind:value={citaEnEdicion.servicio}
                            >
                          </div>
                          <div class="col-12 mt-3 d-flex justify-content-end gap-2">
                            <button class="btn btn-secondary" on:click={cancelarEdicion}>
                              <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button class="btn btn-primary" on:click={guardarCambiosCita}>
                              <i class="fas fa-save me-2"></i>Guardar cambios
                            </button>
                          </div>
                        </div>
                      {:else}
                        <!-- Vista normal de la cita -->
                        <div class="row g-2 align-items-center">
                          <div class="col-md-2">
                            <h5 class="mb-0 text-primary">
                              <i class="fas fa-clock me-1"></i>{formatoHora(cita.hora)}
                            </h5>
                          </div>
                          <div class="col-md-5">
                            <h5 class="mb-1">{cita.nombre || 'Cliente'}</h5>
                            <p class="mb-0 text-muted">
                              <i class="fas fa-phone me-1"></i>{cita.telefono || 'No disponible'}
                              {#if cita.servicio}
                                <span class="ms-3"><i class="fas fa-cut me-1"></i>{cita.servicio}</span>
                              {/if}
                            </p>
                          </div>
                          <div class="col-md-5 text-end">
                            {#if cita.completada}
                              <span class="badge bg-success py-2 px-3 me-2">
                                <i class="fas fa-check me-1"></i>Completada
                              </span>
                              <button 
                                class="btn btn-sm btn-outline-primary"
                                on:click={() => iniciarEdicion(cita)}
                              >
                                <i class="fas fa-edit me-1"></i>Editar
                              </button>
                            {:else}
                              <button 
                                class="btn btn-sm btn-outline-primary me-2"
                                on:click={() => iniciarEdicion(cita)}
                              >
                                <i class="fas fa-edit me-1"></i>Editar
                              </button>
                              <button 
                                class="btn btn-sm btn-outline-success"
                                on:click={() => marcarCompletada(cita.id)}
                              >
                                <i class="fas fa-check me-1"></i>Marcar completada
                              </button>
                            {/if}
                          </div>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
  
<style>
  /* Asegúrate que el calendario se muestre correctamente */
  :global(.flatpickr-calendar) {
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }
  
  :global(.flatpickr-day.selected) {
    background: #3498db !important;
    border-color: #3498db !important;
  }
  
  :global(.flatpickr-day.today) {
    border-color: #3498db !important;
  }
  
  :global(.flatpickr-month) {
    background-color: #3498db !important;
    color: white !important;
    padding: 10px 0 !important;
  }
  
  :global(.flatpickr-current-month) {
    color: white !important;
  }
  
  :global(.flatpickr-monthDropdown-months) {
    color: white !important;
  }
  
  :global(.flatpickr-weekday) {
    color: #3498db !important;
    font-weight: bold !important;
  }
  
  :global(.flatpickr-prev-month svg, .flatpickr-next-month svg) {
    fill: white !important;
  }
  
  /* Estilos para las citas */
  .border-left-primary {
    border-left: 4px solid #3498db !important;
  }
  
  .border-success {
    border-left: 4px solid #27ae60 !important;
  }
  
  /* Asegúrate de que la lista de citas tenga scroll si hay muchas */
  .lista-citas {
    max-height: 600px;
    overflow-y: auto;
  }
</style>