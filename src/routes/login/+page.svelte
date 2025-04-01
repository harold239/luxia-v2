<script>
    let isLoginForm = true;
    let showPassword = false;

    const toggleForm = () => {
        isLoginForm = !isLoginForm;
    };

    const handleSubmit = () => {
        alert(`${isLoginForm ? "Login" : "Registro"} exitoso!`);
    };
</script>

<div class="container-fluid bg-dark text-light py-5">
    <div class="container text-center">
        <h1 class="display-4 mb-4">
            <i class="fas fa-user-shield me-3"></i>{isLoginForm
                ? "Inicia Sesión"
                : "Regístrate"}
        </h1>
        <p class="lead">
            {isLoginForm
                ? "Accede a tu cuenta personal"
                : "Únete a nuestra comunidad"}
        </p>
    </div>
</div>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-6">
            <div class="card border-0 shadow-lg">
                <div class="card-body p-4 p-md-5">
                    <ul class="nav nav-pills nav-justified mb-5">
                        <li class="nav-item">
                            <button
                                class="nav-link {isLoginForm ? 'active' : ''}"
                                on:click={toggleForm}
                            >
                                <i class="fas fa-sign-in-alt me-2"></i>Login
                            </button>
                        </li>
                        <li class="nav-item">
                            <button
                                class="nav-link {!isLoginForm ? 'active' : ''}"
                                on:click={toggleForm}
                            >
                                <i class="fas fa-user-plus me-2"></i>Registro
                            </button>
                        </li>
                    </ul>

                    <div class="text-center mb-5">
                        <h5 class="mb-4">O continúa con:</h5>
                        <div class="d-flex justify-content-center gap-3">
                            <button class="btn btn-outline-dark">
                                <i class="fab fa-google fa-2x"></i>
                            </button>
                            <button class="btn btn-outline-dark">
                                <i class="fab fa-facebook fa-2x"></i>
                            </button>
                            <button class="btn btn-outline-dark">
                                <i class="fab fa-apple fa-2x"></i>
                            </button>
                        </div>
                    </div>

                    <div class="position-relative">
                        <div class="divider-text">o</div>
                    </div>

                    <form on:submit|preventDefault={handleSubmit}>
                        <div class="row g-3">
                            {#if !isLoginForm}
                                <div class="col-12">
                                    <div class="form-floating">
                                        <input
                                            type="text"
                                            class="form-control"
                                            id="nombre"
                                            placeholder="Nombre Completo"
                                            required
                                        />
                                        <label for="nombre">
                                            <i class="fas fa-user me-2"
                                            ></i>Nombre Completo
                                        </label>
                                    </div>
                                </div>
                            {/if}

                            <div class="col-12">
                                <div class="form-floating">
                                    <input
                                        type="email"
                                        class="form-control"
                                        id="email"
                                        placeholder="nombre@ejemplo.com"
                                        required
                                    />
                                    <label for="email">
                                        <i class="fas fa-envelope me-2"
                                        ></i>Correo Electrónico
                                    </label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="form-floating">
                                    <input
                                        type={showPassword
                                            ? "text"
                                            : "password"}
                                        class="form-control"
                                        id="password"
                                        placeholder="Contraseña"
                                        required
                                    />
                                    <label for="password">
                                        <i class="fas fa-lock me-2"
                                        ></i>Contraseña
                                    </label>
                                    <button
                                        type="button"
                                        class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3"
                                        on:click={() =>
                                            (showPassword = !showPassword)}
                                    >
                                        <i
                                            class="fas {showPassword
                                                ? 'fa-eye-slash'
                                                : 'fa-eye'}"
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            {#if !isLoginForm}
                                <div class="col-12">
                                    <div class="form-floating">
                                        <input
                                            type="password"
                                            class="form-control"
                                            id="confirmPassword"
                                            placeholder="Confirmar Contraseña"
                                            required
                                        />
                                        <label for="confirmPassword">
                                            <i class="fas fa-lock me-2"
                                            ></i>Confirmar Contraseña
                                        </label>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="form-check">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="terms"
                                            required
                                        />
                                        <label
                                            class="form-check-label"
                                            for="terms"
                                        >
                                            Acepto los
                                            <a
                                                href="#"
                                                class="text-decoration-none"
                                                >términos y condiciones</a
                                            >
                                        </label>
                                    </div>
                                </div>
                            {:else}
                                <div class="col-12">
                                    <div class="d-flex justify-content-between">
                                        <div class="form-check">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                id="remember"
                                            />
                                            <label
                                                class="form-check-label"
                                                for="remember"
                                            >
                                                Recordarme
                                            </label>
                                        </div>
                                        <a href="#" class="text-decoration-none"
                                            >¿Olvidaste tu contraseña?</a
                                        >
                                    </div>
                                </div>
                            {/if}

                            <div class="col-12 mt-4">
                                <button
                                    type="submit"
                                    class="btn btn-primary w-100 py-3"
                                >
                                    <i
                                        class="fas fa-{isLoginForm
                                            ? 'sign-in-alt'
                                            : 'user-plus'} me-2"
                                    ></i>
                                    {isLoginForm
                                        ? "Iniciar Sesión"
                                        : "Registrarse"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .nav-pills .nav-link {
        transition: all 0.3s;
    }

    .nav-pills .nav-link.active {
        background-color: #0d6efd;
        color: white !important;
    }

    .divider-text {
        position: relative;
        text-align: center;
        margin: 2rem 0;
    }

    .divider-text::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        border-top: 2px solid #dee2e6;
        z-index: 1;
    }

    .divider-text span {
        background: white;
        position: relative;
        z-index: 2;
        padding: 0 1rem;
    }

    .form-control:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    }

    .btn-primary {
        transition: all 0.3s;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(13, 110, 253, 0.4);
    }

    .btn-outline-dark:hover {
        background-color: #f8f9fa;
    }
</style>
