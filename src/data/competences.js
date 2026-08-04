// ============================================================
// LISTE DES COMPÉTENCES — Star Wars : Aux Confins de l'Empire
// Chaque compétence est liée à une caractéristique : c'est ce
// lien qui servira à construire la réserve de dés (Jalon 2).
// ============================================================

export const CARACTERISTIQUES = {
  vigueur: 'Vigueur',
  agilite: 'Agilité',
  intelligence: 'Intelligence',
  ruse: 'Ruse',
  volonte: 'Volonté',
  presence: 'Présence',
}

export const COMPETENCES = [
  // — Compétences générales —
  { id: 'astrogation', nom: 'Astrogation', carac: 'intelligence', groupe: 'generale' },
  { id: 'athletisme', nom: 'Athlétisme', carac: 'vigueur', groupe: 'generale' },
  { id: 'charme', nom: 'Charme', carac: 'presence', groupe: 'generale' },
  { id: 'coercition', nom: 'Coercition', carac: 'volonte', groupe: 'generale' },
  { id: 'commandement', nom: 'Commandement', carac: 'presence', groupe: 'generale' },
  { id: 'coordination', nom: 'Coordination', carac: 'agilite', groupe: 'generale' },
  { id: 'debrouillardise', nom: 'Débrouillardise', carac: 'ruse', groupe: 'generale' },
  { id: 'discipline', nom: 'Discipline', carac: 'volonte', groupe: 'generale' },
  { id: 'discretion', nom: 'Discrétion', carac: 'agilite', groupe: 'generale' },
  { id: 'escamotage', nom: 'Escamotage', carac: 'ruse', groupe: 'generale' },
  { id: 'informatique', nom: 'Informatique', carac: 'intelligence', groupe: 'generale' },
  { id: 'mecanique', nom: 'Mécanique', carac: 'intelligence', groupe: 'generale' },
  { id: 'medecine', nom: 'Médecine', carac: 'intelligence', groupe: 'generale' },
  { id: 'negociation', nom: 'Négociation', carac: 'presence', groupe: 'generale' },
  { id: 'perception', nom: 'Perception', carac: 'ruse', groupe: 'generale' },
  { id: 'pilotage-planetaire', nom: 'Pilotage (planétaire)', carac: 'agilite', groupe: 'generale' },
  { id: 'pilotage-spatial', nom: 'Pilotage (spatial)', carac: 'agilite', groupe: 'generale' },
  { id: 'resistance', nom: 'Résistance', carac: 'vigueur', groupe: 'generale' },
  { id: 'sang-froid', nom: 'Sang-froid', carac: 'presence', groupe: 'generale' },
  { id: 'survie', nom: 'Survie', carac: 'ruse', groupe: 'generale' },
  { id: 'tromperie', nom: 'Tromperie', carac: 'ruse', groupe: 'generale' },
  { id: 'vigilance', nom: 'Vigilance', carac: 'volonte', groupe: 'generale' },
  { id: 'connaissances', nom: 'Connaissances', carac: 'intelligence', groupe: 'generale' },
  // — Compétences de combat —
  { id: 'artillerie', nom: 'Artillerie', carac: 'agilite', groupe: 'combat' },
  { id: 'corps-a-corps', nom: 'Corps à corps', carac: 'vigueur', groupe: 'combat' },
  { id: 'distance-legeres', nom: 'Distance (armes légères)', carac: 'agilite', groupe: 'combat' },
  { id: 'distance-lourdes', nom: 'Distance (armes lourdes)', carac: 'agilite', groupe: 'combat' },
  { id: 'pugilat', nom: 'Pugilat', carac: 'vigueur', groupe: 'combat' },
]

export const getCompetence = (id) => COMPETENCES.find((c) => c.id === id)

// Construit la réserve de dés d'un test de compétence :
// on compare la caractéristique et le rang — le plus petit des
// deux donne le nombre de dés jaunes (Maîtrise), le reste de la
// plus grande valeur donne des dés verts (Aptitude).
export function reserveDeDes(valeurCarac, rangCompetence) {
  const jaunes = Math.min(valeurCarac, rangCompetence)
  const verts = Math.max(valeurCarac, rangCompetence) - jaunes
  return { maitrise: jaunes, aptitude: verts }
}
