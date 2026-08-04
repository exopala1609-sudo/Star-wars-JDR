// Aperçu de la réserve de dés construite pour une compétence.
// Pour l'instant purement visuel — le lancer arrivera au Jalon 2.
const STYLE_DES = {
  maitrise: { fond: 'var(--color-de-maitrise)', texte: '#1a1a1a', nom: 'Maîtrise' },
  aptitude: { fond: 'var(--color-de-aptitude)', texte: '#ffffff', nom: 'Aptitude' },
}

function De({ type }) {
  const s = STYLE_DES[type]
  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold shadow-md"
      style={{ backgroundColor: s.fond, color: s.texte }}
      title={`Dé de ${s.nom}`}
    >
      {s.nom[0]}
    </span>
  )
}

export default function ReserveDesApercu({ competence, carac, reserve }) {
  return (
    <div className="rounded-xl border border-sw-yellow/40 bg-space-800 p-4 flex flex-col gap-3">
      <div className="flex items-baseline justify-between flex-wrap gap-1">
        <span className="font-semibold text-sw-yellow">
          Réserve pour « {competence} »
        </span>
        <span className="text-xs text-space-300">basée sur {carac}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: reserve.maitrise }, (_, i) => (
          <De key={`m${i}`} type="maitrise" />
        ))}
        {Array.from({ length: reserve.aptitude }, (_, i) => (
          <De key={`a${i}`} type="aptitude" />
        ))}
        {reserve.maitrise + reserve.aptitude === 0 && (
          <span className="text-sm text-space-400 italic">Aucun dé (caractéristique à 0)</span>
        )}
      </div>

      <p className="text-xs text-space-400">
        {reserve.maitrise} dé{reserve.maitrise > 1 ? 's' : ''} de Maîtrise (jaune) +{' '}
        {reserve.aptitude} dé{reserve.aptitude > 1 ? 's' : ''} d’Aptitude (vert) — le lancer
        de dés arrive au Jalon 2 !
      </p>
    </div>
  )
}
