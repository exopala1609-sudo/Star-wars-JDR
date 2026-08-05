import { useState } from 'react'

// Portrait de personnage dans un cadre holographique.
// Si l'image n'existe pas (encore) dans public/avatars/,
// on retombe automatiquement sur l'emoji du personnage :
// l'application ne montre jamais d'image cassée.
export default function Avatar({ perso, tailleClasse = 'h-14 w-14', tailleEmoji = 'text-2xl' }) {
  const [imageOk, setImageOk] = useState(true)
  const src = `${import.meta.env.BASE_URL}${perso.avatar}`

  return (
    <div
      className={`holo-cadre relative flex items-center justify-center rounded-full overflow-hidden shrink-0 ${tailleClasse}`}
      style={{ backgroundColor: perso.couleur }}
    >
      {imageOk && perso.avatar ? (
        <img
          src={src}
          alt={`Portrait de ${perso.nom}`}
          className="h-full w-full object-cover"
          onError={() => setImageOk(false)}
        />
      ) : (
        <span className={tailleEmoji}>{perso.emoji}</span>
      )}
    </div>
  )
}
