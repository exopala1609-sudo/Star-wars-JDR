import { PERSONNAGES } from '../data/personnages.js'

// Écran d'accueil : la galerie des 6 personnages prêts à jouer.
export default function SelectionPersonnage({ onChoisir }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="titre-sw text-xl text-sw-yellow mb-1">Choisissez votre personnage</h2>
      <p className="text-space-300 mb-6 text-sm">
        Les 6 héros du Kit d’Initiation, prêts à s’évader de Mos Shuuta.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONNAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => onChoisir(p.id)}
            className="group text-left rounded-2xl border border-space-600 bg-space-800/80 p-5 transition
                       hover:border-sw-yellow hover:bg-space-700 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-inner"
                style={{ backgroundColor: p.couleur }}
              >
                {p.emoji}
              </div>
              <div>
                <div className="text-lg font-bold text-space-200 group-hover:text-sw-yellow transition">
                  {p.nom}
                </div>
                <div className="text-xs text-space-300">
                  {p.espece} · {p.carriere}
                </div>
              </div>
            </div>
            <p className="text-sm text-space-300 italic">{p.accroche}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
