// Bandeau affiché sur TOUS les écrans quand un combat est en
// cours : le tour et l'ordre d'initiative, avec le combattant
// actif mis en avant. Lecture seule — le MJ pilote depuis sa vue.
export default function BandeauCombat({ combat }) {
  const participants = combat?.participants ?? []
  if (!combat || participants.length === 0) return null

  return (
    <div className="border-b border-sw-or/30 bg-space-900/95 sticky top-[57px] z-10">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-sw-or font-bold text-sm shrink-0">⚔️ Tour {combat.tour}</span>
        {participants.map((p, i) => {
          const actif = i === combat.indexActif
          return (
            <span
              key={p.cle}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border ${
                actif
                  ? 'border-sw-yellow text-sw-yellow bg-sw-yellow/10'
                  : p.type === 'pj'
                    ? 'border-space-600 text-space-300'
                    : 'border-sw-red/40 text-space-300'
              }`}
            >
              {actif && '▶ '}
              {p.nom}
            </span>
          )
        })}
      </div>
    </div>
  )
}
