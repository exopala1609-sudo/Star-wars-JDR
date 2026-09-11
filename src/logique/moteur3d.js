import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { TYPES_DES } from './des.js'
import { solidePourFaces, faceVersLeHaut, decalageTextures, textureDeLaFace } from './geometrieDes.js'
import { entierAleatoire } from './aleatoire.js'
import {
  UTILISER_MES_SYMBOLES,
  RECOLORER_LES_SYMBOLES,
  COTE_TEXTURE,
  dispositionDeLaFace,
  urlSvgSymbole,
  cheminSymbole,
  symbolesUtilises,
} from '../data/texturesDes.js'

// ============================================================
// MOTEUR DE DÉS 3D — physique réelle, résultat garanti
//
// ── LE PRINCIPE ─────────────────────────────────────────────
// Le résultat est tiré AVANT par le moteur cryptographique.
// La physique ne décide de rien : elle met en scène.
//
// Le déroulé se fait en trois temps :
//
//   1. SIMULATION À BLANC — la physique est jouée à toute
//      vitesse, sans rien afficher. Les dés tombent, se
//      percutent, rebondissent sur les bords et s'immobilisent.
//      Chaque image est enregistrée.
//
//   2. ACCORD DES FACES — on regarde quelle face de chaque dé
//      a fini en haut, et on décale l'attribution des textures
//      pour que cette face porte le symbole voulu. C'est une
//      permutation : le dé reste un dé valide.
//
//   3. REJEU — la trajectoire enregistrée est rejouée à
//      l'écran, à vitesse normale. Comme les textures sont déjà
//      en place, rien ne change sous les yeux du joueur, et la
//      face qui s'arrête en haut est forcément la bonne.
//
// Rejouer un enregistrement plutôt que refaire tourner la
// physique garantit que l'image est rigoureusement identique à
// ce qui a été analysé.
// ============================================================

const TAILLE_DE = 0.88
const TAPIS_X = 6
const TAPIS_Z = 3.8
const PAS = 1 / 60
const PAS_MAX = 420 // 7 s : au-delà, on fige (ne devrait pas arriver)
const IMAGES_REPOS = 18 // images conservées après immobilisation
const SEUIL_IMMOBILE = 0.2
const IMAGES_APLAT = 10 // images pour redresser un dé légèrement de travers

// ============================================================
// ASSEMBLAGE DES FACES
//
// Vous ne fournissez que les symboles ; les faces sont
// composées ici, une fois pour toutes :
//   fond à la couleur du dé + symbole(s) dimensionnés et placés.
//
// Chaque symbole est chargé une seule fois (votre PNG s'il
// existe, sinon le dessin intégré de l'application), puis
// réutilisé sur toutes les faces de tous les dés qui l'emploient.
// ============================================================

function chargerImage(source) {
  return new Promise((resoudre, rejeter) => {
    const image = new Image()
    image.onload = () => resoudre(image)
    image.onerror = rejeter
    image.src = source
  })
}

// Charge un symbole : votre image si elle est disponible, le
// dessin intégré sinon. Ne peut pas échouer.
async function chargerSymbole(symbole) {
  if (UTILISER_MES_SYMBOLES) {
    try {
      return await chargerImage(cheminSymbole(symbole))
    } catch {
      // Image absente ou illisible : on bascule sans bruit sur
      // le dessin intégré.
    }
  }
  return chargerImage(urlSvgSymbole(symbole))
}

let imagesSymboles = null

export async function preparerSymboles() {
  if (imagesSymboles) return imagesSymboles
  const symboles = symbolesUtilises()
  const chargees = await Promise.all(symboles.map(chargerSymbole))
  imagesSymboles = Object.fromEntries(symboles.map((s, i) => [s, chargees[i]]))
  return imagesSymboles
}

// Pose un symbole sur la face, en le recolorant si besoin pour
// qu'il contraste avec la couleur du dé.
function dessinerSymbole(contexte, image, { x, y, taille }, couleur) {
  if (!RECOLORER_LES_SYMBOLES) {
    contexte.drawImage(image, x - taille / 2, y - taille / 2, taille, taille)
    return
  }
  // On dessine le symbole à part, puis on remplace ses pixels
  // par la couleur voulue en conservant leur transparence.
  const tampon = document.createElement('canvas')
  tampon.width = tampon.height = taille
  const ctx = tampon.getContext('2d')
  ctx.drawImage(image, 0, 0, taille, taille)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = couleur
  ctx.fillRect(0, 0, taille, taille)
  contexte.drawImage(tampon, x - taille / 2, y - taille / 2)
}

const cacheMateriaux = new Map()

function materiauxDuDe(type) {
  if (cacheMateriaux.has(type)) return cacheMateriaux.get(type)
  const def = TYPES_DES[type]

  const materiaux = def.faces.map((face) => {
    const toile = document.createElement('canvas')
    toile.width = toile.height = COTE_TEXTURE
    const contexte = toile.getContext('2d')

    contexte.fillStyle = def.hex
    contexte.fillRect(0, 0, COTE_TEXTURE, COTE_TEXTURE)
    for (const emplacement of dispositionDeLaFace(face)) {
      const image = imagesSymboles?.[emplacement.symbole]
      if (image) dessinerSymbole(contexte, image, emplacement, def.texte)
    }

    const texture = new THREE.CanvasTexture(toile)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.45, metalness: 0.05 })
  })

  cacheMateriaux.set(type, materiaux)
  return materiaux
}

// Identifie une face par son contenu plutôt que par sa
// référence : le résultat peut avoir transité par le réseau et
// avoir perdu son identité d'objet.
const signatureFace = (face) =>
  Object.entries(face)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([s, n]) => `${s}${n}`)
    .join('+')

function indexDeLaFace(def, face) {
  const cible = signatureFace(face)
  return Math.max(
    0,
    def.faces.findIndex((f) => signatureFace(f) === cible),
  )
}

// ——— Forme physique correspondant au solide ———

function formeCannon(solide) {
  return new CANNON.ConvexPolyhedron({
    vertices: solide.sommets.map((s) => new CANNON.Vec3(...s)),
    faces: solide.faces.map((f) => [...f]),
  })
}

// Petit tirage décoratif — l'aléa visuel n'influence pas le
// résultat, mais autant utiliser la même source de qualité.
const hasard = (min, max) => min + (entierAleatoire(10000) / 10000) * (max - min)

// ——— 1 & 2. Simulation à blanc + accord des faces ———

export function simuler(resultat) {
  const monde = new CANNON.World({ gravity: new CANNON.Vec3(0, -42, 0) })
  monde.broadphase = new CANNON.SAPBroadphase(monde)
  monde.allowSleep = true

  // Réglages cherchant l'équilibre entre rebonds spectaculaires
  // et immobilisation rapide : un lancer doit durer 2 à 3 s.
  const matiereDe = new CANNON.Material('de')
  const matiereTapis = new CANNON.Material('tapis')
  monde.addContactMaterial(
    new CANNON.ContactMaterial(matiereDe, matiereTapis, { friction: 0.32, restitution: 0.22 }),
  )
  monde.addContactMaterial(
    new CANNON.ContactMaterial(matiereDe, matiereDe, { friction: 0.16, restitution: 0.3 }),
  )

  // Sol et murs du tapis
  const ajouterPlan = (position, rotation) => {
    const corps = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: matiereTapis })
    corps.position.set(...position)
    corps.quaternion.setFromEuler(...rotation)
    monde.addBody(corps)
  }
  ajouterPlan([0, 0, 0], [-Math.PI / 2, 0, 0]) // sol
  ajouterPlan([-TAPIS_X, 0, 0], [0, Math.PI / 2, 0])
  ajouterPlan([TAPIS_X, 0, 0], [0, -Math.PI / 2, 0])
  ajouterPlan([0, 0, -TAPIS_Z], [0, 0, 0])
  ajouterPlan([0, 0, TAPIS_Z], [0, Math.PI, 0])
  ajouterPlan([0, 9, 0], [Math.PI / 2, 0, 0]) // plafond

  const corps = resultat.des.map((de, i) => {
    const def = TYPES_DES[de.type]
    const solide = solidePourFaces(def.facettes, TAILLE_DE)
    const body = new CANNON.Body({
      mass: 1,
      shape: formeCannon(solide),
      material: matiereDe,
      sleepSpeedLimit: 0.26,
      sleepTimeLimit: 0.18,
      linearDamping: 0.22,
      angularDamping: 0.32,
    })
    // Départ étalé sur toute la largeur du tapis : les dés
    // s'entrechoquent en tombant mais finissent bien séparés,
    // sans s'empiler les uns sur les autres.
    const nb = resultat.des.length
    const etalement = Math.min(4.6, 0.95 * (nb - 1))
    const x = nb === 1 ? hasard(-0.6, 0.6) : -etalement + (2 * etalement * i) / (nb - 1)
    body.position.set(x + hasard(-0.3, 0.3), 4.2 + hasard(0, 1.4), hasard(-1.4, 1.4))
    // Vitesse dirigée vers l'extérieur, pour écarter les dés
    body.velocity.set(Math.sign(x || 1) * hasard(0.6, 2.4), hasard(-3.5, -1), hasard(-1.5, 1.5))
    body.angularVelocity.set(hasard(-9, 9), hasard(-9, 9), hasard(-9, 9))
    body.quaternion.setFromEuler(hasard(0, 6.28), hasard(0, 6.28), hasard(0, 6.28))
    monde.addBody(body)
    return body
  })

  // Enregistrement image par image
  const images = []
  let imagesImmobiles = 0
  for (let pas = 0; pas < PAS_MAX; pas++) {
    monde.step(PAS)
    images.push(
      corps.map((b) => ({
        p: [b.position.x, b.position.y, b.position.z],
        q: [b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w],
      })),
    )
    const bougeEncore = corps.some(
      (b) => b.velocity.length() > SEUIL_IMMOBILE || b.angularVelocity.length() > SEUIL_IMMOBILE,
    )
    imagesImmobiles = bougeEncore ? 0 : imagesImmobiles + 1
    if (imagesImmobiles >= IMAGES_REPOS) break
  }

  // ——— Redressement final ———
  // Un dé peut s'arrêter très légèrement incliné (ou encore en
  // train de frémir si la simulation a été coupée). On le
  // redresse alors doucement sur les dernières images, pour que
  // sa face supérieure soit parfaitement lisible. Un dé posé sur
  // un autre est laissé tel quel : le redresser le ferait
  // s'enfoncer dans son voisin.
  const orientationsFinales = corps.map((b, i) => {
    const def = TYPES_DES[resultat.des[i].type]
    const solide = solidePourFaces(def.facettes, TAILLE_DE)
    const q = new THREE.Quaternion(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w)
    const face = faceVersLeHaut(solide.normales, q)
    const normaleMonde = solide.normales[face].clone().applyQuaternion(q)

    // Un dé posé sur un autre dé est laissé tel quel : le
    // redresser le ferait s'enfoncer dans son voisin. En
    // revanche un dé appuyé contre un bord est redressé, car
    // les bords du tapis sont invisibles.
    const empile = b.position.y > solide.rayonInterieur * 1.6
    if (empile || normaleMonde.y > 0.999) return { q, face, y: b.position.y }

    const redressement = new THREE.Quaternion().setFromUnitVectors(
      normaleMonde.normalize(),
      new THREE.Vector3(0, 1, 0),
    )
    return { q: redressement.multiply(q), face, y: solide.rayonInterieur }
  })

  // Fusion progressive du redressement sur les dernières images
  const debutAplat = Math.max(0, images.length - IMAGES_APLAT)
  for (let n = debutAplat; n < images.length; n++) {
    const avancement = (n - debutAplat + 1) / (images.length - debutAplat)
    images[n] = images[n].map((etat, i) => {
      const depart = new THREE.Quaternion(...etat.q)
      const melange = depart.clone().slerp(orientationsFinales[i].q, avancement)
      const y = etat.p[1] + (orientationsFinales[i].y - etat.p[1]) * avancement
      return { p: [etat.p[0], y, etat.p[2]], q: [melange.x, melange.y, melange.z, melange.w] }
    })
  }

  // Accord des faces : quelle face a fini en haut, et laquelle
  // doit y figurer ?
  const decalages = corps.map((b, i) => {
    const def = TYPES_DES[resultat.des[i].type]
    const voulue = indexDeLaFace(def, resultat.des[i].face)
    return decalageTextures(def.facettes, orientationsFinales[i].face, voulue)
  })

  return { images, decalages }
}

// ——— 3. Scène et rejeu ———

export function creerScene(conteneur) {
  const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  rendu.shadowMap.enabled = true
  rendu.shadowMap.type = THREE.PCFSoftShadowMap
  conteneur.appendChild(rendu.domElement)
  rendu.domElement.style.cssText = 'width:100%;height:100%;display:block'

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 10.6, 7.4)
  camera.lookAt(0, 0, 0)

  scene.add(new THREE.AmbientLight(0xffffff, 1.5))
  const lumiere = new THREE.DirectionalLight(0xfff2cc, 2.4)
  lumiere.position.set(4, 12, 6)
  lumiere.castShadow = true
  lumiere.shadow.mapSize.set(1024, 1024)
  lumiere.shadow.camera.left = -10
  lumiere.shadow.camera.right = 10
  lumiere.shadow.camera.top = 10
  lumiere.shadow.camera.bottom = -10
  scene.add(lumiere)
  const appoint = new THREE.DirectionalLight(0x6fd6ff, 0.7)
  appoint.position.set(-6, 5, -4)
  scene.add(appoint)

  // Le tapis de jeu
  const tapis = new THREE.Mesh(
    new THREE.PlaneGeometry(TAPIS_X * 2, TAPIS_Z * 2),
    new THREE.MeshStandardMaterial({ color: 0x121829, roughness: 0.95, metalness: 0 }),
  )
  tapis.rotation.x = -Math.PI / 2
  tapis.receiveShadow = true
  scene.add(tapis)

  // Un liseré doré rappelant l'habillage « datapad »
  const liseres = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(TAPIS_X * 2, TAPIS_Z * 2)),
    new THREE.LineBasicMaterial({ color: 0xe8a33d, transparent: true, opacity: 0.5 }),
  )
  liseres.rotation.x = -Math.PI / 2
  liseres.position.y = 0.01
  scene.add(liseres)

  const redimensionner = () => {
    const l = conteneur.clientWidth || 1
    const h = conteneur.clientHeight || 1
    rendu.setSize(l, h, false)
    camera.aspect = l / h
    camera.updateProjectionMatrix()
  }
  redimensionner()
  window.addEventListener('resize', redimensionner)

  let mailles = []
  let animation = null
  let sauter = null

  // Les géométries et les matériaux sont mutualisés entre tous
  // les lancers : on retire les dés de la scène sans les libérer.
  const viderDes = () => {
    for (const m of mailles) scene.remove(m)
    mailles = []
  }

  // Lance les dés et rejoue la trajectoire. Renvoie une promesse
  // résolue quand tous les dés sont immobiles.
  const lancer = async (resultat) => {
    // Les symboles ne sont chargés qu'une fois, au premier lancer
    await preparerSymboles()

    return new Promise((terminer) => {
      viderDes()
      const { images, decalages } = simuler(resultat)

      mailles = resultat.des.map((de, i) => {
        const def = TYPES_DES[de.type]
        const solide = solidePourFaces(def.facettes, TAILLE_DE)
        const materiaux = materiauxDuDe(de.type)
        // Application du décalage : la face qui finira en haut
        // porte le symbole tiré au sort.
        const materiauxDecales = materiaux.map(
          (_, indexFace) => materiaux[textureDeLaFace(indexFace, decalages[i], def.facettes)],
        )
        const maille = new THREE.Mesh(solide.geometrie, materiauxDecales)
        maille.castShadow = true
        scene.add(maille)
        return maille
      })

      const appliquer = (image) => {
        image.forEach((etat, i) => {
          mailles[i].position.set(...etat.p)
          mailles[i].quaternion.set(...etat.q)
        })
      }
      appliquer(images[0])

      const conclure = () => {
        if (animation) cancelAnimationFrame(animation)
        animation = null
        sauter = null
        appliquer(images[images.length - 1])
        rendu.render(scene, camera)
        terminer()
      }
      sauter = conclure

      const depart = performance.now()
      const boucle = () => {
        const index = Math.floor((performance.now() - depart) / (PAS * 1000))
        if (index >= images.length - 1) {
          conclure()
          return
        }
        appliquer(images[index])
        rendu.render(scene, camera)
        animation = requestAnimationFrame(boucle)
      }
      animation = requestAnimationFrame(boucle)
    })
  }

  const detruire = () => {
    if (animation) cancelAnimationFrame(animation)
    window.removeEventListener('resize', redimensionner)
    viderDes()
    rendu.dispose()
    rendu.domElement.remove()
  }

  return { lancer, detruire, redimensionner, sauterAnimation: () => sauter?.() }
}
