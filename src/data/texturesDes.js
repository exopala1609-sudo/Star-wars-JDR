import { TYPES_DES } from '../logique/des.js'
import { balisesSymbole } from '../logique/symbolesSvg.js'

// ============================================================
// TEXTURES DES FACES DES DÉS 3D
//
// Vous ne fournissez QUE les symboles — l'application assemble
// les faces elle-même : fond à la couleur du dé, puis le ou les
// symboles correctement dimensionnés et positionnés.
//
// ── POUR UTILISER VOS PROPRES SYMBOLES ──────────────────────
// 1. Déposez vos PNG dans public/assets/dice/ (6 fichiers
//    suffisent, voir le LISEZMOI.txt de ce dossier).
// 2. Passez UTILISER_MES_SYMBOLES à true, juste en dessous.
//
// Un symbole sans image utilise le dessin intégré de
// l'application : vous pouvez donc n'en fournir qu'une partie,
// ou les ajouter au fur et à mesure.
// ============================================================

export const UTILISER_MES_SYMBOLES = false

// Vos images sont recolorées automatiquement pour rester
// lisibles sur chaque dé : un Succès s'affiche en blanc sur le
// dé vert et en noir sur le dé jaune. Fournissez donc des
// silhouettes sur fond transparent — leur couleur d'origine n'a
// pas d'importance.
//
// Si vos images sont déjà coloriées et que vous voulez qu'elles
// soient posées telles quelles, passez ce réglage à false.
export const RECOLORER_LES_SYMBOLES = true

export const DOSSIER_IMAGES = 'assets/dice/'

// Un fichier par symbole. Les deux symboles de Force sont
// facultatifs : sans eux, le dé blanc garde le dessin intégré.
export const FICHIERS_SYMBOLES = {
  s: 'succes.png',
  a: 'avantage.png',
  t: 'triomphe.png',
  e: 'echec.png',
  m: 'menace.png',
  d: 'desastre.png',
  l: 'force_lumineuse.png',
  o: 'force_obscure.png',
}

export const NOMS_SYMBOLES = {
  s: 'Succès',
  a: 'Avantage',
  t: 'Triomphe',
  e: 'Échec',
  m: 'Menace',
  d: 'Désastre',
  l: 'Force lumineuse',
  o: 'Force obscure',
}

// ——— Mise en page d'une face ———
// Le symbole doit tenir dans le cercle central de l'image : les
// coins débordent de la face du dé (surtout sur les triangles)
// et ne seraient pas visibles.
export const COTE_TEXTURE = 256

export function dispositionDeLaFace(face) {
  // Développe { s: 2 } en ['s', 's']
  const symboles = Object.entries(face).flatMap(([s, n]) =>
    Array.from({ length: n }, () => s),
  )
  const centre = COTE_TEXTURE / 2

  if (symboles.length === 0) return []
  if (symboles.length === 1) {
    return [{ symbole: symboles[0], x: centre, y: centre, taille: 152 }]
  }
  // Deux symboles : côte à côte, resserrés pour rester dans le
  // cercle utile.
  const ecart = 50
  return symboles.map((symbole, i) => ({
    symbole,
    x: centre + (i === 0 ? -ecart : ecart),
    y: centre,
    taille: 92,
  }))
}

// Dessin intégré d'un symbole, en blanc sur fond transparent :
// il sert de repli et suit exactement les icônes de l'interface.
export const urlSvgSymbole = (symbole) =>
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${COTE_TEXTURE}" height="${COTE_TEXTURE}" viewBox="0 0 24 24">` +
      balisesSymbole(symbole, '#ffffff') +
      `</svg>`,
  )

export const cheminSymbole = (symbole) =>
  `${import.meta.env.BASE_URL}${DOSSIER_IMAGES}${FICHIERS_SYMBOLES[symbole]}`

// Liste des symboles réellement utilisés par les 7 dés
export function symbolesUtilises() {
  const vus = new Set()
  for (const def of Object.values(TYPES_DES)) {
    for (const face of def.faces) for (const s of Object.keys(face)) vus.add(s)
  }
  return [...vus]
}
