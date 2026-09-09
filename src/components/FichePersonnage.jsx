import { useState } from 'react'
import {
  CARACTERISTIQUES,
  COMPETENCES,
  reserveDeDes,
  reservePersonnage,
} from '../data/competences.js'
import { RESERVE_VIDE } from '../logique/des.js'
import Compteur from './Compteur.jsx'
import ConstructeurReserve from './ConstructeurReserve.jsx'
import Avatar from './Avatar.jsx'
import MiniReserve from './MiniReserve.jsx'
import SectionProgression from './SectionProgression.jsx'

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
    <section className="datapad p-4">
      <h3 className="titre-sw text-sm text-sw-or mb-3 flex items-center gap-2 border-b border-sw-or/25 pb-2">
        <span className="inline-block h-3.5 w-1.5 bg-sw-or -skew-x-12 shrink-0" />
        {titre}
      </h3>
      {children}
    </section>
  )
}

export default function FichePersonnage({
  perso,
  etat,
  onEtat,
  onRetour,
  onLancer,
  reservePartagee,
  onReserve,
  progression,
  onAcheter,
}) {
  const [compSelectionnee, setCompSelectionnee] = useState(null)

  const majEtat = (champ, valeur) => onEtat({ ...etat, [champ]: valeur })

  const comp = compSelectionnee && COMPETENCES.find((c) => c.id === compSelectionnee)

  // Les dés affichés : la réserve partagée si elle correspond à
  // la compétence sélectionnée (le MJ a pu la modifier), sinon
  // la base calculée depuis caractéristique + rang.
  const base =
    comp && reserveDeDes(perso.caracteristiques[comp.carac], perso.competences[comp.id] ?? 0)
  const des = comp
    ? reservePartagee && reservePartagee.competence === comp.nom
      ? { ...RESERVE_VIDE, ...reservePartagee.des }
      : { ...RESERVE_VIDE, maitrise: base.maitrise, aptitude: base.aptitude }
    : null

  const selectionner = (c, dejaActive) => {
    if (dejaActive) {
      setCompSelectionnee(null)
      onReserve(null)
      return
    }
    setCompSelectionnee(c.id)
    // Une réserve déjà en préparation pour cette compétence est
    // conservée : elle peut contenir des dés injectés par le MJ.
    if (reservePartagee && reservePartagee.competence === c.nom) return
    const nouvelleBase = reserveDeDes(
      perso.caracteristiques[c.carac],
      perso.competences[c.id] ?? 0,
    )
    onReserve({
      competence: c.nom,
      des: {
        ...RESERVE_VIDE,
        maitrise: nouvelleBase.maitrise,
        aptitude: nouvelleBase.aptitude,
      },
    })
  }

  const groupes = [
    { titre: 'Compétences générales', liste: COMPETENCES.filter((c) => c.groupe === 'generale') },
    { titre: 'Compétences de combat', liste: COMPETENCES.filter((c) => c.groupe === 'combat') },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4">
      {/* ——— En-tête d'identité : le panneau datapad principal ——— */}
      <div className="datapad p-4 flex flex-col gap-4">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ——— Colonne gauche : caractéristiques + compétences ——— */}
        <div className="flex flex-col gap-4">
          <Section titre="Caractéristiques">
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CARACTERISTIQUES).map(([id, nom]) => (
                <div key={id} className="capsule-carac p-2 text-center">
                  <div className="text-2xl font-bold text-sw-or">
                    {perso.caracteristiques[id]}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-space-300">{nom}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section titre="Compétences — cliquez pour préparer un jet">
            {des && (
              <div className="mb-3">
                <ConstructeurReserve
                  competence={comp.nom}
                  carac={CARACTERISTIQUES[comp.carac]}
                  des={des}
                  onChange={(nouveauxDes) =>
                    onReserve({ competence: comp.nom, des: nouveauxDes })
                  }
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
                          onClick={() => selectionner(c, active)}
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
          <Section titre="Armes — cliquez pour préparer l’attaque">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-space-400">
                    <th className="pb-1 pr-2">Arme</th>
                    <th className="pb-1 pr-2">Dég.</th>
                    <th className="pb-1 pr-2">Crit.</th>
                    <th className="pb-1 pr-2">Portée</th>
                    <th className="pb-1">Réserve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-700">
                  {perso.armes.map((a) => {
                    const competenceArme = COMPETENCES.find((c) => c.id === a.competence)
                    return (
                      <tr
                        key={a.nom}
                        onClick={() =>
                          competenceArme && selectionner(competenceArme, compSelectionnee === a.competence)
                        }
                        className="cursor-pointer hover:bg-space-700/60 transition"
                        title={
                          competenceArme
                            ? `Préparer un jet de ${competenceArme.nom}`
                            : undefined
                        }
                      >
                        <td className="py-1.5 pr-2">
                          <div className="font-semibold">{a.nom}</div>
                          <div className="text-xs text-space-400">
                            {competenceArme?.nom}
                            {a.special ? ` · ${a.special}` : ''}
                          </div>
                        </td>
                        <td className="py-1.5 pr-2 font-bold text-sw-red whitespace-nowrap">
                          {a.degats}
                          {a.formuleDegats && (
                            <span className="block text-[10px] font-normal text-space-400">
                              {a.formuleDegats}
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 pr-2">{a.critique}</td>
                        <td className="py-1.5 pr-2">{a.portee}</td>
                        <td className="py-1.5">
                          <MiniReserve reserve={reservePersonnage(perso, a.competence)} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-space-400 mt-2">
              En cas de réussite : les dégâts indiqués +1 par Succès net. Le chiffre « Crit. » est
              le nombre d’Avantages à dépenser pour infliger 1 blessure critique.
            </p>
          </Section>

          <Section titre="Talents">
            <ul className="flex flex-col gap-2">
              {perso.talents.map((t) => (
                <li key={t.nom} className="text-sm">
                  <span className="font-semibold text-space-200">{t.nom}.</span>{' '}
                  <span className="text-space-300">{t.description}</span>
                  {t.acquis && (
                    <span className="ml-1 text-[10px] uppercase tracking-wide font-bold text-sw-green">
                      acquis par XP
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <Section titre="Progression — expérience">
            <SectionProgression
              perso={perso}
              progression={progression}
              onAcheter={onAcheter}
            />
          </Section>

          <Section titre="Équipement">
            <ul className="flex flex-col gap-1.5">
              {perso.equipement.map((e) => (
                <li key={e.nom} className="text-sm">
                  <span className="font-semibold text-space-200">{e.nom}</span>
                  {e.detail && <span className="text-space-300"> — {e.detail}</span>}
                </li>
              ))}
            </ul>
            {perso.credits != null && (
              <p className="mt-3 pt-2 border-t border-space-700 text-sm">
                <span className="font-semibold text-space-200">Crédits :</span>{' '}
                <span className="text-sw-or font-bold">{perso.credits}</span>
              </p>
            )}
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
