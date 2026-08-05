import { GABARITS_ADVERSAIRES, GABARIT_VIERGE, LIBELLES_RANG } from '../data/adversaires.js'
import { RESERVE_VIDE, lancerReserve } from '../logique/des.js'

// Section « Adversaires » de la Vue MJ : poser des ennemis sur
// la table depuis des gabarits prêts, suivre leurs blessures,
// les montrer aux joueurs ou les garder secrets, et les retirer
// quand ils tombent.

function ChampNombre({ label, valeur, onChange, largeur = 'w-14' }) {
  return (
    <label className="flex items-center gap-1 text-xs text-space-400">
      {label}
      <input
        type="number"
        min="0"
        value={valeur}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className={`${largeur} rounded-md bg-space-700 border border-space-600 px-1.5 py-0.5 text-sm text-space-200`}
      />
    </label>
  )
}

function CarteAdversaire({ adversaire, onMaj, onSupprimer, combat, onInitiative }) {
  const maj = (champ, valeur) => onMaj({ ...adversaire, [champ]: valeur })
  const tombe = adversaire.blessures >= adversaire.seuilBlessures
  const ratio = Math.min(adversaire.blessures / Math.max(adversaire.seuilBlessures, 1), 1)

  return (
    <div
      className={`rounded-xl border p-3 flex flex-col gap-2 transition ${
        tombe ? 'border-sw-red/60 bg-sw-red/5' : 'border-space-600 bg-space-800/70'
      }`}
    >
      {/* Identité */}
      <div className="flex items-center gap-2">
        <span className="text-xl shrink-0">{adversaire.emoji}</span>
        <input
          value={adversaire.nom}
          onChange={(e) => maj('nom', e.target.value)}
          className="flex-1 min-w-0 rounded-md bg-transparent border border-transparent hover:border-space-600 focus:border-space-500 px-1 py-0.5 font-bold text-space-200"
        />
        <button
          onClick={() => maj('visible', !adversaire.visible)}
          title={
            adversaire.visible
              ? 'Visible par les joueurs — cliquer pour le rendre secret'
              : 'Secret — cliquer pour le montrer aux joueurs'
          }
          className={`h-7 w-7 rounded-md text-sm shrink-0 transition ${
            adversaire.visible
              ? 'bg-sw-blue/20 border border-sw-blue/50'
              : 'bg-space-700 border border-space-600 opacity-60'
          }`}
        >
          {adversaire.visible ? '👁' : '🙈'}
        </button>
        <button
          onClick={onSupprimer}
          title="Retirer de la table"
          className="h-7 w-7 rounded-md bg-space-700 hover:bg-sw-red/50 text-xs shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Caractéristiques de combat */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={adversaire.rang}
          onChange={(e) => maj('rang', e.target.value)}
          className="rounded-md bg-space-700 border border-space-600 px-1.5 py-0.5 text-xs text-space-200"
        >
          {Object.entries(LIBELLES_RANG).map(([cle, libelle]) => (
            <option key={cle} value={cle}>
              {libelle}
            </option>
          ))}
        </select>
        <ChampNombre
          label="Seuil"
          valeur={adversaire.seuilBlessures}
          onChange={(v) => maj('seuilBlessures', Math.max(1, v))}
        />
        <ChampNombre
          label="Enc."
          valeur={adversaire.encaissement}
          onChange={(v) => maj('encaissement', v)}
        />
        <ChampNombre label="Déf." valeur={adversaire.defense} onChange={(v) => maj('defense', v)} />
      </div>

      {/* Jauge de blessures */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => maj('blessures', Math.max(0, adversaire.blessures - 1))}
          className="h-7 w-7 rounded-md bg-space-700 hover:bg-space-600 font-bold shrink-0"
          title="Soigner 1 blessure"
        >
          −
        </button>
        <div className="h-2.5 flex-1 rounded-full bg-space-700 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${ratio * 100}%`, backgroundColor: 'var(--color-sw-red)' }}
          />
        </div>
        <button
          onClick={() => maj('blessures', adversaire.blessures + 1)}
          className="h-7 w-7 rounded-md bg-space-700 hover:bg-space-600 font-bold shrink-0"
          title="Infliger 1 blessure"
        >
          +
        </button>
        <span
          className={`w-12 text-right text-sm font-bold shrink-0 ${tombe ? 'text-sw-red' : 'text-space-200'}`}
        >
          {adversaire.blessures}/{adversaire.seuilBlessures}
        </span>
      </div>

      {tombe && (
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-sw-red uppercase tracking-wide">Hors de combat</span>
          <button
            onClick={onSupprimer}
            className="rounded-md bg-sw-red/20 border border-sw-red/50 text-sw-red px-2 py-0.5 font-semibold hover:bg-sw-red/30 transition"
          >
            Le retirer
          </button>
        </div>
      )}

      {adversaire.notes && <p className="text-xs text-space-400 italic">{adversaire.notes}</p>}

      {combat && (
        <button
          onClick={onInitiative}
          className="rounded-lg bg-space-700 hover:bg-space-600 px-2 py-1 text-xs transition"
        >
          🎲 Lancer son initiative ({adversaire.aptitude} vert
          {adversaire.aptitude > 1 ? 's' : ''}
          {adversaire.maitrise > 0 ? ` + ${adversaire.maitrise} jaune` : ''})
        </button>
      )}
    </div>
  )
}

export default function SectionAdversaires({
  adversaires,
  majAdversaire,
  combat,
  majCombat,
  ajouterHistorique,
}) {
  const liste = Object.entries(adversaires).map(([cle, valeur]) => ({ ...valeur, cle }))

  const poser = (gabarit) => {
    const cle = crypto.randomUUID()
    majAdversaire(cle, { ...gabarit, blessures: 0, visible: true })
  }

  // Lance l'initiative de l'adversaire et l'insère dans l'ordre
  // du combat en cours (même tri que les autres participants).
  const lancerInitiative = (adversaire) => {
    const reserve = {
      ...RESERVE_VIDE,
      aptitude: adversaire.aptitude,
      maitrise: adversaire.maitrise,
    }
    const resultat = lancerReserve(reserve)
    ajouterHistorique({
      ts: Date.now(),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      perso: { nom: adversaire.nom, emoji: adversaire.emoji, couleur: '#7f1d1d' },
      competence: 'Initiative',
      reserve,
      resultat,
    })
    const participants = [
      ...(combat.participants ?? []),
      {
        cle: crypto.randomUUID(),
        nom: adversaire.nom,
        type: 'pnj',
        succes: resultat.nets.succes,
        avantages: resultat.nets.avantages,
      },
    ].sort((a, b) => b.succes - a.succes || b.avantages - a.avantages)

    let indexActif = 0
    if (combat.enCours) {
      const cleActive = combat.participants?.[combat.indexActif]?.cle
      indexActif = Math.max(0, participants.findIndex((x) => x.cle === cleActive))
    }
    majCombat({ ...combat, participants, indexActif })
  }

  return (
    <div className="datapad p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 border-b border-sw-or/25 pb-2 flex-wrap">
        <h3 className="titre-sw text-sm text-sw-or flex items-center gap-2">
          <span className="inline-block h-3.5 w-1.5 bg-sw-or -skew-x-12 shrink-0" />
          Adversaires
          {liste.length > 0 && (
            <span className="text-space-400 font-normal normal-case tracking-normal">
              ({liste.length} sur la table)
            </span>
          )}
        </h3>
        {liste.length > 0 && (
          <button
            onClick={() => liste.forEach((a) => majAdversaire(a.cle, null))}
            className="rounded-lg border border-space-600 bg-space-800 px-3 py-1 text-xs hover:border-sw-red hover:text-sw-red transition"
          >
            Vider la table
          </button>
        )}
      </div>

      {/* Gabarits prêts à poser */}
      <div className="flex flex-wrap gap-2">
        {GABARITS_ADVERSAIRES.map((gabarit) => (
          <button
            key={gabarit.id}
            onClick={() => poser(gabarit)}
            title={gabarit.notes}
            className="rounded-lg border border-space-600 bg-space-800 hover:border-sw-or hover:bg-space-700 px-3 py-1.5 text-xs transition"
          >
            + {gabarit.emoji} {gabarit.nom}
          </button>
        ))}
        <button
          onClick={() => poser(GABARIT_VIERGE)}
          className="rounded-lg border border-dashed border-space-500 bg-space-800/60 hover:border-sw-yellow px-3 py-1.5 text-xs transition"
        >
          + Personnalisé
        </button>
      </div>

      {liste.length === 0 ? (
        <p className="text-sm text-space-400 italic">
          Aucun adversaire sur la table. Posez-en un depuis les gabarits ci-dessus — l’icône
          👁 décide si les joueurs voient sa jauge ou non.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {liste.map((adversaire) => (
            <CarteAdversaire
              key={adversaire.cle}
              adversaire={adversaire}
              onMaj={(nouveau) => majAdversaire(adversaire.cle, nouveau)}
              onSupprimer={() => majAdversaire(adversaire.cle, null)}
              combat={combat}
              onInitiative={() => lancerInitiative(adversaire)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
