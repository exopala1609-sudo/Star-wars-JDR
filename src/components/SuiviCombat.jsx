import { useState } from 'react'
import { PERSONNAGES, getPersonnage } from '../data/personnages.js'
import { reserveDeDes } from '../data/competences.js'
import { RESERVE_VIDE, lancerReserve } from '../logique/des.js'
import IconeSymbole from './IconeSymbole.jsx'

// Suivi de combat (panneau de la Vue MJ) : jets d'initiative
// des PJ (Sang-froid ou Vigilance, calculés depuis leur fiche),
// ajout de PNJ avec réserve sur mesure, ordre trié
// automatiquement (Succès puis Avantages) et marqueur de tour.

const trierParticipants = (liste) =>
  [...liste].sort((a, b) => b.succes - a.succes || b.avantages - a.avantages)

function LigneParticipant({ participant, index, actif, onRetirer }) {
  return (
    <li
      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
        actif ? 'bg-space-700 ring-1 ring-sw-yellow/60' : ''
      }`}
    >
      <span className={`w-5 text-center font-bold ${actif ? 'text-sw-yellow' : 'text-space-400'}`}>
        {actif ? '▶' : index + 1}
      </span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
          participant.type === 'pj'
            ? 'bg-sw-blue/15 text-sw-blue border border-sw-blue/40'
            : 'bg-sw-red/15 text-sw-red border border-sw-red/40'
        }`}
      >
        {participant.type === 'pj' ? 'PJ' : 'PNJ'}
      </span>
      <span className="flex-1 font-semibold truncate">{participant.nom}</span>
      <span className="flex items-center gap-1 text-space-300 shrink-0">
        {participant.succes} <IconeSymbole symbole="s" className="h-3.5 w-3.5" />
        <span className="ml-1">{participant.avantages}</span>
        <IconeSymbole symbole="a" className="h-3.5 w-3.5" />
      </span>
      <button
        onClick={onRetirer}
        title="Retirer du combat"
        className="h-6 w-6 rounded-md bg-space-700 hover:bg-sw-red/40 text-xs shrink-0"
      >
        ✕
      </button>
    </li>
  )
}

export default function SuiviCombat({ combat, majCombat, ajouterHistorique }) {
  const [pjChoisi, setPjChoisi] = useState(PERSONNAGES[0].id)
  const [competenceInit, setCompetenceInit] = useState('sang-froid')
  const [nomPnj, setNomPnj] = useState('')
  const [vertsPnj, setVertsPnj] = useState(2)
  const [jaunesPnj, setJaunesPnj] = useState(0)

  const participants = combat?.participants ?? []
  const pjsDisponibles = PERSONNAGES.filter(
    (p) => !participants.some((x) => x.persoId === p.id),
  )

  const enregistrerJet = (identite, competence, reserve, resultat) => {
    ajouterHistorique({
      ts: Date.now(),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      perso: identite,
      competence,
      reserve,
      resultat,
    })
  }

  const ajouterParticipant = (participant) => {
    const nouveaux = trierParticipants([...participants, participant])
    // Tant que le combat n'a pas commencé à tourner, le marqueur
    // reste en tête d'ordre ; ensuite il suit le même combattant
    // même si le tri le déplace.
    let nouvelIndex = 0
    if (combat.enCours) {
      const cleActive = participants[combat.indexActif]?.cle
      nouvelIndex = Math.max(0, nouveaux.findIndex((x) => x.cle === cleActive))
    }
    majCombat({ ...combat, participants: nouveaux, indexActif: nouvelIndex })
  }

  const lancerInitiativePj = () => {
    const perso = getPersonnage(pjChoisi)
    if (!perso) return
    const nomCompetence = competenceInit === 'sang-froid' ? 'Sang-froid' : 'Vigilance'
    const carac = competenceInit === 'sang-froid' ? 'presence' : 'volonte'
    const base = reserveDeDes(
      perso.caracteristiques[carac],
      perso.competences[competenceInit] ?? 0,
    )
    const reserve = { ...RESERVE_VIDE, maitrise: base.maitrise, aptitude: base.aptitude }
    const resultat = lancerReserve(reserve)
    enregistrerJet(
      { nom: perso.nom, emoji: perso.emoji, couleur: perso.couleur },
      `Initiative (${nomCompetence})`,
      reserve,
      resultat,
    )
    ajouterParticipant({
      cle: crypto.randomUUID(),
      persoId: perso.id,
      nom: perso.nom,
      type: 'pj',
      succes: resultat.nets.succes,
      avantages: resultat.nets.avantages,
    })
    if (pjsDisponibles.length > 1) {
      setPjChoisi(pjsDisponibles.find((p) => p.id !== pjChoisi)?.id ?? pjsDisponibles[0].id)
    }
  }

  const lancerInitiativePnj = () => {
    const nom = nomPnj.trim() || 'Adversaire'
    const reserve = { ...RESERVE_VIDE, aptitude: vertsPnj, maitrise: jaunesPnj }
    const resultat = lancerReserve(reserve)
    enregistrerJet(
      { nom, emoji: '👾', couleur: '#7f1d1d' },
      'Initiative',
      reserve,
      resultat,
    )
    ajouterParticipant({
      cle: crypto.randomUUID(),
      nom,
      type: 'pnj',
      succes: resultat.nets.succes,
      avantages: resultat.nets.avantages,
    })
    setNomPnj('')
  }

  const retirer = (index) => {
    const nouveaux = participants.filter((_, i) => i !== index)
    let indexActif = combat.indexActif
    if (index < indexActif) indexActif -= 1
    if (indexActif >= nouveaux.length) indexActif = 0
    majCombat({ ...combat, participants: nouveaux, indexActif })
  }

  const suivant = () => {
    if (participants.length === 0) return
    const prochain = (combat.indexActif + 1) % participants.length
    majCombat({
      ...combat,
      enCours: true,
      indexActif: prochain,
      tour: prochain === 0 ? combat.tour + 1 : combat.tour,
    })
  }

  if (!combat) {
    return (
      <div className="datapad p-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="titre-sw text-sm text-sw-or">Suivi de combat</h3>
          <p className="text-xs text-space-400 mt-1">
            Jets d’initiative, ordre des tours et marqueur « à qui le tour »,
            visibles par toute la table.
          </p>
        </div>
        <button
          onClick={() => majCombat({ tour: 1, indexActif: 0, participants: [] })}
          className="rounded-lg bg-sw-red/80 hover:bg-sw-red text-white font-bold px-4 py-2 text-sm uppercase tracking-wide transition"
        >
          ⚔️ Démarrer un combat
        </button>
      </div>
    )
  }

  return (
    <div className="datapad p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 border-b border-sw-or/25 pb-2">
        <h3 className="titre-sw text-sm text-sw-or flex items-center gap-2">
          <span className="inline-block h-3.5 w-1.5 bg-sw-or -skew-x-12 shrink-0" />
          Combat — Tour {combat.tour}
        </h3>
        <button
          onClick={() => majCombat(null)}
          className="rounded-lg border border-space-600 bg-space-800 px-3 py-1 text-xs hover:border-sw-red hover:text-sw-red transition"
        >
          Terminer le combat
        </button>
      </div>

      {/* ——— Ajout des participants ——— */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-xl border border-space-600 bg-space-800/70 p-3 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-space-400">
            Initiative d’un personnage
          </span>
          <div className="flex gap-2 flex-wrap">
            <select
              value={pjChoisi}
              onChange={(e) => setPjChoisi(e.target.value)}
              className="flex-1 min-w-28 rounded-lg bg-space-700 border border-space-600 px-2 py-1.5 text-sm"
            >
              {pjsDisponibles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom}
                </option>
              ))}
            </select>
            <select
              value={competenceInit}
              onChange={(e) => setCompetenceInit(e.target.value)}
              className="rounded-lg bg-space-700 border border-space-600 px-2 py-1.5 text-sm"
            >
              <option value="sang-froid">Sang-froid (préparé)</option>
              <option value="vigilance">Vigilance (surpris)</option>
            </select>
            <button
              onClick={lancerInitiativePj}
              disabled={pjsDisponibles.length === 0}
              className="rounded-lg bg-sw-yellow text-black font-bold px-3 py-1.5 text-sm hover:brightness-110 transition disabled:opacity-40"
            >
              🎲 Lancer
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-space-600 bg-space-800/70 p-3 flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-space-400">
            Initiative d’un PNJ
          </span>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              value={nomPnj}
              onChange={(e) => setNomPnj(e.target.value)}
              placeholder="Nom (ex. Vigile de Teemo)"
              className="flex-1 min-w-32 rounded-lg bg-space-700 border border-space-600 px-2 py-1.5 text-sm placeholder:text-space-500"
            />
            <label className="flex items-center gap-1 text-xs text-space-300">
              <span
                className="h-4 w-4 rounded-sm inline-block"
                style={{ backgroundColor: 'var(--color-de-aptitude)' }}
              />
              <input
                type="number"
                min="0"
                max="6"
                value={vertsPnj}
                onChange={(e) => setVertsPnj(Math.max(0, Number(e.target.value)))}
                className="w-12 rounded-lg bg-space-700 border border-space-600 px-1.5 py-1 text-sm"
              />
            </label>
            <label className="flex items-center gap-1 text-xs text-space-300">
              <span
                className="h-4 w-4 rounded-sm inline-block border border-black/30"
                style={{ backgroundColor: 'var(--color-de-maitrise)' }}
              />
              <input
                type="number"
                min="0"
                max="6"
                value={jaunesPnj}
                onChange={(e) => setJaunesPnj(Math.max(0, Number(e.target.value)))}
                className="w-12 rounded-lg bg-space-700 border border-space-600 px-1.5 py-1 text-sm"
              />
            </label>
            <button
              onClick={lancerInitiativePnj}
              className="rounded-lg bg-sw-yellow text-black font-bold px-3 py-1.5 text-sm hover:brightness-110 transition"
            >
              🎲 Lancer
            </button>
          </div>
        </div>
      </div>

      {/* ——— Ordre d'initiative ——— */}
      {participants.length === 0 ? (
        <p className="text-sm text-space-400 italic">
          Lancez les initiatives ci-dessus : l’ordre du combat se construira ici.
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-1">
            {participants.map((participant, i) => (
              <LigneParticipant
                key={participant.cle}
                participant={participant}
                index={i}
                actif={i === combat.indexActif}
                onRetirer={() => retirer(i)}
              />
            ))}
          </ul>
          <button
            onClick={suivant}
            className="rounded-xl bg-sw-yellow text-black font-bold py-2.5 text-sm uppercase tracking-wide hover:brightness-110 active:scale-[0.99] transition"
          >
            ➡ Participant suivant
          </button>
        </>
      )}
    </div>
  )
}
