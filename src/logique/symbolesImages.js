import { useEffect, useState } from 'react'
import { UTILISER_MES_SYMBOLES, FICHIERS_SYMBOLES, cheminSymbole } from '../data/texturesDes.js'

// ============================================================
// SYMBOLES PERSONNALISÉS DANS L'INTERFACE
//
// Les images que vous déposez dans public/assets/dice/ servent
// aux dés 3D, mais aussi aux icônes de l'application : aide de
// jeu, badges de résultat, historique. Les joueurs voient ainsi
// partout exactement les mêmes symboles que sur les dés.
//
// Les images sont vérifiées une seule fois au démarrage. Celles
// qui manquent gardent le dessin intégré : rien ne peut donc
// disparaître de l'écran à cause d'un fichier absent.
//
// À l'affichage, l'image sert de pochoir et non d'illustration :
// elle est remplie avec la couleur du texte environnant. Une
// silhouette noire devient donc blanche sur fond sombre, comme
// les icônes dessinées.
// ============================================================

let sondage = null

function sonderLesImages() {
  if (sondage) return sondage

  if (!UTILISER_MES_SYMBOLES) {
    sondage = Promise.resolve(new Set())
    return sondage
  }

  const symboles = Object.keys(FICHIERS_SYMBOLES)
  sondage = Promise.all(
    symboles.map(
      (symbole) =>
        new Promise((resoudre) => {
          const image = new Image()
          image.onload = () => resoudre(symbole)
          image.onerror = () => resoudre(null)
          image.src = cheminSymbole(symbole)
        }),
    ),
  ).then((resultats) => new Set(resultats.filter(Boolean)))

  return sondage
}

// Ensemble des symboles pour lesquels votre image est utilisable.
export function useSymbolesImages() {
  const [disponibles, setDisponibles] = useState(() => new Set())

  useEffect(() => {
    let vivant = true
    sonderLesImages().then((trouves) => vivant && setDisponibles(trouves))
    return () => {
      vivant = false
    }
  }, [])

  return disponibles
}
