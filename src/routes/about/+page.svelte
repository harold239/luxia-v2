<script>
    let trabajadores = [
        {
            id: 1,
            nombre: "Brayan",
            description: "Brayan es un barbero profesional con más de 4 años de experiencia en el oficio. Es el fundador de Luxia 23, donde combina su pasión y habilidad para ofrecer cortes de calidad y un servicio excepcional a sus clientes",
        },
        {
            id: 2,
            nombre: "Edison",
            description: "Edison es un barbero talentoso con 3 años de experiencia, demostrando gran habilidad y dedicación en cada corte, su destreza y compromiso con la calidad lo convierten en un profesional altamente confiable en la barbería Luxia 23.",
        },
        {
            id: 3,
            nombre: "Fernanda",
            description: "Fernanda es una manicurista y peinadora profesional, reconocida por su precisión y creatividad en cada servicio. Con una gran atención al detalle, se especializa en ofrecer manicuras impecables y peinados sofisticados, siempre buscando resaltar la belleza y estilo único de cada cliente.",
        },
        {
            id: 4,
            nombre: "Personal #4",
            description: "Descripción",
        },
        {
            id: 5,
            nombre: "Personal #5",
            description: "Descripción",
        },
    ];
</script>

<div class="container-fluid bg-dark text-light py-5">
    <div class="container text-center">
        <h1 class="display-4 mb-4">
            <i class="fas fa-cut me-3"></i>En LUXIA 23 la Tradición Continúa
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
            <div class="col-lg-3 col-md-6">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body text-center">
                        <div
                            class="position-relative overflow-hidden rounded-circle mx-auto mb-3"
                            style="width: 200px; height: 200px;"
                        >
                            <div
                                class="bg-light position-absolute w-100 h-100"
                            ></div>
                            <i
                                class="fas fa-user-tie fa-7x text-secondary position-absolute top-50 start-50 translate-middle"
                            ></i>
                        </div>
                        <h5 class="card-title fw-bold">{trabajador.nombre}</h5>
                        <p class="card-text text-muted">
                            {trabajador.description}
                        </p>
                        <div class="social-links">
                            <a href="/" class="text-dark mx-2">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="/" class="text-dark mx-2">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="/" class="text-dark mx-2">
                                <i class="fab fa-twitter"></i>
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
                <p class="text-white">
                    Hace cuatro años, en el corazón de Pupiales, Nariño, nació nuestra barbería con una misión clara: redefinir el cuidado masculino a través de la excelencia, la innovación y la tradición. Lo que comenzó como un sueño se convirtió en un espacio donde cada cliente encuentra no solo un corte impecable, sino una experiencia única de estilo y confianza.Hoy, seguimos creciendo con la misma pasión que nos vio nacer, consolidándonos como un referente en la barbería y el cuidado personal. 💈🔥
                </p>
                <img
                    src="https://via.placeholder.com/500x300"
                    alt="Historia"
                    class="img-fluid rounded shadow"
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

                <div class="d-flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-check-circle text-primary fa-2x me-3"
                        ></i>
                    </div>
                    <div>
                        <h5>Ambiente Exclusivo</h5>
                        <p class="text-muted mb-0">
                            Diseño vintage con comodidades modernas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="bg-light py-5">
    <div class="container text-center">
        <h3 class="mb-4">¿Listo para tu nueva experiencia?</h3>
        <a href="/" class="btn btn-primary btn-lg px-5">
            <i class="fas fa-calendar-check me-2"></i>Reserva tu Cita
        </a>
    </div>
</div>

<style>
    .feature-item {
        transition: transform 0.3s;
    }
    .feature-item:hover {
        transform: translateY(-5px);
    }
    .card {
        transition:
            transform 0.3s,
            box-shadow 0.3s;
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
