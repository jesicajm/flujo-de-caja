import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// Tu configuración de Firebase (deberás reemplazar esto con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyB0imch7K7WzUXjkVs0bxcIA15B388mb8Y",
  authDomain: "flujo-de-caja-a7c41.firebaseapp.com",
  projectId: "flujo-de-caja-a7c41",
  storageBucket: "flujo-de-caja-a7c41.appspot.com",
  messagingSenderId: "492971691992",
  appId: "1:492971691992:web:9c7665d62c0f685277ecad"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const db = firebase.firestore()
const auth = firebase.auth()

// Configuración de timestamps
db.settings({ timestampsInSnapshots: true })

export { db, auth } 