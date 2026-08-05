// ============================================================
// GABARITS D'ADVERSAIRES — Kit d'Initiation « Aux Confins de
// l'Empire » (évasion de Mos Shuuta).
//
// ⚠️ COMMENT MODIFIER OU AJOUTER UN GABARIT :
// Chaque bloc ci-dessous est un ennemi prêt à poser sur la
// table. Changez simplement les valeurs après les deux-points,
// ou copiez un bloc entier pour créer votre propre adversaire.
//   rang         : 'sbire', 'rival' ou 'nemesis'
//   seuilBlessures / encaissement / defense : les chiffres de
//                  sa fiche
//   aptitude / maitrise : les dés verts et jaunes de son jet
//                  d'initiative
// Tout reste modifiable à la volée dans la Vue MJ.
// ============================================================

export const GABARITS_ADVERSAIRES = [
  {
    id: 'garde-gamorreen',
    nom: 'Garde gamorréen',
    rang: 'sbire',
    emoji: '🐗',
    seuilBlessures: 5,
    encaissement: 4,
    defense: 0,
    aptitude: 2,
    maitrise: 0,
    notes: 'Vibro-hache (dégâts 8, crit. 2, Vicieuse 1) · Brutal mais lent',
  },
  {
    id: 'vigile',
    nom: 'Vigile de Mos Shuuta',
    rang: 'sbire',
    emoji: '🥷',
    seuilBlessures: 4,
    encaissement: 3,
    defense: 0,
    aptitude: 2,
    maitrise: 0,
    notes: 'Pistolet blaster (dégâts 6, crit. 3, portée moyenne)',
  },
  {
    id: 'stormtrooper',
    nom: 'Soldat impérial',
    rang: 'sbire',
    emoji: '🪖',
    seuilBlessures: 5,
    encaissement: 4,
    defense: 0,
    aptitude: 2,
    maitrise: 0,
    notes: 'Fusil blaster (dégâts 9, crit. 3) · Armure de stormtrooper',
  },
  {
    id: 'chasseur-primes',
    nom: 'Chasseur de primes trandoshan',
    rang: 'rival',
    emoji: '🦎',
    seuilBlessures: 12,
    encaissement: 4,
    defense: 1,
    aptitude: 3,
    maitrise: 1,
    notes: 'Carabine blaster (dégâts 9, crit. 3) · Régénération, griffes',
  },
]

// Adversaire vierge, à remplir entièrement à la main
export const GABARIT_VIERGE = {
  id: 'personnalise',
  nom: 'Nouvel adversaire',
  rang: 'sbire',
  emoji: '👾',
  seuilBlessures: 5,
  encaissement: 3,
  defense: 0,
  aptitude: 2,
  maitrise: 0,
  notes: '',
}

export const LIBELLES_RANG = {
  sbire: 'Sbire',
  rival: 'Rival',
  nemesis: 'Némésis',
}
