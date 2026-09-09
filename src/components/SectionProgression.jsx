import { xpDisponibles, xpDepenses } from '../logique/progression.js'

// Menu d'améliorations de la fiche : le joueur y dépense les
// points d'expérience que le MJ lui a accordés. Les achats sont
// synchronisés avec toute la table.

function CarteAmelioration({ amelioration, achetee, abordable, onAcheter }) {
  return (
    <li
      className={`rounded-xl border p-3 flex flex-col gap-2 transition ${
        achetee
          ? 'border-sw-green/50 bg-sw-green/5'
          : abordable
            ? 'border-space-600 bg-space-800/70'
            : 'border-space-700 bg-space-800/40 opacity-70'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-space-200">{amelioration.nom}</span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold border ${
            achetee
              ? 'border-sw-green/50 text-sw-green'
              : 'border-sw-or/50 text-sw-or'
          }`}
        >
          {amelioration.cout} XP
        </span>
      </div>

      <p className="text-xs text-space-300">{amelioration.description}</p>

      {achetee ? (
        <span className="text-xs font-bold text-sw-green uppercase tracking-wide">
          ✓ Acquis
        </span>
      ) : (
        <button
          onClick={onAcheter}
          disabled={!abordable}
          className="rounded-lg bg-sw-yellow text-black font-bold py-1.5 text-xs uppercase tracking-wide
                     hover:brightness-110 active:scale-[0.98] transition
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          {abordable ? `Acheter pour ${amelioration.cout} XP` : 'Expérience insuffisante'}
        </button>
      )}
    </li>
  )
}

export default function SectionProgression({ perso, progression, onAcheter }) {
  const menu = perso.ameliorations ?? []
  const achetees = progression?.ameliorations ?? []
  const disponibles = xpDisponibles(perso, progression)
  const depenses = xpDepenses(perso, progression)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold border ${
            disponibles > 0
              ? 'border-sw-yellow text-sw-yellow bg-sw-yellow/10'
              : 'border-space-600 text-space-400'
          }`}
        >
          {disponibles} XP disponible{disponibles > 1 ? 's' : ''}
        </span>
        <span className="text-xs text-space-400">
          {depenses} XP dépensé{depenses > 1 ? 's' : ''} · {progression?.xpTotal ?? 0} XP reçus au
          total
        </span>
      </div>

      {menu.length === 0 ? (
        <p className="text-sm text-space-400 italic">
          Menu d’améliorations pas encore intégré pour ce personnage. Transmettez-le au MJ pour
          qu’il soit ajouté — les points d’expérience reçus sont conservés en attendant.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menu.map((amelioration) => (
            <CarteAmelioration
              key={amelioration.id}
              amelioration={amelioration}
              achetee={achetees.includes(amelioration.id)}
              abordable={disponibles >= amelioration.cout}
              onAcheter={() => onAcheter(amelioration.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
