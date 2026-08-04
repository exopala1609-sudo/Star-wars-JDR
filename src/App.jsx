import { useState } from 'react'
import { PERSONNAGES, getPersonnage } from './data/personnages.js'
import SelectionPersonnage from './components/SelectionPersonnage.jsx'
import FichePersonnage from './components/FichePersonnage.jsx'

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

export default function App() {
  const [persoActifId, setPersoActifId] = useState(null)
  const [etats, setEtats] = useState(etatInitial)

  const persoActif = persoActifId && getPersonnage(persoActifId)

  return (
    <div className="min-h-screen">
      <header className="border-b border-space-700 bg-space-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="titre-sw text-sw-yellow text-lg">
            Aux Confins de l’Empire
          </h1>
          <span className="text-xs text-space-400">Compagnon de table · Jalon 1</span>
        </div>
      </header>

      <main>
        {persoActif ? (
          <FichePersonnage
            perso={persoActif}
            etat={etats[persoActif.id]}
            onEtat={(nouvelEtat) =>
              setEtats({ ...etats, [persoActif.id]: nouvelEtat })
            }
            onRetour={() => setPersoActifId(null)}
          />
        ) : (
          <SelectionPersonnage onChoisir={setPersoActifId} />
        )}
      </main>
    </div>
  )
}
