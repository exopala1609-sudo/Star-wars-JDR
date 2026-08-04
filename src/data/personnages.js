// ============================================================
// LES 6 PERSONNAGES PRÊTS À JOUER — Kit d'Initiation
// Star Wars : Aux Confins de l'Empire
//
// ⚠️ COMMENT MODIFIER UNE STATISTIQUE :
// Chaque personnage est un bloc ci-dessous. Pour corriger un
// chiffre, il suffit de changer la valeur après les deux-points.
// Exemple : pour passer l'Agilité d'Oskara à 3, remplacez
//   agilite: 4,   par   agilite: 3,
// Les compétences utilisent les identifiants du fichier
// competences.js (colonne "id"). Un rang absent = rang 0.
// ============================================================

export const PERSONNAGES = [
  {
    id: 'oskara',
    nom: 'Oskara',
    espece: 'Twi’lek',
    carriere: 'Chasseuse de primes',
    specialisation: 'Assassin',
    emoji: '🎯',
    couleur: '#2e8b57',
    accroche: 'Tireuse d’élite mortelle et méthodique',
    motivation:
      'Protéger son peuple : elle craint que les machinations de Teemo le Hutt ne finissent par menacer les Twi’leks de Ryloth.',
    obligation:
      'Dette familiale — elle doit réunir de quoi racheter la liberté de sa sœur.',
    caracteristiques: {
      vigueur: 2,
      agilite: 4,
      intelligence: 2,
      ruse: 3,
      volonte: 1,
      presence: 2,
    },
    seuilBlessures: 12,
    seuilStress: 12,
    encaissement: 4,
    defense: { melee: 0, distance: 0 },
    competences: {
      athletisme: 1,
      'sang-froid': 1,
      perception: 1,
      'pilotage-spatial': 1,
      'distance-lourdes': 2,
      discretion: 1,
      vigilance: 1,
      pugilat: 1,
    },
    talents: [
      {
        nom: 'Précision mortelle',
        description: 'Ajoute +10 aux jets de blessures critiques infligées.',
      },
      {
        nom: 'Traqueur',
        description: 'Ajoute un dé de Fortune (bleu) aux tests de Discrétion et de Coordination.',
      },
      {
        nom: 'Cran',
        description: 'Augmente le seuil de stress de 1 (déjà compté).',
      },
    ],
    armes: [
      {
        nom: 'Carabine blaster',
        competence: 'distance-lourdes',
        degats: 9,
        critique: 3,
        portee: 'Moyenne',
        special: 'Paralysante (réglage étourdissant)',
      },
      {
        nom: 'Vibrocouteau',
        competence: 'corps-a-corps',
        degats: 3,
        critique: 2,
        portee: 'Engagé',
        special: 'Perforante 2',
      },
    ],
    equipement: [
      'Armure rembourrée (+2 encaissement, déjà compté)',
      'Jumelles électroniques',
      'Menottes',
      'Comlink',
      '2 stimpacks',
    ],
  },

  {
    id: 'pash',
    nom: 'Pash',
    espece: 'Humain',
    carriere: 'Contrebandier',
    specialisation: 'Pilote',
    emoji: '🚀',
    couleur: '#c0392b',
    accroche: 'Pilote au charme facile et à la gâchette rapide',
    motivation:
      'Liberté : ballotté toute sa vie par les événements, il est bien décidé à reprendre le contrôle de son destin.',
    obligation: 'Dette de jeu envers Teemo le Hutt.',
    caracteristiques: {
      vigueur: 2,
      agilite: 3,
      intelligence: 2,
      ruse: 2,
      volonte: 1,
      presence: 3,
    },
    seuilBlessures: 12,
    seuilStress: 11,
    encaissement: 3,
    defense: { melee: 0, distance: 0 },
    competences: {
      astrogation: 1,
      charme: 2,
      'sang-froid': 1,
      tromperie: 1,
      artillerie: 1,
      'pilotage-spatial': 2,
      'distance-legeres': 2,
      debrouillardise: 1,
      vigilance: 1,
    },
    talents: [
      {
        nom: 'As du manche',
        description: 'Retire un dé d’Infortune (noir) des tests de Pilotage.',
      },
      {
        nom: 'Plein gaz',
        description: 'Peut augmenter temporairement la vitesse maximale de son vaisseau de 1.',
      },
      {
        nom: 'Cran',
        description: 'Augmente le seuil de stress de 1 (déjà compté).',
      },
    ],
    armes: [
      {
        nom: 'Pistolet blaster lourd',
        competence: 'distance-legeres',
        degats: 7,
        critique: 3,
        portee: 'Moyenne',
        special: 'Paralysante (réglage étourdissant)',
      },
    ],
    equipement: [
      'Blouson de pilote',
      'Comlink',
      'Datapad',
      'Dés porte-bonheur',
      '1 stimpack',
    ],
  },

  {
    id: 'lowhhrick',
    nom: 'Lowhhrick',
    espece: 'Wookiee',
    carriere: 'Mercenaire',
    specialisation: 'Maraudeur',
    emoji: '🛡️',
    couleur: '#8b5a2b',
    accroche: 'Colosse au grand cœur, ancien gladiateur d’arène',
    motivation:
      'Vengeance et liberté : réduit en esclavage comme gladiateur par Teemo, il veut faire payer le Hutt et libérer les siens.',
    obligation: 'Prime sur sa tête — esclave évadé.',
    caracteristiques: {
      vigueur: 4,
      agilite: 2,
      intelligence: 2,
      ruse: 2,
      volonte: 2,
      presence: 1,
    },
    seuilBlessures: 18,
    seuilStress: 10,
    encaissement: 6,
    defense: { melee: 0, distance: 0 },
    competences: {
      athletisme: 1,
      coercition: 1,
      'corps-a-corps': 2,
      pugilat: 2,
      resistance: 1,
      perception: 1,
      survie: 1,
      vigilance: 1,
    },
    talents: [
      {
        nom: 'Rage wookiee',
        description:
          'Une fois blessé, inflige +1 dégât en mêlée ; +2 s’il souffre d’une blessure critique.',
      },
      {
        nom: 'Force sauvage',
        description: 'Inflige +1 dégât aux attaques de Corps à corps et de Pugilat (déjà compté).',
      },
      {
        nom: 'Robustesse',
        description: 'Augmente le seuil de blessures de 2 (déjà compté).',
      },
    ],
    armes: [
      {
        nom: 'Vibrohache',
        competence: 'corps-a-corps',
        degats: 8,
        critique: 2,
        portee: 'Engagé',
        special: 'Perforante 2, Vicieuse 1',
      },
      {
        nom: 'Poings',
        competence: 'pugilat',
        degats: 5,
        critique: 5,
        portee: 'Engagé',
        special: 'Assommante',
      },
    ],
    equipement: [
      'Armure de gladiateur (+2 encaissement, déjà compté)',
      'Trophées d’arène',
      '1 stimpack',
    ],
  },

  {
    id: '41-vex',
    nom: '41-VEX',
    espece: 'Droïde',
    carriere: 'Colon',
    specialisation: 'Médecin',
    emoji: '⚕️',
    couleur: '#5dade2',
    accroche: 'Droïde médecin en quête de perfectionnement',
    motivation:
      'Perfectionnement : sa programmation le pousse à acquérir les derniers algorithmes de chirurgie et de médecine.',
    obligation:
      'Considéré comme un bien volé depuis qu’il a quitté sa clinique de Mos Eisley.',
    caracteristiques: {
      vigueur: 2,
      agilite: 2,
      intelligence: 4,
      ruse: 2,
      volonte: 2,
      presence: 1,
    },
    seuilBlessures: 12,
    seuilStress: 12,
    encaissement: 4,
    defense: { melee: 0, distance: 0 },
    competences: {
      medecine: 2,
      mecanique: 1,
      connaissances: 2,
      commandement: 1,
      resistance: 1,
      'sang-froid': 1,
      'distance-legeres': 1,
    },
    talents: [
      {
        nom: 'Chirurgien',
        description: 'Soigne 1 blessure supplémentaire par test de Médecine réussi.',
      },
      {
        nom: 'Droïde',
        description:
          'N’a pas besoin de respirer, manger ni boire ; immunisé contre les poisons, toxines et le vide spatial.',
      },
      {
        nom: 'Cran',
        description: 'Augmente le seuil de stress de 1 (déjà compté).',
      },
    ],
    armes: [
      {
        nom: 'Pistolet blaster léger',
        competence: 'distance-legeres',
        degats: 5,
        critique: 4,
        portee: 'Moyenne',
        special: 'Paralysante (réglage étourdissant)',
      },
      {
        nom: 'Grenade paralysante',
        competence: 'distance-legeres',
        degats: 8,
        critique: '—',
        portee: 'Courte',
        special: 'Étourdissement, Explosion 3',
      },
    ],
    equipement: [
      'Blindage renforcé (+2 encaissement, déjà compté)',
      'Trousse médicale (medpac)',
      'Scanner médical',
      '3 stimpacks',
    ],
  },

  {
    id: 'mathus',
    nom: 'Mathus',
    espece: 'Humain',
    carriere: 'Technicien',
    specialisation: 'Mécano',
    emoji: '🔧',
    couleur: '#e67e22',
    accroche: 'Génie de la mécanique, jamais loin de sa boîte à outils',
    motivation:
      'Créateur : rien ne le rend plus heureux que réparer, bricoler et améliorer des machines.',
    obligation: 'Contrat de travail racheté par Teemo le Hutt — il lui « appartient » légalement.',
    caracteristiques: {
      vigueur: 2,
      agilite: 2,
      intelligence: 4,
      ruse: 2,
      volonte: 2,
      presence: 2,
    },
    seuilBlessures: 12,
    seuilStress: 12,
    encaissement: 3,
    defense: { melee: 0, distance: 0 },
    competences: {
      informatique: 2,
      mecanique: 2,
      astrogation: 1,
      coordination: 1,
      escamotage: 1,
      perception: 1,
      'distance-legeres': 1,
      vigilance: 1,
    },
    talents: [
      {
        nom: 'Fondu de mécanique',
        description: 'Retire un dé d’Infortune (noir) des tests de Mécanique.',
      },
      {
        nom: 'Réparations solides',
        description: 'Répare 1 point de coque supplémentaire sur un véhicule ou vaisseau.',
      },
      {
        nom: 'Bricoleur',
        description: 'Peut ajouter 1 point de personnalisation supplémentaire à un équipement.',
      },
    ],
    armes: [
      {
        nom: 'Pistolet blaster léger',
        competence: 'distance-legeres',
        degats: 5,
        critique: 4,
        portee: 'Moyenne',
        special: 'Paralysante (réglage étourdissant)',
      },
      {
        nom: 'Clé hydraulique',
        competence: 'corps-a-corps',
        degats: 4,
        critique: 5,
        portee: 'Engagé',
        special: 'Déséquilibrante',
      },
    ],
    equipement: [
      'Boîte à outils',
      'Datapad',
      'Pièces détachées',
      'Lunettes de soudure',
      '1 stimpack',
    ],
  },

  {
    id: 'sasha',
    nom: 'Sasha',
    espece: 'Humaine',
    carriere: 'Exploratrice',
    specialisation: 'Débrouillarde',
    emoji: '🧭',
    couleur: '#9b59b6',
    accroche: 'Aventurière curieuse, à l’aise partout dans la galaxie',
    motivation:
      'Découverte : cartographier les mondes inexplorés de la Bordure Extérieure et voir ce que personne n’a jamais vu.',
    obligation:
      'Contrat : la dette de son vaisseau a été rachetée par Teemo le Hutt.',
    caracteristiques: {
      vigueur: 2,
      agilite: 3,
      intelligence: 2,
      ruse: 3,
      volonte: 2,
      presence: 2,
    },
    seuilBlessures: 12,
    seuilStress: 12,
    encaissement: 3,
    defense: { melee: 0, distance: 0 },
    competences: {
      astrogation: 1,
      'sang-froid': 1,
      coordination: 1,
      perception: 2,
      'pilotage-spatial': 1,
      survie: 2,
      debrouillardise: 1,
      'distance-legeres': 1,
      connaissances: 1,
    },
    talents: [
      {
        nom: 'Cartographe galactique',
        description: 'Retire un dé d’Infortune (noir) des tests d’Astrogation.',
      },
      {
        nom: 'Système D',
        description:
          'Retire un dé d’Infortune (noir) des tests de Débrouillardise et de Connaissances (bas-fonds).',
      },
      {
        nom: 'Robustesse',
        description: 'Augmente le seuil de blessures de 2 (déjà compté).',
      },
    ],
    armes: [
      {
        nom: 'Pistolet blaster léger',
        competence: 'distance-legeres',
        degats: 5,
        critique: 4,
        portee: 'Moyenne',
        special: 'Paralysante (réglage étourdissant)',
      },
      {
        nom: 'Vibrocouteau',
        competence: 'corps-a-corps',
        degats: 3,
        critique: 2,
        portee: 'Engagé',
        special: 'Perforante 2',
      },
    ],
    equipement: [
      'Kit de survie',
      'Jumelles',
      'Corde synthétique (20 m)',
      'Rations de voyage',
      'Comlink',
      '1 stimpack',
    ],
  },
]

export const getPersonnage = (id) => PERSONNAGES.find((p) => p.id === id)
