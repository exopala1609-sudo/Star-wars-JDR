import { useState } from 'react'
import { PERSONNAGES, getPersonnage } from './data/personnages.js'
import SelectionPersonnage from './components/SelectionPersonnage.jsx'
import FichePersonnage from './components/FichePersonnage.jsx'
import HistoriqueLancers from './components/HistoriqueLancers.jsx'

// État de jeu initial de chaque personnage (compteurs modifiables
// en séance). Au Jalon 3, cet état sera synchronisé en temps réel
// entre tous les écrans via la base de données.
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

const CLE_HISTORIQUE = 'swjdr-historique'

const chargerHistorique = () => {
  try {
    return JSON.parse(localStorage.getItem(CLE_HISTORIQUE)) ?? []
  } catch {
    return []
  }
}

export default function App() {
  const [persoActifId, setPersoActifId] = useState(null)
  const [etats, setEtats] = useState(etatInitial)
  const [historique, setHistorique] = useState(chargerHistorique)
  const [historiqueOuvert, setHistoriqueOuvert] = useState(false)

  const persoActif = persoActifId && getPersonnage(persoActifId)

  const ajouterLancer = ({ competence, reserve, resultat }) => {
    const entree = {
      id: crypto.randomUUID(),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      perso: {
        nom: persoActif.nom,
        emoji: persoActif.emoji,
        couleur: persoActif.couleur,
      },
      competence,
      reserve,
      resultat,
    }
    // Les 50 derniers lancers suffisent pour une séance
    const nouvelHistorique = [entree, ...historique].slice(0, 50)
    setHistorique(nouvelHistorique)
    try {
      localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(nouvelHistorique))
    } catch {
      // stockage local indisponible : l'historique reste en mémoire
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-space-700 bg-space-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <h1 className="titre-sw text-sw-yellow text-lg">Aux Confins de l’Empire</h1>
          <button
            onClick={() => setHistoriqueOuvert(true)}
            className="rounded-lg border border-space-600 bg-space-800 px-3 py-1.5 text-sm hover:border-sw-yellow transition"
          >
            🎲 Historique{historique.length > 0 ? ` (${historique.length})` : ''}
          </button>
        </div>
      </header>

      <main>
        {persoActif ? (
          <FichePersonnage
            perso={persoActif}
            etat={etats[persoActif.id]}
            onEtat={(nouvelEtat) => setEtats({ ...etats, [persoActif.id]: nouvelEtat })}
            onRetour={() => setPersoActifId(null)}
            onLancer={ajouterLancer}
          />
        ) : (
          <SelectionPersonnage onChoisir={setPersoActifId} />
        )}
      </main>

      <HistoriqueLancers
        entrees={historique}
        ouvert={historiqueOuvert}
        onFermer={() => setHistoriqueOuvert(false)}
      />
    </div>
  )
}
