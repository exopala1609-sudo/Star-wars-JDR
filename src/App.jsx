import { useState } from 'react'
import { PERSONNAGES, getPersonnage } from './data/personnages.js'
import { personnageEffectif, progressionDe } from './logique/progression.js'
import { estConfigure } from './firebase.js'
import {
  useEtatsPartages,
  useHistoriquePartage,
  useForcePartagee,
  useReservesPartagees,
  useCombatPartage,
  useAdversairesPartages,
  useProgressionPartagee,
  useOccupantsPartages,
  useNotesPartagees,
  useDiffusionLancers,
} from './hooks/useSynchronisation.js'
import { APPAREIL_ID } from './logique/identite.js'
import SelectionPersonnage from './components/SelectionPersonnage.jsx'
import FichePersonnage from './components/FichePersonnage.jsx'
import HistoriqueLancers from './components/HistoriqueLancers.jsx'
import AideDeJeu from './components/AideDeJeu.jsx'
import VueMJ from './components/VueMJ.jsx'
import LanceurLibre from './components/LanceurLibre.jsx'
import BandeauCombat from './components/BandeauCombat.jsx'
import BandeauAdversaires from './components/BandeauAdversaires.jsx'
import AccesMJ, { accesMemorise, oublierAcces } from './components/AccesMJ.jsx'
import NotificationsLancers from './components/NotificationsLancers.jsx'

export default function App() {
  // vue = 'accueil' | 'mj' | identifiant d'un personnage
  const [vue, setVue] = useState('accueil')
  const [etats, majEtat] = useEtatsPartages()
  const [historique, ajouterEntree] = useHistoriquePartage()
  const [force, majForce] = useForcePartagee()
  const [reserves, majReserve] = useReservesPartagees()
  const [combat, majCombat] = useCombatPartage()
  const [adversaires, majAdversaire] = useAdversairesPartages()
  const [progressions, majProgression] = useProgressionPartagee()
  const { occupants, reclamer, liberer } = useOccupantsPartages()
  const [notes, majNote] = useNotesPartagees()
  const { notifications, diffuser, retirerNotification } = useDiffusionLancers()
  const [historiqueOuvert, setHistoriqueOuvert] = useState(false)
  const [aideOuverte, setAideOuverte] = useState(false)
  const [lanceurOuvert, setLanceurOuvert] = useState(false)
  const [demandeCodeMJ, setDemandeCodeMJ] = useState(false)
  const [secretPnj, setSecretPnj] = useState(false)

  // La Vue MJ n'est accessible qu'après saisie du code ; une fois
  // validé, il reste mémorisé sur l'appareil du MJ.
  const ouvrirVueMJ = () => {
    if (accesMemorise()) setVue('mj')
    else setDemandeCodeMJ(true)
  }

  const verrouillerVueMJ = () => {
    oublierAcces()
    setVue('accueil')
  }

  // Fiches « effectives » : les statistiques de base auxquelles
  // on applique les améliorations achetées avec l'expérience.
  const persosEffectifs = PERSONNAGES.map((p) =>
    personnageEffectif(p, progressionDe(progressions, p.id)),
  )

  const persoActif =
    vue !== 'accueil' && vue !== 'mj' ? persosEffectifs.find((p) => p.id === vue) : null

  // Le MJ accorde de l'expérience ; le joueur l'utilise pour
  // acheter une amélioration de sa fiche.
  const donnerXp = (persoId, delta) => {
    const progression = progressionDe(progressions, persoId)
    majProgression(persoId, {
      ...progression,
      xpTotal: Math.max(0, progression.xpTotal + delta),
    })
  }

  const acheterAmelioration = (persoId, ameliorationId) => {
    const progression = progressionDe(progressions, persoId)
    if (progression.ameliorations.includes(ameliorationId)) return
    majProgression(persoId, {
      ...progression,
      ameliorations: [...progression.ameliorations, ameliorationId],
    })
  }

  const reinitialiserAchats = (persoId) => {
    majProgression(persoId, { ...progressionDe(progressions, persoId), ameliorations: [] })
  }

  // Point de passage unique de TOUS les lancers : l'historique
  // partagé et la diffusion aux autres écrans.
  //
  // ⚠️ Un jet secret n'écrit ni dés ni résultat dans la base :
  // celle-ci est ouverte, donc tout ce qu'on y met est lisible.
  // Le résultat reste sur l'écran du MJ, dans son lanceur.
  const enregistrerLancer = ({ identite, competence, reserve, resultat, secret }) => {
    const heure = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    if (secret) {
      ajouterEntree({
        ts: Date.now(),
        heure,
        perso: { nom: 'Maître de Jeu', emoji: '🤫', couleur: '#e8a33d' },
        competence: 'Jet secret',
        secret: true,
      })
      diffuser({ id: crypto.randomUUID(), secret: true })
      return
    }

    ajouterEntree({ ts: Date.now(), heure, perso: identite, competence, reserve, resultat })
    diffuser({
      id: crypto.randomUUID(),
      secret: false,
      perso: identite,
      competence,
      nets: resultat.nets,
    })
  }

  const ajouterLancer = ({ competence, reserve, resultat }) =>
    enregistrerLancer({
      identite: { nom: persoActif.nom, emoji: persoActif.emoji, couleur: persoActif.couleur },
      competence,
      reserve,
      resultat,
    })

  // Identité affichée dans l'historique pour un lancer libre :
  // le personnage ouvert, sinon le MJ, sinon « La table »
  const identiteLibre = persoActif
    ? { nom: persoActif.nom, emoji: persoActif.emoji, couleur: persoActif.couleur }
    : vue === 'mj'
      ? { nom: 'MJ', emoji: '🎛', couleur: '#e8a33d' }
      : { nom: 'La table', emoji: '🎲', couleur: '#5c6b8f' }

  const ajouterLancerLibre = (reserve, resultat, secret) =>
    enregistrerLancer({
      identite: identiteLibre,
      competence: 'Lancer libre',
      reserve,
      resultat,
      secret,
    })

  // Réclamation d'un personnage : un écran ne peut ouvrir que
  // les fiches libres ou celles qu'il occupe déjà.
  const choisirPersonnage = (persoId) => {
    const occupant = occupants[persoId]
    if (occupant && occupant.appareil !== APPAREIL_ID) return
    if (!occupant) reclamer(persoId)
    setVue(persoId)
  }

  const libererEtRevenir = (persoId) => {
    liberer(persoId)
    setVue('accueil')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-space-700 bg-space-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="titre-sw text-sw-yellow text-lg truncate">Aux Confins de l’Empire</h1>
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] rounded-full px-2.5 py-0.5 border shrink-0 ${
                estConfigure
                  ? 'border-sw-green/50 text-sw-green'
                  : 'border-space-600 text-space-400'
              }`}
              title={
                estConfigure
                  ? 'Les écrans de toute la table sont synchronisés'
                  : 'Synchronisation non configurée : chaque écran est indépendant'
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {estConfigure ? 'Table connectée' : 'Mode local'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLanceurOuvert(true)}
              className="rounded-lg border border-space-600 bg-space-800 px-3 py-1.5 text-sm hover:border-sw-yellow transition"
            >
              🎲 Libre
            </button>
            <button
              onClick={() => setAideOuverte(true)}
              className="rounded-lg border border-space-600 bg-space-800 px-3 py-1.5 text-sm hover:border-sw-yellow transition"
            >
              ? Aide
            </button>
            <button
              onClick={() => setHistoriqueOuvert(true)}
              className="rounded-lg border border-space-600 bg-space-800 px-3 py-1.5 text-sm hover:border-sw-yellow transition"
            >
              📜 Historique{historique.length > 0 ? ` (${historique.length})` : ''}
            </button>
          </div>
        </div>
      </header>

      <BandeauCombat combat={combat} />
      {vue !== 'mj' && <BandeauAdversaires adversaires={adversaires} />}

      <main>
        {persoActif ? (
          <FichePersonnage
            perso={persoActif}
            etat={etats[persoActif.id]}
            onEtat={(nouvelEtat) => majEtat(persoActif.id, nouvelEtat)}
            onRetour={() => setVue('accueil')}
            onLancer={ajouterLancer}
            reservePartagee={reserves[persoActif.id]}
            onReserve={(reserve) => majReserve(persoActif.id, reserve)}
            progression={progressionDe(progressions, persoActif.id)}
            onAcheter={(ameliorationId) => acheterAmelioration(persoActif.id, ameliorationId)}
            notes={notes[persoActif.id] ?? ''}
            onNotes={(texte) => majNote(persoActif.id, texte)}
            onLiberer={
              occupants[persoActif.id]?.appareil === APPAREIL_ID
                ? () => libererEtRevenir(persoActif.id)
                : null
            }
          />
        ) : vue === 'mj' ? (
          <VueMJ
            etats={etats}
            majEtat={majEtat}
            force={force}
            majForce={majForce}
            reserves={reserves}
            majReserve={majReserve}
            combat={combat}
            majCombat={majCombat}
            adversaires={adversaires}
            majAdversaire={majAdversaire}
            enregistrerLancer={enregistrerLancer}
            personnages={persosEffectifs}
            progressions={progressions}
            onDonnerXp={donnerXp}
            onReinitialiserAchats={reinitialiserAchats}
            occupants={occupants}
            onLiberer={liberer}
            notesMJ={notes.mj ?? ''}
            onNotesMJ={(texte) => majNote('mj', texte)}
            secretPnj={secretPnj}
            onSecretPnj={setSecretPnj}
            onRetour={() => setVue('accueil')}
            onVerrouiller={verrouillerVueMJ}
          />
        ) : (
          <SelectionPersonnage
            personnages={persosEffectifs}
            occupants={occupants}
            monAppareil={APPAREIL_ID}
            onChoisir={choisirPersonnage}
            onVueMJ={ouvrirVueMJ}
          />
        )}
      </main>

      <HistoriqueLancers
        entrees={historique}
        ouvert={historiqueOuvert}
        onFermer={() => setHistoriqueOuvert(false)}
      />

      <AideDeJeu ouvert={aideOuverte} onFermer={() => setAideOuverte(false)} />

      <LanceurLibre
        ouvert={lanceurOuvert}
        onFermer={() => setLanceurOuvert(false)}
        onLancer={ajouterLancerLibre}
        secretDisponible={vue === 'mj'}
      />

      <NotificationsLancers
        notifications={notifications}
        onRetirer={retirerNotification}
        onOuvrirHistorique={() => setHistoriqueOuvert(true)}
      />

      <AccesMJ
        ouvert={demandeCodeMJ}
        onReussite={() => {
          setDemandeCodeMJ(false)
          setVue('mj')
        }}
        onAnnuler={() => setDemandeCodeMJ(false)}
      />
    </div>
  )
}
