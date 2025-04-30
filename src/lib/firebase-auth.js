import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { writable } from 'svelte/store';

import firebaseConfig from "./firebase-config.js";

// Inicializa la app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Auth
export const auth = getAuth(app);

// Configura la persistencia - AQUÍ ESTÁ EL CAMBIO IMPORTANTE
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistencia de autenticación configurada correctamente");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia:", error);
  });

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// Exporta las funciones de autenticación directamente
export { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, updateProfile };

// Stores para el estado del usuario
export const user = writable(null);
export const userData = writable(null);

// Configura el listener de cambios de autenticación - OTRO CAMBIO IMPORTANTE
onAuthStateChanged(auth, async (currentUser) => {
  console.log("Estado de autenticación cambió:", currentUser ? "Usuario autenticado" : "No autenticado");
  user.set(currentUser);
  
  if (currentUser) {
    try {
      // Obtener datos adicionales del usuario desde Firestore
      const userDataDoc = await getUserById(currentUser.uid);
      userData.set(userDataDoc);
    } catch (error) {
      console.error("Error al cargar datos de usuario:", error);
      userData.set({
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phoneNumber: currentUser.phoneNumber || ""
      });
    }
  } else {
    userData.set(null);
  }
});

// Firestore
const db = getFirestore(app);
export const USERS_COLLECTION = "usuarios";

/**
 * Crea o actualiza un usuario en Firestore tras el login.
 */
export async function createOrUpdateUser(user) {
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const snap = await getDoc(userRef);
  
  if (snap.exists()) {
    await updateDoc(userRef, { lastLogin: serverTimestamp() });
  } else {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      role: "user"
    });
  }
  
  const updated = await getDoc(userRef);
  return { id: updated.id, ...updated.data() };
}

/**
 * Obtiene un usuario por su ID.
 */
export async function getUserById(userId) {
  const ref = doc(db, USERS_COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Obtiene un usuario por su email.
 */
export async function getUserByEmail(email) {
  const q = query(collection(db, USERS_COLLECTION), where("email", "==", email));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc0 = snap.docs[0];
  return { id: doc0.id, ...doc0.data() };
}

/**
 * Actualiza el perfil de un usuario.
 */
export async function updateUserProfile(userId, profileData) {
  const ref = doc(db, USERS_COLLECTION, userId);
  await updateDoc(ref, { ...profileData, updatedAt: serverTimestamp() });
  return true;
}

/**
 * Verifica si un usuario es administrador.
 */
export async function isUserAdmin(userId) {
  const user = await getUserById(userId);
  return user?.role === "admin";
}