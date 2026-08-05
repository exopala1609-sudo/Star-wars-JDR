import { PERSONNAGES } from '../data/personnages.js'
import { CARACTERISTIQUES } from '../data/competences.js'
import Avatar from './Avatar.jsx'

// Écran d'accueil : grandes cartes "poster" des 6 personnages,
// avec leurs statistiques clés visibles d'un coup d'œil.
export default function SelectionPersonnage({ onChoisir, onVueMJ }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h2 className="titre-sw text-xl text-sw-yellow mb-1">Choisissez votre personnage</h2>
          <p className="text-space-300 text-sm">
            Les 6 héros du Kit d’Initiation, prêts à s’évader de Mos Shuuta.
          </p>
        </div>
        <button
          onClick={onVueMJ}
          className="rounded-lg border border-sw-or/50 bg-space-800 px-4 py-2 text-sm text-sw-or
                     hover:bg-space-700 hover:border-sw-or transition font-semibold"
        >
          🎛 Vue Maître de Jeu
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PERSONNAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => onChoisir(p.id)}
            className="group text-left datapad datapad-hover transition hover:-translate-y-1"
          >
            <div className="p-6 flex flex-col items-center gap-4">
              <Avatar perso={p} tailleClasse="h-28 w-28" tailleEmoji="text-5xl" />

              <div className="text-center">
                <div className="titre-sw text-xl text-sw-yellow">{p.nom}</div>
                <div className="text-xs text-space-300 mt-1">
                  {p.espece} · {p.carriere} ({p.specialisation})
                </div>
              </div>

              <div className="grid grid-cols-6 gap-1.5 w-full">
                {Object.entries(CARACTERISTIQUES).map(([id, nom]) => (
                  <div
                    key={id}
                    className="rounded-md bg-space-700/80 border border-space-600 py-1 text-center"
                    title={nom}
                  >
                    <div className="text-sm font-bold text-sw-or">{p.caracteristiques[id]}</div>
                    <div className="text-[9px] uppercase tracking-wide text-space-400">
                      {nom.slice(0, 3)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 text-xs">
                <span className="rounded-full border border-sw-red/40 bg-sw-red/10 text-sw-red px-2.5 py-0.5 font-semibold">
                  Blessures {p.seuilBlessures}
                </span>
                <span className="rounded-full border border-sw-blue/40 bg-sw-blue/10 text-sw-blue px-2.5 py-0.5 font-semibold">
                  Stress {p.seuilStress}
                </span>
                <span className="rounded-full border border-space-400/40 bg-space-600/30 text-space-300 px-2.5 py-0.5 font-semibold">
                  Enc. {p.encaissement}
                </span>
              </div>

              <p className="text-sm text-space-300 italic text-center min-h-10">{p.accroche}</p>

              <span
                className="w-full text-center rounded-lg bg-sw-yellow text-black font-bold uppercase tracking-wider
                           py-2.5 text-sm group-hover:brightness-110 transition"
              >
                Ouvrir la fiche
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
