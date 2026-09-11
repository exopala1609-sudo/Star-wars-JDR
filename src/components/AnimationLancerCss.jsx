import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { TYPES_DES } from '../logique/des.js'
import IconeSymbole from './IconeSymbole.jsx'
import ResultatLancer from './ResultatLancer.jsx'

// Animation de repli, en 2D : utilisée quand la 3D n'est pas
// disponible (matériel ancien, WebGL désactivé) ou quand
// l'utilisateur a demandé à réduire les animations.
//
// Le tirage est déjà calculé AVANT l'animation — ici on ne fait
// que le théâtre. Trois phases :
//   1. entrée : les dés tombent au centre en tournant
//   2. roulement : secousses + symboles qui défilent (~0,9 s)
//   3. impact : chaque dé se fige sur sa vraie face, puis le
//      bilan net apparaît. Un clic pendant le roulement saute
//      directement au résultat ; un clic ensuite referme.

const FORME_PAR_FACETTES = {
  6: 'de-forme-d6',
  8: 'de-forme-d8',
  12: 'de-forme-d12',
}

function DeAnime({ de, index, phase, tick }) {
  const def = TYPES_DES[de.type]
  // Pendant le roulement : une face pseudo-aléatoire qui change
  // à chaque tic. À l'arrêt : la vraie face tirée.
  const face =
    phase === 'roulement'
      ? def.faces[(tick * 7 + index * 3) % def.faces.length]
      : de.face

  const symboles = Object.entries(face).flatMap(([sym, n]) =>
    Array.from({ length: n }, (_, i) => (
      <IconeSymbole key={`${sym}${i}`} symbole={sym} className="h-5 w-5" />
    )),
  )

  return (
    <div className="de-anim-entree" style={{ animationDelay: `${index * 0.05}s` }}>
      <div
        className={`${phase === 'roulement' ? 'de-anim-secousse' : 'de-anim-impact'}
          ${FORME_PAR_FACETTES[def.facettes]}
          ${def.facettes === 6 ? 'border border-white/25' : ''}
          h-16 w-16 flex items-center justify-center gap-0.5 shadow-xl`}
        style={{ backgroundColor: def.couleur, color: def.texte }}
        title={`Dé de ${def.nom}`}
      >
        {symboles.length > 0 ? symboles : <span className="opacity-40 text-xl">·</span>}
      </div>
    </div>
  )
}

export default function AnimationLancerCss({ resultat, onTerminee }) {
  const mouvementReduit =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [phase, setPhase] = useState(mouvementReduit ? 'resultat' : 'roulement')
  const [tick, setTick] = useState(0)

  // Phase de roulement : symboles qui défilent puis arrêt
  useEffect(() => {
    if (phase !== 'roulement') return
    const defilement = setInterval(() => setTick((t) => t + 1), 80)
    const arret = setTimeout(() => setPhase('resultat'), 950)
    return () => {
      clearInterval(defilement)
      clearTimeout(arret)
    }
  }, [phase])

  // Une fois le résultat affiché, fermeture automatique
  useEffect(() => {
    if (phase !== 'resultat') return
    const fermeture = setTimeout(onTerminee, 2800)
    return () => clearTimeout(fermeture)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const clic = () => {
    if (phase === 'roulement') setPhase('resultat')
    else onTerminee()
  }

  // Portail vers <body> : sans lui, la superposition serait
  // rognée par les panneaux "datapad" à coins découpés.
  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-6 px-4 cursor-pointer"
      onClick={clic}
    >
      <div className="flex flex-wrap justify-center gap-3 max-w-lg">
        {resultat.des.map((de, i) => (
          <DeAnime key={i} de={de} index={i} phase={phase} tick={tick} />
        ))}
      </div>

      {phase === 'resultat' && (
        <div className="anim-apparition flex flex-col items-center gap-3">
          <ResultatLancer resultat={resultat} compact />
          <p className="text-xs text-space-300">Toucher l’écran pour continuer</p>
        </div>
      )}
    </div>,
    document.body,
  )
}
