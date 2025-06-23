<script>
  import { obtenerHorasDisponibles, crearReserva } from '$lib/firebase-reservas.js';
  import { onMount } from 'svelte';
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/themes/material_blue.css';
  import { Spanish } from 'flatpickr/dist/l10n/es.js';
  import { goto } from '$app/navigation';
  import { user, userData } from '$lib/firebase-auth.js';
  
  
  import edison from '$lib/imagenes/edison.jpg';
  import brayan from '$lib/imagenes/brayan.jpg';
  import fernanda from '$lib/imagenes/fernanda.jpg';

  
  let barbero = '';
  let fecha = '';
  let hora = '';
  let nombre = '';
  let telefono = '';
  let horasDisponibles = [];
  let errorCargandoHoras = '';
  let datepickerElement; 
  let calendarInitialized = false;
  let reservaEnviada = false;
  let mensajeEstado = '';
  let reservaExitosa = false;
  let reservaConfirmada = null;
  let diaCompleto = false; 
  let flatpickrInstance = null; 
  let calendarAttempts = 0; 
  let intentandoInicializarCalendario = false; 
  
  
  let usuarioAutenticado = false; 
  
  // Suscripción al store de usuario
  const unsubscribe = user.subscribe(currentUser => {
    usuarioAutenticado = !!currentUser;
    console.log("Estado de autenticación actualizado:", usuarioAutenticado);
    
    
    if (currentUser && $userData) {
      
      nombre = nombre || $userData.displayName || '';
      telefono = telefono || $userData.phoneNumber || '';
    }
  });
  
  
  let pasoActual = 1;
  const totalPasos = 4;

  
  function handleImageError(event, nombreBarbero) {
    
    const initialLetter = nombreBarbero[0];
    const svgImage = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' fill='%23E0E0E0'/><text x='50%' y='50%' font-size='36' text-anchor='middle' alignment-baseline='middle' fill='%237F8C8D'>${initialLetter}</text></svg>`;
    
    event.target.src = svgImage;
    console.log(`Error al cargar imagen de ${nombreBarbero}, utilizando placeholder SVG`);
  }

  
  const barberos = [
    { 
      id: 'Edison', 
      nombre: 'Edison', 
      imagen: edison,
      especialidad: 'Cortes clásicos'
    },
    { 
      id: 'Brayan', 
      nombre: 'Brayan', 
      imagen: brayan,
      especialidad: 'Fade y diseños'
    },
    { 
      id: 'Fernanda', 
      nombre: 'Fernanda', 
      imagen: fernanda,
      especialidad: 'Coloración y tratamientos'
    }
  ];

 
function initCalendar() {
  if (intentandoInicializarCalendario) {
    console.log("Ya hay un intento de inicialización en curso, esperando...");
    return;
  }
  
  intentandoInicializarCalendario = true;
  
  if (!datepickerElement) {
    console.error("Elemento de calendario no encontrado");
    intentandoInicializarCalendario = false;
    
    if (calendarAttempts < 5) {
      calendarAttempts++;
      console.log(`Reintentando inicializar calendario (intento ${calendarAttempts})...`);
      setTimeout(initCalendar, 300);
    }
    return;
  }
  
  console.log("Inicializando calendario...");
  
  try {
    
    if (flatpickrInstance) {
      flatpickrInstance.destroy();
      flatpickrInstance = null;
    }
    
    
    flatpickrInstance = flatpickr(datepickerElement, {
      dateFormat: 'Y-m-d',
      minDate: 'today',
      locale: Spanish,
      inline: true,
      static: true,
      disable: [
        function(date) {
          return (date.getDay() === 0);
        }
      ],
      onChange: function(selectedDates, dateStr) {
        fecha = dateStr;
        console.log("Fecha seleccionada:", dateStr);
        
        mensajeEstado = '';
        diaCompleto = false;
      },
      onMonthChange: function(selectedDates, dateStr, instance) {
        
        console.log("Mes cambiado a:", instance.currentMonth + 1);
      },
      onYearChange: function(selectedDates, dateStr, instance) {
        
        console.log("Año cambiado a:", instance.currentYear);
      }
    });
    
    calendarInitialized = true;
    calendarAttempts = 0;
    console.log("Calendario inicializado correctamente", flatpickrInstance);
    
    
    if (fecha) {
      flatpickrInstance.setDate(fecha, true);
    }
  } catch (error) {
    console.error("Error al inicializar calendario:", error);
    calendarInitialized = false;
    
    if (calendarAttempts < 5) {
      calendarAttempts++;
      console.log(`Error en inicialización, reintentando (intento ${calendarAttempts})...`);
      setTimeout(initCalendar, 500);
    }
  } finally {
    intentandoInicializarCalendario = false;
  }
}

  
  onMount(() => {
    console.log("Componente montado");
    
    
    recuperarEstadoSesion();
    
   
    const intentosInicializacion = [100, 300, 600, 1000, 2000];
    
    intentosInicializacion.forEach((delay, index) => {
      setTimeout(() => {
        if (!calendarInitialized && pasoActual === 2) {
          console.log(`Intento programado ${index + 1} de inicializar calendario después de ${delay}ms`);
          initCalendar();
        }
      }, delay);
    });
    
    
    return () => {
      
      if (flatpickrInstance) {
        flatpickrInstance.destroy();
        flatpickrInstance = null;
      }
      unsubscribe();
    };
  });
  
  
  function guardarEstadoSesion() {
    
    if (barbero || fecha || hora || nombre || telefono) {
      const estadoGuardar = {
        barbero,
        fecha,
        hora,
        nombre,
        telefono,
        pasoActual
      };
      
      try {
        localStorage.setItem('reservaEnProgreso', JSON.stringify(estadoGuardar));
        console.log("Estado guardado en sesión:", estadoGuardar);
      } catch (error) {
        console.error("Error al guardar estado en localStorage:", error);
      }
    }
  }
  
  
  function recuperarEstadoSesion() {
    try {
      const estadoGuardado = localStorage.getItem('reservaEnProgreso');
      
      if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado);
        console.log("Estado recuperado de sesión:", estado);
        
       
        barbero = estado.barbero || barbero;
        fecha = estado.fecha || fecha;
        hora = estado.hora || hora;
        nombre = estado.nombre || nombre;
        telefono = estado.telefono || telefono;
        
        
        if (estado.pasoActual > 1 && (barbero || fecha)) {
          pasoActual = estado.pasoActual;
          
          
          if (pasoActual === 3 && fecha && barbero) {
            setTimeout(() => cargarHoras(), 500);
          }
        }
      }
    } catch (error) {
      console.error("Error al recuperar estado de sesión:", error);
    }
  }
  
  
  $: {
    
    if (barbero || fecha || hora || nombre || telefono) {
      guardarEstadoSesion();
    }
  }

  async function cargarHoras() {
    errorCargandoHoras = '';
    horasDisponibles = [];
    
    try {
      if (fecha && barbero) {
        console.log(`Cargando horas para ${barbero} en fecha ${fecha}`);
        
        try {
          
          const horasObtenidas = await obtenerHorasDisponibles(fecha, barbero);
          console.log("Horas obtenidas:", horasObtenidas);
          
          
          if (horasObtenidas.length === 0 || 
              (horasObtenidas.length === 1 && horasObtenidas[0].startsWith('No hay horas disponibles'))) {
            
            diaCompleto = true;
            horasDisponibles = [];
            mensajeEstado = 'No hay horas disponibles para este día. Por favor selecciona otra fecha.';
            return;
          }
          
          if (horasObtenidas.length > 0 && horasObtenidas[0].startsWith('ADVERTENCIA')) {
            
            errorCargandoHoras = "No se pudieron verificar completamente las horas ocupadas. Algunas horas mostradas podrían no estar disponibles.";
            
            horasDisponibles = horasObtenidas.slice(1);
          } else {
            
            if (horasObtenidas[0] && (horasObtenidas[0].includes('AM') || horasObtenidas[0].includes('PM'))) {
              horasDisponibles = horasObtenidas;
            } else {
              
              horasDisponibles = horasObtenidas.map(hora => {
                const [horas, minutos] = hora.split(':');
                let horaNum = parseInt(horas);
                const periodo = horaNum >= 12 ? 'PM' : 'AM';
                
                
                if (horaNum > 12) {
                  horaNum -= 12;
                } else if (horaNum === 0) {
                  horaNum = 12;
                }
                
                
                return `${horaNum}:${minutos} ${periodo}`;
              });
            }
          }
          
          
          if (horasDisponibles.length === 0) {
            diaCompleto = true;
            mensajeEstado = 'No hay horas disponibles para este día. Por favor selecciona otra fecha.';
            return;
          }
          
          console.log("Horas disponibles procesadas:", horasDisponibles);
        } catch (error) {
          console.error("Error al cargar horas:", error);
          errorCargandoHoras = 'Error al cargar horas disponibles. Por favor intenta con otra fecha.';
          return;
        }
      }
    } catch (error) {
      console.error("Error general al cargar horas:", error);
      errorCargandoHoras = 'Error al cargar horas disponibles. Por favor intenta con otra fecha.';
    }
  }

  function seleccionarBarbero(id) {
    barbero = id;
    console.log("Barbero seleccionado:", id);
    avanzarPaso();
  }

  function avanzarPaso() {
    if (pasoActual < totalPasos) {
      pasoActual++;
      console.log("Avanzando al paso:", pasoActual);
      
      
      mensajeEstado = '';
      diaCompleto = false;
      
      
      if (pasoActual === 3 && fecha && barbero) {
        cargarHoras();
      }
      
      
      if (pasoActual === 2) {
        
        calendarInitialized = false;
        
        
        setTimeout(() => {
          calendarAttempts = 0;
          initCalendar();
        }, 200);
      }
      
      
      guardarEstadoSesion();
    }
  }

  function retrocederPaso() {
    if (pasoActual > 1) {
      pasoActual--;
      console.log("Retrocediendo al paso:", pasoActual);
      
      
      mensajeEstado = '';
      diaCompleto = false;
      
      
      if (pasoActual === 2) {
        
        calendarInitialized = false;
        if (flatpickrInstance) {
          flatpickrInstance.destroy();
          flatpickrInstance = null;
        }
        
        
        setTimeout(() => {
          calendarAttempts = 0;
          initCalendar();
        }, 300);
      }
      
      
      guardarEstadoSesion();
    }
  }

  function validarPaso(paso) {
    if (paso === 2 && !barbero) return false;
    if (paso === 3 && (!fecha || !hora)) return false;
    return true;
  }

  
  function convertirDe_AMPM(horaAMPM) {
    try {
      
      if (!horaAMPM || !horaAMPM.includes(' ')) {
        return horaAMPM; 
      }
      
      
      const [tiempo, periodo] = horaAMPM.split(' ');
      let [horas, minutos] = tiempo.split(':').map(Number);
      
      
      if (periodo === 'PM' && horas < 12) {
        horas += 12;
      } else if (periodo === 'AM' && horas === 12) {
        horas = 0;
      }
      
      return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
    } catch (error) {
      console.error("Error al convertir hora:", error);
      return horaAMPM; 
    }
  }

  function redirigirALogin() {
    
    sessionStorage.setItem('returnTo', '/reservar');
    
    guardarEstadoSesion();
    goto('/login');
  }

  function resetearFormulario() {
    barbero = '';
    fecha = '';
    hora = '';
    nombre = '';
    telefono = '';
    horasDisponibles = [];
    pasoActual = 1;
    reservaEnviada = false;
    mensajeEstado = '';
    diaCompleto = false;
    
    localStorage.removeItem('reservaEnProgreso');
  }

  async function confirmarReserva() {
    try {
      
      if (!barbero || !fecha || !hora || !nombre || !telefono) {
        mensajeEstado = 'Por favor completa todos los campos.';
        return;
      }
      
      
      if (!usuarioAutenticado) {
        mensajeEstado = 'Necesitas iniciar sesión para confirmar la reserva.';
        console.log("Error: Usuario no autenticado intentando crear reserva");
        
        
        if (confirm('Necesitas iniciar sesión para continuar. ¿Deseas ir a la página de login?')) {
          redirigirALogin();
        }
        return;
      }
      
      
      const datosReserva = {
        barbero,
        fechaReserva: new Date(`${fecha}T${convertirDe_AMPM(hora)}:00`),
        hora: convertirDe_AMPM(hora),
        nombre,
        telefono
      };
      
      console.log("Intentando crear reserva con datos:", datosReserva);
      
      
      mensajeEstado = 'Enviando reserva...';
      
      
      try {
        const reserva = await crearReserva(datosReserva);
        
        reservaEnviada = true;
        reservaExitosa = true;
        mensajeEstado = '¡Reserva confirmada con éxito!';
        console.log("Reserva creada exitosamente", reserva);
        
        
        reservaConfirmada = {
          nombre,
          telefono,
          fecha,
          hora,
          barbero
        };
        
        
        localStorage.removeItem('reservaEnProgreso');
        
        
        setTimeout(() => {
          resetearFormulario();
        }, 3000);
      } catch (error) {
        console.error("Error al crear reserva en Firebase:", error);
        
        
        if (error.code === 'permission-denied') {
          mensajeEstado = 'No tienes permisos para crear la reserva. Por favor inicia sesión.';
          setTimeout(() => redirigirALogin(), 2000);
        } else if (error.message && error.message.includes('no disponible')) {
          
          mensajeEstado = 'Esta hora ya no está disponible. Por favor selecciona otra hora.';
          pasoActual = 3;
          
          setTimeout(() => cargarHoras(), 1000);
        } else {
          mensajeEstado = `Error: ${error.message || "No se pudo crear la reserva. Intenta de nuevo."}`;
        }
      }
    } catch (error) {
      console.error("Error general al confirmar la reserva:", error);
      mensajeEstado = 'Error al procesar la reserva. Por favor intenta nuevamente.';
    }
  }

  
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  
  
  function generarCalendarioSimple() {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    
    const fechasDisponibles = [];
    for (let i = hoy.getDate(); i <= ultimoDia.getDate(); i++) {
      const fecha = new Date(anioActual, mesActual, i);
      
      if (fecha.getDay() !== 0) {
        fechasDisponibles.push({
          dia: i,
          fecha: `${anioActual}-${String(mesActual + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        });
      }
    }
    
    return {
      mes: meses[mesActual],
      anio: anioActual,
      fechasDisponibles: fechasDisponibles
    };
  }
  
  const datosCalendario = generarCalendarioSimple();

  
  $: if (pasoActual === 2) {
    
    setTimeout(() => {
      
      if (flatpickrInstance) {
        flatpickrInstance.destroy();
        flatpickrInstance = null;
      }
      calendarInitialized = false;
      
      if (datepickerElement) {
        calendarAttempts = 0;
        initCalendar();
      }
    }, 300);
  }
</script>

<div class="contenedor-reserva">
  <h1>Reservar tu Cita</h1>
  
  
  <div class="barra-progreso">
    <div class="pasos">
      <div class={`paso ${pasoActual >= 1 ? 'activo' : ''}`}>
        <div class="numero-paso">1</div>
        <div class="texto-paso">Barbero</div>
      </div>
      <div class={`paso ${pasoActual >= 2 ? 'activo' : ''}`}>
        <div class="numero-paso">2</div>
        <div class="texto-paso">Fecha</div>
      </div>
      <div class={`paso ${pasoActual >= 3 ? 'activo' : ''}`}>
        <div class="numero-paso">3</div>
        <div class="texto-paso">Hora</div>
      </div>
      <div class={`paso ${pasoActual >= 4 ? 'activo' : ''}`}>
        <div class="numero-paso">4</div>
        <div class="texto-paso">Datos</div>
      </div>
    </div>
    <div class="linea-progreso">
      <div class="progreso" style="width: {((pasoActual - 1) / (totalPasos - 1)) * 100}%"></div>
    </div>
  </div>

  {#if mensajeEstado}
    <div class={`mensaje-estado ${reservaExitosa ? 'exito' : ''}`}>
      {mensajeEstado}
    </div>
  {/if}

  
  {#if !usuarioAutenticado && pasoActual >= 3}
    <div class="mensaje-info">
      <strong>Nota:</strong> Para confirmar tu reserva necesitarás iniciar sesión.
      <div class="acciones-login">
        <button class="boton-login" on:click={redirigirALogin}>
          Iniciar sesión
        </button>
      </div>
    </div>
  {/if}


{#if pasoActual === 1}
  <div class="paso-contenido">
    <h2>Selecciona tu barbero</h2>
    <div class="grid-barberos">
      {#each barberos as barberoItem}
        <div 
          class="tarjeta-barbero {barbero === barberoItem.id ? 'seleccionado' : ''}" 
          on:click={() => seleccionarBarbero(barberoItem.id)}
        >
          <div class="imagen-barbero">
            <img 
              src={barberoItem.imagen} 
              alt={barberoItem.nombre}
              on:error={(e) => handleImageError(e, barberoItem.nombre)}
            />
          </div>
          <h3>{barberoItem.nombre}</h3>
          <p>{barberoItem.especialidad}</p>
          {#if barbero === barberoItem.id}
            <div class="indicador-seleccion">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

  
  {#if pasoActual === 2}
    <div class="paso-contenido">
      <h2>Selecciona la fecha</h2>
      
      <div class="calendario-contenedor">
        <div class="fecha-seleccionada">
          {#if fecha}
            <p>Fecha seleccionada: <strong>{fecha}</strong></p>
          {:else}
            <p>Selecciona una fecha en el calendario</p>
          {/if}
        </div>
        
        
        <div class="calendario">
          
          <div bind:this={datepickerElement} id="calendario-flatpickr"></div>
          
          
          <div class="calendario-simple" style={calendarInitialized ? 'display: none;' : ''}>
            <div class="calendario-encabezado">
              <h3>{datosCalendario.mes} {datosCalendario.anio}</h3>
            </div>
            <div class="calendario-dias">
              {#each diasSemana as dia}
                <div class="dia-semana">{dia}</div>
              {/each}
            </div>
            <div class="calendario-fechas">
              {#each datosCalendario.fechasDisponibles as item}
                <div 
                  class={`fecha-dia ${fecha === item.fecha ? 'seleccionada' : ''}`}
                  on:click={() => {
                    fecha = item.fecha;
                    
                    mensajeEstado = '';
                    diaCompleto = false;
                  }}
                >
                  {item.dia}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
      
      
      {#if diaCompleto}
        <div class="mensaje-error">
          No hay horas disponibles para este día. Por favor selecciona otra fecha.
        </div>
      {/if}
      
      <div class="botones-navegacion">
        <button class="boton-secundario" on:click={retrocederPaso}>Anterior</button>
        <button class="boton-primario" on:click={avanzarPaso} disabled={!fecha}>Siguiente</button>
      </div>
    </div>
  {/if}

  
  {#if pasoActual === 3}
    <div class="paso-contenido">
      <h2>Selecciona la hora</h2>
      {#if diaCompleto}
        <div class="mensaje-error">No hay horas disponibles para este día. Por favor selecciona otra fecha.</div>
        <div class="botones-navegacion">
          <button class="boton-secundario" on:click={retrocederPaso}>Seleccionar otra fecha</button>
        </div>
      {:else if errorCargandoHoras}
        <div class="mensaje-info">{errorCargandoHoras}</div>
        <div class="botones-navegacion">
          <button class="boton-secundario" on:click={retrocederPaso}>Seleccionar otra fecha</button>
        </div>
      {:else if horasDisponibles.length === 0}
        <div class="cargando">Cargando horas disponibles...</div>
      {:else}
        <div class="grid-horas">
          {#each horasDisponibles as horaDisponible}
            <div 
              class={`tarjeta-hora ${hora === horaDisponible ? 'seleccionada' : ''}`} 
              on:click={() => hora = horaDisponible}
            >
              {horaDisponible}
            </div>
          {/each}
        </div>
        <div class="botones-navegacion">
          <button class="boton-secundario" on:click={retrocederPaso}>Anterior</button>
          <button class="boton-primario" on:click={avanzarPaso} disabled={!hora}>Siguiente</button>
        </div>
      {/if}
    </div>
  {/if}

  
  {#if pasoActual === 4}
    <div class="paso-contenido">
      <h2>Tus datos personales</h2>
      <div class="campo-formulario">
        <label for="nombre">Nombre Completo</label>
        <input type="text" id="nombre" bind:value={nombre} placeholder="Ingresa tu nombre completo" />
      </div>
      <div class="campo-formulario">
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" bind:value={telefono} placeholder="Ingresa tu número de teléfono" />
      </div>
      
      <div class="resumen-reserva">
        <h3>Resumen de tu reserva</h3>
        <p><strong>Barbero:</strong> {barbero}</p>
        <p><strong>Fecha:</strong> {fecha}</p>
        <p><strong>Hora:</strong> {hora}</p>
      </div>
      
      <div class="botones-navegacion">
        <button class="boton-secundario" on:click={retrocederPaso}>Anterior</button>
        {#if usuarioAutenticado}
          <button class="boton-primario" on:click={confirmarReserva} disabled={!nombre || !telefono}>
            Confirmar Reserva
          </button>
        {:else}
          <button class="boton-primario" on:click={redirigirALogin}>
            Iniciar Sesión para Confirmar
          </button>
        {/if}
      </div>
    </div>
  {/if}
  
  
  {#if reservaExitosa && reservaConfirmada}
    <div class="confirmacion-reserva">
      <h2>¡Reserva Confirmada!</h2>
      <div class="detalles-confirmacion">
        <p><strong>Nombre:</strong> {reservaConfirmada.nombre}</p>
        <p><strong>Barbero:</strong> {reservaConfirmada.barbero}</p>
        <p><strong>Fecha:</strong> {reservaConfirmada.fecha}</p>
        <p><strong>Hora:</strong> {reservaConfirmada.hora}</p>
      </div>
      <button class="boton-primario" on:click={() => {
        reservaExitosa = false;
        reservaConfirmada = null;
        resetearFormulario();
      }}>
        Hacer otra reserva
      </button>
    </div>
  {/if}
</div>

<style>
  .contenedor-reserva {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
  }

  h2 {
    color: #3498db;
    margin-bottom: 20px;
  }

  
  .barra-progreso {
    margin-bottom: 40px;
  }

  .pasos {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .paso {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
  }

  .numero-paso {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #e0e0e0;
    color: #757575;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 5px;
    transition: all 0.3s ease;
  }
  .paso.activo .numero-paso {
    background-color: #3498db;
    color: white;
  }

  .texto-paso {
    font-size: 14px;
    color: #757575;
    transition: all 0.3s ease;
  }

  .paso.activo .texto-paso {
    color: #3498db;
    font-weight: bold;
  }

  .linea-progreso {
    height: 4px;
    background-color: #e0e0e0;
    border-radius: 2px;
    position: relative;
  }

  .progreso {
    height: 100%;
    background-color: #3498db;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  
  .mensaje-estado {
    background-color: #f8f9fa;
    border-left: 4px solid #3498db;
    padding: 12px 15px;
    margin-bottom: 20px;
    border-radius: 4px;
    animation: fadeIn 0.3s ease;
    transition: all 0.3s ease;
  }

  .mensaje-estado.exito {
    background-color: #d4edda;
    border-left-color: #28a745;
    color: #155724;
  }

  .mensaje-info {
    background-color: #e6f2ff;
    border-left: 4px solid #74b9ff;
    padding: 10px 15px;
    margin-bottom: 15px;
    border-radius: 4px;
  }

  
  .acciones-login {
    text-align: center;
    margin: 10px 0;
  }

  .boton-login {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .boton-login:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  
  .paso-contenido {
    min-height: 300px;
  }

  
  .grid-barberos {
    display: grid;
    grid-template-columns: repeat(3, minmax(250px, 1fr));
    gap: 25px;
    margin-top: 30px;
    justify-content: center;
  }
  
  @media (max-width: 900px) {
    .grid-barberos {
      grid-template-columns: repeat(2, minmax(200px, 1fr));
    }
  }
  
  @media (max-width: 600px) {
    .grid-barberos {
      grid-template-columns: minmax(250px, 1fr);
    }
  }

  .tarjeta-barbero {
    position: relative;
    border: 2px solid #2c3e50;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 25px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .tarjeta-barbero:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    border-color: #3498db;
  }

  .tarjeta-barbero.seleccionado {
    background-color: rgba(52, 152, 219, 0.1);
    border-color: #3498db;
    box-shadow: 0 8px 20px rgba(52, 152, 219, 0.3);
  }

  .imagen-barbero {
    width: 150px;
    height: 150px;
    margin: 0 auto 20px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #333;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border: 3px solid #3498db;
    transition: all 0.3s ease;
  }

  .tarjeta-barbero:hover .imagen-barbero {
    transform: scale(1.05);
    border-color: #2980b9;
  }


  .imagen-barbero img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
  }

  .tarjeta-barbero h3 {
    margin: 0 0 10px;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .tarjeta-barbero p {
    margin: 0;
    color: #bdc3c7;
    font-size: 1rem;
  }

  .indicador-seleccion {
    position: absolute;
    top: 15px;
    right: 15px;
    background-color: #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
    }
  }

  
  @media (prefers-color-scheme: dark) {
    .tarjeta-barbero {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    .tarjeta-barbero h3 {
      color: #ecf0f1;
    }
    
    .tarjeta-barbero p {
      color: #bdc3c7;
    }
  }

  
  @media (max-width: 768px) {
    .grid-barberos {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .imagen-barbero {
      width: 120px;
      height: 120px;
    }
    
    .tarjeta-barbero h3 {
      font-size: 1.3rem;
    }
  }

  @media (max-width: 480px) {
    .grid-barberos {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  
.calendario-simple {
  border: 1px solid #e0b05f;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  background-color: #111126;
  max-width: 400px;
  margin: 0 auto;
}

.calendario-encabezado {
  background-color: #e0b05f;
  color: #111126;
  padding: 15px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendario-encabezado h3 {
  margin: 0;
  font-weight: 600;
  font-size: 18px;
  flex-grow: 1;
}

.calendario-encabezado .nav-btn {
  background: transparent;
  border: none;
  color: #111126;
  font-size: 18px;
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.calendario-encabezado .nav-btn:hover {
  background-color: rgba(17, 17, 38, 0.2);
}

.calendario-dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #111126;
  border-bottom: 1px solid #333;
  padding: 5px 0;
}

.dia-semana {
  padding: 6px 2px;
  text-align: center;
  font-weight: 600;
  color: #e0b05f;
  font-size: 13px;
}

.calendario-fechas {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 5px;
  gap: 1px;
  background-color: #111126;
  justify-items: center;
}

.fecha-dia {
  padding: 0;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  margin: 1px;
  transition: all 0.3s ease;
  color: #fff;
  line-height: 1;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
}

.fecha-dia:hover {
  background-color: rgba(224, 176, 95, 0.2);
  color: #e0b05f;
}

.fecha-dia.seleccionada {
  background-color: #e0b05f;
  color: #111126;
  font-weight: bold;
}

.fecha-dia.otro-mes {
  opacity: 0.5;
}


.calendario-contenedor {
  margin: 20px auto;
  border: 1px solid #e0b05f;
  border-radius: 15px;
  padding: 20px;
  background-color: #111126;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  color: #fff;
  overflow: hidden;
  max-width: 400px;
}

.fecha-seleccionada {
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0b05f;
  color: #e0b05f;
  font-size: 18px;
}

.calendario {
  margin: 0 auto;
  max-width: 400px;
}


:global(.flatpickr-day.selected) {
  background-color: #e0b05f !important;
  border-color: #e0b05f !important;
  color: #111126 !important;
  font-weight: bold !important;
}

:global(.flatpickr-day:hover) {
  background-color: rgba(224, 176, 95, 0.2) !important;
  border-color: #e0b05f !important;
  color: #e0b05f !important;
}

:global(.flatpickr-day.today) {
  border-color: #e0b05f !important;
  color: #e0b05f !important;
  background-color: rgba(224, 176, 95, 0.1) !important;
  font-weight: bold !important;
}

:global(.flatpickr-day.disabled) {
  color: #444 !important;
  background-color: #111126 !important;
  cursor: not-allowed !important;
}

:global(.flatpickr-day.prevMonthDay),
:global(.flatpickr-day.nextMonthDay) {
  color: rgba(255, 255, 255, 0.5) !important;
}

:global(.flatpickr-prev-month), 
:global(.flatpickr-next-month) {
  padding: 10px !important;
}

:global(.flatpickr-prev-month svg), 
:global(.flatpickr-next-month svg) {
  fill: #e0b05f !important;
  width: 20px !important;
  height: 20px !important;
}

:global(.flatpickr-prev-month:hover svg), 
:global(.flatpickr-next-month:hover svg) {
  fill: #fff !important;
}

:global(.flatpickr-month) {
  background-color: #111126 !important;
  color: #e0b05f !important;
  height: 50px !important;
}

:global(.flatpickr-months) {
  background-color: #111126 !important;
  padding: 15px 0 5px !important;
}

:global(.flatpickr-current-month) {
  color: #e0b05f !important;
  font-weight: 600 !important;
  font-size: 18px !important;
}

:global(.flatpickr-monthDropdown-months) {
  color: #e0b05f !important;
  background-color: #111126 !important;
  border: 1px solid #333 !important;
  border-radius: 5px !important;
}

:global(.flatpickr-weekday) {
  color: #ffffff !important;
  background-color: #111126 !important;
  font-weight: 600 !important;
  font-size: 13px !important;
}


:global(.flatpickr-calendar) {
  width: 100% !important;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3) !important;
  border-radius: 15px !important;
  overflow: hidden !important;
  background-color: #111126 !important;
  border: 1px solid #333 !important;
}

:global(.flatpickr-day) {
  color: #fff !important;
  background-color: #111126 !important;
  border-color: #333 !important;
  height: 36px !important;
  line-height: 36px !important;
  border-radius: 50% !important;
  margin: 1px !important;
  font-weight: 500 !important;
  width: 36px !important;
}


:global(.flatpickr-weekdays) {
  background-color: #111126 !important;
  display: flex !important;
  width: 100% !important;
  padding: 5px 0 !important;
}


:global(.flatpickr-calendar) {
  
  --first-day-of-week: 0; 
}


:global(.dayContainer) {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
  display: grid !important;
  grid-template-columns: repeat(7, 1fr) !important;
  justify-items: center !important;
}


:global(.flatpickr-current-month select.flatpickr-monthDropdown-months) {
  background-color: #111126 !important;
  border: 1px solid #333 !important;
  outline: none !important;
}

:global(.numInputWrapper) {
  position: relative !important;
}

:global(.numInputWrapper input) {
  background-color: #111126 !important;
  color: #e0b05f !important;
  border: 1px solid #333 !important;
  border-radius: 3px !important;
  padding: 0 5px !important;
  width: 60px !important;
  text-align: center !important;
}

:global(.numInputWrapper span) {
  position: absolute !important;
  right: 0 !important;
  width: 14px !important;
  height: 50% !important;
  line-height: 1 !important;
  opacity: 0.7 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:global(.numInputWrapper span:hover) {
  background-color: rgba(224, 176, 95, 0.1) !important;
}

:global(.flatpickr-time) {
  background-color: #111126 !important;
  border-top: 1px solid #333 !important;
}


@media (max-width: 480px) {
  .calendario-simple {
    max-width: 100%;
  }
  
  .fecha-dia {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
  
  .dia-semana {
    font-size: 12px;
    padding: 5px 1px;
  }
  
  .calendario-encabezado h3 {
    font-size: 16px;
  }
  
  :global(.flatpickr-day) {
    height: 30px !important;
    line-height: 30px !important;
    width: 30px !important;
  }
  
  .calendario-contenedor {
    padding: 15px;
  }
}


:global(.flatpickr-innerContainer) {
  display: block !important;
  min-height: 260px !important;
}

:global(.flatpickr-rContainer) {
  width: 100% !important;
}

:global(.flatpickr-days) {
  width: 100% !important;
}


:global(.flatpickr-weeks) {
  margin-left: 0 !important;
}

  
 .grid-horas {
  display: grid;
  grid-template-columns: repeat(6, 1fr); 
  grid-template-rows: repeat(2, auto); 
  gap: 15px;
  margin: 40px auto;
  max-width: 900px;
  padding: 10px;
}

.tarjeta-hora {
  border: 2px solid #4a90e2;
  border-radius: 8px;
  padding: 15px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.tarjeta-hora:hover {
  background-color: rgba(74, 144, 226, 0.3);
  border-color: #64a5ff;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.tarjeta-hora.seleccionada {
  background-color: #4a90e2;
  color: white;
  border-color: #64a5ff;
  box-shadow: 0 6px 12px rgba(74, 144, 226, 0.5);
  transform: translateY(-3px);
}


@media (max-width: 767px) {
  .grid-horas {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
  }
}

  
:root {
  --color-primario: #d4af37;
  --color-secundario: #2c3e50;
  --color-fondo: #1a1c2e;
  --color-texto: #f8f9fa;
  --color-acento: #4b9cd3;
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

body {
  font-family: 'Poppins', sans-serif;
  color: var(--color-texto);
  line-height: 1.6;
}


.formulario-reserva {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
}

.pasos-reserva {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
}

.paso {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.paso .numero {
  width: 50px;
  height: 50px;
  background-color: var(--color-acento);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.paso.activo .numero {
  background-color: var(--color-primario);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
}

.paso .texto {
  color: var(--color-acento);
  font-weight: 500;
}

.paso.activo .texto {
  color: var(--color-primario);
  font-weight: 600;
}


.campo-formulario {
  margin-bottom: 25px;
}

.campo-formulario label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-texto);
  font-size: 16px;
}

.campo-formulario input {
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(224, 224, 224, 0.3);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius);
  font-size: 16px;
  color: var(--color-texto);
  transition: all 0.3s ease;
}

.campo-formulario input:focus {
  outline: none;
  border-color: var(--color-primario);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
}

.campo-formulario input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}


.resumen-reserva {
  background-color: rgba(248, 249, 250, 0.08);
  border-radius: var(--border-radius);
  padding: 25px;
  margin: 30px 0;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: var(--box-shadow);
}

.resumen-reserva h3 {
  color: var(--color-primario);
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  padding-bottom: 10px;
}

.resumen-reserva .detalle {
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  font-size: 16px;
}

.resumen-reserva .etiqueta {
  font-weight: 500;
  color: var(--color-texto);
}

.resumen-reserva .valor {
  font-weight: 600;
  color: var(--color-primario);
}


.botones-navegacion {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.btn {
  padding: 12px 25px;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-secundario {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-texto);
}

.btn-secundario:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.btn-primario {
  background-color: var(--color-acento);
  color: white;
}

.btn-primario:hover {
  background-color: var(--color-primario);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
}


@media (max-width: 768px) {
  .pasos-reserva {
    flex-wrap: wrap;
  }
  
  .paso {
    margin-bottom: 15px;
  }
  
  .botones-navegacion {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
  }
}

  
  .botones-navegacion {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }

  .boton-primario {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .boton-primario:hover {
    background-color: #2980b9;
  }

  .boton-primario:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }

  .boton-secundario {
    background-color: white;
    color: #3498db;
    border: 1px solid #3498db;
    border-radius: 5px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .boton-secundario:hover {
    background-color: #f5f5f5;
  }

  
  .error-mensaje {
    color: #e74c3c;
    text-align: center;
    padding: 10px;
  }

  .cargando {
    text-align: center;
    color: #7f8c8d;
    padding: 10px;
  }

  :global(.flatpickr-months .flatpickr-prev-month),
:global(.flatpickr-months .flatpickr-next-month) {
  padding: 10px !important;
  height: auto !important;
  position: static !important;  
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  z-index: 10 !important;  
}


.paso-contenido {
  display: flex;
  flex-direction: column;
  align-items: center;  
  min-height: 300px;
  width: 100%;
}
</style>