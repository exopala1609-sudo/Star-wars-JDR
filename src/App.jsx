import { useState } from 'react'
import { getPersonnage } from './data/personnages.js'
import { estConfigure } from './firebase.js'
import {
  useEtatsPartages,
  useHistoriquePartage,
  useForcePartagee,
  useReservesPartagees,
} from './hooks/useSynchronisation.js'
import SelectionPersonnage from './components/SelectionPersonnage.jsx'
import FichePersonnage from './components/FichePersonnage.jsx'
import HistoriqueLancers from './components/HistoriqueLancers.jsx'
import AideDeJeu from './components/AideDeJeu.jsx'
import VueMJ from './components/VueMJ.jsx'

export default function App() {
  // vue = 'accueil' | 'mj' | identifiant d'un personnage
  const [vue, setVue] = useState('accueil')
  const [etats, majEtat] = useEtatsPartages()
  const [historique, ajouterEntree] = useHistoriquePartage()
  const [force, majForce] = useForcePartagee()
  const [reserves, majReserve] = useReservesPartagees()
  const [historiqueOuvert, setHistoriqueOuvert] = useState(false)
  const [aideOuverte, setAideOuverte] = useState(false)

  const persoActif = vue !== 'accueil' && vue !== 'mj' ? getPersonnage(vue) : null

  const ajouterLancer = ({ competence, reserve, resultat }) => {
    ajouterEntree({
      ts: Date.now(),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      perso: {
        nom: persoActif.nom,
        emoji: persoActif.emoji,
        couleur: persoActif.couleur,
      },
      competence,
      reserve,
      resultat,
    })
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-space-700 bg-space-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="titre-sw text-sw-yellow text-lg truncate">Aux Confins de l’Empire</h1>
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] rounded-full px-2.5 py-0.5 border shrink-0 ${
                estConfigure
                  ? 'border-sw-green/50 text-sw-green'
                  : 'border-space-600 text-space-400'
              }`}
              title={
                estConfigure
                  ? 'Les écrans de toute la table sont synchronisés'
                  : 'Synchronisation non configurée : chaque écran est indépendant'
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {estConfigure ? 'Table connectée' : 'Mode local'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAideOuverte(true)}
              className="rounded-lg border border-space-600 bg-space-800 px-3 py-1.5 text-sm hover:border-sw-yellow transition"
            >
              ? Aide
            </button>
            <button
              onClick={() => setHistoriqueOuvert(true)}
              className="rounded-lg border border-space-600 bg-space-800 px-3 py-1.5 text-sm hover:border-sw-yellow transition"
            >
              🎲 Historique{historique.length > 0 ? ` (${historique.length})` : ''}
            </button>
          </div>
        </div>
      </header>

      <main>
        {persoActif ? (
          <FichePersonnage
            perso={persoActif}
            etat={etats[persoActif.id]}
            onEtat={(nouvelEtat) => majEtat(persoActif.id, nouvelEtat)}
            onRetour={() => setVue('accueil')}
            onLancer={ajouterLancer}
            reservePartagee={reserves[persoActif.id]}
            onReserve={(reserve) => majReserve(persoActif.id, reserve)}
          />
        ) : vue === 'mj' ? (
          <VueMJ
            etats={etats}
            majEtat={majEtat}
            force={force}
            majForce={majForce}
            reserves={reserves}
            majReserve={majReserve}
            onRetour={() => setVue('accueil')}
          />
        ) : (
          <SelectionPersonnage onChoisir={setVue} onVueMJ={() => setVue('mj')} />
        )}
      </main>

      <HistoriqueLancers
        entrees={historique}
        ouvert={historiqueOuvert}
        onFermer={() => setHistoriqueOuvert(false)}
      />

      <AideDeJeu ouvert={aideOuverte} onFermer={() => setAideOuverte(false)} />
    </div>
  )
}
