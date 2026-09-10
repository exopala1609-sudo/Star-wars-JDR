// ============================================================
// IDENTITÉ D'APPAREIL
//
// Chaque écran se génère un identifiant unique et anonyme au
// premier chargement, conservé dans son navigateur. C'est le
// « ticket de vestiaire » de l'application : elle ne sait pas
// QUI est devant l'écran, mais elle sait que c'est toujours le
// même écran.
//
// Il sert à trois choses :
//   - savoir quel personnage cet écran a réclamé
//   - ne pas se notifier soi-même de ses propres lancers
//   - libérer un personnage depuis l'appareil qui l'a pris
// ============================================================

const CLE_APPAREIL = 'swjdr-appareil'

function chargerOuCreer() {
  try {
    const existant = localStorage.getItem(CLE_APPAREIL)
    if (existant) return existant
    const nouveau = crypto.randomUUID()
    localStorage.setItem(CLE_APPAREIL, nouveau)
    return nouveau
  } catch {
    // Stockage local indisponible : identité valable le temps
    // de la session, l'application reste utilisable.
    return crypto.randomUUID()
  }
}

export const APPAREIL_ID = chargerOuCreer()
