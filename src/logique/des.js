// ============================================================
// MOTEUR DE DÉS NARRATIFS — Star Wars : Aux Confins de l'Empire
//
// Chaque dé est défini par la liste EXACTE de ses faces
// officielles. Une face est un petit objet listant ses symboles :
//   s = Succès      e = Échec
//   a = Avantage    m = Menace
//   t = Triomphe    d = Désastre
//   l = Force lumineuse   o = Force obscure
// Une face vide {} est une face blanche.
// ============================================================

export const TYPES_DES = {
  aptitude: {
    nom: 'Aptitude',
    couleur: 'var(--color-de-aptitude)',
    texte: '#ffffff',
    facettes: 8,
    faces: [
      {},
      { s: 1 },
      { s: 1 },
      { s: 2 },
      { a: 1 },
      { a: 1 },
      { s: 1, a: 1 },
      { a: 2 },
    ],
  },
  maitrise: {
    nom: 'Maîtrise',
    couleur: 'var(--color-de-maitrise)',
    texte: '#1a1a1a',
    facettes: 12,
    faces: [
      {},
      { s: 1 },
      { s: 1 },
      { s: 2 },
      { s: 2 },
      { a: 1 },
      { s: 1, a: 1 },
      { s: 1, a: 1 },
      { s: 1, a: 1 },
      { a: 2 },
      { a: 2 },
      { t: 1 },
    ],
  },
  fortune: {
    nom: 'Fortune',
    couleur: 'var(--color-de-fortune)',
    texte: '#1a1a1a',
    facettes: 6,
    faces: [{}, {}, { s: 1 }, { s: 1, a: 1 }, { a: 2 }, { a: 1 }],
  },
  difficulte: {
    nom: 'Difficulté',
    couleur: 'var(--color-de-difficulte)',
    texte: '#ffffff',
    facettes: 8,
    faces: [
      {},
      { e: 1 },
      { e: 2 },
      { m: 1 },
      { m: 1 },
      { m: 1 },
      { m: 2 },
      { e: 1, m: 1 },
    ],
  },
  defi: {
    nom: 'Défi',
    couleur: 'var(--color-de-defi)',
    texte: '#ffffff',
    facettes: 12,
    faces: [
      {},
      { e: 1 },
      { e: 1 },
      { e: 2 },
      { e: 2 },
      { m: 1 },
      { m: 1 },
      { e: 1, m: 1 },
      { e: 1, m: 1 },
      { m: 2 },
      { m: 2 },
      { d: 1 },
    ],
  },
  infortune: {
    nom: 'Infortune',
    couleur: 'var(--color-de-infortune)',
    texte: '#ffffff',
    facettes: 6,
    faces: [{}, {}, { e: 1 }, { e: 1 }, { m: 1 }, { m: 1 }],
  },
  force: {
    nom: 'Force',
    couleur: 'var(--color-de-force)',
    texte: '#1a1a1a',
    facettes: 12,
    faces: [
      { o: 1 },
      { o: 1 },
      { o: 1 },
      { o: 1 },
      { o: 1 },
      { o: 1 },
      { o: 2 },
      { l: 1 },
      { l: 1 },
      { l: 2 },
      { l: 2 },
      { l: 2 },
    ],
  },
}

// Ordre d'affichage d'une réserve de dés
export const ORDRE_DES = [
  'maitrise',
  'aptitude',
  'fortune',
  'defi',
  'difficulte',
  'infortune',
  'force',
]

export const RESERVE_VIDE = {
  maitrise: 0,
  aptitude: 0,
  fortune: 0,
  difficulte: 0,
  defi: 0,
  infortune: 0,
  force: 0,
}

// Lance toute une réserve. Renvoie :
//  - des : chaque dé lancé avec la face obtenue
//  - totaux : somme brute de chaque symbole
//  - nets : les résultats calculés selon les règles :
//      * les Succès annulent les Échecs (Triomphe = +1 Succès,
//        Désastre = +1 Échec dans ce décompte)
//      * les Avantages annulent les Menaces
//      * Triomphes et Désastres restent affichés séparément,
//        ils ne s'annulent jamais entre eux narrativement
export function lancerReserve(reserve) {
  const des = []
  for (const type of ORDRE_DES) {
    const nombre = reserve[type] ?? 0
    const def = TYPES_DES[type]
    for (let i = 0; i < nombre; i++) {
      const face = def.faces[Math.floor(Math.random() * def.faces.length)]
      des.push({ type, face })
    }
  }

  const totaux = { s: 0, a: 0, t: 0, e: 0, m: 0, d: 0, l: 0, o: 0 }
  for (const { face } of des) {
    for (const [symbole, n] of Object.entries(face)) {
      totaux[symbole] += n
    }
  }

  const netSucces = totaux.s + totaux.t - (totaux.e + totaux.d)
  const netAvantages = totaux.a - totaux.m

  return {
    des,
    totaux,
    nets: {
      succes: netSucces,
      avantages: netAvantages,
      triomphes: totaux.t,
      desastres: totaux.d,
      lumineux: totaux.l,
      obscurs: totaux.o,
      reussite: netSucces > 0,
    },
  }
}

// Libellés et pictogrammes des symboles pour l'affichage
export const SYMBOLES = {
  s: { nom: 'Succès', icone: '✶' },
  a: { nom: 'Avantage', icone: '▲' },
  t: { nom: 'Triomphe', icone: '✪' },
  e: { nom: 'Échec', icone: '✕' },
  m: { nom: 'Menace', icone: '▼' },
  d: { nom: 'Désastre', icone: '⊗' },
  l: { nom: 'Force lumineuse', icone: '○' },
  o: { nom: 'Force obscure', icone: '●' },
}
