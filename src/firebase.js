// ============================================================
// CONNEXION À LA BASE DE DONNÉES TEMPS RÉEL (Firebase)
//
// ⚠️ TANT QUE CE BLOC EST VIDE, l'application fonctionne en
// « Mode local » : chaque écran garde ses propres compteurs et
// son propre historique, sans synchronisation.
//
// Pour activer la synchronisation de la table, collez ici les
// valeurs du bloc `firebaseConfig` fourni par la console
// Firebase (Paramètres du projet → Vos applications → Web).
// Ces valeurs ne sont PAS des secrets : elles identifient
// simplement le projet, la protection se règle côté Firebase
// dans les règles de la base de données.
// ============================================================
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const configFirebase = {
  apiKey: 'AIzaSyAR8-GkmDHkWDo6o0Yv-rSXuPrutgfXGsE',
  authDomain: 'star-wars-jdr-bf996.firebaseapp.com',
  databaseURL: 'https://star-wars-jdr-bf996-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'star-wars-jdr-bf996',
  storageBucket: 'star-wars-jdr-bf996.firebasestorage.app',
  messagingSenderId: '284638942611',
  appId: '1:284638942611:web:8ac2ce97a09ea6a2390466',
}

// La synchronisation est considérée comme configurée dès que
// l'adresse de la base de données est renseignée.
export const estConfigure = Boolean(configFirebase.databaseURL)

export const db = estConfigure ? getDatabase(initializeApp(configFirebase)) : null
