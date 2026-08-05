import { TYPES_DES, ORDRE_DES } from '../logique/des.js'

// Aperçu miniature d'une réserve de dés : une pastille colorée
// par dé, dans l'ordre standard. Utilisé dans l'historique et
// dans la Vue MJ.
export default function MiniReserve({ reserve, taille = 'h-3 w-3' }) {
  return (
    <span className="inline-flex flex-wrap gap-1 align-middle">
      {ORDRE_DES.flatMap((type) =>
        Array.from({ length: reserve[type] ?? 0 }, (_, i) => (
          <span
            key={`${type}${i}`}
            className={`${taille} rounded-sm border border-black/30 inline-block`}
            style={{ backgroundColor: TYPES_DES[type].couleur }}
            title={TYPES_DES[type].nom}
          />
        )),
      )}
    </span>
  )
}
