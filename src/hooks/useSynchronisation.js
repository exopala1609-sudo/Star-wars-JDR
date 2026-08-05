// ============================================================
// HOOKS DE SYNCHRONISATION
// Chaque hook fonctionne dans les deux modes :
//  - « Table connectée » (Firebase configuré) : l'état vit dans
//    la base temps réel, tous les écrans le voient changer.
//  - « Mode local » : l'état reste dans le navigateur, comme
//    avant le Jalon 3.
// Les écritures sont « optimistes » : l'écran de celui qui agit
// se met à jour immédiatement, la base confirme derrière.
// ============================================================
import { useEffect, useState } from 'react'
import { ref, onValue, set, push, query, limitToLast } from 'firebase/database'
import { db, estConfigure } from '../firebase.js'
import { PERSONNAGES } from '../data/personnages.js'

const etatInitial = () =>
  Object.fromEntries(
    PERSONNAGES.map((p) => [
      p.id,
      {
        blessures: 0,
        stress: 0,
        defenseMelee: p.defense.melee,
        defenseDistance: p.defense.distance,
      },
    ]),
  )

// ——— État vital des 6 personnages (blessures, stress, défenses)
export function useEtatsPartages() {
  const [etats, setEtats] = useState(etatInitial)

  useEffect(() => {
    if (!db) return
    return onValue(ref(db, 'salle/etats'), (instantane) => {
      if (instantane.exists()) setEtats({ ...etatInitial(), ...instantane.val() })
    })
  }, [])

  const majEtat = (persoId, etat) => {
    setEtats((precedent) => ({ ...precedent, [persoId]: etat }))
    if (db) set(ref(db, `salle/etats/${persoId}`), etat)
  }

  return [etats, majEtat]
}

// ——— Historique des lancers, partagé par toute la table
const CLE_HISTORIQUE = 'swjdr-historique'

export function useHistoriquePartage() {
  const [entrees, setEntrees] = useState(() => {
    if (estConfigure) return []
    try {
      return JSON.parse(localStorage.getItem(CLE_HISTORIQUE)) ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (!db) return
    const cinquanteDerniers = query(ref(db, 'salle/historique'), limitToLast(50))
    return onValue(cinquanteDerniers, (instantane) => {
      const valeurs = instantane.val() ?? {}
      setEntrees(
        Object.entries(valeurs)
          .map(([cle, entree]) => ({ ...entree, id: cle }))
          .sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0)),
      )
    })
  }, [])

  const ajouter = (entree) => {
    if (db) {
      // La liste locale sera rafraîchie par l'écouteur ci-dessus
      push(ref(db, 'salle/historique'), entree)
      return
    }
    setEntrees((precedent) => {
      const nouvelles = [{ ...entree, id: crypto.randomUUID() }, ...precedent].slice(0, 50)
      try {
        localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(nouvelles))
      } catch {
        // stockage local indisponible : l'historique reste en mémoire
      }
      return nouvelles
    })
  }

  return [entrees, ajouter]
}

// ——— Réserves de dés en préparation, une par personnage.
// Le joueur la construit depuis sa fiche, le MJ la voit dans sa
// vue et peut y injecter des dés avant le lancer.
export function useReservesPartagees() {
  const [reserves, setReserves] = useState({})

  useEffect(() => {
    if (!db) return
    return onValue(ref(db, 'salle/reserves'), (instantane) => {
      setReserves(instantane.val() ?? {})
    })
  }, [])

  const majReserve = (persoId, reserve) => {
    setReserves((precedent) => {
      const nouvelles = { ...precedent }
      if (reserve === null) delete nouvelles[persoId]
      else nouvelles[persoId] = reserve
      return nouvelles
    })
    if (db) set(ref(db, `salle/reserves/${persoId}`), reserve)
  }

  return [reserves, majReserve]
}

// ——— Adversaires du MJ. Chaque adversaire porte un drapeau
// `visible` : s'il est faux, les joueurs ne le voient pas du
// tout (le MJ garde ses jauges secrètes).
export function useAdversairesPartages() {
  const [adversaires, setAdversaires] = useState({})

  useEffect(() => {
    if (!db) return
    return onValue(ref(db, 'salle/adversaires'), (instantane) => {
      setAdversaires(instantane.val() ?? {})
    })
  }, [])

  const majAdversaire = (cle, adversaire) => {
    setAdversaires((precedent) => {
      const nouveaux = { ...precedent }
      if (adversaire === null) delete nouveaux[cle]
      else nouveaux[cle] = adversaire
      return nouveaux
    })
    if (db) set(ref(db, `salle/adversaires/${cle}`), adversaire)
  }

  return [adversaires, majAdversaire]
}

// ——— Suivi de combat : tour, participant actif et ordre
// d'initiative, partagés avec toute la table. `null` = pas de
// combat en cours.
export function useCombatPartage() {
  const [combat, setCombat] = useState(null)

  useEffect(() => {
    if (!db) return
    return onValue(ref(db, 'salle/combat'), (instantane) => {
      setCombat(instantane.exists() ? instantane.val() : null)
    })
  }, [])

  const majCombat = (nouveau) => {
    setCombat(nouveau)
    if (db) set(ref(db, 'salle/combat'), nouveau)
  }

  return [combat, majCombat]
}

// ——— Réserve de Force du groupe (points lumineux / obscurs)
export function useForcePartagee() {
  const [force, setForce] = useState({ lumineux: 0, obscurs: 0 })

  useEffect(() => {
    if (!db) return
    return onValue(ref(db, 'salle/force'), (instantane) => {
      if (instantane.exists()) setForce(instantane.val())
    })
  }, [])

  const majForce = (nouvelle) => {
    setForce(nouvelle)
    if (db) set(ref(db, 'salle/force'), nouvelle)
  }

  return [force, majForce]
}
