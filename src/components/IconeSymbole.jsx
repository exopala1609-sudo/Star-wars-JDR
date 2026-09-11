import { TRACES_SYMBOLES } from '../logique/symbolesSvg.js'

// ============================================================
// ICÔNES SVG DES SYMBOLES NARRATIFS — zéro dépendance externe.
// Les tracés viennent de logique/symbolesSvg.js, partagés avec
// les textures des dés 3D : un seul dessin pour les deux usages.
//
// Chaque icône est tracée en `currentColor` et hérite donc
// automatiquement de la couleur du texte qui l'entoure.
// ============================================================

export default function IconeSymbole({ symbole, className = 'h-4 w-4' }) {
  const traces = TRACES_SYMBOLES[symbole]
  if (!traces) return null
  const cercles = TRACES_SYMBOLES[`${symbole}Cercles`] ?? []

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {traces.map((trace, i) => {
        const d = typeof trace === 'string' ? trace : trace.d
        const fillRule = typeof trace === 'object' ? trace.regle : undefined
        const opacity = typeof trace === 'object' ? trace.opacite : undefined
        return <path key={i} d={d} fillRule={fillRule} opacity={opacity} />
      })}
      {cercles.map((c, i) => (
        <circle key={`c${i}`} cx={c.cx} cy={c.cy} r={c.r} />
      ))}
    </svg>
  )
}
