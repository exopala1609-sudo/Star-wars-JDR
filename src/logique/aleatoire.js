// ============================================================
// HASARD CRYPTOGRAPHIQUE
//
// Toute l'aléa des lancers de dés passe par ce fichier — et par
// lui seul. La source d'entropie est l'API Web Crypto du
// navigateur (crypto.getRandomValues), le même générateur que
// celui utilisé pour les clés de chiffrement, et non le
// Math.random() du langage.
//
// ------------------------------------------------------------
// LE PIÈGE DU « BIAIS DE MODULO »
//
// L'API nous donne un entier tiré uniformément entre 0 et
// 2³² − 1, soit 4 294 967 296 valeurs possibles. Pour en faire
// une face de dé, la tentation est d'écrire « valeur % faces ».
//
// C'est faux dès que le nombre de faces ne divise pas
// exactement la plage. Exemple avec un simple octet (256
// valeurs) et un dé à 12 faces :
//   256 = 21 × 12 + 4
// Les faces 1 à 4 sortiraient donc 22 fois sur 256, et les
// faces 5 à 12 seulement 21 fois — soit environ 4,8 % de
// chances en plus pour les quatre premières. Invisible sur
// dix lancers, mesurable sur dix mille.
//
// ------------------------------------------------------------
// LA PARADE : LE TIRAGE AVEC REJET
//
// On ne garde que les valeurs situées sous le plus grand
// multiple du nombre de faces contenu dans la plage, et on
// retire au sort tant qu'on tombe au-dessus. La portion
// « en trop », celle qui déséquilibrerait le reste, est
// simplement écartée.
//
//   plage  = 2³²
//   limite = plage − (plage % faces)   ← plus grand multiple
//   on retire tant que valeur >= limite
//   résultat = valeur % faces          ← désormais équitable
//
// Le coût est négligeable : pour un dé à 12 faces, la
// probabilité de devoir retirer est de 4 sur 4 294 967 296,
// soit moins d'une chance sur un milliard. La boucle se
// termine donc pratiquement toujours au premier tour, et sa
// terminaison est garantie (chaque tirage a une probabilité
// quasi certaine d'être accepté).
// ============================================================

const PLAGE = 2 ** 32

function tirerEntier32() {
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    // On préfère échouer bruyamment plutôt que de retomber en
    // silence sur un hasard de moindre qualité : des dés faussés
    // sans prévenir seraient pires qu'une erreur visible.
    throw new Error(
      'Générateur cryptographique indisponible : ce navigateur ne peut pas lancer les dés de façon équitable.',
    )
  }
  const tampon = new Uint32Array(1)
  crypto.getRandomValues(tampon)
  return tampon[0]
}

// Entier uniforme dans [0, borne[ — le cœur du dispositif.
export function entierAleatoire(borne) {
  if (!Number.isInteger(borne) || borne < 1 || borne > PLAGE) {
    throw new Error(`Borne de tirage invalide : ${borne}`)
  }
  if (borne === 1) return 0

  const limite = PLAGE - (PLAGE % borne)
  let valeur = tirerEntier32()
  while (valeur >= limite) valeur = tirerEntier32()
  return valeur % borne
}

// Lancer d'un dé à N faces : renvoie un entier de 1 à N.
export function lancerDeSecurise(faces) {
  return entierAleatoire(faces) + 1
}

// Tire un élément au hasard dans un tableau (les faces d'un dé).
export function elementAleatoire(tableau) {
  return tableau[entierAleatoire(tableau.length)]
}
