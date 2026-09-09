// ============================================================
// PROGRESSION PAR EXPÉRIENCE
//
// Le MJ accorde des points d'expérience à un personnage ; le
// joueur les dépense dans le menu d'améliorations de sa fiche.
// Les achats ne modifient jamais les données d'origine : la
// fiche « effective » est recalculée à la volée, ce qui permet
// au MJ d'annuler des achats sans rien casser.
// ============================================================

const PROGRESSION_VIDE = { xpTotal: 0, ameliorations: [] }

export const progressionDe = (progressions, persoId) => ({
  ...PROGRESSION_VIDE,
  ...(progressions?.[persoId] ?? {}),
})

// Applique les améliorations achetées à une fiche de personnage.
export function personnageEffectif(perso, progression) {
  const achetees = progression?.ameliorations ?? []
  if (achetees.length === 0) return perso

  const competences = { ...perso.competences }
  const talents = [...perso.talents]
  let seuilBlessures = perso.seuilBlessures
  let seuilStress = perso.seuilStress
  let encaissement = perso.encaissement

  for (const id of achetees) {
    const amelioration = (perso.ameliorations ?? []).find((a) => a.id === id)
    if (!amelioration) continue

    if (amelioration.type === 'competence') {
      competences[amelioration.cible] = (competences[amelioration.cible] ?? 0) + 1
    } else if (amelioration.type === 'talent') {
      talents.push({
        nom: amelioration.nom,
        description: amelioration.effetTexte ?? amelioration.description,
        acquis: true,
      })
      seuilBlessures += amelioration.seuilBlessures ?? 0
      seuilStress += amelioration.seuilStress ?? 0
      encaissement += amelioration.encaissement ?? 0
    }
  }

  return { ...perso, competences, talents, seuilBlessures, seuilStress, encaissement }
}

export function xpDepenses(perso, progression) {
  return (progression?.ameliorations ?? []).reduce((total, id) => {
    const amelioration = (perso.ameliorations ?? []).find((a) => a.id === id)
    return total + (amelioration?.cout ?? 0)
  }, 0)
}

export function xpDisponibles(perso, progression) {
  return (progression?.xpTotal ?? 0) - xpDepenses(perso, progression)
}
