import { PERSONNAGES } from '../data/personnages.js'
import { TYPES_DES } from '../logique/des.js'
import Avatar from './Avatar.jsx'
import IconeSymbole from './IconeSymbole.jsx'
import MiniReserve from './MiniReserve.jsx'
import SuiviCombat from './SuiviCombat.jsx'
import SectionAdversaires from './SectionAdversaires.jsx'
import { estConfigure } from '../firebase.js'

// Vue du Maître de Jeu : tableau de bord des 6 personnages
// (jauges vitales modifiables) et réserve de Force du groupe.

function Jauge({ valeur, max, couleur }) {
  const ratio = max ? Math.min(valeur / max, 1) : 0
  return (
    <div className="h-2 flex-1 rounded-full bg-space-700 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${ratio * 100}%`, backgroundColor: couleur }}
      />
    </div>
  )
}

function PetitBouton({ onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="h-7 w-7 rounded-md bg-space-700 hover:bg-space-600 active:scale-95 transition font-bold text-sm shrink-0"
    >
      {children}
    </button>
  )
}

function LigneJauge({ nom, valeur, max, couleur, onChange }) {
  const depassement = valeur >= max
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 text-xs uppercase tracking-wide text-space-400 shrink-0">{nom}</span>
      <PetitBouton onClick={() => onChange(Math.max(0, valeur - 1))} title={`Diminuer ${nom}`}>
        −
      </PetitBouton>
      <Jauge valeur={valeur} max={max} couleur={couleur} />
      <PetitBouton onClick={() => onChange(valeur + 1)} title={`Augmenter ${nom}`}>
        +
      </PetitBouton>
      <span
        className={`w-12 text-right text-sm font-bold shrink-0 ${depassement ? 'text-sw-red' : 'text-space-200'}`}
      >
        {valeur}/{max}
      </span>
    </div>
  )
}

// Dés que le MJ peut injecter dans la réserve d'un joueur
const DES_INJECTABLES = ['fortune', 'difficulte', 'defi', 'infortune']

function InjectionDe({ type, nombre, onChange }) {
  const def = TYPES_DES[type]
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-4 w-4 rounded-sm border border-black/30 shrink-0"
        style={{ backgroundColor: def.couleur }}
        title={def.nom}
      />
      <span className="flex-1 text-xs text-space-300 truncate">{def.nom}</span>
      <PetitBouton onClick={() => onChange(Math.max(0, nombre - 1))} title={`Retirer ${def.nom}`}>
        −
      </PetitBouton>
      <span className="w-5 text-center text-sm font-bold">{nombre}</span>
      <PetitBouton onClick={() => onChange(nombre + 1)} title={`Ajouter ${def.nom}`}>
        +
      </PetitBouton>
    </div>
  )
}

function CartePersonnageMJ({ perso, etat, onEtat, reserve, onReserve }) {
  const maj = (champ, v) => onEtat({ ...etat, [champ]: v })
  const horsCombat = etat.blessures >= perso.seuilBlessures
  return (
    <div className="datapad p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar perso={perso} tailleClasse="h-12 w-12" tailleEmoji="text-xl" />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-space-200 truncate">{perso.nom}</div>
          <div className="text-xs text-space-400 truncate">
            {perso.carriere} · Enc. {perso.encaissement} · Déf. {etat.defenseMelee}/
            {etat.defenseDistance}
          </div>
        </div>
        {horsCombat && (
          <span className="rounded-full bg-sw-red/20 border border-sw-red/50 text-sw-red text-xs font-bold px-2 py-0.5">
            K.O.
          </span>
        )}
      </div>
      <LigneJauge
        nom="Bless."
        valeur={etat.blessures}
        max={perso.seuilBlessures}
        couleur="var(--color-sw-red)"
        onChange={(v) => maj('blessures', v)}
      />
      <LigneJauge
        nom="Stress"
        valeur={etat.stress}
        max={perso.seuilStress}
        couleur="var(--color-sw-blue)"
        onChange={(v) => maj('stress', v)}
      />

      {/* ——— Réserve en préparation : injection de dés ——— */}
      {reserve ? (
        <div className="border-t border-space-700 pt-2 flex flex-col gap-2">
          <div className="text-xs text-space-300">
            Réserve en préparation :{' '}
            <span className="text-sw-yellow font-semibold">{reserve.competence}</span>
          </div>
          <MiniReserve reserve={reserve.des} />
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {DES_INJECTABLES.map((type) => (
              <InjectionDe
                key={type}
                type={type}
                nombre={reserve.des?.[type] ?? 0}
                onChange={(n) =>
                  onReserve({ ...reserve, des: { ...reserve.des, [type]: n } })
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t border-space-700 pt-2 text-xs text-space-500 italic">
          Aucune réserve en préparation — elle apparaîtra ici dès que ce joueur
          cliquera sur une compétence.
        </div>
      )}
    </div>
  )
}

function CompteurForce({ symbole, nom, valeur, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-space-700 border border-space-600 text-sw-yellow">
        <IconeSymbole symbole={symbole} className="h-5 w-5" />
      </span>
      <span className="flex-1 text-sm">{nom}</span>
      <PetitBouton onClick={() => onChange(Math.max(0, valeur - 1))} title={`Retirer ${nom}`}>
        −
      </PetitBouton>
      <span className="w-8 text-center text-xl font-bold">{valeur}</span>
      <PetitBouton onClick={() => onChange(valeur + 1)} title={`Ajouter ${nom}`}>
        +
      </PetitBouton>
    </div>
  )
}

export default function VueMJ({
  etats,
  majEtat,
  force,
  majForce,
  reserves,
  majReserve,
  combat,
  majCombat,
  adversaires,
  majAdversaire,
  ajouterHistorique,
  onRetour,
}) {
  const utiliser = (depuis, vers) => {
    if (force[depuis] <= 0) return
    majForce({ ...force, [depuis]: force[depuis] - 1, [vers]: force[vers] + 1 })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={onRetour}
          className="rounded-lg border border-space-600 bg-space-800 px-3 py-2 text-sm hover:border-sw-yellow transition"
        >
          ← Accueil
        </button>
        <h2 className="titre-sw text-xl text-sw-yellow flex-1">Vue du Maître de Jeu</h2>
        {!estConfigure && (
          <span className="text-xs text-space-400 border border-space-600 rounded-full px-3 py-1">
            Mode local — les joueurs ne voient pas encore ces changements
          </span>
        )}
      </div>

      {/* ——— Suivi de combat ——— */}
      <SuiviCombat combat={combat} majCombat={majCombat} ajouterHistorique={ajouterHistorique} />

      {/* ——— Adversaires ——— */}
      <SectionAdversaires
        adversaires={adversaires}
        majAdversaire={majAdversaire}
        combat={combat}
        majCombat={majCombat}
        ajouterHistorique={ajouterHistorique}
      />

      {/* ——— Réserve de Force du groupe ——— */}
      <div className="datapad p-4 flex flex-col gap-3">
        <h3 className="titre-sw text-sm text-sw-or flex items-center gap-2 border-b border-sw-or/25 pb-2">
          <span className="inline-block h-3.5 w-1.5 bg-sw-or -skew-x-12 shrink-0" />
          Réserve de Force du groupe
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          <CompteurForce
            symbole="l"
            nom="Points lumineux"
            valeur={force.lumineux}
            onChange={(v) => majForce({ ...force, lumineux: v })}
          />
          <CompteurForce
            symbole="o"
            nom="Points obscurs"
            valeur={force.obscurs}
            onChange={(v) => majForce({ ...force, obscurs: v })}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => utiliser('lumineux', 'obscurs')}
            disabled={force.lumineux <= 0}
            className="rounded-lg bg-space-700 hover:bg-space-600 px-3 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Un joueur utilise 1 pt lumineux → devient obscur
          </button>
          <button
            onClick={() => utiliser('obscurs', 'lumineux')}
            disabled={force.obscurs <= 0}
            className="rounded-lg bg-space-700 hover:bg-space-600 px-3 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Le MJ utilise 1 pt obscur → devient lumineux
          </button>
        </div>
      </div>

      {/* ——— Tableau de bord des personnages ——— */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONNAGES.map((p) => (
          <CartePersonnageMJ
            key={p.id}
            perso={p}
            etat={etats[p.id]}
            onEtat={(etat) => majEtat(p.id, etat)}
            reserve={reserves[p.id]}
            onReserve={(reserve) => majReserve(p.id, reserve)}
          />
        ))}
      </div>
    </div>
  )
}
