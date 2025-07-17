<!-- ChatWidget.svelte -->
<script>
  import { onMount } from 'svelte';
  import logoImg from '../lib/imagenes/ia.png';
  
  // Configuración de enlaces externos
  const externalLinks = {
    whatsapp: {
      number: "+573164014591", // Número de WhatsApp
      message: "Hola, me interesa información sobre los servicios de LUXIA 23"
    },
    reservas: {
      url: "/reservar" // ✅ Ruta interna corregida
    }
  };
  
  // Base de conocimiento expandida con IA inteligente
  const knowledgeBase = {
    // Información específica de la barbería
    businessInfo: {
      name: "LUXIA 23",
      description: "Barbería premium especializada en servicios masculinos de alta calidad",
      services: {
        haircuts: {
          classic: { name: "Corte clásico", price: 25000, description: "Cortes tradicionales y elegantes" },
          modern: { name: "Corte moderno", price: 30000, description: "Estilos actuales y creativos" },
          fade: { name: "Corte degradado", price: 28000, description: "Degradados y texturas modernas" }
        },
        beard: {
          trim: { name: "Arreglo de barba", price: 15000, description: "Perfilado y mantenimiento de barba" },
          shave: { name: "Afeitado tradicional", price: 20000, description: "Afeitado clásico con navaja" }
        },
        treatments: {
          hair: { name: "Tratamiento capilar", price: 40000, description: "Hidratación y fortalecimiento del cabello" },
          scalp: { name: "Masaje capilar", price: 25000, description: "Masaje relajante y estimulante" }
        },
        packages: {
          complete: { name: "Paquete completo", price: 55000, description: "Corte + Barba + Tratamiento" },
          basic: { name: "Paquete básico", price: 35000, description: "Corte + Barba" }
        }
      },
      schedule: {
        weekdays: "Lunes a Viernes: 9:00 AM - 8:00 PM",
        saturday: "Sábados: 10:00 AM - 6:00 PM",
      },
      location: {
        address: "Calle #5",
        neighborhood: "Barrio La Esperanza",
        phone: "+57 316 4014591 ",
        features: []
      },
      promotions: {
        student: { name: "Descuento estudiante", discount: 20, description: "20% descuento con carnet estudiantil" },
        senior: { name: "Descuento tercera edad", discount: 15, description: "15% descuento para adultos mayores" },
        family: { name: "Domingo familiar", discount: 15, description: "15% descuento los domingos" },
        loyalty: { name: "Cliente frecuente", description: "5ta visita gratis" }
      }
    }
  };

  // Sistema de IA Inteligente que responde a todo
  class SmartAISystem {
    constructor() {
      this.conversationHistory = [];
      this.userPreferences = {};
      this.contextMemory = {};
    }

    // Función principal que analiza cualquier mensaje
    analyzeMessage(message, userName = '', conversationHistory = []) {
      const cleanMessage = message.toLowerCase().trim();
      
      // 1. Buscar información específica primero
      const specificInfo = this.findSpecificInfo(cleanMessage);
      if (specificInfo) {
        return this.formatResponse(specificInfo, userName);
      }

      // 2. Detectar tipo de pregunta
      const questionType = this.detectQuestionType(cleanMessage);
      
      // 3. Generar respuesta inteligente basada en el contexto
      const intelligentResponse = this.generateIntelligentResponse(cleanMessage, questionType, userName);
      
      return intelligentResponse;
    }

    // Busca información específica en la base de conocimiento
    findSpecificInfo(message) {
      const info = knowledgeBase.businessInfo;
      
      // Servicios específicos
      const serviceQueries = [
        { keywords: ['corte', 'cortar', 'cabello'], data: info.services.haircuts },
        { keywords: ['barba', 'bigote', 'afeitar'], data: info.services.beard },
        { keywords: ['tratamiento', 'capilar', 'masaje', 'hidrat'], data: info.services.treatments },
        { keywords: ['paquete', 'combo', 'oferta'], data: info.services.packages }
      ];

      for (const query of serviceQueries) {
        if (query.keywords.some(keyword => message.includes(keyword))) {
          return { type: 'service', data: query.data };
        }
      }

      // Precios
      if (message.includes('precio') || message.includes('costo') || message.includes('cuánto')) {
        return { type: 'prices', data: info.services };
      }

      // Horarios
      if (message.includes('horario') || message.includes('hora') || message.includes('abierto')) {
        return { type: 'schedule', data: info.schedule };
      }

      // Ubicación
      if (message.includes('ubicación') || message.includes('dirección') || message.includes('dónde')) {
        return { type: 'location', data: info.location };
      }

      // Promociones
      if (message.includes('promoción') || message.includes('descuento') || message.includes('oferta')) {
        return { type: 'promotions', data: info.promotions };
      }

      return null;
    }

    // Detecta el tipo de pregunta para responder apropiadamente
    detectQuestionType(message) {
      const questionPatterns = [
        { pattern: /^(qué|que)\s/, type: 'what' },
        { pattern: /^(cómo|como)\s/, type: 'how' },
        { pattern: /^(cuándo|cuando)\s/, type: 'when' },
        { pattern: /^(dónde|donde)\s/, type: 'where' },
        { pattern: /^(por qué|porque)\s/, type: 'why' },
        { pattern: /^(cuánto|cuanto)\s/, type: 'howmuch' },
        { pattern: /\?$/, type: 'question' }
      ];

      for (const pattern of questionPatterns) {
        if (pattern.pattern.test(message)) {
          return pattern.type;
        }
      }

      return 'statement';
    }

    // Genera respuestas inteligentes para cualquier pregunta
    generateIntelligentResponse(message, questionType, userName) {
      const responses = {
        // Respuestas generales inteligentes
        general: [
          `Entiendo tu consulta${userName ? `, ${userName}` : ''}. En LUXIA 23 estamos especializados en servicios de barbería premium. ¿Podrías ser más específico sobre lo que necesitas?`,
          `Gracias por contactarnos${userName ? `, ${userName}` : ''}. Como experto en servicios masculinos, puedo ayudarte con información sobre cortes, tratamientos, precios y más. ¿Qué te interesa saber?`,
          `¡Hola${userName ? ` ${userName}` : ''}! Soy WOLFIE AI y conozco todo sobre LUXIA 23. Cuéntame exactamente qué buscas y te daré la mejor recomendación.`
        ],
        // Respuestas según el tipo de pregunta
        what: [
          `Te explico: En LUXIA 23 ofrecemos servicios premium de barbería. Si me dices específicamente qué servicio te interesa, puedo darte detalles completos.`,
          `Sobre eso que preguntas, tenemos varias opciones. ¿Te refieres a servicios, precios, horarios o ubicación?`
        ],
        how: [
          `Te ayudo con el proceso: Para la mayoría de nuestros servicios, es recomendable agendar cita previa. ¿Qué servicio específico te interesa?`,
          `El procedimiento es sencillo. Dime exactamente qué necesitas y te explico paso a paso.`
        ],
        when: [
          `Nuestros horarios son: Lunes a Sábado 9:00 AM - 7:00 PM, Domingos 10:00 AM - 4:00 PM. ¿Qué día te conviene más?`,
          `Sobre los tiempos, depende del servicio. ¿Qué tratamiento específico te interesa?`
        ],
        where: [
          `Estamos ubicados en Calle 123 #45-67, Centro, Barrio La Esperanza. Tenemos parqueadero y estamos cerca al TransMilenio.`,
          `Nuestra ubicación es muy accesible. ¿Necesitas indicaciones específicas para llegar?`
        ],
        why: [
          `En LUXIA 23 nos especializamos en calidad premium y servicio personalizado. Cada tratamiento está diseñado para darte los mejores resultados.`,
          `La razón es simple: ofrecemos la mejor experiencia en cuidado masculino de la ciudad. ¿Qué aspecto específico te interesa conocer?`
        ],
        howmuch: [
          `Nuestros precios van desde $15.000 hasta $55.000 dependiendo del servicio. ¿Qué tratamiento específico te interesa?`,
          `Los costos varían según el paquete. Tenemos opciones desde básicas hasta premium. ¿Cuál es tu presupuesto aproximado?`
        ]
      };

      // Seleccionar respuesta según el tipo de pregunta
      let responseArray = responses[questionType] || responses.general;
      let response = responseArray[Math.floor(Math.random() * responseArray.length)];

      // Agregar sugerencias inteligentes
      const suggestions = this.generateSmartSuggestions(message, questionType);

      return {
        response: response,
        suggestions: suggestions,
        showQuickOptions: suggestions.length > 0,
        followUp: this.generateFollowUp(questionType),
        category: 'intelligent'
      };
    }

    // Formatea respuestas específicas encontradas
    formatResponse(info, userName) {
      let response = '';
      let suggestions = [];

      switch (info.type) {
        case 'service':
          response = this.formatServiceInfo(info.data, userName);
          suggestions = ['Ver precios', 'Agendar cita', 'Otros servicios'];
          break;
        case 'prices':
          response = this.formatPriceInfo(info.data, userName);
          suggestions = ['Agendar cita', 'Ver promociones', 'Ubicación'];
          break;
        case 'schedule':
          response = this.formatScheduleInfo(info.data, userName);
          suggestions = ['Agendar cita', 'Ver servicios', 'Ubicación'];
          break;
        case 'location':
          response = this.formatLocationInfo(info.data, userName);
          suggestions = ['Ver horarios', 'Agendar cita', 'Servicios'];
          break;
        case 'promotions':
          response = this.formatPromotionInfo(info.data, userName);
          suggestions = ['Agendar cita', 'Ver precios', 'Servicios'];
          break;
        default:
          response = `Información encontrada${userName ? `, ${userName}` : ''}. ¿Necesitas más detalles?`;
      }

      return {
        response: response,
        suggestions: suggestions,
        showQuickOptions: true,
        followUp: '¿Te ayudo con algo más específico?',
        category: info.type
      };
    }

    formatServiceInfo(services, userName) {
      let response = `${userName ? `${userName}, aquí` : 'Aquí'} tienes información sobre nuestros servicios:\n\n`;
      
      Object.entries(services).forEach(([key, service]) => {
        response += `✨ ${service.name}: ${service.price.toLocaleString()}\n   ${service.description}\n\n`;
      });
      
      return response + '¿Cuál te llama más la atención?';
    }

    formatPriceInfo(services, userName) {
      let response = `${userName ? `${userName}, esta` : 'Esta'} es nuestra lista de precios:\n\n`;
      
      Object.values(services).forEach(category => {
        Object.values(category).forEach(service => {
          response += `💰 ${service.name}: ${service.price.toLocaleString()}\n`;
        });
      });
      
      return response + '\n¡Tenemos opciones para todos los presupuestos!';
    }

    formatScheduleInfo(schedule, userName) {
      return `${userName ? `${userName}, nuestros` : 'Nuestros'} horarios de atención son:\n\n🕘 ${schedule.weekdays}\n🕘 ${schedule.saturday}\n🕘 ${schedule.sunday}\n\n¡Te esperamos!`;
    }

    formatLocationInfo(location, userName) {
      let response = `${userName ? `${userName}, nos` : 'Nos'} encontramos en:\n\n`;
      response += `📍 ${location.address}\n📍 ${location.neighborhood}\n📞 ${location.phone}\n\n`;
      response += location.features.map(feature => `✅ ${feature}`).join('\n');
      return response;
    }

    formatPromotionInfo(promotions, userName) {
      let response = `${userName ? `${userName}, estas` : 'Estas'} son nuestras promociones actuales:\n\n`;
      
      Object.values(promotions).forEach(promo => {
        const discount = promo.discount ? `${promo.discount}% descuento` : '';
        response += `🎉 ${promo.name}: ${discount}\n   ${promo.description}\n\n`;
      });
      
      return response + '¿Calificas para alguna de estas promociones?';
    }

    generateSmartSuggestions(message, questionType) {
      // Sugerencias inteligentes basadas en el contexto
      const baseSuggestions = ['Ver servicios', 'Precios', 'Agendar cita', 'Ubicación'];
      const contextSuggestions = {
        'what': ['Servicios disponibles', 'Tratamientos especiales', 'Paquetes'],
        'how': ['Proceso de cita', 'Cómo llegar', 'Formas de pago'],
        'when': ['Horarios disponibles', 'Mejor momento', 'Agendar ahora'],
        'where': ['Ubicación exacta', 'Cómo llegar', 'Transporte público'],
        'howmuch': ['Lista de precios', 'Promociones', 'Paquetes económicos']
      };

      return contextSuggestions[questionType] || baseSuggestions;
    }

    generateFollowUp(questionType) {
      const followUps = {
        'what': '¿Qué tipo de servicio específico te interesa más?',
        'how': '¿Necesitas ayuda con algún proceso en particular?',
        'when': '¿Qué día y hora te conviene mejor?',
        'where': '¿Necesitas indicaciones para llegar?',
        'why': '¿Hay algo específico que te preocupa?',
        'howmuch': '¿Te interesa conocer nuestros paquetes con descuento?',
        'general': '¿Hay algo más específico que te gustaría saber?'
      };

      return followUps[questionType] || followUps.general;
    }
  }

  // Variables del componente
  let isOpen = false;
  let userName = '';
  let conversationState = 'greeting';
  let messages = [
    {
      id: 1,
      content: "¡Hola! Bienvenido a LUXIA 23. Soy WOLFIE AI, tu asistente inteligente ✨",
      isUser: false,
      time: getCurrentTime()
    },
    {
      id: 2,
      content: "Puedo responder cualquier pregunta sobre nuestros servicios, precios, horarios y más. Para una experiencia personalizada, cuéntame tu nombre 😊",
      isUser: false,
      time: getCurrentTime(),
      showQuickOptions: true,
      quickOptions: ['Mi nombre es...', 'Ver servicios', 'Información general']
    }
  ];
  let currentMessage = '';
  let isTyping = false;
  let messagesContainer;
  let aiSystem = new SmartAISystem();
  let conversationHistory = [];
  
  // Funciones para enlaces externos
  function openWhatsApp() {
    const message = encodeURIComponent(externalLinks.whatsapp.message);
    const whatsappUrl = `https://wa.me/${externalLinks.whatsapp.number.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
  
  // ✅ Función corregida para navegación interna
  function openReservas() {
    // Opción 1: Cierra el chat y navega con transición suave
    isOpen = false;
    setTimeout(() => {
      window.location.href = externalLinks.reservas.url;
    }, 300);
    
    // Opción 2: Si prefieres navegación inmediata, usa solo esta línea:
    // window.location.href = externalLinks.reservas.url;
  }
  
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  function toggleChat() {
    isOpen = !isOpen;
  }
  
  function sendMessage() {
    if (currentMessage.trim() === '') return;
    
    const userMessage = {
      id: Date.now(),
      content: currentMessage,
      isUser: true,
      time: getCurrentTime()
    };
    
    messages = [...messages, userMessage];
    conversationHistory.push({ message: currentMessage, isUser: true });
    
    const messageToProcess = currentMessage;
    currentMessage = '';
    
    isTyping = true;
    scrollToBottom();
    
    setTimeout(() => {
      const response = getSmartResponse(messageToProcess);
      const botMessage = {
        id: Date.now() + 1,
        content: response.response,
        isUser: false,
        time: getCurrentTime(),
        showQuickOptions: response.showQuickOptions,
        quickOptions: response.suggestions,
        followUp: response.followUp
      };
      
      messages = [...messages, botMessage];
      conversationHistory.push({ message: response.response, isUser: false, category: response.category });
      
      // Agregar pregunta de seguimiento si existe
      if (response.followUp) {
        setTimeout(() => {
          const followUpMessage = {
            id: Date.now() + 2,
            content: response.followUp,
            isUser: false,
            time: getCurrentTime(),
            isFollowUp: true
          };
          messages = [...messages, followUpMessage];
          scrollToBottom();
        }, 2000);
      }
      
      isTyping = false;
      scrollToBottom();
    }, Math.random() * 1500 + 800);
  }
  
  function getSmartResponse(message) {
    // Manejo del nombre del usuario
    if (!userName && (message.toLowerCase().includes('mi nombre es') || message.toLowerCase().includes('me llamo'))) {
      userName = message.replace(/mi nombre es/i, '').replace(/me llamo/i, '').replace(/soy/i, '').trim();
      if (userName.length > 20) userName = userName.split(' ')[0];
      conversationState = 'conversation';
      return {
        response: `¡Perfecto ${userName}! 👋 Ahora puedo darte una atención personalizada. Pregúntame lo que necesites sobre LUXIA 23 - servicios, precios, horarios, tratamientos específicos, ¡cualquier cosa!`,
        suggestions: ['Ver todos los servicios', 'Precios actualizados', 'Agendar mi cita', 'Tratamientos especiales'],
        showQuickOptions: true,
        followUp: '¿Qué te interesa más: un corte específico, tratamiento capilar, o tal vez un paquete completo?',
        category: 'greeting'
      };
    }
    
    // Usar el sistema de IA inteligente para cualquier otra consulta
    return aiSystem.analyzeMessage(message, userName, conversationHistory);
  }
  
  function selectQuickOption(option) {
    currentMessage = option;
    sendMessage();
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }
  
  function scrollToBottom() {
    setTimeout(() => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }
  
  onMount(() => {
    scrollToBottom();
  });
</script>

<!-- Widget flotante -->
<div class="chat-widget">
  <!-- Botón flotante -->
  <div class="chat-button" class:open={isOpen} on:click={toggleChat}>
    {#if isOpen}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    {:else}
      <img src={logoImg} alt="Logo" class="logo-img" />
    {/if}
  </div>
  
  <!-- Chat container -->
  {#if isOpen}
    <div class="chat-container">
      <!-- Header -->
      <div class="chat-header">
        <div class="avatar">
          <img src={logoImg} alt="WOLFIE AI" class="avatar-img" />
        </div>
        <div class="header-info">
          <h3>WOLFIE AI</h3>
          <span class="status">🟢 En línea • IA Inteligente</span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="action-btn whatsapp-btn" on:click={openWhatsApp}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
          </svg>
          <span>WhatsApp</span>
        </button>
        
        <button class="action-btn reservas-btn" on:click={openReservas}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          <span>Reservar</span>
        </button>
      </div>
      
      <!-- Messages -->
      <div class="chat-messages" bind:this={messagesContainer}>
        {#each messages as message (message.id)}
          <div class="message" class:user={message.isUser} class:bot={!message.isUser} class:follow-up={message.isFollowUp}>
            <div class="message-content">
              {#each message.content.split('\n') as line}
                <div>{line}</div>
              {/each}
              <div class="message-time">{message.time}</div>
            </div>
            
            {#if message.showQuickOptions && message.quickOptions}
              <div class="quick-options">
                {#each message.quickOptions as option}
                  <button class="quick-btn" on:click={() => selectQuickOption(option)}>
                    {option}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
        
        {#if isTyping}
          <div class="message bot">
            <div class="typing-indicator">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="typing-text">WOLFIE AI está pensando...</div>
            </div>
          </div>
        {/if}
      </div>
      
      <!-- Input -->
      <div class="chat-input">
        <input 
          type="text" 
          bind:value={currentMessage} 
          on:keypress={handleKeyPress}
          placeholder={userName ? `Pregúntame cualquier cosa ${userName}...` : "Pregúntame cualquier cosa..."}
          maxlength="500"
        />
        <button class="send-btn" on:click={sendMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
      
      <!-- Footer info -->
      <div class="chat-footer">
        <span>La IA • Solo responde a cualquier pregunta relacionada con la barberia</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .chat-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #20b2aa, #17a2b8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(32, 178, 170, 0.4);
    transition: all 0.3s ease;
    border: none;
    position: relative;
  }
  
  .chat-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(32, 178, 170, 0.6);
  }
  
  .chat-button.open {
    background: #dc3545;
  }
  
  .logo-img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: none;
  }
  
  .chat-container {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 380px;
    height: 580px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .chat-header {
    background: linear-gradient(135deg, #20b2aa, #17a2b8);
    color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    overflow: hidden;
    padding: 2px;
  }
  
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .header-info h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .status {
    font-size: 12px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* Estilos mejorados para los botones de acción */
  .action-buttons {
    padding: 12px 15px;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-bottom: 1px solid #dee2e6;
    display: flex;
    gap: 10px;
    justify-content: center;
    animation: slideInFromTop 0.5s ease-out;
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border: none;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    min-height: 44px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* Efecto de ondas en hover */
  .action-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  .action-btn:hover::before {
    width: 300px;
    height: 300px;
  }

  /* Botón de WhatsApp */
  .whatsapp-btn {
    background: linear-gradient(135deg, #25D366, #128C7E);
    color: white;
    border: 2px solid transparent;
    animation: pulse 2s infinite;
  }

  .whatsapp-btn:hover {
    background: linear-gradient(135deg, #128C7E, #075E54);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
  }

  .whatsapp-btn:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(37, 211, 102, 0.3);
  }

  /* Botón de Reservas */
  .reservas-btn {
    background: linear-gradient(135deg, #20b2aa, #17a2b8);
    color: white;
    border: 2px solid transparent;
  }

  .reservas-btn:hover {
    background: linear-gradient(135deg, #17a2b8, #138496);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(32, 178, 170, 0.4);
  }

  .reservas-btn:active {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(32, 178, 170, 0.3);
  }

  /* Iconos de los botones */
  .action-btn svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  .action-btn:hover svg {
    transform: scale(1.1);
  }

  /* Texto de los botones */
  .action-btn span {
    position: relative;
    z-index: 1;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* Efecto de pulso para llamar la atención */
  @keyframes pulse {
    0% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(37, 211, 102, 0.7);
    }
    70% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 10px rgba(37, 211, 102, 0);
    }
    100% {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(37, 211, 102, 0);
    }
  }

  /* Estados de focus para accesibilidad */
  .action-btn:focus {
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  /* Estados deshabilitados */
  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .action-btn:disabled:hover {
    background: #6c757d;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* Efectos de carga */
  .action-btn.loading {
    position: relative;
    color: transparent;
  }

  .action-btn.loading::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    left: 50%;
    margin-left: -8px;
    margin-top: -8px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #ffffff;
    animation: spin 1s linear infinite;
    z-index: 2;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  }
  
  .message {
    margin-bottom: 15px;
    display: flex;
  }
  
  .message.bot {
    justify-content: flex-start;
  }
  
  .message.user {
    justify-content: flex-end;
  }
  
  .message.follow-up .message-content {
    background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
    border-left: 3px solid #20b2aa;
  }
  
  .message-content {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.4;
    position: relative;
  }
  
  .message.bot .message-content {
    background: white;
    color: #333;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    border: 1px solid #e9ecef;
  }
  
  .message.user .message-content {
    background: linear-gradient(135deg, #20b2aa, #17a2b8);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 12px rgba(32, 178, 170, 0.3);
  }
  
  .message-time {
    font-size: 11px;
    color: #999;
    margin-top: 5px;
    text-align: right;
  }
  
  .message.user .message-time {
    color: rgba(255,255,255,0.8);
  }
  
  .typing-indicator {
    padding: 12px 16px;
    background: white;
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    border: 1px solid #e9ecef;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .typing-dots {
    display: flex;
    gap: 4px;
  }
  
  .typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #20b2aa;
    animation: typing 1.4s infinite ease-in-out;
  }
  
  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
  
  .quick-options {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
    max-width: 80%;
  }
  
  .quick-btn {
    padding: 6px 10px;
    background: #f0f8ff;
    border: 1px solid #20b2aa;
    border-radius: 12px;
    font-size: 11px;
    color: #20b2aa;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .quick-btn:hover {
    background: #20b2aa;
    color: white;
    transform: translateY(-1px);
  }

  .chat-input {
    padding: 15px;
    background: white;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .chat-input input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
  }
  
  .chat-input input:focus {
    border-color: #20b2aa;
  }
  
  .send-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: #20b2aa;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .send-btn:hover {
    background: #1a9690;
    transform: scale(1.05);
  }

  .chat-footer {
    padding: 8px 15px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    text-align: center;
    font-size: 11px;
    color: #6c757d;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .chat-container {
      width: 300px;
      height: 450px;
    }
    
    .chat-widget {
      bottom: 15px;
      right: 15px;
    }

    .action-buttons {
      padding: 10px 12px;
      gap: 8px;
    }
    
    .action-btn {
      padding: 10px 12px;
      font-size: 12px;
      min-height: 40px;
    }
    
    .action-btn svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 480px) {
    .action-buttons {
      flex-direction: column;
      gap: 8px;
    }
    
    .action-btn {
      min-height: 36px;
    }
  }
</style>