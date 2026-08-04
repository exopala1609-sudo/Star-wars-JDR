import { TYPES_DES, ORDRE_DES } from '../logique/des.js'
import ResultatLancer from './ResultatLancer.jsx'

// Historique des lancers : flux antéchronologique des jets de
// toute la table. Local pour l'instant — il sera partagé en
// temps réel entre tous les écrans au Jalon 3.

function MiniReserve({ reserve }) {
  return (
    <span className="inline-flex gap-1 align-middle">
      {ORDRE_DES.flatMap((type) =>
        Array.from({ length: reserve[type] ?? 0 }, (_, i) => (
          <span
            key={`${type}${i}`}
            className="h-3 w-3 rounded-sm border border-black/30 inline-block"
            style={{ backgroundColor: TYPES_DES[type].couleur }}
            title={TYPES_DES[type].nom}
          />
        )),
      )}
    </span>
  )
}

export default function HistoriqueLancers({ entrees, ouvert, onFermer }) {
  if (!ouvert) return null

  return (
    <div className="fixed inset-0 z-30 flex justify-end" onClick={onFermer}>
      <div className="absolute inset-0 bg-black/60" />
      <aside
        className="relative z-40 w-full max-w-md h-full bg-space-900 border-l border-space-600 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-space-700">
          <h3 className="titre-sw text-sw-yellow text-sm">Historique des lancers</h3>
          <button
            onClick={onFermer}
            className="rounded-lg bg-space-700 hover:bg-space-600 px-3 py-1 text-sm"
          >
            Fermer ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {entrees.length === 0 && (
            <p className="text-sm text-space-400 italic text-center mt-8">
              Aucun lancer pour l’instant. Que la Force soit avec vous !
            </p>
          )}
          {entrees.map((entree) => (
            <div
              key={entree.id}
              className="rounded-xl border border-space-600 bg-space-800/80 p-3 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm shrink-0"
                  style={{ backgroundColor: entree.perso.couleur }}
                >
                  {entree.perso.emoji}
                </span>
                <span className="font-semibold">{entree.perso.nom}</span>
                <span className="text-space-400">· {entree.competence}</span>
                <span className="ml-auto text-xs text-space-400">{entree.heure}</span>
              </div>
              <MiniReserve reserve={entree.reserve} />
              <ResultatLancer resultat={entree.resultat} compact />
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
