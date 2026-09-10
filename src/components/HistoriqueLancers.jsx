import ResultatLancer from './ResultatLancer.jsx'
import MiniReserve from './MiniReserve.jsx'

// Historique des lancers : flux antéchronologique des jets de
// toute la table, partagé en temps réel quand la table est
// connectée.

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
              className={`rounded-xl border p-3 flex flex-col gap-2 ${
                entree.secret
                  ? 'border-sw-or/40 bg-space-800/50'
                  : 'border-space-600 bg-space-800/80'
              }`}
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
              {entree.secret ? (
                <p className="text-xs text-space-400 italic">
                  Résultat connu du seul Maître de Jeu.
                </p>
              ) : (
                <>
                  <MiniReserve reserve={entree.reserve} />
                  <ResultatLancer resultat={entree.resultat} compact />
                </>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
