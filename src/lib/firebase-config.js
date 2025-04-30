// src/firebase-config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXMHYSMZD9toYPmSqlJ_NEMIxgIYb-gQI",
  authDomain: "base-datos-f74f8.firebaseapp.com",
  projectId: "base-datos-f74f8",
  storageBucket: "base-datos-f74f8.firebasestorage.app",
  messagingSenderId: "239252795816",
  appId: "1:239252795816:web:6a51619690aeaebfc26d9d",
  measurementId: "G-LWHYF2GPBY"
};

// Inicializa (o reutiliza) la app
const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Exporta tus instancias existentes
export const auth = getAuth(app);
export const db   = getFirestore(app);

// *Añade este default export* para que firebase-auth.js pueda hacer:
//    import firebaseConfig from './firebase-config.js';
export default firebaseConfig;