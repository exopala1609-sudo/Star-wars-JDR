import { useState } from 'react'
import { CARACTERISTIQUES, COMPETENCES, reserveDeDes } from '../data/competences.js'
import Compteur from './Compteur.jsx'
import ConstructeurReserve from './ConstructeurReserve.jsx'
import Avatar from './Avatar.jsx'

// Pastilles de rang (●●○○○) affichées à côté de chaque compétence.
function Rangs({ rang }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${i < rang ? 'bg-sw-yellow' : 'bg-space-600'}`}
        />
      ))}
    </span>
  )
}

function Section({ titre, children }) {
  return (
    <section className="rounded-2xl border border-space-600 bg-space-800/60 p-4">
      <h3 className="titre-sw text-sm text-sw-blue mb-3">{titre}</h3>
      {children}
    </section>
  )
}

export default function FichePersonnage({ perso, etat, onEtat, onRetour, onLancer }) {
  const [compSelectionnee, setCompSelectionnee] = useState(null)

  const majEtat = (champ, valeur) => onEtat({ ...etat, [champ]: valeur })

  const comp = compSelectionnee && COMPETENCES.find((c) => c.id === compSelectionnee)
  const reserve =
    comp && reserveDeDes(perso.caracteristiques[comp.carac], perso.competences[comp.id] ?? 0)

  const groupes = [
    { titre: 'Compétences générales', liste: COMPETENCES.filter((c) => c.groupe === 'generale') },
    { titre: 'Compétences de combat', liste: COMPETENCES.filter((c) => c.groupe === 'combat') },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4">
      {/* ——— En-tête ——— */}
      <div className="flex items-start gap-4 flex-wrap">
        <button
          onClick={onRetour}
          className="rounded-lg border border-space-600 bg-space-800 px-3 py-2 text-sm hover:border-sw-yellow transition"
        >
          ← Personnages
        </button>
        <div className="flex items-center gap-4 flex-1 min-w-60">
          <Avatar perso={perso} tailleClasse="h-16 w-16" tailleEmoji="text-3xl" />
          <div>
            <h2 className="titre-sw text-2xl text-sw-yellow">{perso.nom}</h2>
            <p className="text-sm text-space-300">
              {perso.espece} · {perso.carriere} ({perso.specialisation})
            </p>
          </div>
        </div>
      </div>

      {/* ——— Compteurs d'état ——— */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Compteur
          label="Blessures"
          valeur={etat.blessures}
          max={perso.seuilBlessures}
          couleur="var(--color-sw-red)"
          onChange={(v) => majEtat('blessures', v)}
        />
        <Compteur
          label="Stress"
          valeur={etat.stress}
          max={perso.seuilStress}
          couleur="var(--color-sw-blue)"
          onChange={(v) => majEtat('stress', v)}
        />
        <Compteur
          label="Défense mêlée"
          valeur={etat.defenseMelee}
          couleur="var(--color-sw-green)"
          onChange={(v) => majEtat('defenseMelee', v)}
        />
        <Compteur
          label="Défense distance"
          valeur={etat.defenseDistance}
          couleur="var(--color-sw-green)"
          onChange={(v) => majEtat('defenseDistance', v)}
        />
        <div className="rounded-xl border border-space-600 bg-space-800/80 p-3 flex flex-col justify-center items-center gap-1">
          <span className="text-xs uppercase tracking-wider text-space-300">Encaissement</span>
          <span className="text-2xl font-bold text-space-200">{perso.encaissement}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ——— Colonne gauche : caractéristiques + compétences ——— */}
        <div className="flex flex-col gap-4">
          <Section titre="Caractéristiques">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CARACTERISTIQUES).map(([id, nom]) => (
                <div
                  key={id}
                  className="rounded-xl bg-space-700 p-2 text-center border border-space-600"
                >
                  <div className="text-2xl font-bold text-sw-yellow">
                    {perso.caracteristiques[id]}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-space-300">{nom}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section titre="Compétences — cliquez pour préparer un jet">
            {reserve && (
              <div className="mb-3">
                <ConstructeurReserve
                  competence={comp.nom}
                  carac={CARACTERISTIQUES[comp.carac]}
                  reserveBase={reserve}
                  onLancer={(reserveLancee, resultat) =>
                    onLancer({ competence: comp.nom, reserve: reserveLancee, resultat })
                  }
                />
              </div>
            )}
            {groupes.map((g) => (
              <div key={g.titre} className="mb-3 last:mb-0">
                <h4 className="text-xs uppercase tracking-wider text-space-400 mb-1">{g.titre}</h4>
                <ul className="divide-y divide-space-700">
                  {g.liste.map((c) => {
                    const rang = perso.competences[c.id] ?? 0
                    const active = compSelectionnee === c.id
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => setCompSelectionnee(active ? null : c.id)}
                          className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition text-sm
                            ${active ? 'bg-space-700 ring-1 ring-sw-yellow/60 text-sw-yellow' : 'hover:bg-space-700'}`}
                        >
                          <span className={rang > 0 ? 'font-semibold' : 'text-space-300'}>
                            {c.nom}
                            <span className="text-space-400 font-normal">
                              {' '}
                              ({CARACTERISTIQUES[c.carac].slice(0, 3)})
                            </span>
                          </span>
                          <Rangs rang={rang} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </Section>
        </div>

        {/* ——— Colonne droite : armes, talents, équipement, histoire ——— */}
        <div className="flex flex-col gap-4">
          <Section titre="Armes">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-space-400">
                    <th className="pb-1 pr-2">Arme</th>
                    <th className="pb-1 pr-2">Dég.</th>
                    <th className="pb-1 pr-2">Crit.</th>
                    <th className="pb-1">Portée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-700">
                  {perso.armes.map((a) => (
                    <tr key={a.nom}>
                      <td className="py-1.5 pr-2">
                        <div className="font-semibold">{a.nom}</div>
                        <div className="text-xs text-space-400">{a.special}</div>
                      </td>
                      <td className="py-1.5 pr-2 font-bold text-sw-red">{a.degats}</td>
                      <td className="py-1.5 pr-2">{a.critique}</td>
                      <td className="py-1.5">{a.portee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section titre="Talents">
            <ul className="flex flex-col gap-2">
              {perso.talents.map((t) => (
                <li key={t.nom} className="text-sm">
                  <span className="font-semibold text-space-200">{t.nom}.</span>{' '}
                  <span className="text-space-300">{t.description}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section titre="Équipement">
            <ul className="flex flex-wrap gap-2">
              {perso.equipement.map((e) => (
                <li
                  key={e}
                  className="rounded-full border border-space-600 bg-space-700 px-3 py-1 text-xs"
                >
                  {e}
                </li>
              ))}
            </ul>
          </Section>

          <Section titre="Motivation & Obligation">
            <p className="text-sm text-space-300 mb-2">
              <span className="font-semibold text-space-200">Motivation.</span> {perso.motivation}
            </p>
            <p className="text-sm text-space-300">
              <span className="font-semibold text-space-200">Obligation.</span> {perso.obligation}
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}
