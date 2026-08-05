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
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}

// La synchronisation est considérée comme configurée dès que
// l'adresse de la base de données est renseignée.
export const estConfigure = Boolean(configFirebase.databaseURL)

export const db = estConfigure ? getDatabase(initializeApp(configFirebase)) : null
