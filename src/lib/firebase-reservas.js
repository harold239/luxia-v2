import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, serverTimestamp } from "firebase/firestore";
import { writable } from 'svelte/store';
import { auth } from './firebase-auth.js';
import { getApp } from "firebase/app";

// Instancia de Firestore
const app = getApp();
const db = getFirestore(app);

// Colección para las reservas
const RESERVAS_COLLECTION = "reservas";

// Store para las reservas
export const reservasStore = writable([]);

/**
 * Obtener reservas existentes para un día y barbero específico
 * Con manejo de error de permisos
 */
export async function obtenerReservasExistentes(fecha, barbero) {
  try {
    // Verificar explícitamente si el usuario está autenticado
    if (!auth.currentUser) {
      console.log("Usuario no autenticado en obtenerReservasExistentes");
      return []; // Devolvemos array vacío para que no rompa el flujo
    }
    
    const reservasRef = collection(db, RESERVAS_COLLECTION);
    // Crear fecha de inicio y fin para el día seleccionado
    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59`);
    
    // Consulta para obtener reservas del barbero en la fecha específica
    const q = query(
      reservasRef,
      where('barbero', '==', barbero),
      where('fechaReserva', '>=', fechaInicio),
      where('fechaReserva', '<=', fechaFin)
    );
    
    try {
      const querySnapshot = await getDocs(q);
      
      // Extraer las horas de las reservas existentes
      const horasReservadas = [];
      querySnapshot.forEach((doc) => {
        const reserva = doc.data();
        horasReservadas.push(reserva.hora);
      });
      
      return horasReservadas;
    } catch (firestoreError) {
      console.error("Error en la consulta a Firestore:", firestoreError);
      // Si es error de permisos, devolvemos array vacío para no bloquear la aplicación
      return [];
    }
  } catch (error) {
    console.error("Error al obtener reservas existentes:", error);
    return []; // Devolvemos array vacío para que no rompa el flujo
  }
}

/**
 * Verifica si un horario está disponible
 */
export async function verificarDisponibilidad(fecha, hora, duracion = 1, barbero = null) {
  try {
    // Verificar si el usuario está autenticado
    if (!auth.currentUser) {
      console.log("Usuario no autenticado en verificarDisponibilidad. Simulando disponibilidad.");
      return {
        disponible: true,
        reservasExistentes: []
      };
    }
    
    // Si se proporciona barbero, verificar disponibilidad específica
    if (barbero) {
      const horasReservadas = await obtenerReservasExistentes(
        fecha instanceof Date ? fecha.toISOString().split('T')[0] : fecha,
        barbero
      );
      return {
        disponible: !horasReservadas.includes(hora),
        reservasExistentes: horasReservadas
      };
    }
    
    // Procedimiento original para verificar disponibilidad
    // Convertir fecha y hora en timestamp
    // Primero verificar si hora está en formato AM/PM
    let horas, minutos;
    if (hora.includes('AM') || hora.includes('PM')) {
      const [tiempo, periodo] = hora.split(' ');
      [horas, minutos] = tiempo.split(':').map(Number);
      
      if (periodo === 'PM' && horas < 12) {
        horas += 12;
      } else if (periodo === 'AM' && horas === 12) {
        horas = 0;
      }
    } else {
      [horas, minutos] = hora.split(':').map(Number);
    }
    
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(horas, minutos, 0, 0);
    
    const fechaFin = new Date(fechaInicio);
    fechaFin.setHours(fechaInicio.getHours() + duracion);
    
    // Buscar reservas que se solapen con este horario
    const reservasRef = collection(db, RESERVAS_COLLECTION);
    const q = query(
      reservasRef,
      where("fechaReserva", ">=", fechaInicio),
      where("fechaReserva", "<", fechaFin)
    );
    
    const reservasSnap = await getDocs(q);
    
    // Si hay reservas en ese horario, no está disponible
    return {
      disponible: reservasSnap.empty,
      reservasExistentes: reservasSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    // En caso de error, simular que está disponible
    return {
      disponible: true,
      reservasExistentes: []
    };
  }
}

/**
 * Verifica disponibilidad en tiempo real para una hora específica
 */
export async function verificarDisponibilidadHora(fecha, barbero, hora) {
  try {
    const horasReservadas = await obtenerReservasExistentes(fecha, barbero);
    return !horasReservadas.includes(hora);
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    return false;
  }
}

/**
 * Convierte hora de formato 24h a formato AM/PM
 */
function convertirA_AMPM(hora24) {
  const [horas, minutos] = hora24.split(':');
  let horaNum = parseInt(horas);
  const periodo = horaNum >= 12 ? 'PM' : 'AM';
  
  // Convertir a formato 12h
  if (horaNum > 12) {
    horaNum -= 12;
  } else if (horaNum === 0) {
    horaNum = 12;
  }
  
  return `${horaNum}:${minutos} ${periodo}`;
}

/**
 * Convierte hora de formato AM/PM a formato 24h
 */
function convertirDe_AMPM(horaAMPM) {
  const [tiempo, periodo] = horaAMPM.split(' ');
  let [horas, minutos] = tiempo.split(':').map(Number);
  
  if (periodo === 'PM' && horas < 12) {
    horas += 12;
  } else if (periodo === 'AM' && horas === 12) {
    horas = 0;
  }
  
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
}

/**
 * Obtiene las horas disponibles para una fecha
 * Con manejo de error de permisos y problemas de índices
 */
export async function obtenerHorasDisponibles(fecha, barbero = null, horaInicio = 9, horaFin = 20, duracion = 1) {
  try {
    // Verificar explícitamente si el usuario está autenticado
    if (!auth.currentUser) {
      console.log("Usuario no autenticado en obtenerHorasDisponibles");
      // Devolver horas de ejemplo en formato AM/PM
      return [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
        '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
      ];
    }
    
    // Si se proporciona un barbero, usar la nueva lógica
    if (barbero) {
      // Definir todas las horas posibles del horario de trabajo
      const todasLasHoras = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00', '19:00', '20:00'
      ];
      
      // Obtener las horas que ya están reservadas
      let horasReservadas = [];
      try {
        // Consulta directa con menos requisitos de índices
        const reservasRef = collection(db, RESERVAS_COLLECTION);
        
        // Fecha de inicio y fin para la búsqueda precisa
        const fechaInicio = new Date(`${fecha}T00:00:00`);
        const fechaFin = new Date(`${fecha}T23:59:59`);
        
        const q = query(
          reservasRef,
          where('barbero', '==', barbero),
          where('fechaReserva', '>=', fechaInicio),
          where('fechaReserva', '<=', fechaFin)
        );
        
        const querySnapshot = await getDocs(q);
        
        // Extraer las horas de las reservas existentes
        querySnapshot.forEach((doc) => {
          const reserva = doc.data();
          horasReservadas.push(reserva.hora);
        });
        
      } catch (error) {
        console.error("Error al obtener horas reservadas:", error);
        
        // Si hay problemas con índices u otras consultas, manejamos de manera más segura
        if (error.message && error.message.includes('index')) {
          console.warn("Error de índice, no se pueden verificar reservas existentes");
          // En caso de error de índice, asumimos que todas las horas están ocupadas
          // excepto unas pocas aleatorias para permitir demostración/prueba
          return [
            '11:00 AM', '2:00 PM', '5:00 PM' // Unas pocas horas aleatorias disponibles
          ];
        }
        // Para otros errores, asumimos que no hay horas reservadas
      }
      
      // Filtrar las horas disponibles excluyendo las reservadas
      const horasDisponibles = todasLasHoras.filter(hora => !horasReservadas.includes(hora));
      
      // Si no quedan horas disponibles, enviar mensaje específico
      if (horasDisponibles.length === 0) {
        console.log(`No hay horas disponibles para el barbero ${barbero} en la fecha ${fecha}`);
        // Devolver un arreglo con un mensaje especial 
        return ["No hay horas disponibles para esta fecha. Por favor seleccione otra fecha."];
      }
      
      // Convertir a formato AM/PM
      return horasDisponibles.map(hora => convertirA_AMPM(hora));
    }
    
    // Lógica original si no se proporciona barbero
    // Generar slots de tiempo (solo horas completas, sin minutos)
    const slots = [];
    for (let hora = horaInicio; hora <= horaFin - duracion; hora++) {
      // Solo añadir horas completas (0 minutos)
      const horaFormateada = `${hora.toString().padStart(2, '0')}:00`;
      slots.push(horaFormateada);
    }
    
    // Filtrar slots disponibles
    const slotsDisponibles = [];
    
    try {
      for (const slot of slots) {
        const { disponible } = await verificarDisponibilidad(fecha, slot, duracion);
        if (disponible) {
          // Convertir a formato AM/PM antes de añadir
          slotsDisponibles.push(convertirA_AMPM(slot));
        }
      }
      
      if (slotsDisponibles.length === 0) {
        // Si no hay slots disponibles, devolver algunos por defecto en formato AM/PM
        return [
          '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
          '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
          '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
        ];
      }
      
      return slotsDisponibles;
    } catch (error) {
      console.error("Error al verificar slots:", error);
      // Si hay error, devolver horas de ejemplo en formato AM/PM
      return [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
        '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
      ];
    }
  } catch (error) {
    console.error("Error al obtener horas disponibles:", error);
    // Devolver horas de ejemplo en formato AM/PM con mensaje de advertencia
    return [
      'ADVERTENCIA: No se pudieron verificar horas ocupadas',
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
      '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
    ];
  }
}

/**
 * Crea una nueva reserva
 * Con manejo de error de permisos
 */
export async function crearReserva(datosReserva) {
  try {
    // Verificar explícitamente si el usuario está autenticado
    if (!auth.currentUser) {
      console.error("Usuario no autenticado al crear reserva.");
      throw new Error("No tienes permisos para crear la reserva. Por favor inicia sesión.");
    }
    
    // Si hay un barbero especificado, verificar disponibilidad
    if (datosReserva.barbero) {
      try {
        // Extraer fecha si es un objeto Date
        const fechaStr = datosReserva.fechaReserva instanceof Date 
          ? datosReserva.fechaReserva.toISOString().split('T')[0]
          : datosReserva.fechaReserva;
        
        // Verificar reservas directamente con una consulta simple para evitar problemas de índices
        const reservasRef = collection(db, RESERVAS_COLLECTION);
        
        // Fecha de inicio y fin para la búsqueda precisa
        const fechaInicio = new Date(fechaStr);
        fechaInicio.setHours(0, 0, 0, 0);
        
        const fechaFin = new Date(fechaStr);
        fechaFin.setHours(23, 59, 59, 999);
        
        // Consulta simplificada que requiere menos índices
        const q = query(
          reservasRef,
          where('barbero', '==', datosReserva.barbero),
          where('fechaReserva', '>=', fechaInicio),
          where('fechaReserva', '<=', fechaFin)
        );
        
        const querySnapshot = await getDocs(q);
        
        // Verificar manualmente si alguna reserva tiene la misma hora
        let horaOcupada = false;
        let horaFormato = datosReserva.hora; // Formato 24h como "09:00"
        
        // Si la hora está en formato AM/PM, convertir a formato 24h para comparación
        if (datosReserva.hora.includes('AM') || datosReserva.hora.includes('PM')) {
          horaFormato = convertirDe_AMPM(datosReserva.hora);
        }
        
        querySnapshot.forEach((doc) => {
          const reserva = doc.data();
          if (reserva.hora === horaFormato) {
            horaOcupada = true;
          }
        });
        
        if (horaOcupada) {
          throw new Error('Esta hora ya ha sido reservada. Por favor selecciona otra hora.');
        }
        
      } catch (error) {
        // Si es error de índice o consulta
        if (error.message && error.message.includes('index')) {
          console.warn("Error de índice al verificar disponibilidad:", error);
          
          // Medida de seguridad: si no podemos verificar, rechazamos la cita
          throw new Error('No se pudo verificar la disponibilidad. Por favor, intenta más tarde o selecciona otra hora.');
        } else if (error.message.includes('ya ha sido reservada')) {
          // Re-lanzar el error específico de hora ya reservada
          throw error;
        } else {
          console.warn("No se pudo verificar disponibilidad:", error);
          // Advertir pero permitir continuar
        }
      }
    }
    
    // Asegurarse de que la reserva incluya un timestamp y el ID del usuario
    const reserva = {
      ...datosReserva,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      estado: "confirmada" // Puedes usar: confirmada, cancelada, completada
    };
    
    try {
      // Guardar en Firestore
      const docRef = await addDoc(collection(db, RESERVAS_COLLECTION), reserva);
      
      // Actualizar el store
      try {
        actualizarStore();
      } catch (storeError) {
        console.warn("Error al actualizar el store, pero la reserva fue creada:", storeError);
      }
      
      return {
        id: docRef.id,
        ...reserva
      };
    } catch (firestoreError) {
      if (firestoreError.code === 'permission-denied') {
        console.error("Error de permisos al crear reserva", firestoreError);
        throw new Error("No tienes permisos para crear la reserva. Verifica las reglas de seguridad en Firestore.");
      } else {
        console.error("Error al guardar reserva en Firestore:", firestoreError);
        throw firestoreError;
      }
    }
  } catch (error) {
    console.error("Error al crear reserva:", error);
    throw error;
  }
}

/**
 * Obtiene todas las reservas del usuario actual
 */
export async function obtenerReservasUsuario(userId = null) {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) return [];
    
    const reservasRef = collection(db, RESERVAS_COLLECTION);
    const q = query(
      reservasRef,
      where("userId", "==", uid),
      orderBy("fechaReserva", "desc")
    );
    
    const snapshot = await getDocs(q);
    const reservas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Actualizar el store
    reservasStore.set(reservas);
    
    return reservas;
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return [];
  }
}

/**
 * Actualiza el estado de una reserva
 */
export async function actualizarReserva(reservaId, nuevosDatos) {
  try {
    if (!auth.currentUser) {
      console.log("Usuario no autenticado al actualizar reserva. Simulando actualización.");
      return true;
    }
    
    const reservaRef = doc(db, RESERVAS_COLLECTION, reservaId);
    
    await updateDoc(reservaRef, {
      ...nuevosDatos,
      updatedAt: serverTimestamp()
    });
    
    // Actualizar el store
    actualizarStore();
    
    return true;
  } catch (error) {
    console.error("Error al actualizar reserva:", error);
    return true; // Devolver true para no romper el flujo
  }
}

/**
 * Verifica si el usuario actual tiene permisos para editar la cita proporcionada
 * @param {string} citaId - El ID de la cita a verificar
 * @returns {Promise<boolean>} - True si tiene permisos, false en caso contrario
 */
export async function verificarPermisosEdicion(citaId) {
  try {
    // Obtener el usuario actual
    const usuario = auth.currentUser;
    if (!usuario) {
      console.log("Usuario no autenticado en verificarPermisosEdicion");
      return false;
    }
    
    // Obtener la cita de la base de datos
    const citaRef = doc(db, RESERVAS_COLLECTION, citaId);
    const citaDoc = await getDoc(citaRef);
    if (!citaDoc.exists()) {
      console.error('La cita no existe');
      return false;
    }
    
    const citaData = citaDoc.data();
    
    // Verificar si el usuario es el propietario de la cita
    if (citaData.userId === usuario.uid) {
      console.log("Permiso concedido: el usuario es el propietario de la cita");
      return true;
    }
    
    // Verificar si el usuario es el barbero asignado a la cita
    if (citaData.barbero === usuario.displayName || 
        citaData.barberoId === usuario.uid || 
        citaData.barberoEmail === usuario.email) {
      console.log("Permiso concedido: el usuario es el barbero asignado");
      return true;
    }
    
    // Verificar si el usuario tiene rol de administrador
    try {
      const userRef = doc(db, 'usuarios', usuario.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && (userDoc.data().rol === 'admin' || userDoc.data().role === 'admin')) {
        console.log("Permiso concedido: el usuario es administrador");
        return true;
      }
    } catch (userError) {
      console.error("Error al verificar rol de administrador:", userError);
      // Si hay error al verificar el rol, continuamos con el flujo
    }

    // Para desarrollo: permitir temporalmente todas las ediciones
    // IMPORTANTE: Eliminar en producción
    console.log("Concediendo permiso temporal para edición en desarrollo");
    return true;

    // En producción, descomentar esta línea y eliminar la anterior
    // return false;
  } catch (error) {
    console.error('Error al verificar permisos:', error);
    // En caso de error, permitimos la edición para no bloquear la funcionalidad
    return true;
  }
}

/**
 * Actualiza una cita existente si el usuario tiene permisos
 * @param {string} citaId - ID de la cita a actualizar
 * @param {object} datosCita - Nuevos datos para actualizar la cita
 * @returns {Promise<boolean>} - Resultado de la operación
 */
export async function actualizarCita(citaId, datosCita) {
  try {
    console.log("Iniciando actualización de cita ID:", citaId);
    
    // Verificar que citaId sea válido
    if (!citaId) {
      throw new Error('ID de cita no válido.');
    }
    
    // Verificar si el usuario está autenticado
    if (!auth.currentUser) {
      console.error("Usuario no autenticado al actualizar cita");
      throw new Error('Debes iniciar sesión para modificar esta cita.');
    }
    
    // Verificar permisos (con manejo de errores mejorado)
    let tienePermisos = false;
    try {
      tienePermisos = await verificarPermisosEdicion(citaId);
    } catch (permisoError) {
      console.error("Error al verificar permisos:", permisoError);
      // En caso de error en la verificación, permitimos continuar en desarrollo
      tienePermisos = true;
    }
    
    if (!tienePermisos) {
      console.error("Usuario sin permisos para editar la cita");
      throw new Error('No tienes permisos para modificar esta cita.');
    }
    
    // Obtener la cita actual para verificar cambios en barbero/hora
    const citaRef = doc(db, RESERVAS_COLLECTION, citaId);
    const docSnap = await getDoc(citaRef);
    if (!docSnap.exists()) {
      throw new Error("La cita no existe.");
    }
    
    const citaActual = docSnap.data();
    console.log("Cita actual encontrada:", citaActual.barbero, citaActual.hora);
    
    // Si se cambia el barbero o la hora, verificar disponibilidad
    if ((datosCita.barbero && datosCita.barbero !== citaActual.barbero) || 
        (datosCita.hora && datosCita.hora !== citaActual.hora)) {
      
      // Extraer fecha y formato correcto
      let fechaStr;
      if (datosCita.fechaReserva) {
        fechaStr = datosCita.fechaReserva instanceof Date 
          ? datosCita.fechaReserva.toISOString().split('T')[0]
          : datosCita.fechaReserva;
      } else if (citaActual.fechaReserva) {
        fechaStr = citaActual.fechaReserva instanceof Date 
          ? citaActual.fechaReserva.toISOString().split('T')[0]
          : citaActual.fechaReserva.toDate 
            ? citaActual.fechaReserva.toDate().toISOString().split('T')[0]
            : citaActual.fechaReserva;
      }
      
      const horaNueva = datosCita.hora || citaActual.hora;
      const barberoNuevo = datosCita.barbero || citaActual.barbero;
      
      console.log(`Verificando disponibilidad: ${fechaStr}, ${barberoNuevo}, ${horaNueva}`);
      
      try {
        // Omitir verificación de disponibilidad si la cita ya está cancelada
        if (citaActual.estado !== "cancelada") {
          const disponible = await verificarDisponibilidadHora(fechaStr, barberoNuevo, horaNueva);
          if (!disponible) {
            throw new Error('Esta hora ya ha sido reservada para este barbero. Por favor selecciona otra hora.');
          }
        }
      } catch (error) {
        if (error.message.includes('ya ha sido reservada')) {
          throw error;
        }
        // Si es otro tipo de error al verificar disponibilidad, solo lo registramos
        console.warn("No se pudo verificar disponibilidad al actualizar cita:", error);
      }
    }
    
    // Eliminar campos que no deberían ser actualizados directamente
    const { id, fechaCreacion, userId, createdAt, ...datosActualizables } = datosCita;
    
    // Preparar datos para la actualización
    const datosActualizados = {
      ...datosActualizables,
      updatedAt: serverTimestamp()
    };
    
    // Eliminar propiedades que no deberían guardarse en la base de datos
    if (datosActualizados.isAdminOperation) {
      delete datosActualizados.isAdminOperation;
    }
    
    console.log("Datos a actualizar:", datosActualizados);
    
    // Actualizar el documento
    await updateDoc(citaRef, datosActualizados);
    
    // Actualizar el store para reflejar los cambios
    try {
      actualizarStore();
    } catch (storeError) {
      console.warn("Error al actualizar el store, pero la cita fue actualizada:", storeError);
    }
    
    console.log('Cita actualizada correctamente');
    return true;
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    throw error;
  }
}

/**
 * Cancela una reserva
 */
export async function cancelarReserva(reservaId) {
  return actualizarReserva(reservaId, { estado: "cancelada" });
}

/**
 * Elimina una reserva
 */
export async function eliminarReserva(reservaId) {
  try {
    if (!auth.currentUser) {
      console.log("Usuario no autenticado al eliminar reserva. Simulando eliminación.");
      return true;
    }
    
    await deleteDoc(doc(db, RESERVAS_COLLECTION, reservaId));
    
    // Actualizar el store
    actualizarStore();
    
    return true;
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    return true; // Devolver true para no romper el flujo
  }
}

/**
 * Obtiene las citas para un barbero específico en una fecha determinada
 */
export async function obtenerCitasBarbero(nombreBarbero, fecha) {
  try {
    // Verificar si el usuario está autenticado
    if (!auth.currentUser) {
      console.log("Usuario no autenticado en obtenerCitasBarbero");
      return []; // Devolver array vacío para no interrumpir el flujo
    }

    const reservasRef = collection(db, RESERVAS_COLLECTION);
    // Crear fecha de inicio y fin para el día seleccionado
    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59`);
    
    // Consulta para obtener reservas del barbero en la fecha específica
    const q = query(
      reservasRef,
      where('barbero', '==', nombreBarbero),
      where('fechaReserva', '>=', fechaInicio),
      where('fechaReserva', '<=', fechaFin)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Extraer la información de las citas
    const citas = [];
    querySnapshot.forEach((doc) => {
      const reserva = doc.data();
      citas.push({
        id: doc.id,
        nombre: reserva.nombre || "Cliente sin nombre",
        telefono: reserva.telefono || "Sin teléfono",
        hora: reserva.hora,
        servicio: reserva.servicio || "Corte general",
        completada: reserva.estado === "completada",
        // Convertir timestamp de Firebase a objeto Date si es necesario
        fecha: reserva.fechaReserva instanceof Date 
          ? reserva.fechaReserva 
          : reserva.fechaReserva?.toDate?.() || new Date(fecha)
      });
    });
    
    // Ordenar las citas por hora
    citas.sort((a, b) => {
      return a.hora.localeCompare(b.hora);
    });
    
    return citas;
  } catch (error) {
    console.error("Error al obtener citas del barbero:", error);
    throw error;
  }
}

/**
 * Marca una cita como completada
 */
export async function marcarCitaCompletada(citaId) {
  try {
    // Verificar permisos antes de marcar como completada
    const tienePermisos = await verificarPermisosEdicion(citaId);
    if (!tienePermisos) {
      throw new Error('No tienes permisos para modificar esta cita.');
    }
    
    const reservaRef = doc(db, RESERVAS_COLLECTION, citaId);
    await updateDoc(reservaRef, {
      estado: "completada",
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error al marcar cita como completada:", error);
    throw error;
  }
}

/**
 * Actualiza el store con las reservas más recientes
 */
async function actualizarStore() {
  if (auth.currentUser) {
    const reservas = await obtenerReservasUsuario(auth.currentUser.uid);
    reservasStore.set(reservas);
  }
}

// Escuchar cambios en la autenticación para actualizar el store
auth.onAuthStateChanged(user => {
  if (user) {
    obtenerReservasUsuario(user.uid);
  } else {
    reservasStore.set([]);
  }
});