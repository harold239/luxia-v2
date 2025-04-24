<script>
  import portada from '$lib/imagenes/portada.png';
  import fotoBrayan from '$lib/imagenes/brayan.jpg';
  import fotoEdison from '$lib/imagenes/edison.jpg';
</script>
<!-- Eliminamos el container-fluid inicial para que ocupe todo el ancho -->
<div class="portada-hero"
     style="background-image: url({portada}); background-size: cover; background-position: center; background-repeat: no-repeat;">
  <div class="overlay"></div> <!-- Capa semitransparente para oscurecer el fondo -->
  <div class="hero-content">
    <div class="the-barber">The</div>
    <h1 class="hero-text display-4 fw-bold mb-3">
      LUXIA 23
    </h1>
    <p class="subtitle">BARBERÍA MODERNA</p>
    
    <p class="hero-description">
      Bienvenidos a Luxia 23, el destino donde la excelencia en el arte de la barbería y el cuidado personal se fusionan para ofrecerte una experiencia única. En nuestro exclusivo espacio, cada detalle está diseñado para brindarte un servicio personalizado, elevando tu estilo con cortes de alta calidad, arreglos impecables y un ambiente sofisticado. Confía en nuestros profesionales y permite que tu imagen refleje lo mejor de ti.
    </p>
  </div>
</div>

<div class="container py-5">
  <div class="row g-4 mb-5">
    <div class="col-md-4">
      <div class="card service-card h-100 shadow service-bg classic-cut">
        <div class="card-overlay"></div>
        <div class="card-body position-relative">
          <h5 class="card-title text-white text-center mb-3">
            💈 Corte Clásico
          </h5>
          <p class="card-text text-white">
            Técnicas tradicionales con acabado perfecto, incluye
            toalla caliente y tratamiento capilar.
          </p>
          <div class="text-center mt-4">
            <span class="badge bg-warning">45 min</span>
            <span class="badge bg-success ms-2">$20.000</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card service-card h-100 shadow service-bg premium-shave">
        <div class="card-overlay"></div>
        <div class="card-body position-relative">
          <h5 class="card-title text-white text-center mb-3">
            🧔 Afeitado Premium
          </h5>
          <p class="card-text text-white">
            Afeitado tradicional con navaja, incluye mascarilla
            calmante y masaje facial.
          </p>
          <div class="text-center mt-4">
            <span class="badge bg-warning">30 min</span>
            <span class="badge bg-success ms-2">$25.000</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card service-card h-100 shadow service-bg color-expert">
        <div class="card-overlay"></div>
        <div class="card-body position-relative">
          <h5 class="card-title text-white text-center mb-3">
            ✂️ Coloración Expert
          </h5>
          <p class="card-text text-white">
            Tintes de última generación con diagnóstico capilar
            personalizado.
          </p>
          <div class="text-center mt-4">
            <span class="badge bg-warning">1h 15min</span>
            <span class="badge bg-success ms-2">$70.000</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-dark text-white p-5 rounded-3 mb-5 position-relative">
    <div class="highlight">
      <h2 class="mb-4">💎 EL ARTE DE LA BARBERIA </h2>
      <p class="fs-5">
        En <strong>LUXIA 23</strong> Reinventamos la tradición combinando más de 4 años de experiencia 
        en el cuidado masculino con las tendencias más innovadoras. Fusionamos 
        técnicas clásicas y modernas para ofrecer un servicio exclusivo y 
        personalizado. Utilizamos productos orgánicos de alta calidad y
        herramientas profesionales esterilizadas, garantizando la 
        máxima higiene y excelencia en cada detalle.
      </p>
      <ul class="list-unstyled">
        <li class="mb-3">
          ✅ Certificación Internacional de Barbería
        </li>
        <li class="mb-3">✅ Productos 100% Ecológicos</li>
        <li>✅ Técnicas Personalizadas</li>
      </ul>
    </div>
  </div>

  <div class="row g-4 mb-5">
    <div class="col-md-6">
      <div
        class="d-flex align-items-center bg-white p-4 rounded-3 shadow"
      >
        <img
          src={fotoBrayan}
          alt="Barbero Brayan"
          class="me-4 barbero-img"
          style="width: 100px;"
        />
        <div>
          <h3>Brayan</h3>
          <p class="text-muted mb-0">Maestro Barbero</p>
          <small class="text-primary"
            >Experto en cortes de precisión, domina tanto los estilos clásicos como las tendencias más modernas. 💯💥</small
          >
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div
        class="d-flex align-items-center bg-white p-4 rounded-3 shadow"
      >
        <img
          src={fotoEdison}
          alt="Barbero Edison"
          class="me-4 barbero-img"
          style="width: 100px;"
        />
        <div>
          <h3>Edison</h3>
          <p class="text-muted mb-0">Maestro barbero</p>
          <small class="text-primary"
            >Experto en cortes a tijera logrando acabados precisos y personalizados con máxima atención al detalle. ✂️🔥</small
          >
        </div>
      </div>
    </div>
  </div>

  <!-- Sección de CTA con video de YouTube como fondo -->
  <div class="cta-section position-relative overflow-hidden rounded-3 mb-5">
    <!-- Contenedor del video de YouTube -->
    <div class="youtube-container">
      <!-- URL de YouTube corregida para funcionar como embed -->
      <iframe 
        class="youtube-video" 
        src="https://www.youtube.com/embed/hgmltZKxb3o?autoplay=1&mute=1&loop=1&playlist=hgmltZKxb3o&controls=0&showinfo=0&rel=0"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
    
    <!-- Overlay para oscurecer el video y mejorar la legibilidad del texto -->
    <div class="cta-overlay"></div>
    
    <!-- Contenido sobre el video -->
    <div class="cta-content text-center p-5 text-white">
      <h2 class="mb-4">¡ELEVA TU ESTILO!</h2>
      <p class="mb-4">
        Déjanos transformar tu estilo con la máxima precisión y detalle. Disfruta de un 20% de cortesía en tu primera visita.
      </p>
      <button class="btn btn-light btn-lg px-5">
        <i class="bi bi-calendar-check me-2"></i>
        Reservar Ahora
      </button>
    </div>
  </div>

  <div class="mt-5 p-4 bg-white rounded-3 shadow">
    <h4 class="mb-4">⏰ Horario de Atención</h4>
    <div class="row">
      <div class="col-md-6">
        <ul class="list-unstyled">
          <li class="mb-3">
            <strong>Lunes-Viernes:</strong> 9:00 - 20:00
          </li>
          <li class="mb-3">
            <strong>Sábados:</strong> 10:00 - 18:00
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-circle me-2"></i>
          Cerramos los domingos y festivos
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Reset de márgenes para asegurar que llegue hasta el borde */
  body, html {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  
  .hero-text {
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
    font-size: 3.5rem;
    letter-spacing: 2px;
  }
  
  .service-card:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
  }
  
  .barber-icon {
    width: 70px;
    height: 70px;
    filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.4));
  }
  
  .highlight {
    border-left: 4px solid #d4af37;
    padding-left: 1rem;
  }
  
  /* Estilos para hero a pantalla completa */
  .portada-hero {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    /* Posicionamiento para asegurar que está en la parte superior */
    position: relative;
    top: 0;
    left: 0;
    right: 0;
  }
  
  /* Capa semitransparente para oscurecer el fondo */
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* Negro con 60% de opacidad */
    z-index: 1;
  }
  
  .hero-content {
    width: 100%;
    max-width: 1200px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 2; /* Asegura que el contenido esté por encima del overlay */
  }
  
  .hero-description {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.5rem;
    line-height: 1.7;
    color:rgb(250, 250, 250);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  .the-barber {
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin-bottom: -10px;
    color:#d4af37;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  .subtitle {
    color: #d4af37;
    font-size: 1rem;
    letter-spacing: 3px;
    margin-top: -10px;
    margin-bottom: 20px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  /* Estilos para las tarjetas de servicio con imagen de fondo */
  .service-bg {
    background-size: cover;
    background-position: center;
    border: none;
    overflow: hidden;
    min-height: 350px; /* Altura mínima para las tarjetas */
  }
  
  /* Imágenes de fondo para los servicios - REEMPLAZA ESTAS URLs CON TUS PROPIAS IMÁGENES */
  .classic-cut {
    background-image: url('$lib/imagenes/corte.jpg');
  }
  
  .premium-shave {
    background-image: url('$lib/imagenes/barba.png');
  }
  
  .color-expert {
    background-image: url('$lib/imagenes/coloracion.jpg');
  }
  
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
  
  .card-body {
    z-index: 2;
    padding: 2rem; /* Aumentar el padding para hacer las tarjetas más grandes */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .text-white {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  }
  
  .card-title {
    font-size: 1.5rem; /* Título más grande */
    font-weight: bold;
  }
  
  .card-text {
    font-size: 1.1rem; /* Texto más grande */
    margin-bottom: 1.5rem;
  }
  
  .badge {
    font-size: 0.9rem; /* Badges más grandes */
    padding: 0.5rem 1rem;
  }
  
  /* Estilo para las fotos de los barberos */
  .barbero-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #d4af37;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  /* Estilos para la sección CTA con video de YouTube como fondo */
  .cta-section {
    position: relative;
    min-height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .youtube-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Evita interacciones con el video */
    overflow: hidden;
  }
  
 .youtube-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

  
  .cta-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Overlay más oscuro para compensar el video */
    z-index: 1;
  }
  
  .cta-content {
    position: relative;
    z-index: 2;
    width: 100%;
  }
</style>