import { useState } from 'react'
import { ORDRE_DES, RESERVE_VIDE, lancerReserve } from '../logique/des.js'
import { LigneDe } from './ConstructeurReserve.jsx'
import ResultatLancer from './ResultatLancer.jsx'
import AnimationLancer from './AnimationLancer.jsx'

// Lanceur libre : composer n'importe quelle réserve à la main,
// sans passer par une fiche. Utile au MJ (PNJ, tests cachés)
// comme aux joueurs (jets improvisés). Le jet part dans
// l'historique partagé de la table.
export default function LanceurLibre({ ouvert, onFermer, onLancer }) {
  const [des, setDes] = useState({ ...RESERVE_VIDE })
  const [resultat, setResultat] = useState(null)
  const [animation, setAnimation] = useState(null)

  if (!ouvert) return null

  const totalDes = Object.values(des).reduce((somme, n) => somme + n, 0)

  const lancer = () => setAnimation(lancerReserve(des))

  const terminerAnimation = () => {
    if (!animation) return
    setResultat(animation)
    onLancer(des, animation)
    setAnimation(null)
  }

  const vider = () => {
    setDes({ ...RESERVE_VIDE })
    setResultat(null)
  }

  return (
    <div className="fixed inset-0 z-30 flex justify-end" onClick={onFermer}>
      <div className="absolute inset-0 bg-black/60" />
      <aside
        className="relative z-40 w-full max-w-md h-full bg-space-900 border-l border-space-600 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-space-700">
          <h3 className="titre-sw text-sw-yellow text-sm">Lancer libre</h3>
          <button
            onClick={onFermer}
            className="rounded-lg bg-space-700 hover:bg-space-600 px-3 py-1 text-sm"
          >
            Fermer ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <p className="text-xs text-space-400">
            Composez une réserve à la main — pour un PNJ, un test improvisé ou un
            simple jet de dés. Le résultat rejoint l’historique de la table.
          </p>

          <div className="flex flex-col gap-1.5">
            {ORDRE_DES.map((type) => (
              <LigneDe
                key={type}
                type={type}
                nombre={des[type] ?? 0}
                onChange={(n) => setDes({ ...des, [type]: n })}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={lancer}
              disabled={totalDes === 0}
              className="flex-1 rounded-xl bg-sw-yellow text-black font-bold py-2.5 tracking-wide uppercase
                         hover:brightness-110 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🎲 Lancer {totalDes} dé{totalDes > 1 ? 's' : ''}
            </button>
            <button
              onClick={vider}
              className="rounded-xl border border-space-600 bg-space-800 px-4 text-sm hover:border-sw-yellow transition"
            >
              Vider
            </button>
          </div>

          {resultat && <ResultatLancer resultat={resultat} />}
        </div>
      </aside>

      {animation && <AnimationLancer resultat={animation} onTerminee={terminerAnimation} />}
    </div>
  )
}
