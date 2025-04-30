<script>
    import "$lib/app.css";
    import logoImg from "../lib/imagenes/logo.jpg";
</script>

<nav class="navbar navbar-expand-lg bg_nav border-bottom sticky-top w-100">
    <div class="container-fluid">
        <!-- Logo a la izquierda -->
        <a href="/" class="navbar-brand">
            <img src={logoImg} alt="Logo Barbería" class="navbar-logo" />
        </a>
        
        <!-- Botón hamburguesa para móviles -->
        <button
            class="navbar-toggler bg-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        
        <!-- Menú de navegación alineado a la derecha -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link NavFont" aria-current="page" href="/">
                        INICIO
                        
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link NavFont" href="/about">
                        NOSOTROS
                        
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link NavFont" href="/contacto">
                        CONTACTO
                        
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link NavFont" href="/login">
                        INGRESAR
                        
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<style>
    .bg_nav {
        background-color: black;
    }
    
    .NavFont {
        color: #e8bf00;
        transition: color 175ms ease-in;
        font-weight: bold;
        margin: 0 10px; /* Añade espacio entre los elementos de navegación */
    }
    
    .NavFont:hover {
        color: #ffff00;
    }
    
    /* Estilo para el logo */
    .navbar-logo {
        height: 120px;
        width: auto;
    }
    
    /* Para pantallas pequeñas */
    @media (max-width: 992px) {
        .navbar-collapse {
            text-align: right;
        }
    }
</style>