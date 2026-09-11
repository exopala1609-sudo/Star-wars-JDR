import { TYPES_DES, ORDRE_DES } from '../logique/des.js'
import { balisesSymbole } from '../logique/symbolesSvg.js'

// ============================================================
// TEXTURES DES FACES DES DÉS 3D
//
// ── POUR UTILISER VOS PROPRES IMAGES ────────────────────────
// 1. Déposez vos PNG dans public/assets/dice/ (voir le
//    LISEZMOI.txt de ce dossier pour la liste exacte des noms).
// 2. Passez UTILISER_IMAGES à true, juste en dessous.
//
// Tant que ce réglage est à false, les faces sont dessinées
// automatiquement à partir des icônes de l'application : les
// dés 3D fonctionnent donc immédiatement, sans aucune image.
// Si une image est manquante ou illisible, la face concernée
// retombe toute seule sur le dessin automatique.
//
// ── ORDRE DES FICHIERS ──────────────────────────────────────
// Chaque liste `images` suit EXACTEMENT l'ordre des faces
// défini dans logique/des.js. Le commentaire en fin de ligne
// rappelle le contenu de la face correspondante.
// ============================================================

export const UTILISER_IMAGES = false

export const DOSSIER_IMAGES = 'assets/dice/'

export const TEXTURES_DES = {
  aptitude: {
    nom: 'Dé vert — Aptitude (8 faces)',
    images: [
      'vert_vide.png', //           face 1 — vide
      'vert_1_succes.png', //       face 2 — 1 succès
      'vert_1_succes.png', //       face 3 — 1 succès
      'vert_2_succes.png', //       face 4 — 2 succès
      'vert_1_avantage.png', //     face 5 — 1 avantage
      'vert_1_avantage.png', //     face 6 — 1 avantage
      'vert_succes_avantage.png', //face 7 — 1 succès + 1 avantage
      'vert_2_avantages.png', //    face 8 — 2 avantages
    ],
  },
  maitrise: {
    nom: 'Dé jaune — Maîtrise (12 faces)',
    images: [
      'jaune_vide.png', //            face 1 — vide
      'jaune_1_succes.png', //        face 2 — 1 succès
      'jaune_1_succes.png', //        face 3 — 1 succès
      'jaune_2_succes.png', //        face 4 — 2 succès
      'jaune_2_succes.png', //        face 5 — 2 succès
      'jaune_1_avantage.png', //      face 6 — 1 avantage
      'jaune_succes_avantage.png', // face 7 — 1 succès + 1 avantage
      'jaune_succes_avantage.png', // face 8 — 1 succès + 1 avantage
      'jaune_succes_avantage.png', // face 9 — 1 succès + 1 avantage
      'jaune_2_avantages.png', //     face 10 — 2 avantages
      'jaune_2_avantages.png', //     face 11 — 2 avantages
      'jaune_triomphe.png', //        face 12 — 1 triomphe
    ],
  },
  fortune: {
    nom: 'Dé bleu — Fortune (6 faces)',
    images: [
      'bleu_vide.png', //             face 1 — vide
      'bleu_vide.png', //             face 2 — vide
      'bleu_1_succes.png', //         face 3 — 1 succès
      'bleu_succes_avantage.png', //  face 4 — 1 succès + 1 avantage
      'bleu_2_avantages.png', //      face 5 — 2 avantages
      'bleu_1_avantage.png', //       face 6 — 1 avantage
    ],
  },
  difficulte: {
    nom: 'Dé violet — Difficulté (8 faces)',
    images: [
      'violet_vide.png', //           face 1 — vide
      'violet_1_echec.png', //        face 2 — 1 échec
      'violet_2_echecs.png', //       face 3 — 2 échecs
      'violet_1_menace.png', //       face 4 — 1 menace
      'violet_1_menace.png', //       face 5 — 1 menace
      'violet_1_menace.png', //       face 6 — 1 menace
      'violet_2_menaces.png', //      face 7 — 2 menaces
      'violet_echec_menace.png', //   face 8 — 1 échec + 1 menace
    ],
  },
  defi: {
    nom: 'Dé rouge — Défi (12 faces)',
    images: [
      'rouge_vide.png', //            face 1 — vide
      'rouge_1_echec.png', //         face 2 — 1 échec
      'rouge_1_echec.png', //         face 3 — 1 échec
      'rouge_2_echecs.png', //        face 4 — 2 échecs
      'rouge_2_echecs.png', //        face 5 — 2 échecs
      'rouge_1_menace.png', //        face 6 — 1 menace
      'rouge_1_menace.png', //        face 7 — 1 menace
      'rouge_echec_menace.png', //    face 8 — 1 échec + 1 menace
      'rouge_echec_menace.png', //    face 9 — 1 échec + 1 menace
      'rouge_2_menaces.png', //       face 10 — 2 menaces
      'rouge_2_menaces.png', //       face 11 — 2 menaces
      'rouge_desastre.png', //        face 12 — 1 désastre
    ],
  },
  infortune: {
    nom: 'Dé noir — Infortune (6 faces)',
    images: [
      'noir_vide.png', //             face 1 — vide
      'noir_vide.png', //             face 2 — vide
      'noir_1_echec.png', //          face 3 — 1 échec
      'noir_1_echec.png', //          face 4 — 1 échec
      'noir_1_menace.png', //         face 5 — 1 menace
      'noir_1_menace.png', //         face 6 — 1 menace
    ],
  },
  force: {
    nom: 'Dé blanc — Force (12 faces)',
    images: [
      'blanc_1_obscur.png', //        face 1 — 1 point obscur
      'blanc_1_obscur.png', //        face 2 — 1 point obscur
      'blanc_1_obscur.png', //        face 3 — 1 point obscur
      'blanc_1_obscur.png', //        face 4 — 1 point obscur
      'blanc_1_obscur.png', //        face 5 — 1 point obscur
      'blanc_1_obscur.png', //        face 6 — 1 point obscur
      'blanc_2_obscurs.png', //       face 7 — 2 points obscurs
      'blanc_1_lumineux.png', //      face 8 — 1 point lumineux
      'blanc_1_lumineux.png', //      face 9 — 1 point lumineux
      'blanc_2_lumineux.png', //      face 10 — 2 points lumineux
      'blanc_2_lumineux.png', //      face 11 — 2 points lumineux
      'blanc_2_lumineux.png', //      face 12 — 2 points lumineux
    ],
  },
}

// ——— Dessin automatique d'une face ———
// Fabrique une image SVG de la face à partir des icônes de
// l'application : fond aux couleurs du dé, symboles centrés.
const COTE = 256

export function svgDeLaFace(type, indexFace) {
  const def = TYPES_DES[type]
  const face = def.faces[indexFace]

  // Développe { s: 2 } en ['s', 's']
  const symboles = Object.entries(face).flatMap(([s, n]) => Array.from({ length: n }, () => s))

  const groupes = symboles.map((symbole, i) => {
    const centre = COTE / 2
    // Un symbole : grand et centré. Deux : côte à côte.
    const echelle = symboles.length === 1 ? 6.4 : 4.3
    const ecart = 56
    const x = symboles.length === 1 ? centre : centre + (i === 0 ? -ecart : ecart)
    return `<g transform="translate(${x} ${centre}) scale(${echelle}) translate(-12 -12)">${balisesSymbole(
      symbole,
      def.texte,
    )}</g>`
  })

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${COTE}" height="${COTE}" viewBox="0 0 ${COTE} ${COTE}">` +
    `<rect width="${COTE}" height="${COTE}" fill="${def.hex}"/>` +
    groupes.join('') +
    `</svg>`
  )
}

export const urlSvgDeLaFace = (type, indexFace) =>
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgDeLaFace(type, indexFace))

export const cheminImage = (type, indexFace) =>
  `${import.meta.env.BASE_URL}${DOSSIER_IMAGES}${TEXTURES_DES[type].images[indexFace]}`

// Contrôle de cohérence : autant d'images déclarées que de faces
export function verifierTextures() {
  const erreurs = []
  for (const type of ORDRE_DES) {
    const attendues = TYPES_DES[type].faces.length
    const declarees = TEXTURES_DES[type]?.images?.length ?? 0
    if (attendues !== declarees) {
      erreurs.push(`${type} : ${declarees} image(s) déclarée(s) pour ${attendues} face(s)`)
    }
  }
  return erreurs
}
