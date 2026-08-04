// Compteur interactif (+ / −) avec jauge, utilisé pour les
// Blessures, le Stress et la Défense.
export default function Compteur({ label, valeur, max, couleur, onChange }) {
  const ratio = max ? Math.min(valeur / max, 1) : 0
  const depassement = max != null && valeur >= max

  return (
    <div className="rounded-xl border border-space-600 bg-space-800/80 p-3 flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-wider text-space-300">{label}</span>
        <span className={`text-lg font-bold ${depassement ? 'text-sw-red' : 'text-space-200'}`}>
          {valeur}
          {max != null && <span className="text-space-400 text-sm font-normal"> / {max}</span>}
        </span>
      </div>

      {max != null && (
        <div className="h-1.5 rounded-full bg-space-700 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${ratio * 100}%`, backgroundColor: couleur }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onChange(Math.max(0, valeur - 1))}
          className="flex-1 rounded-lg bg-space-700 hover:bg-space-600 active:scale-95 transition text-lg font-bold py-1"
          aria-label={`Diminuer ${label}`}
        >
          −
        </button>
        <button
          onClick={() => onChange(valeur + 1)}
          className="flex-1 rounded-lg bg-space-700 hover:bg-space-600 active:scale-95 transition text-lg font-bold py-1"
          aria-label={`Augmenter ${label}`}
        >
          +
        </button>
      </div>

      {depassement && (
        <p className="text-xs text-sw-red font-semibold">Seuil atteint !</p>
      )}
    </div>
  )
}
