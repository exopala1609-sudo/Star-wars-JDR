import { useState } from 'react'

// ============================================================
// VERROU DE LA VUE MAÎTRE DE JEU
//
// Le code n'est pas écrit en clair dans le projet : seule son
// empreinte (SHA-256) est stockée ici. Un joueur qui ouvrirait
// le code source ne peut donc pas le lire directement.
//
// ⚠️ À SAVOIR : l'application tourne entièrement dans le
// navigateur, ce verrou empêche les curieux d'entrer par
// inadvertance — ce n'est pas un coffre-fort contre quelqu'un
// de déterminé et techniquement compétent.
//
// Pour changer le code : générez la nouvelle empreinte puis
// remplacez la valeur ci-dessous (demandez-la moi, c'est
// l'affaire d'une seconde).
// ============================================================
const EMPREINTE_CODE = '8cd6cb7e1601eb5dcd0a0d3d8f62c2dd8ee483819f9130a34259a217e927679f'

const CLE_DEVERROUILLAGE = 'swjdr-acces-mj'

async function empreinte(texte) {
  const donnees = new TextEncoder().encode(texte)
  const condensat = await crypto.subtle.digest('SHA-256', donnees)
  return [...new Uint8Array(condensat)].map((o) => o.toString(16).padStart(2, '0')).join('')
}

// L'accès reste mémorisé sur l'appareil du MJ : il ne retape
// pas le code à chaque séance.
export const accesMemorise = () => localStorage.getItem(CLE_DEVERROUILLAGE) === 'ok'

export const oublierAcces = () => localStorage.removeItem(CLE_DEVERROUILLAGE)

export default function AccesMJ({ ouvert, onReussite, onAnnuler }) {
  const [code, setCode] = useState('')
  const [erreur, setErreur] = useState(false)

  if (!ouvert) return null

  const valider = async (valeur) => {
    if ((await empreinte(valeur)) === EMPREINTE_CODE) {
      localStorage.setItem(CLE_DEVERROUILLAGE, 'ok')
      setCode('')
      setErreur(false)
      onReussite()
    } else {
      setErreur(true)
      setCode('')
    }
  }

  const saisir = (valeur) => {
    const chiffres = valeur.replace(/\D/g, '').slice(0, 4)
    setCode(chiffres)
    setErreur(false)
    if (chiffres.length === 4) valider(chiffres)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onAnnuler}
    >
      <div
        className="datapad p-6 w-full max-w-xs flex flex-col gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="titre-sw text-sm text-sw-or">Accès Maître de Jeu</h3>
          <p className="text-xs text-space-400 mt-2">
            Zone réservée. Saisissez le code à 4 chiffres.
          </p>
        </div>

        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={code}
          onChange={(e) => saisir(e.target.value)}
          placeholder="••••"
          className={`w-32 text-center text-3xl tracking-[0.5em] font-bold rounded-lg bg-space-800 border-2 py-2
                      text-sw-yellow placeholder:text-space-600 outline-none transition
                      ${erreur ? 'border-sw-red' : 'border-space-600 focus:border-sw-yellow'}`}
        />

        {erreur && (
          <p className="text-xs text-sw-red font-semibold">Code incorrect — réessayez.</p>
        )}

        <button
          onClick={onAnnuler}
          className="text-xs text-space-400 hover:text-space-200 transition"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
