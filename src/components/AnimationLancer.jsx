import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ResultatLancer from './ResultatLancer.jsx'
import AnimationLancerCss from './AnimationLancerCss.jsx'

// ============================================================
// MISE EN SCÈNE D'UN LANCER
//
// Le résultat est déjà tiré au sort quand ce composant s'ouvre :
// l'animation ne décide de rien, elle raconte. Trois chemins
// possibles, du plus beau au plus simple :
//
//   1. Dés 3D avec vraie physique (moteur chargé à la demande)
//   2. Animation 2D de repli, si la 3D est indisponible
//   3. Résultat affiché sans animation, si l'appareil demande
//      de réduire les animations
// ============================================================

function webglDisponible() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

function Animation3D({ resultat, onTerminee, onEchec }) {
  const conteneur = useRef(null)
  const scene = useRef(null)
  const [phase, setPhase] = useState('chargement')

  useEffect(() => {
    let annule = false

    const demarrer = async () => {
      try {
        // Le moteur 3D pèse lourd : il n'est téléchargé qu'ici,
        // au tout premier lancer, puis gardé en cache.
        const { creerScene } = await import('../logique/moteur3d.js')
        if (annule || !conteneur.current) return
        scene.current = creerScene(conteneur.current)
        setPhase('lancer')
        await scene.current.lancer(resultat)
        if (!annule) setPhase('resultat')
      } catch (erreur) {
        console.error('Moteur 3D indisponible, repli sur l’animation classique', erreur)
        if (!annule) onEchec()
      }
    }
    demarrer()

    return () => {
      annule = true
      scene.current?.detruire()
      scene.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fermeture automatique une fois le résultat lu
  useEffect(() => {
    if (phase !== 'resultat') return
    const minuteur = setTimeout(onTerminee, 3200)
    return () => clearTimeout(minuteur)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const clic = () => {
    if (phase === 'lancer') scene.current?.sauterAnimation()
    else if (phase === 'resultat') onTerminee()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col cursor-pointer"
      onClick={clic}
    >
      <div ref={conteneur} className="flex-1 min-h-0" />

      <div className="shrink-0 pb-8 px-4 flex flex-col items-center gap-3 min-h-28 justify-start">
        {phase === 'chargement' && (
          <p className="text-sm text-space-300 animate-pulse">Préparation des dés…</p>
        )}
        {phase === 'resultat' && (
          <div className="anim-apparition flex flex-col items-center gap-3">
            <ResultatLancer resultat={resultat} compact />
            <p className="text-xs text-space-300">Toucher l’écran pour continuer</p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default function AnimationLancer({ resultat, onTerminee }) {
  const mouvementReduit =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [mode, setMode] = useState(() => {
    if (mouvementReduit) return 'css'
    return webglDisponible() ? '3d' : 'css'
  })

  if (mode === '3d') {
    return (
      <Animation3D
        resultat={resultat}
        onTerminee={onTerminee}
        onEchec={() => setMode('css')}
      />
    )
  }
  return <AnimationLancerCss resultat={resultat} onTerminee={onTerminee} />
}
