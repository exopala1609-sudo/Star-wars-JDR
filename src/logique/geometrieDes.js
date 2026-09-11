import * as THREE from 'three'

// ============================================================
// GÉOMÉTRIE DES DÉS 3D
//
// Construit les trois solides dont nous avons besoin — cube
// (d6), octaèdre (d8) et dodécaèdre (d12) — avec pour chacun :
//
//   • une face = un matériau = une texture distincte
//   • une normale connue par face, pour savoir laquelle pointe
//     vers le haut (et pour y amener celle qu'on veut)
//   • la liste des sommets et des faces pour le moteur physique
//   • le rayon intérieur, c'est-à-dire la hauteur exacte à
//     laquelle le dé repose sur le tapis
//
// Tout est calculé, rien n'est recopié à la main : les faces
// sont déduites des sommets et des directions de normales, et
// leur orientation est corrigée automatiquement. Une erreur de
// saisie est donc impossible.
// ============================================================

const PHI = (1 + Math.sqrt(5)) / 2

// ——— Sommets et directions de faces des trois solides ———

const CUBE_SOMMETS = []
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CUBE_SOMMETS.push([x, y, z])
const CUBE_NORMALES = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
]

const OCTAEDRE_SOMMETS = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
]
const OCTAEDRE_NORMALES = []
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) OCTAEDRE_NORMALES.push([x, y, z])

const DODECAEDRE_SOMMETS = [
  ...CUBE_SOMMETS,
  [0, 1 / PHI, PHI], [0, 1 / PHI, -PHI], [0, -1 / PHI, PHI], [0, -1 / PHI, -PHI],
  [1 / PHI, PHI, 0], [1 / PHI, -PHI, 0], [-1 / PHI, PHI, 0], [-1 / PHI, -PHI, 0],
  [PHI, 0, 1 / PHI], [PHI, 0, -1 / PHI], [-PHI, 0, 1 / PHI], [-PHI, 0, -1 / PHI],
]
// Les 12 faces d'un dodécaèdre regardent dans les 12 directions
// des sommets de l'icosaèdre DUAL. Attention à l'ordre des
// coordonnées : c'est (0, ±φ, ±1) et ses permutations, et non
// (0, ±1, ±φ) — l'inverse donnerait des faces non planes.
const DODECAEDRE_NORMALES = [
  [0, PHI, 1], [0, PHI, -1], [0, -PHI, 1], [0, -PHI, -1],
  [PHI, 1, 0], [PHI, -1, 0], [-PHI, 1, 0], [-PHI, -1, 0],
  [1, 0, PHI], [-1, 0, PHI], [1, 0, -PHI], [-1, 0, -PHI],
]

// ——— Regroupe les sommets par face, dans l'ordre ———
// Pour chaque direction de normale, on retient les sommets les
// plus éloignés dans cette direction (ils sont coplanaires),
// puis on les trie angulairement autour de la normale : ils
// tournent alors dans le sens direct vu de l'extérieur.
function facesDepuisNormales(sommets, normales, sommetsParFace) {
  const points = sommets.map((s) => new THREE.Vector3(...s))

  return normales.map((n) => {
    const normale = new THREE.Vector3(...n).normalize()
    const distances = points.map((p, i) => ({ i, d: p.dot(normale) }))
    distances.sort((a, b) => b.d - a.d)
    const retenus = distances.slice(0, sommetsParFace).map((x) => x.i)

    const centre = retenus
      .reduce((acc, i) => acc.add(points[i]), new THREE.Vector3())
      .multiplyScalar(1 / retenus.length)

    // Repère tangent au plan de la face
    const tangente = points[retenus[0]].clone().sub(centre).normalize()
    const bitangente = new THREE.Vector3().crossVectors(normale, tangente)

    retenus.sort((a, b) => {
      const angle = (i) => {
        const d = points[i].clone().sub(centre)
        return Math.atan2(d.dot(bitangente), d.dot(tangente))
      }
      return angle(a) - angle(b)
    })

    return { indices: retenus, normale, centre }
  })
}

// ——— Construit la géométrie Three.js ———
// Chaque face est découpée en éventail depuis son centre, avec
// ses propres coordonnées de texture et son propre groupe de
// matériau. Le rayon INTÉRIEUR de la face (distance du centre
// au milieu d'un côté) est mis à l'échelle de la texture : le
// symbole dessiné au centre est ainsi toujours entièrement
// visible sur la face, quel que soit le nombre de côtés.
function construireGeometrie(sommets, faces) {
  const points = sommets.map((s) => new THREE.Vector3(...s))
  const positions = []
  const normalesSommets = []
  const uvs = []
  const geometrie = new THREE.BufferGeometry()
  let debut = 0

  faces.forEach((face, indexFace) => {
    const { indices, normale, centre } = face
    const pts = indices.map((i) => points[i])

    const tangente = pts[0].clone().sub(centre).normalize()
    const bitangente = new THREE.Vector3().crossVectors(normale, tangente)
    const projeter = (p) => {
      const d = p.clone().sub(centre)
      return new THREE.Vector2(d.dot(tangente), d.dot(bitangente))
    }
    const plans = pts.map(projeter)

    // Rayon intérieur du polygone projeté : distance du centre
    // au milieu du côté le plus proche.
    const rayonInterieur = Math.min(
      ...plans.map((p, i) => p.clone().add(plans[(i + 1) % plans.length]).multiplyScalar(0.5).length()),
    )
    const enUv = (v) =>
      new THREE.Vector2(0.5 + (v.x / rayonInterieur) * 0.45, 0.5 + (v.y / rayonInterieur) * 0.45)

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i]
      const b = pts[(i + 1) % pts.length]
      const uvA = enUv(plans[i])
      const uvB = enUv(plans[(i + 1) % plans.length])

      positions.push(centre.x, centre.y, centre.z, a.x, a.y, a.z, b.x, b.y, b.z)
      uvs.push(0.5, 0.5, uvA.x, uvA.y, uvB.x, uvB.y)
      for (let k = 0; k < 3; k++) normalesSommets.push(normale.x, normale.y, normale.z)
    }

    const compte = pts.length * 3
    geometrie.addGroup(debut, compte, indexFace)
    debut += compte
  })

  geometrie.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometrie.setAttribute('normal', new THREE.Float32BufferAttribute(normalesSommets, 3))
  geometrie.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  return geometrie
}

// ——— Assemblage d'un solide complet ———
function construireSolide(sommetsBruts, normales, sommetsParFace, taille) {
  // Normalisation : tous les sommets à distance 1 du centre,
  // puis mise à l'échelle voulue.
  const echelle = taille / new THREE.Vector3(...sommetsBruts[0]).length()
  const sommets = sommetsBruts.map((s) => s.map((c) => c * echelle))

  const faces = facesDepuisNormales(sommets, normales, sommetsParFace)
  const geometrie = construireGeometrie(sommets, faces)

  // Hauteur de repos = distance du centre au plan d'une face
  const rayonInterieur = Math.abs(faces[0].centre.dot(faces[0].normale))

  return {
    sommets,
    faces: faces.map((f) => f.indices),
    normales: faces.map((f) => f.normale.clone()),
    geometrie,
    rayonInterieur,
  }
}

const CACHE = new Map()

// Renvoie le solide correspondant au nombre de faces demandé.
// Les solides sont construits une seule fois puis réutilisés.
export function solidePourFaces(nbFaces, taille = 1) {
  const cle = `${nbFaces}-${taille}`
  if (CACHE.has(cle)) return CACHE.get(cle)

  let solide
  if (nbFaces === 6) solide = construireSolide(CUBE_SOMMETS, CUBE_NORMALES, 4, taille)
  else if (nbFaces === 8) solide = construireSolide(OCTAEDRE_SOMMETS, OCTAEDRE_NORMALES, 3, taille)
  else if (nbFaces === 12)
    solide = construireSolide(DODECAEDRE_SOMMETS, DODECAEDRE_NORMALES, 5, taille)
  else throw new Error(`Aucun solide défini pour ${nbFaces} faces`)

  CACHE.set(cle, solide)
  return solide
}

// Index de la face dont la normale pointe le plus vers le haut,
// une fois la rotation du dé appliquée.
export function faceVersLeHaut(normales, quaternion) {
  const haut = new THREE.Vector3(0, 1, 0)
  let meilleure = 0
  let meilleurScore = -Infinity
  normales.forEach((n, i) => {
    const score = n.clone().applyQuaternion(quaternion).dot(haut)
    if (score > meilleurScore) {
      meilleurScore = score
      meilleure = i
    }
  })
  return meilleure
}

// ——— Faire apparaître le résultat voulu ———
//
// Le résultat est tiré AVANT la simulation ; il faut donc que la
// face qui finit en haut porte le bon symbole. Plutôt que de
// tordre la physique, on redistribue les textures : un simple
// décalage circulaire de l'affectation face → texture suffit.
//
// C'est une permutation, donc chaque texture reste utilisée
// exactement une fois — le dé reste un dé valide, il a juste
// ses symboles disposés autrement. Et comme le décalage est
// calculé avant le rendu (grâce à la simulation jouée d'avance),
// rien ne change sous les yeux du joueur.
export function decalageTextures(nbFaces, faceAtterrissage, faceVoulue) {
  return ((faceVoulue - faceAtterrissage) % nbFaces + nbFaces) % nbFaces
}

export function textureDeLaFace(indexFace, decalage, nbFaces) {
  return (indexFace + decalage) % nbFaces
}
