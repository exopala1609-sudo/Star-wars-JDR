import { TRACES_SYMBOLES } from '../logique/symbolesSvg.js'
import { useSymbolesImages } from '../logique/symbolesImages.js'
import { cheminSymbole } from '../data/texturesDes.js'

// ============================================================
// ICÔNES DES SYMBOLES NARRATIFS
//
// Deux sources possibles, dans cet ordre :
//   1. votre image PNG si vous en avez fourni une pour ce
//      symbole — la même que sur les dés 3D ;
//   2. sinon le dessin intégré de l'application.
//
// Dans les deux cas l'icône prend la couleur du texte qui
// l'entoure : votre image est utilisée comme pochoir, remplie
// avec cette couleur. Elle reste donc lisible aussi bien sur un
// badge vert que dans le panneau d'aide.
// ============================================================

export default function IconeSymbole({ symbole, className = 'h-4 w-4' }) {
  const imagesDisponibles = useSymbolesImages()

  if (imagesDisponibles.has(symbole)) {
    const pochoir = `url("${cheminSymbole(symbole)}")`
    return (
      <span
        aria-hidden="true"
        className={`inline-block shrink-0 ${className}`}
        style={{
          backgroundColor: 'currentColor',
          WebkitMaskImage: pochoir,
          maskImage: pochoir,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    )
  }

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
