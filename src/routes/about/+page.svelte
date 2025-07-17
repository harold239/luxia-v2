<script>
    // Primero comprobamos qué imágenes existen realmente en la carpeta
    import brayanImg from '$lib/imagenes/brayan.jpg';
    import edisonImg from '$lib/imagenes/edison.jpg';
    import fernandaImg from '$lib/imagenes/fernanda.jpg'; // Importamos la imagen de Fernanda
    
    // Importar la imagen de fondo para la sección hero
    import portadaImg from '$lib/imagenes/portada2.jpg';
    
    let trabajadores = [
        {
            id: 1,
            nombre: "Brayan",
            description: "Brayan es un barbero profesional con más de 4 años de experiencia en el oficio. Es el fundador de Luxia 23, donde combina su pasión y habilidad para ofrecer cortes de calidad y un servicio excepcional a sus clientes",
            imagen: brayanImg
        },
        {
            id: 2,
            nombre: "Edison",
            description: "Edison es un barbero talentoso con 3 años de experiencia, demostrando gran habilidad y dedicación en cada corte, su destreza y compromiso con la calidad lo convierten en un profesional altamente confiable en la barbería Luxia 23.",
            imagen: edisonImg
        },
        {
            id: 3,
            nombre: "Fernanda",
            description: "Fernanda es una manicurista y peinadora profesional, reconocida por su precisión y creatividad en cada servicio. Con una gran atención al detalle, se especializa en ofrecer manicuras impecables y peinados sofisticados, siempre buscando resaltar la belleza y estilo único de cada cliente.",
            imagen: fernandaImg // Usamos la imagen de Fernanda
        }
    ];

    // Función para manejar errores
    function handleImageError(event) {
        const imgElement = event.target;
        console.error("Failed to load image:", imgElement.src);
        
        imgElement.style.display = 'none';
        
        const container = imgElement.parentNode;
        
        const bgDiv = document.createElement('div');
        bgDiv.className = 'bg-light position-absolute w-100 h-100';
        container.appendChild(bgDiv);
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-user-tie fa-7x text-secondary position-absolute top-50 start-50 translate-middle';
        container.appendChild(icon);
    }
</script>

<!-- Sección hero con fondo de imagen -->
<div class="container-fluid hero-section text-light py-5" style="background-image: url({portadaImg});">
    <div class="container text-center">
        <h1 class="display-4 mb-4">
           EN LUXIA 23 LA TRADICION CONTINUA
        </h1>
        <p class="lead mb-4">Más de 20 años creando estilos únicos</p>
        <div class="row g-4 justify-content-center">
            <div class="col-lg-8">
                <p class="mb-4">
                 En nuestra barbería, combinamos tradición y vanguardia para ofrecer una experiencia única, donde la precisión, la calidad y la atención personalizada son nuestra prioridad. Buscamos realzar el estilo y la confianza de cada cliente mediante técnicas clásicas y modernas, utilizando productos ecológicos de alta calidad. Nuestro compromiso es brindar un servicio de excelencia, marcando tendencia en el cuidado masculino con innovación, profesionalismo e impecable atención al detalle.
                </p>
                <div class="d-flex justify-content-center gap-4">
                    <div class="feature-item">
                        <i class="fas fa-clock fa-2x mb-2"></i>
                        <p>Puntualidad</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-star fa-2x mb-2"></i>
                        <p>Calidad</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-heart fa-2x mb-2"></i>
                        <p>Pasión</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container py-5">
    <div class="text-center mb-5">
        <h2 class="text-uppercase border-bottom pb-3">
            El Talento Detrás de Cada Corte
        </h2>
    </div>

    <div class="row g-4 justify-content-center">
        {#each trabajadores as trabajador}
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body text-center">
                        <div
                            class="position-relative overflow-hidden rounded-circle mx-auto mb-3"
                            style="width: 200px; height: 200px;"
                        >
                            <!-- Corregido: Ajustar imagen para que se muestre completa dentro del círculo -->
                            <img 
                                src="{trabajador.imagen}" 
                                alt="{trabajador.nombre}" 
                                class="w-100 h-100" 
                                style="object-fit: cover; border-radius: 50%;"
                                on:error={handleImageError}
                            />
                        </div>
                        <h5 class="card-title fw-bold">{trabajador.nombre}</h5>
                        <p class="card-text text-muted">
                            {trabajador.description}
                        </p>
                        <div class="social-links">
                            <a href="https://www.instagram.com/luxia_23.1?igsh=MXdyejQ1YTI0YXJmaA==" class="text-dark mx-2">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/share/1F3do9DUX9/?mibextid=wwXIfr" class="text-dark mx-2">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="https://wa.me/573164014591" class="text-dark mx-2">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<div class="container py-5">
    <div class="row g-5">
        <div class="col-lg-6">
            <div class="pe-lg-5">
                <h3 class="mb-4">Nuestra Historia</h3>
                <p>
                    Hace cuatro años, en el corazón de Pupiales, Nariño, nació nuestra barbería con una misión clara: redefinir el cuidado masculino a través de la excelencia, la innovación y la tradición. Lo que comenzó como un sueño se convirtió en un espacio donde cada cliente encuentra no solo un corte impecable, sino una experiencia única de estilo y confianza.Hoy, seguimos creciendo con la misma pasión que nos vio nacer, consolidándonos como un referente en la barbería y el cuidado personal. 💈🔥
                </p>
                
                />
            </div>
        </div>

        <div class="col-lg-6">
            <div class="ps-lg-5">
                <h3 class="mb-4">¿Por Qué Elegirnos?</h3>
                <div class="d-flex mb-4">
                    <div class="flex-shrink-0">
                        <i class="fas fa-check-circle text-primary fa-2x me-3"
                        ></i>
                    </div>
                    <div>
                        <h5>Expertos Certificados</h5>
                        <p class="text-muted mb-0">
                            Todos nuestros barberos cuentan con certificaciones
                            internacionales
                        </p>
                    </div>
                </div>

                <div class="d-flex mb-4">
                    <div class="flex-shrink-0">
                        <i class="fas fa-check-circle text-primary fa-2x me-3"
                        ></i>
                    </div>
                    <div>
                        <h5>Productos Premium</h5>
                        <p class="text-muted mb-0">
                            Utilizamos las mejores marcas del mercado
                        </p>
                    </div>
                </div>

                <div class="d-flex mb-4">
                     <div class="flex-shrink-0">
                         <i class="fas fa-check-circle text-primary fa-2x me-3"></i>
                     </div>
                     <div>
                         <h5>Ambiente Exclusivo</h5>
                         <p class="text-muted mb-0">
                             Disfruta de un espacio único y sofisticado diseñado para tu comodidad
                         </p>
                     </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="bg-dark py-5">
    <div class="container text-center">
        <h3 class="mb-4 text-light">¿Listo para tu nueva experiencia?</h3>
        <a href="/reservar" class="btn btn-primary btn-lg px-5">
            <i class="fas fa-calendar-check me-2"></i>Reserva tu Cita
        </a>
    </div>
</div>

<style>
   .hero-section {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    padding: 150px 0;
    min-height: 700px;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
}

.hero-section .container {
    position: relative;
    z-index: 2;
}

.hero-section p {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    font-weight: 400;
}

.hero-section h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.hero-section .feature-item {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 15px;
    border-radius: 10px;
    width: 120px;
}

.hero-section .feature-item i {
    color: #e8bf00;
}

/* CORRECCIÓN PARA LA SECCIÓN "¿POR QUÉ ELEGIRNOS?" */
/* Estilos base para los elementos flex */
.d-flex.mb-4 {
    display: flex !important;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    padding: 0 1rem;
    overflow: visible !important;
    min-height: auto;
    flex-wrap: nowrap;
    gap: 0.75rem;
}

.d-flex.mb-4 .flex-shrink-0 {
    flex-shrink: 0;
    margin-right: 0;
    width: 40px;
    min-width: 40px;
    flex-basis: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.d-flex.mb-4 .flex-grow-1 {
    flex-grow: 1;
    min-width: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.d-flex.mb-4 .flex-shrink-0 i {
    color: #28a745 !important; /* Verde para el check */
    font-size: 1.5rem;
    display: block;
    width: 100%;
    text-align: center;
    line-height: 1;
    margin: 0;
}

/* Texto en blanco y legible */
.d-flex.mb-4 h5 {
    color: #ffffff !important;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
    line-height: 1.3;
    word-wrap: break-word;
}

.d-flex.mb-4 p {
    color: #e9ecef !important; /* Blanco suave para mejor legibilidad */
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 0;
    word-wrap: break-word;
}

/* Corrección específica para contenedores con altura fija */
.col-lg-6,
.container-fluid .col-lg-6 {
    overflow: visible !important;
    min-height: auto !important;
}

/* Asegurar que no haya cortes en el contenido */
.row {
    overflow: visible !important;
}

.container,
.container-fluid {
    overflow: visible !important;
}

/* Asegurar que el contenedor padre tenga suficiente espacio */
.col-lg-6 {
    padding: 1rem;
}

/* Mejorar el título de la sección */
.col-lg-6 h3 {
    color: #ffffff !important;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

/* Si tienes una sección con fondo oscuro, asegurar que sea visible */
.bg-dark .col-lg-6 h3,
.bg-dark .d-flex.mb-4 h5 {
    color: #ffffff !important;
}

.bg-dark .d-flex.mb-4 p {
    color: #e9ecef !important;
}

/* MEDIA QUERIES RESPONSIVAS */

/* Tablets */
@media (max-width: 768px) {
    .hero-section {
        padding: 100px 0;
        min-height: 500px;
    }
    
    .hero-section h1 {
        font-size: 2rem !important;
        line-height: 1.2;
        margin-bottom: 1.5rem;
    }
    
    .hero-section .lead {
        font-size: 1.1rem;
    }
    
    .hero-section p {
        font-size: 0.95rem;
        line-height: 1.5;
        text-align: justify;
    }
    
    .hero-section .feature-item {
        width: 100px;
        padding: 12px;
        margin-bottom: 1rem;
    }
    
    .hero-section .feature-item i {
        font-size: 1.5rem !important;
    }
    
    .hero-section .feature-item p {
        font-size: 0.85rem;
        margin: 0;
    }
    
    .d-flex.justify-content-center.gap-4 {
        flex-direction: column;
        align-items: center;
        gap: 1rem !important;
    }
    
    /* Ajustes para las tarjetas de trabajadores */
    .card-body .position-relative {
        width: 150px !important;
        height: 150px !important;
    }
    
    .card-title {
        font-size: 1.25rem;
    }
    
    .card-text {
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    /* Correcciones para "¿Por qué elegirnos?" en tablets */
    .d-flex.mb-4 {
        padding: 0 0.5rem;
        margin-bottom: 1.25rem;
        overflow: visible !important;
        flex-wrap: nowrap;
        gap: 0.5rem;
    }
    
    .d-flex.mb-4 .flex-shrink-0 {
        margin-right: 0;
        min-width: 35px;
        width: 35px;
        flex-basis: 35px;
    }
    
    .d-flex.mb-4 .flex-shrink-0 i {
        font-size: 1.3rem;
    }
    
    .d-flex.mb-4 .flex-grow-1 {
        flex-grow: 1;
        min-width: 0;
    }
    
    .d-flex.mb-4 .flex-shrink-0 i {
        font-size: 1.5rem;
        width: 35px;
    }
    
    .d-flex.mb-4 h5 {
        font-size: 1.1rem;
    }
    
    .d-flex.mb-4 p {
        font-size: 0.9rem;
    }
    
    .col-lg-6 {
        padding: 0.5rem;
        margin-bottom: 2rem;
    }
    
    .col-lg-6 h3 {
        font-size: 1.3rem;
        margin-bottom: 1rem;
        text-align: center;
    }
}

/* Móviles */
@media (max-width: 480px) {
    .hero-section {
        padding: 80px 0;
        min-height: 400px;
    }
    
    .hero-section h1 {
        font-size: 1.5rem !important;
        line-height: 1.1;
        margin-bottom: 1rem;
        padding: 0 1rem;
    }
    
    .hero-section .lead {
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .hero-section p {
        font-size: 0.85rem;
        line-height: 1.4;
        padding: 0 0.5rem;
        text-align: left;
    }
    
    .hero-section .feature-item {
        width: 80px;
        padding: 10px;
        margin-bottom: 0.5rem;
    }
    
    .hero-section .feature-item i {
        font-size: 1.2rem !important;
        margin-bottom: 0.5rem;
    }
    
    .hero-section .feature-item p {
        font-size: 0.75rem;
        margin: 0;
    }
    
    /* Tarjetas de trabajadores en móvil */
    .card-body .position-relative {
        width: 120px !important;
        height: 120px !important;
    }
    
    .card-title {
        font-size: 1.1rem;
    }
    
    .card-text {
        font-size: 0.8rem;
        line-height: 1.3;
    }
    
    .social-links a {
        font-size: 1.2rem;
        margin: 0 0.5rem;
    }
    
    /* Sección "¿Por qué elegirnos?" en móviles */
    .d-flex.mb-4 {
        flex-direction: row; /* Mantener horizontal */
        align-items: flex-start;
        text-align: left;
        padding: 0 0.25rem;
        margin-bottom: 1rem;
        overflow: visible !important;
        flex-wrap: nowrap;
        width: 100%;
        gap: 0.4rem;
    }
    
    .d-flex.mb-4 .flex-shrink-0 {
        margin-right: 0;
        margin-bottom: 0;
        min-width: 30px;
        width: 30px;
        flex-basis: 30px;
    }
    
    .d-flex.mb-4 .flex-shrink-0 i {
        font-size: 1.1rem;
    }
    
    .d-flex.mb-4 .flex-grow-1 {
        flex-grow: 1;
        min-width: 0;
        width: calc(100% - 35px);
    }
    
    .d-flex.mb-4 .flex-shrink-0 i {
        font-size: 1.3rem;
        width: 30px;
    }
    
    .d-flex.mb-4 h5 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }
    
    .d-flex.mb-4 p {
        font-size: 0.85rem;
        line-height: 1.4;
    }
}

/* Móviles muy pequeños */
@media (max-width: 320px) {
    .hero-section {
        padding: 60px 0;
        min-height: 350px;
    }
    
    .hero-section h1 {
        font-size: 1.3rem !important;
        padding: 0 0.5rem;
    }
    
    .hero-section .lead {
        font-size: 0.9rem;
    }
    
    .hero-section p {
        font-size: 0.8rem;
        padding: 0 0.25rem;
    }
    
    .hero-section .feature-item {
        width: 70px;
        padding: 8px;
    }
    
    .hero-section .feature-item i {
        font-size: 1rem !important;
    }
    
    .hero-section .feature-item p {
        font-size: 0.7rem;
    }
    
    .card-body .position-relative {
        width: 100px !important;
        height: 100px !important;
    }
    
    .card-title {
        font-size: 1rem;
    }
    
    .card-text {
        font-size: 0.75rem;
    }
    
    /* Correcciones para "¿Por qué elegirnos?" en móviles muy pequeños */
    .d-flex.mb-4 .flex-shrink-0 {
        min-width: 25px;
        width: 25px;
        flex-basis: 25px;
    }
    
    .d-flex.mb-4 .flex-shrink-0 i {
        font-size: 1rem;
    }
    
    .d-flex.mb-4 h5 {
        font-size: 0.95rem;
    }
    
    .d-flex.mb-4 p {
        font-size: 0.8rem;
    }
}

/* Mejoras adicionales para la responsividad */
@media (max-width: 768px) {
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    
    .row.g-4 {
        --bs-gutter-x: 1rem;
        --bs-gutter-y: 1rem;
    }
    
    .row.g-5 {
        --bs-gutter-x: 1.5rem;
        --bs-gutter-y: 1.5rem;
    }
    
    .pe-lg-5, .ps-lg-5 {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    
    .col-lg-6 p {
        font-size: 0.9rem;
        line-height: 1.5;
        text-align: justify;
    }
}

/* Estilos existentes que se mantienen */
.feature-item {
    transition: transform 0.3s;
}

.feature-item:hover {
    transform: translateY(-5px);
}

.card {
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}

.social-links a {
    opacity: 0.7;
    transition: opacity 0.3s;
}

.social-links a:hover {
    opacity: 1;
    text-decoration: none;
}
</style>