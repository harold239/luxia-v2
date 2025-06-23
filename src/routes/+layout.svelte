<script>
    import Footer from "./../components/Footer.svelte";
    import Navbar from "./../components/Navbar.svelte";
    import ChatWidget from "./../components/ChatWidget.svelte";
</script>

<Navbar></Navbar>
<slot></slot>
<Footer></Footer>

<!-- Widget del chatbot flotante -->
<ChatWidget />

<style>
    /* Estilos globales para el layout */
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    /* Asegurar que el contenido no se superponga con el widget */
    :global(main) {
        min-height: calc(100vh - 120px); /* Ajusta según la altura de tu navbar y footer */
        padding-bottom: 100px; /* Espacio para el widget flotante */
    }
    
    /* Estilos para dispositivos móviles */
    @media (max-width: 768px) {
        :global(main) {
            padding-bottom: 90px;
        }
    }
</style>