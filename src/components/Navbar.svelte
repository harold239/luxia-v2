<script>
    import "$lib/app.css";
</script>

<nav class="navbar navbar-expand-lg bg_nav border-bottom sticky-top w-100">
    <div class="container-fluid w-100">
        <div class="text-light fw-bold d-lg-none">
            <a href="/"> BARBERIA </a>
        </div>
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
        <div class="collapse navbar-collapse w-100" id="navbarNav">
            <ul
                class="navbar-nav w-100 d-flex justify-content-evenly align-items-center"
            >
                <li class="nav-item">
                    <a class="nav-link NavFont" aria-current="page" href="/">
                        INICIO
                        <i class="fa-solid fa-house"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link NavFont" href="/about">
                        ACERCA DE
                        <i class="fa-solid fa-circle-info"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link NavFont" href="/contacto">
                        CONTACTO
                        <i class="fa-solid fa-address-book"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link NavFont" href="/login">
                        INGRESAR
                        <i class="fa-solid fa-circle-user"></i>
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
    }

    .NavFont:hover {
        color: #ffff00;
    }
</style>
