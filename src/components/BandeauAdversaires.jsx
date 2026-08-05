// Bandeau des adversaires visibles, affiché sur TOUS les écrans.
// Seuls les ennemis que le MJ a marqués « visibles » y figurent :
// ses adversaires secrets restent invisibles pour les joueurs.
// Lecture seule — le MJ pilote les jauges depuis sa vue.
export default function BandeauAdversaires({ adversaires }) {
  const visibles = Object.entries(adversaires ?? {})
    .map(([cle, valeur]) => ({ ...valeur, cle }))
    .filter((a) => a.visible)

  if (visibles.length === 0) return null

  return (
    <div className="border-b border-sw-red/25 bg-space-900/95">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-sw-red font-bold text-xs uppercase tracking-wide shrink-0">
          👾 Adversaires
        </span>
        {visibles.map((a) => {
          const tombe = a.blessures >= a.seuilBlessures
          const ratio = Math.min(a.blessures / Math.max(a.seuilBlessures, 1), 1)
          return (
            <span
              key={a.cle}
              className={`shrink-0 flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                tombe
                  ? 'border-sw-red/60 text-sw-red bg-sw-red/10'
                  : 'border-space-600 text-space-300'
              }`}
            >
              <span>{a.emoji}</span>
              <span className="font-semibold">{a.nom}</span>
              <span className="h-1.5 w-12 rounded-full bg-space-700 overflow-hidden inline-block">
                <span
                  className="h-full block rounded-full"
                  style={{ width: `${ratio * 100}%`, backgroundColor: 'var(--color-sw-red)' }}
                />
              </span>
              <span className="font-bold">
                {tombe ? 'H.C.' : `${a.blessures}/${a.seuilBlessures}`}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
