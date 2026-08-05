// ============================================================
// ICÔNES SVG DES SYMBOLES NARRATIFS — dessinées main, zéro
// dépendance externe. Chaque icône est tracée en `currentColor`
// et hérite donc automatiquement de la couleur du texte qui
// l'entoure (blanc sur dé violet, noir sur dé jaune, etc.).
// ============================================================

const DESSINS = {
  // Succès : éclat stellaire à 4 branches
  s: (
    <path d="M12 1.5 14.6 9.4 22.5 12 14.6 14.6 12 22.5 9.4 14.6 1.5 12 9.4 9.4Z" />
  ),

  // Échec : croix épaisse aux angles biseautés
  e: (
    <path d="M5.2 2.9 12 9.7 18.8 2.9 21.1 5.2 14.3 12 21.1 18.8 18.8 21.1 12 14.3 5.2 21.1 2.9 18.8 9.7 12 2.9 5.2Z" />
  ),

  // Avantage : double chevron vers le haut
  a: (
    <>
      <path d="M12 2.5 20.5 9.5 17.6 11.9 12 7.3 6.4 11.9 3.5 9.5Z" />
      <path d="M12 12 20.5 19 17.6 21.4 12 16.8 6.4 21.4 3.5 19Z" />
    </>
  ),

  // Menace : double chevron vers le bas
  m: (
    <>
      <path d="M12 21.5 3.5 14.5 6.4 12.1 12 16.7 17.6 12.1 20.5 14.5Z" />
      <path d="M12 12 3.5 5 6.4 2.6 12 7.2 17.6 2.6 20.5 5Z" />
    </>
  ),

  // Triomphe : étoile rayonnante à 8 branches, cœur plein
  t: (
    <>
      <path d="M12 1 13.6 8.1 19.8 4.2 15.9 10.4 23 12 15.9 13.6 19.8 19.8 13.6 15.9 12 23 10.4 15.9 4.2 19.8 8.1 13.6 1 12 8.1 10.4 4.2 4.2 10.4 8.1Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),

  // Désastre : triangle d'alerte avec point d'exclamation évidé
  d: (
    <path
      fillRule="evenodd"
      d="M12 1.8 23.2 21.4H0.8ZM10.9 8.6h2.2l-0.4 6.2h-1.4Zm1.1 7.6a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7Z"
    />
  ),

  // Force lumineuse : soleil — anneau clair entouré de rayons
  l: (
    <>
      <path
        fillRule="evenodd"
        d="M12 6.4a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2Zm0 2.2a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z"
      />
      <path d="M11 0.5h2v3.4h-2Zm0 19.6h2v3.4h-2ZM0.5 11h3.4v2H0.5Zm19.6 0h3.4v2h-3.4ZM3.9 5.3 5.3 3.9l2.4 2.4L6.3 7.7Zm12.4 12.4 1.4-1.4 2.4 2.4-1.4 1.4ZM3.9 18.7l2.4-2.4 1.4 1.4-2.4 2.4Zm12.4-12.4 2.4-2.4 1.4 1.4-2.4 2.4Z" />
    </>
  ),

  // Force obscure : disque plein cerné d'un halo
  o: (
    <>
      <circle cx="12" cy="12" r="6" />
      <path
        fillRule="evenodd"
        d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6Zm0 1.8a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"
        opacity="0.55"
      />
    </>
  ),
}

export default function IconeSymbole({ symbole, className = 'h-4 w-4' }) {
  const dessin = DESSINS[symbole]
  if (!dessin) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {dessin}
    </svg>
  )
}
