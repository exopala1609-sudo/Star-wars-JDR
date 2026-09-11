// ============================================================
// TRACÉS SVG DES SYMBOLES NARRATIFS
//
// Source unique des dessins : ils servent à la fois aux icônes
// de l'interface (IconeSymbole.jsx) et aux textures des dés 3D
// (texturesDes.js). Un seul dessin, deux usages — impossible
// que les deux divergent.
//
// Toutes les formes sont tracées dans un carré de 24 × 24.
// ============================================================

export const TRACES_SYMBOLES = {
  // Succès : éclat stellaire à 4 branches
  s: ['M12 1.5 14.6 9.4 22.5 12 14.6 14.6 12 22.5 9.4 14.6 1.5 12 9.4 9.4Z'],

  // Échec : croix épaisse aux angles biseautés
  e: [
    'M5.2 2.9 12 9.7 18.8 2.9 21.1 5.2 14.3 12 21.1 18.8 18.8 21.1 12 14.3 5.2 21.1 2.9 18.8 9.7 12 2.9 5.2Z',
  ],

  // Avantage : double chevron vers le haut
  a: [
    'M12 2.5 20.5 9.5 17.6 11.9 12 7.3 6.4 11.9 3.5 9.5Z',
    'M12 12 20.5 19 17.6 21.4 12 16.8 6.4 21.4 3.5 19Z',
  ],

  // Menace : double chevron vers le bas
  m: [
    'M12 21.5 3.5 14.5 6.4 12.1 12 16.7 17.6 12.1 20.5 14.5Z',
    'M12 12 3.5 5 6.4 2.6 12 7.2 17.6 2.6 20.5 5Z',
  ],

  // Triomphe : étoile rayonnante à 8 branches, cœur plein
  t: [
    'M12 1 13.6 8.1 19.8 4.2 15.9 10.4 23 12 15.9 13.6 19.8 19.8 13.6 15.9 12 23 10.4 15.9 4.2 19.8 8.1 13.6 1 12 8.1 10.4 4.2 4.2 10.4 8.1Z',
  ],
  tCercles: [{ cx: 12, cy: 12, r: 3.2 }],

  // Désastre : triangle d'alerte avec point d'exclamation évidé
  d: [
    {
      d: 'M12 1.8 23.2 21.4H0.8ZM10.9 8.6h2.2l-0.4 6.2h-1.4Zm1.1 7.6a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7Z',
      regle: 'evenodd',
    },
  ],

  // Force lumineuse : soleil — anneau clair entouré de rayons
  l: [
    {
      d: 'M12 6.4a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2Zm0 2.2a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8Z',
      regle: 'evenodd',
    },
    'M11 0.5h2v3.4h-2Zm0 19.6h2v3.4h-2ZM0.5 11h3.4v2H0.5Zm19.6 0h3.4v2h-3.4ZM3.9 5.3 5.3 3.9l2.4 2.4L6.3 7.7Zm12.4 12.4 1.4-1.4 2.4 2.4-1.4 1.4ZM3.9 18.7l2.4-2.4 1.4 1.4-2.4 2.4Zm12.4-12.4 2.4-2.4 1.4 1.4-2.4 2.4Z',
  ],

  // Force obscure : disque plein cerné d'un halo
  o: [
    {
      d: 'M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6Zm0 1.8a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z',
      opacite: 0.55,
      regle: 'evenodd',
    },
  ],
  oCercles: [{ cx: 12, cy: 12, r: 6 }],
}

// Construit le contenu SVG d'un symbole (chaînes de balises),
// utilisable aussi bien dans du JSX que dans un fichier SVG.
export function balisesSymbole(symbole, couleur = 'currentColor') {
  const traces = TRACES_SYMBOLES[symbole] ?? []
  const cercles = TRACES_SYMBOLES[`${symbole}Cercles`] ?? []

  const chemins = traces.map((trace) => {
    const d = typeof trace === 'string' ? trace : trace.d
    const regle =
      typeof trace === 'object' && trace.regle ? ` fill-rule="${trace.regle}"` : ''
    const opacite =
      typeof trace === 'object' && trace.opacite != null ? ` opacity="${trace.opacite}"` : ''
    return `<path d="${d}" fill="${couleur}"${regle}${opacite}/>`
  })

  const disques = cercles.map(
    (c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${couleur}"/>`,
  )

  return [...chemins, ...disques].join('')
}
