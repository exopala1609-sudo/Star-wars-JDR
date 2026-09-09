// ============================================================
// LES 6 PERSONNAGES PRÊTS À JOUER — Kit d'Initiation
// Star Wars : Aux Confins de l'Empire
//
// ⚠️ COMMENT MODIFIER UNE STATISTIQUE :
// Chaque personnage est un bloc ci-dessous. Pour corriger un
// chiffre, il suffit de changer la valeur après les deux-points.
// Les compétences utilisent les identifiants du fichier
// competences.js (colonne "id"). Un rang absent = rang 0.
//
// ✅ VÉRIFIÉ AVEC LA FICHE PDF : Lowhhrick
// ⏳ EN ATTENTE DE VÉRIFICATION : Oskara, Pash, 41-VEX,
//    Mathus, Sasha — leurs valeurs sont provisoires et leur
//    menu d'améliorations est encore vide.
//
// Le bloc `ameliorations` liste ce que le joueur peut acheter
// avec ses points d'expérience :
//   type 'competence' → +1 rang dans la compétence `cible`
//   type 'talent'     → nouveau talent, avec un effet chiffré
//                       optionnel (seuilBlessures, seuilStress,
//                       encaissement)
// ============================================================

export const PERSONNAGES = [
  {
    id: 'oskara',
    nom: 'Oskara',
    espece: 'Twi’lek',
    carriere: 'Chasseuse de primes',
    specialisation: 'Assassin',
    emoji: '🎯',
    avatar: 'avatars/oskara.png',
    couleur: '#2e8b57',
    verifie: true,
    accroche: 'Tireuse d’élite mortelle et méthodique',
    motivation:
      'Protéger son peuple : elle craint que les machinations de Teemo le Hutt ne finissent par menacer les Twi’leks de Ryloth.',
    obligation: 'Dette familiale — elle doit réunir de quoi racheter la liberté de sa sœur.',
    caracteristiques: {
      vigueur: 2,
      agilite: 4,
      intelligence: 2,
      ruse: 2,
      volonte: 2,
      presence: 3,
    },
    seuilBlessures: 12,
    seuilStress: 13,
    encaissement: 4,
    credits: 400,
    defense: { melee: 0, distance: 0 },
    competences: {
      athletisme: 1,
      informatique: 1,
      perception: 1,
      pilotage: 1,
      tromperie: 1,
      vigilance: 1,
      'distance-lourdes': 2,
    },
    talents: [],
    armes: [
      {
        nom: 'Carabine blaster',
        competence: 'distance-lourdes',
        degats: 9,
        critique: 3,
        portee: 'Moyenne',
      },
      {
        nom: 'Poings',
        competence: 'pugilat',
        degats: 2,
        critique: 5,
        portee: 'Contact',
      },
    ],
    equipement: [
      {
        nom: '2 stimpacks',
        detail: 'Manœuvre : soigne un être vivant de 4 blessures. Usage unique.',
      },
      { nom: 'Comlink', detail: 'Permet de communiquer à distance.' },
      { nom: '2 paires de menottes', detail: 'Permettent d’entraver les mains d’un individu.' },
      {
        nom: 'Datapad',
        detail: 'Ordinateur de poche, permet d’accéder aux systèmes informatiques.',
      },
      { nom: 'Armure matelassée', detail: 'Encaissement 2 (déjà inclus)' },
    ],
    ameliorations: [
      {
        id: 'mecanique',
        type: 'competence',
        cible: 'mecanique',
        nom: 'Compétence Mécanique',
        cout: 5,
        description:
          'Vous améliorez votre compétence Mécanique et gagnez 1 rang. Votre réserve de dés passe de 2 Aptitudes à 1 Maîtrise et 1 Aptitude.',
      },
      {
        id: 'artillerie',
        type: 'competence',
        cible: 'artillerie',
        nom: 'Compétence Artillerie',
        cout: 10,
        description:
          'Vous améliorez votre compétence Artillerie et gagnez 1 rang. Votre réserve de dés passe de 4 Aptitudes à 1 Maîtrise et 3 Aptitudes.',
      },
      {
        id: 'armes-en-main',
        type: 'talent',
        nom: 'Armes en main',
        cout: 5,
        description:
          'Vous gagnez le talent Armes en main. Une fois par round, vous pouvez dégainer ou rengainer une arme, ou sortir ou ranger un objet accessible, au prix d’une broutille (sans exécuter de manœuvre).',
        effetTexte:
          'Une fois par round, dégainer/rengainer une arme ou sortir/ranger un objet accessible ne coûte qu’une broutille.',
      },
      {
        id: 'bout-portant',
        type: 'talent',
        nom: 'Bout portant',
        cout: 5,
        description:
          'Vous gagnez le talent Bout portant. Quand vous touchez une cible au contact ou à portée courte avec votre carabine blaster, un pistolet ou fusil blaster, ou une grenade, vous infligez +1 point de dégâts.',
        effetTexte:
          'Au contact ou à portée courte, vos tirs de carabine, pistolet, fusil blaster ou grenade infligent +1 point de dégâts.',
      },
    ],
  },

  {
    id: 'pash',
    nom: 'Pash',
    espece: 'Humain',
    carriere: 'Contrebandier',
    specialisation: 'Pilote',
    emoji: '🚀',
    avatar: 'avatars/pash.png',
    couleur: '#c0392b',
    verifie: true,
    accroche: 'Pilote au charme facile et à la gâchette rapide',
    motivation:
      'Liberté : ballotté toute sa vie par les événements, il est bien décidé à reprendre le contrôle de son destin.',
    obligation: 'Dette de jeu envers Teemo le Hutt.',
    caracteristiques: {
      vigueur: 3,
      agilite: 3,
      intelligence: 2,
      ruse: 3,
      volonte: 2,
      presence: 3,
    },
    seuilBlessures: 13,
    seuilStress: 12,
    encaissement: 4,
    credits: 400,
    defense: { melee: 0, distance: 0 },
    competences: {
      charme: 1,
      perception: 1,
      pilotage: 2,
      tromperie: 1,
      vigilance: 1,
      'distance-legeres': 1,
    },
    talents: [],
    armes: [
      {
        nom: 'Pistolet blaster',
        competence: 'distance-legeres',
        degats: 6,
        critique: 4,
        portee: 'Moyenne',
      },
      {
        nom: 'Poings',
        competence: 'pugilat',
        degats: 3,
        critique: 5,
        portee: 'Contact',
      },
    ],
    equipement: [
      {
        nom: '2 stimpacks',
        detail: 'Manœuvre : soigne un être vivant de 4 blessures. Usage unique.',
      },
      { nom: 'Comlink', detail: 'Permet de communiquer à distance.' },
      { nom: 'Vêtements épais', detail: 'Encaissement 1 (déjà inclus)' },
    ],
    ameliorations: [
      {
        id: 'tromperie',
        type: 'competence',
        cible: 'tromperie',
        nom: 'Compétence Tromperie',
        cout: 10,
        description:
          'Vous améliorez votre compétence Tromperie et gagnez 1 rang. Votre réserve de dés passe de 1 Maîtrise et 2 Aptitudes à 2 Maîtrises et 1 Aptitude.',
      },
      {
        id: 'magouilles',
        type: 'competence',
        cible: 'magouilles',
        nom: 'Compétence Magouilles',
        cout: 5,
        description:
          'Vous améliorez votre compétence Magouilles et gagnez 1 rang. Votre réserve de dés passe de 3 Aptitudes à 1 Maîtrise et 2 Aptitudes.',
      },
      {
        id: 'armes-en-main',
        type: 'talent',
        nom: 'Armes en main',
        cout: 5,
        description:
          'Vous gagnez le talent Armes en main. Une fois par round, vous pouvez dégainer ou rengainer une arme, ou sortir ou ranger un objet accessible, au prix d’une broutille (sans exécuter de manœuvre).',
        effetTexte:
          'Une fois par round, dégainer/rengainer une arme ou sortir/ranger un objet accessible ne coûte qu’une broutille.',
      },
      {
        id: 'pilote-chevronne',
        type: 'talent',
        nom: 'Pilote chevronné',
        cout: 5,
        description:
          'Vous gagnez le talent Pilote chevronné. Chaque fois que vous effectuez un test de Pilotage, retirez d’abord 1 dé d’Infortune de la réserve. Par exemple, si vous pilotez un véhicule assorti d’une maniabilité de −1, vous ne subissez aucun malus aux tests de Pilotage.',
        effetTexte:
          'Retire 1 dé d’Infortune (noir) de chaque test de Pilotage, avant tout autre effet.',
      },
    ],
  },

  {
    id: 'lowhhrick',
    nom: 'Lowhhrick',
    espece: 'Wookiee',
    carriere: 'Mercenaire',
    specialisation: 'Maraudeur',
    emoji: '🛡️',
    avatar: 'avatars/lowhhrick.png',
    couleur: '#8b5a2b',
    verifie: true,
    accroche: 'Colosse au grand cœur, ancien gladiateur d’arène',
    motivation:
      'Vengeance et liberté : réduit en esclavage comme gladiateur par Teemo, il veut faire payer le Hutt et libérer les siens.',
    obligation: 'Prime sur sa tête — esclave évadé.',
    caracteristiques: {
      vigueur: 4,
      agilite: 3,
      intelligence: 2,
      ruse: 2,
      volonte: 2,
      presence: 2,
    },
    seuilBlessures: 18,
    seuilStress: 10,
    encaissement: 4,
    credits: 400,
    defense: { melee: 0, distance: 0 },
    competences: {
      athletisme: 1,
      'sang-froid': 1,
      vigilance: 1,
      artillerie: 1,
      'corps-a-corps': 1,
      'distance-legeres': 1,
      pugilat: 1,
    },
    talents: [
      {
        nom: 'Rage wookiee',
        description:
          'Quand vous êtes blessé, vos attaques de Corps à corps et de Pugilat infligent +1 dégât. Quand vous avez au moins 1 blessure critique, elles infligent +2 dégâts.',
      },
    ],
    armes: [
      {
        nom: 'Vibrohache',
        competence: 'corps-a-corps',
        degats: 7,
        formuleDegats: 'Vigueur + 3',
        critique: 3,
        portee: 'Contact',
        special:
          'Perforant 2 : l’encaissement de la cible est diminué de 2 points contre cette attaque.',
      },
      {
        nom: 'Pistolet blaster',
        competence: 'distance-legeres',
        degats: 6,
        critique: 3,
        portee: 'Moyenne',
      },
      {
        nom: 'Poings',
        competence: 'pugilat',
        degats: 4,
        critique: 5,
        portee: 'Contact',
      },
    ],
    equipement: [
      {
        nom: '2 stimpacks',
        detail: 'Manœuvre : soigne un être vivant de 4 blessures. Usage unique.',
      },
      { nom: 'Comlink', detail: 'Permet de communiquer à distance.' },
    ],
    ameliorations: [
      {
        id: 'coercition',
        type: 'competence',
        cible: 'coercition',
        nom: 'Compétence Coercition',
        cout: 10,
        description:
          'Vous améliorez votre compétence Coercition et gagnez 1 rang. Votre réserve de dés passe de 2 Aptitudes à 1 Maîtrise et 1 Aptitude.',
      },
      {
        id: 'corps-a-corps',
        type: 'competence',
        cible: 'corps-a-corps',
        nom: 'Compétence Corps à corps',
        cout: 10,
        description:
          'Vous améliorez votre compétence Corps à corps et gagnez 1 rang. Votre réserve de dés passe de 1 Maîtrise et 3 Aptitudes à 2 Maîtrises et 2 Aptitudes.',
      },
      {
        id: 'endurci',
        type: 'talent',
        nom: 'Endurci',
        cout: 5,
        seuilBlessures: 1,
        description:
          'Vous gagnez le talent Endurci. Votre seuil de blessures augmente de 1 point, passant de 18 à 19.',
        effetTexte: 'Augmente le seuil de blessures de 1 (déjà compté).',
      },
      {
        id: 'force-surhumaine',
        type: 'talent',
        nom: 'Force surhumaine',
        cout: 5,
        description:
          'Vous gagnez le talent Force surhumaine. Quand vous touchez une cible avec une arme de corps à corps ou de pugilat, vous infligez +1 point de dégâts.',
        effetTexte:
          'Quand vous touchez une cible avec une arme de Corps à corps ou de Pugilat, vous infligez +1 point de dégâts.',
      },
    ],
  },

  {
    id: '41-vex',
    nom: '41-VEX',
    espece: 'Droïde',
    carriere: 'Colon',
    specialisation: 'Médecin',
    emoji: '⚕️',
    avatar: 'avatars/41-vex.png',
    couleur: '#5dade2',
    verifie: true,
    accroche: 'Droïde médecin en quête de perfectionnement',
    motivation:
      'Perfectionnement : sa programmation le pousse à acquérir les derniers algorithmes de chirurgie et de médecine.',
    obligation: 'Considéré comme un bien volé depuis qu’il a quitté sa clinique de Mos Eisley.',
    caracteristiques: {
      vigueur: 2,
      agilite: 2,
      intelligence: 4,
      ruse: 1,
      volonte: 1,
      presence: 2,
    },
    seuilBlessures: 12,
    seuilStress: 11,
    encaissement: 3,
    credits: 400,
    defense: { melee: 0, distance: 0 },
    competences: {
      calme: 1,
      charme: 1,
      connaissance: 1,
      mecanique: 1,
      medecine: 2,
      negociation: 1,
      resistance: 1,
    },
    talents: [
      {
        nom: 'Médipack',
        description:
          'Une fois par rencontre, il vous permet d’utiliser votre compétence Médecine pour soigner un allié sans malus. Le test est Facile (1 dé de Difficulté) si les blessures du patient sont inférieures ou égales à la moitié de son seuil, Moyen (2 dés) si elles sont supérieures à cette moitié, et Difficile (3 dés) si elles dépassent le seuil. Vous soignez 1 blessure par Succès et 1 point de stress par Avantage. Une fois durant l’aventure, vous pouvez soigner 1 blessure critique ; la difficulté dépend de la blessure en question.',
      },
    ],
    armes: [
      {
        nom: 'Blaster léger',
        competence: 'distance-legeres',
        degats: 5,
        critique: 4,
        portee: 'Moyenne',
      },
      {
        nom: 'Grenade étourdissante (×3)',
        competence: 'distance-legeres',
        degats: 8,
        critique: '—',
        portee: 'Courte',
        special:
          'Dégâts étourdissants, convertis en points de stress. 2 Avantages pour Souffle 8 : tous les personnages au contact de la cible subissent 8 dégâts étourdissants. Usage unique.',
      },
      {
        nom: 'Poings',
        competence: 'pugilat',
        degats: 2,
        critique: 5,
        portee: 'Contact',
      },
    ],
    equipement: [
      {
        nom: '2 trousses de réparation d’urgence',
        detail: 'Manœuvre : soigne un droïde de 4 blessures. Usage unique.',
      },
      {
        nom: 'Médipack',
        detail: 'Permet de soigner les êtres organiques avec la compétence Médecine.',
      },
      { nom: 'Comlink', detail: 'Permet de communiquer à distance.' },
      {
        nom: 'Châssis de droïde',
        detail: 'Plaques blindées : 1 point d’encaissement (déjà inclus)',
      },
    ],
    ameliorations: [
      {
        id: 'negociation',
        type: 'competence',
        cible: 'negociation',
        nom: 'Compétence Négociation',
        cout: 10,
        description:
          'Vous améliorez votre compétence Négociation et gagnez 1 rang. Votre réserve de dés passe de 1 Maîtrise et 1 Aptitude à 2 Maîtrises.',
      },
      {
        id: 'distance-legeres',
        type: 'competence',
        cible: 'distance-legeres',
        nom: 'Compétence Distance (armes légères)',
        cout: 10,
        description:
          'Vous améliorez votre compétence Distance (armes légères) et gagnez 1 rang. Votre réserve de dés passe de 2 Aptitudes à 1 Maîtrise et 1 Aptitude.',
      },
      {
        id: 'robustesse',
        type: 'talent',
        nom: 'Robustesse',
        cout: 5,
        seuilStress: 1,
        description:
          'Vous gagnez le talent Robustesse. Votre seuil de stress augmente de 1 point, passant de 11 à 12.',
        effetTexte: 'Augmente le seuil de stress de 1 (déjà compté).',
      },
      {
        id: 'chirurgien',
        type: 'talent',
        nom: 'Chirurgien',
        cout: 5,
        description:
          'Vous gagnez le talent Chirurgien. Quand vous effectuez un test de Médecine pour aider un personnage à soigner des blessures, celui-ci récupère 1 blessure de plus.',
        effetTexte:
          'Un test de Médecine réussi pour soigner un personnage lui fait récupérer 1 blessure de plus.',
      },
    ],
  },

  {
    id: 'mathus',
    nom: 'Mathus',
    espece: 'Humain',
    carriere: 'Technicien',
    specialisation: 'Mécano',
    emoji: '🔧',
    avatar: 'avatars/mathus.png',
    couleur: '#e67e22',
    verifie: true,
    accroche: 'Génie de la mécanique, jamais loin de sa boîte à outils',
    motivation:
      'Créateur : rien ne le rend plus heureux que réparer, bricoler et améliorer des machines.',
    obligation: 'Contrat de travail racheté par Teemo le Hutt — il lui « appartient » légalement.',
    caracteristiques: {
      vigueur: 3,
      agilite: 2,
      intelligence: 4,
      ruse: 2,
      volonte: 2,
      presence: 2,
    },
    seuilBlessures: 13,
    seuilStress: 12,
    encaissement: 4,
    credits: 400,
    defense: { melee: 0, distance: 0 },
    competences: {
      astrogation: 1,
      athletisme: 1,
      connaissance: 1,
      informatique: 1,
      magouilles: 1,
      mecanique: 2,
      pilotage: 1,
      vigilance: 1,
      pugilat: 1,
    },
    talents: [],
    armes: [
      {
        nom: 'Gants à décharge',
        competence: 'pugilat',
        degats: 3,
        critique: 5,
        portee: 'Contact',
        special:
          '2 Avantages : inflige 3 points de stress en ignorant l’encaissement de la cible.',
      },
      {
        nom: 'Blaster de poche',
        competence: 'distance-legeres',
        degats: 5,
        critique: 4,
        portee: 'Courte',
      },
    ],
    equipement: [
      {
        nom: '2 stimpacks',
        detail: 'Manœuvre : soigne un être vivant de 4 blessures. Usage unique.',
      },
      { nom: 'Comlink', detail: 'Permet de communiquer à distance.' },
      { nom: 'Vêtements épais', detail: 'Encaissement 1 (déjà inclus)' },
      {
        nom: 'Datapad',
        detail: 'Ordinateur de poche, permet d’accéder aux systèmes informatiques.',
      },
      {
        nom: 'Trousse de réparation d’urgence',
        detail: 'Manœuvre : soigne un droïde de 4 blessures. Usage unique.',
      },
      {
        nom: 'Trousse à outils',
        detail:
          'Permet de réparer les appareils mécaniques et de « soigner » les droïdes avec la compétence Mécanique.',
      },
    ],
    ameliorations: [
      {
        id: 'perception',
        type: 'competence',
        cible: 'perception',
        nom: 'Compétence Perception',
        cout: 5,
        description:
          'Vous améliorez votre compétence Perception et gagnez 1 rang. Votre réserve de dés passe de 2 Aptitudes à 1 Maîtrise et 1 Aptitude.',
      },
      {
        id: 'pugilat',
        type: 'competence',
        cible: 'pugilat',
        nom: 'Compétence Pugilat',
        cout: 10,
        description:
          'Vous améliorez votre compétence Pugilat et gagnez 1 rang. Votre réserve de dés passe de 1 Maîtrise et 2 Aptitudes à 2 Maîtrises et 1 Aptitude.',
      },
      {
        id: 'endurci',
        type: 'talent',
        nom: 'Endurci',
        cout: 5,
        seuilBlessures: 1,
        description:
          'Vous gagnez le talent Endurci. Votre seuil de blessures augmente de 1 point, passant de 13 à 14.',
        effetTexte: 'Augmente le seuil de blessures de 1 (déjà compté).',
      },
      {
        id: 'mecanicien-precision',
        type: 'talent',
        nom: 'Mécanicien de précision',
        cout: 5,
        description:
          'Vous gagnez le talent Mécanicien de précision. Quand vous effectuez une action réparant le stress mécanique d’un vaisseau ou d’un véhicule, celui-ci élimine 1 point de stress mécanique en plus.',
        effetTexte:
          'Une action réparant le stress mécanique d’un vaisseau ou véhicule en élimine 1 point de plus.',
      },
    ],
  },

  {
    id: 'sasha',
    nom: 'Sasha',
    espece: 'Humaine',
    carriere: 'Exploratrice',
    specialisation: 'Débrouillarde',
    emoji: '🧭',
    avatar: 'avatars/sasha.png',
    couleur: '#9b59b6',
    verifie: false,
    accroche: 'Aventurière curieuse, à l’aise partout dans la galaxie',
    motivation:
      'Découverte : cartographier les mondes inexplorés de la Bordure Extérieure et voir ce que personne n’a jamais vu.',
    obligation: 'Contrat : la dette de son vaisseau a été rachetée par Teemo le Hutt.',
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
    credits: 500,
    defense: { melee: 0, distance: 0 },
    competences: {
      astrogation: 1,
      calme: 1,
      coordination: 1,
      perception: 2,
      pilotage: 1,
      survie: 2,
      'systeme-d': 1,
      'distance-legeres': 1,
      connaissance: 1,
    },
    talents: [
      {
        nom: 'Cartographe galactique',
        description: 'Retire un dé d’Infortune (noir) des tests d’Astrogation.',
      },
      {
        nom: 'Système D',
        description:
          'Retire un dé d’Infortune (noir) des tests de Système D et de Connaissance (bas-fonds).',
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
        portee: 'Contact',
        special: 'Perforant 2',
      },
    ],
    equipement: [
      { nom: 'Kit de survie' },
      { nom: 'Jumelles' },
      { nom: 'Corde synthétique (20 m)' },
      { nom: 'Rations de voyage' },
      { nom: 'Comlink', detail: 'Permet de communiquer à distance.' },
      { nom: '1 stimpack', detail: 'Manœuvre : soigne des blessures. Usage unique.' },
    ],
    ameliorations: [],
  },
]

export const getPersonnage = (id) => PERSONNAGES.find((p) => p.id === id)
