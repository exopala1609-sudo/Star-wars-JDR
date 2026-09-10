import { useState, useEffect, useRef } from 'react'

// Zone de notes à sauvegarde automatique.
// Deux précautions :
//  - on n'enregistre qu'une demi-seconde après la dernière frappe,
//    pour ne pas solliciter la base à chaque lettre ;
//  - une mise à jour venue du réseau n'écrase jamais ce que
//    quelqu'un est en train d'écrire (champ actif ignoré).
export default function BlocNotes({ valeur, onChange, placeholder, lignes = 6 }) {
  const [texte, setTexte] = useState(valeur ?? '')
  const [enregistre, setEnregistre] = useState(true)
  const actif = useRef(false)
  const minuteur = useRef(null)

  useEffect(() => {
    if (!actif.current) setTexte(valeur ?? '')
  }, [valeur])

  useEffect(() => () => clearTimeout(minuteur.current), [])

  const saisir = (nouveauTexte) => {
    setTexte(nouveauTexte)
    setEnregistre(false)
    clearTimeout(minuteur.current)
    minuteur.current = setTimeout(() => {
      onChange(nouveauTexte)
      setEnregistre(true)
    }, 600)
  }

  const quitter = () => {
    actif.current = false
    // On enregistre tout de suite plutôt que d'attendre le minuteur
    clearTimeout(minuteur.current)
    if (texte !== (valeur ?? '')) {
      onChange(texte)
      setEnregistre(true)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        value={texte}
        rows={lignes}
        placeholder={placeholder}
        onFocus={() => {
          actif.current = true
        }}
        onBlur={quitter}
        onChange={(e) => saisir(e.target.value)}
        className="w-full rounded-xl bg-space-800/80 border border-space-600 focus:border-sw-or/70
                   px-3 py-2 text-sm text-space-200 placeholder:text-space-500 outline-none
                   resize-y leading-relaxed"
      />
      <span className="text-xs text-space-400 self-end">
        {enregistre ? 'Enregistré ✓' : 'Enregistrement…'}
      </span>
    </div>
  )
}
