<!-- ContactForm.svelte -->
<script>
    import { collection, addDoc, serverTimestamp } from "firebase/firestore";
    import { db } from '$lib/firebase-config.js';

    let formData = {
      email: "",
      asunto: "",
      mensaje: ""
    };
    
    let enviando = false;
    let mensajeEstado = "";
    let tipoMensaje = "success"; // success o danger
  
    async function onhandlersubmit() {
      try {
        // Validar que los campos no estén vacíos
        if (!formData.email || !formData.asunto || !formData.mensaje) {
          mensajeEstado = "Por favor completa todos los campos";
          tipoMensaje = "danger";
          return;
        }
  
        // Iniciar el proceso de envío
        enviando = true;
        mensajeEstado = "";
  
        // Crear un nuevo documento en la colección "mensajes"
        const docRef = await addDoc(collection(db, "mensajes"), {
          email: formData.email,
          asunto: formData.asunto,
          mensaje: formData.mensaje,
          fecha: serverTimestamp(),
          leido: false
        });
  
        // Restablecer el formulario
        formData = {
          email: "",
          asunto: "",
          mensaje: ""
        };
  
        // Mostrar mensaje de éxito
        mensajeEstado = "¡Mensaje enviado correctamente! Te contactaremos pronto.";
        tipoMensaje = "success";
        
        console.log("Documento guardado con ID: ", docRef.id);
      } catch (error) {
        console.error("Error al enviar el mensaje: ", error);
        mensajeEstado = "Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.";
        tipoMensaje = "danger";
      } finally {
        enviando = false;
      }
    }
</script>

<!-- Página principal de contacto -->
<div class="container-fluid bg-dark text-light py-5">
    <div class="container text-center">
        <h1 class="display-4 mb-4">Contáctanos</h1>
        <p class="lead">Estamos aquí para responder tus preguntas</p>
    </div>
</div>

<div class="container py-5">
    <div class="row g-5 justify-content-center">
        <!-- Información de contacto -->
        <div class="col-lg-4">
            <div class="card border-0 shadow-lg h-100">
                <div class="card-body p-4">
                    <h3 class="card-title mb-4">
                        <i class="fas fa-map-marker-alt text-primary me-2"></i> Nuestra Ubicación
                    </h3>
                    <p class="text-muted mb-4">
                        Calle #5<br />Pupiales, Nariño<br />
                    </p>

                    <h4 class="mb-3">
                        <i class="fas fa-phone-volume text-primary me-2"></i>Teléfono
                    </h4>
                    <ul class="list-unstyled">
                        <li class="mb-2">+57 316 4014591</li>
                    </ul>

                    <hr class="my-4" />

                    <h4 class="mb-3">
                        <i class="fas fa-share-alt text-primary me-2"></i>Redes Sociales
                    </h4>
                    <div class="d-flex gap-3">
                        <a href="https://www.facebook.com" class="text-dark"><i class="fab fa-facebook fa-2x"></i></a>
                        <a href="https://www.instagram.com" class="text-dark"><i class="fab fa-instagram fa-2x"></i></a>
                        <a href="https://wa.me/573164014591" class="text-dark"><i class="fab fa-whatsapp fa-2x"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Formulario de contacto -->
        <div class="col-lg-8">
            <div class="card border-0 shadow-lg">
                <div class="card-body p-4">
                    <form on:submit|preventDefault={onhandlersubmit}>
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input
                                        type="email"
                                        class="form-control"
                                        id="email"
                                        placeholder="nombre@ejemplo.com"
                                        required
                                        bind:value={formData.email}
                                    />
                                    <label for="email">
                                        <i class="fas fa-envelope me-2"></i>Correo Electrónico
                                    </label>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-floating">
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="asunto"
                                        placeholder="Asunto"
                                        required
                                        bind:value={formData.asunto}
                                    />
                                    <label for="asunto">
                                        <i class="fas fa-tag me-2"></i>Asunto
                                    </label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <textarea
                                        class="form-control"
                                        placeholder="Escribe tu mensaje"
                                        id="mensaje"
                                        style="height: 150px"
                                        required
                                        bind:value={formData.mensaje}
                                    ></textarea>
                                    <label for="mensaje">
                                        <i class="fas fa-comment-dots me-2"></i>Mensaje
                                    </label>
                                </div>
                                <div class="form-text text-end">
                                    Máximo 500 caracteres
                                </div>
                            </div>

                            <!-- Mensaje de estado -->
                            {#if mensajeEstado}
                                <div class="col-12">
                                    <div class="alert alert-{tipoMensaje}" role="alert">
                                        {mensajeEstado}
                                    </div>
                                </div>
                            {/if}

                            <div class="col-md-6">
                                <div class="form-check">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="terminos"
                                        required
                                    />
                                    <label class="form-check-label" for="terminos">
                                        Acepto los
                                        <a href="/" class="text-decoration-none">términos y condiciones</a>
                                    </label>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <button
                                    type="submit"
                                    class="btn btn-primary w-100 py-3"
                                    disabled={enviando}
                                >
                                    {#if enviando}
                                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Enviando...
                                    {:else}
                                        <i class="fas fa-paper-plane me-2"></i>Enviar Mensaje
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Mapa -->
        <div class="col-12">
            <div class="card border-0 shadow-lg mt-5">
                <div class="card-body p-0">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15959.374681272771!2d-77.54443889224913!3d0.8704169634743354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e296f3a1bfa1637%3A0x8d5315b42a97501e!2sPupiales%2C%20Nari%C3%B1o!5e0!3m2!1ses!2sco!4v1718481235407!5m2!1ses!2sco"
                        width="100%"
                        height="400"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        class="rounded-3"
                    ></iframe>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Estilos personalizados -->
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

    .form-check-label a {
        color: #0d6efd;
        transition: color 0.3s;
    }

    .form-check-label a:hover {
        color: #0a58ca;
    }

    .btn-primary {
        transition: all 0.3s;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4);
    }

    iframe {
        border-radius: 10px;
    }
</style>