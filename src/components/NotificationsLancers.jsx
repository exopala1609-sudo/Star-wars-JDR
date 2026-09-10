import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import IconeSymbole from './IconeSymbole.jsx'

// Bandeaux discrets annonçant les lancers des AUTRES écrans.
// Celui qui lance voit l'animation complète ; les autres reçoivent
// simplement cette notification, qui n'interrompt jamais leur jeu.
// Un jet secret du MJ n'affiche ni dés ni résultat.

function Pastille({ symbole, texte, fond }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${fond}`}
    >
      <IconeSymbole symbole={symbole} className="h-3.5 w-3.5" />
      {texte}
    </span>
  )
}

function resume(nets) {
  const pastilles = []
  if (nets.succes > 0) {
    pastilles.push(
      <Pastille key="s" symbole="s" texte={nets.succes} fond="bg-green-600/90 text-white" />,
    )
  } else {
    pastilles.push(
      <Pastille
        key="e"
        symbole="e"
        texte={Math.abs(nets.succes)}
        fond="bg-red-700/90 text-white"
      />,
    )
  }
  if (nets.avantages > 0) {
    pastilles.push(
      <Pastille key="a" symbole="a" texte={nets.avantages} fond="bg-sky-600/90 text-white" />,
    )
  } else if (nets.avantages < 0) {
    pastilles.push(
      <Pastille key="m" symbole="m" texte={-nets.avantages} fond="bg-orange-700/90 text-white" />,
    )
  }
  if (nets.triomphes > 0) {
    pastilles.push(
      <Pastille key="t" symbole="t" texte={nets.triomphes} fond="bg-yellow-400 text-black" />,
    )
  }
  if (nets.desastres > 0) {
    pastilles.push(
      <Pastille key="d" symbole="d" texte={nets.desastres} fond="bg-purple-800 text-white" />,
    )
  }
  return pastilles
}

function Bandeau({ lancer, onFermer, onOuvrirHistorique }) {
  // Disparition automatique au bout de 6 secondes
  useEffect(() => {
    const minuteur = setTimeout(onFermer, 6000)
    return () => clearTimeout(minuteur)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lancer.id])

  if (lancer.secret) {
    return (
      <div
        onClick={onFermer}
        className="anim-apparition cursor-pointer rounded-xl border border-sw-or/50 bg-space-900/95 backdrop-blur
                   px-4 py-3 shadow-xl flex items-center gap-3 max-w-xs"
      >
        <span className="text-xl shrink-0">🤫</span>
        <span className="text-sm text-space-200">
          Le MJ a effectué un <span className="font-semibold text-sw-or">jet secret</span>…
        </span>
      </div>
    )
  }

  return (
    <div
      onClick={() => {
        onOuvrirHistorique()
        onFermer()
      }}
      className="anim-apparition cursor-pointer rounded-xl border border-space-600 bg-space-900/95 backdrop-blur
                 px-4 py-3 shadow-xl flex items-start gap-3 max-w-xs hover:border-sw-yellow transition"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-base shrink-0"
        style={{ backgroundColor: lancer.perso?.couleur ?? '#5c6b8f' }}
      >
        {lancer.perso?.emoji ?? '🎲'}
      </span>
      <div className="min-w-0 flex flex-col gap-1.5">
        <div className="text-sm">
          <span className="font-bold text-space-200">{lancer.perso?.nom ?? 'La table'}</span>
          <span className="text-space-400"> · {lancer.competence}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">{resume(lancer.nets)}</div>
      </div>
    </div>
  )
}

export default function NotificationsLancers({ notifications, onRetirer, onOuvrirHistorique }) {
  if (notifications.length === 0) return null

  return createPortal(
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {notifications.map((lancer) => (
        <div key={lancer.id} className="pointer-events-auto">
          <Bandeau
            lancer={lancer}
            onFermer={() => onRetirer(lancer.id)}
            onOuvrirHistorique={onOuvrirHistorique}
          />
        </div>
      ))}
    </div>,
    document.body,
  )
}
