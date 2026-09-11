import { TYPES_DES } from '../logique/des.js'
import IconeSymbole from './IconeSymbole.jsx'

// Affiche le résultat d'un lancer : les dés obtenus face par
// face, puis le bilan net calculé automatiquement.

function FaceDe({ de }) {
  const def = TYPES_DES[de.type]
  const symboles = Object.entries(de.face).flatMap(([sym, n]) =>
    Array.from({ length: n }, (_, i) => <IconeSymbole key={`${sym}${i}`} symbole={sym} />),
  )
  return (
    <span
      className="inline-flex h-9 min-w-9 px-1.5 gap-0.5 items-center justify-center rounded-lg shadow-md border border-black/30"
      style={{ backgroundColor: def.couleur, color: def.texte }}
      title={`Dé de ${def.nom}`}
    >
      {symboles.length > 0 ? symboles : <span className="opacity-50">·</span>}
    </span>
  )
}

function Badge({ symbole, texte, fond, bordure }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${fond} ${bordure ?? ''}`}
    >
      <IconeSymbole symbole={symbole} />
      {texte}
    </span>
  )
}

export default function ResultatLancer({ resultat, compact = false }) {
  const { nets, des } = resultat

  const badges = []
  if (nets.succes > 0) {
    badges.push(
      <Badge
        key="s"
        symbole="s"
        texte={`${nets.succes} Succès net${nets.succes > 1 ? 's' : ''} — Réussite !`}
        fond="bg-green-600/90 text-white"
      />,
    )
  } else {
    // Un jet sans aucun succès net est un échec, même quand
    // succès et échecs se sont exactement annulés.
    const echecs = Math.abs(nets.succes)
    badges.push(
      <Badge
        key="s"
        symbole="e"
        texte={
          echecs === 0
            ? 'Aucun succès — Échec'
            : `${echecs} Échec${echecs > 1 ? 's' : ''} net${echecs > 1 ? 's' : ''} — Échec`
        }
        fond="bg-red-700/90 text-white"
      />,
    )
  }
  if (nets.avantages > 0) {
    badges.push(
      <Badge
        key="a"
        symbole="a"
        texte={`${nets.avantages} Avantage${nets.avantages > 1 ? 's' : ''}`}
        fond="bg-sky-600/90 text-white"
      />,
    )
  } else if (nets.avantages < 0) {
    badges.push(
      <Badge
        key="m"
        symbole="m"
        texte={`${-nets.avantages} Menace${-nets.avantages > 1 ? 's' : ''}`}
        fond="bg-orange-700/90 text-white"
      />,
    )
  }
  if (nets.triomphes > 0) {
    badges.push(
      <Badge
        key="t"
        symbole="t"
        texte={`${nets.triomphes} Triomphe${nets.triomphes > 1 ? 's' : ''} !`}
        fond="bg-yellow-400 text-black"
      />,
    )
  }
  if (nets.desastres > 0) {
    badges.push(
      <Badge
        key="d"
        symbole="d"
        texte={`${nets.desastres} Désastre${nets.desastres > 1 ? 's' : ''} !`}
        fond="bg-purple-800 text-white"
      />,
    )
  }
  if (nets.lumineux > 0) {
    badges.push(
      <Badge key="l" symbole="l" texte={`${nets.lumineux} Force lumineuse`} fond="bg-white text-black" />,
    )
  }
  if (nets.obscurs > 0) {
    badges.push(
      <Badge
        key="o"
        symbole="o"
        texte={`${nets.obscurs} Force obscure`}
        fond="bg-black text-white"
        bordure="border border-space-400"
      />,
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {!compact && (
        <div className="flex flex-wrap gap-1.5">
          {des.map((de, i) => (
            <FaceDe key={i} de={de} />
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">{badges}</div>
    </div>
  )
}
