import { useState } from 'react'
import { TYPES_DES, ORDRE_DES, lancerReserve } from '../logique/des.js'
import ResultatLancer from './ResultatLancer.jsx'
import AnimationLancer from './AnimationLancer.jsx'

// Constructeur de réserve de dés : pré-rempli automatiquement
// depuis la compétence cliquée (dés jaunes/verts). La réserve
// est PARTAGÉE : le joueur l'ajuste ici, et le MJ peut y
// injecter des dés depuis sa vue — chacun voit les changements
// de l'autre en direct.

function LigneDe({ type, nombre, onChange }) {
  const def = TYPES_DES[type]
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-6 w-6 rounded-md border border-black/30 shrink-0"
        style={{ backgroundColor: def.couleur }}
      />
      <span className="flex-1 text-sm">{def.nom}</span>
      <button
        onClick={() => onChange(Math.max(0, nombre - 1))}
        className="h-7 w-7 rounded-md bg-space-700 hover:bg-space-600 font-bold"
        aria-label={`Retirer un dé de ${def.nom}`}
      >
        −
      </button>
      <span className="w-6 text-center font-bold">{nombre}</span>
      <button
        onClick={() => onChange(nombre + 1)}
        className="h-7 w-7 rounded-md bg-space-700 hover:bg-space-600 font-bold"
        aria-label={`Ajouter un dé de ${def.nom}`}
      >
        +
      </button>
    </div>
  )
}

export default function ConstructeurReserve({ competence, carac, des, onChange, onLancer }) {
  const [resultat, setResultat] = useState(null)
  const [animation, setAnimation] = useState(null)

  const totalDes = Object.values(des).reduce((somme, n) => somme + n, 0)

  // Le tirage est calculé immédiatement, puis mis en scène par
  // l'animation ; le résultat n'est inscrit dans l'historique
  // qu'une fois la mise en scène terminée.
  const lancer = () => setAnimation(lancerReserve(des))

  const terminerAnimation = () => {
    if (!animation) return
    setResultat(animation)
    onLancer(des, animation)
    setAnimation(null)
  }

  return (
    <div className="rounded-xl border border-sw-yellow/40 bg-space-800 p-4 flex flex-col gap-3">
      <div className="flex items-baseline justify-between flex-wrap gap-1">
        <span className="font-semibold text-sw-yellow">Réserve pour « {competence} »</span>
        <span className="text-xs text-space-300">basée sur {carac}</span>
      </div>

      <p className="text-xs text-space-400 -mt-1">
        Réserve visible par le MJ — il peut y ajouter des dés à distance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {ORDRE_DES.map((type) => (
          <LigneDe
            key={type}
            type={type}
            nombre={des[type] ?? 0}
            onChange={(n) => onChange({ ...des, [type]: n })}
          />
        ))}
      </div>

      <button
        onClick={lancer}
        disabled={totalDes === 0}
        className="rounded-xl bg-sw-yellow text-black font-bold py-2.5 text-lg tracking-wide uppercase
                   hover:brightness-110 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        🎲 Lancer {totalDes} dé{totalDes > 1 ? 's' : ''}
      </button>

      {resultat && <ResultatLancer resultat={resultat} />}

      {animation && <AnimationLancer resultat={animation} onTerminee={terminerAnimation} />}
    </div>
  )
}
