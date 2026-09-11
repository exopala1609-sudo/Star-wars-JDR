import { TYPES_DES } from '../logique/des.js'
import IconeSymbole from './IconeSymbole.jsx'

// Aide-mémoire des règles : les 7 dés, le lexique des symboles
// et la résolution d'un jet. Tout le contenu est ici, en clair,
// pour être facile à relire et à corriger.

const GUIDE_DES = [
  {
    type: 'aptitude',
    usage: 'La base de la plupart des jets : représente les capacités naturelles et l’entraînement.',
  },
  {
    type: 'maitrise',
    usage:
      'L’expertise : remplace des dés verts quand caractéristique et compétence se recoupent. Seul dé pouvant produire un Triomphe.',
  },
  {
    type: 'fortune',
    usage:
      'Un coup de pouce du destin : aide d’un allié, bonne préparation, avantage de situation.',
  },
  {
    type: 'difficulte',
    usage: 'La difficulté de base de l’action : plus elle est ardue, plus il y en a.',
  },
  {
    type: 'defi',
    usage:
      'Une opposition redoutable : remplace des dés violets face à un adversaire acharné. Seul dé pouvant produire un Désastre.',
  },
  {
    type: 'infortune',
    usage:
      'Les conditions défavorables : obscurité, blessure, terrain glissant, distraction.',
  },
  {
    type: 'force',
    usage:
      'Réservé aux utilisateurs de la Force et à la réserve de destin : produit des points lumineux ou obscurs.',
  },
]

// Couleur de chaque symbole, reprise des badges de résultat :
// l'œil fait ainsi le lien entre l'aide et les jets.
const COULEURS_SYMBOLES = {
  s: 'text-green-400',
  a: 'text-sky-400',
  t: 'text-sw-yellow',
  e: 'text-red-400',
  m: 'text-orange-400',
  d: 'text-purple-400',
  l: 'text-white',
  o: 'text-space-300',
}

const LEXIQUE = [
  { symbole: 's', nom: 'Succès', effet: 'Fait progresser l’action ; il en faut plus que d’Échecs pour réussir.' },
  { symbole: 'e', nom: 'Échec', effet: 'Annule un Succès ; l’action échoue s’ils dominent.' },
  { symbole: 'a', nom: 'Avantage', effet: 'Un bénéfice secondaire : récupérer du stress, aider un allié, créer une opportunité.' },
  { symbole: 'm', nom: 'Menace', effet: 'Une complication mineure : subir du stress, perdre l’initiative, exposer une faiblesse.' },
  { symbole: 't', nom: 'Triomphe', effet: 'Un exploit spectaculaire ! Compte aussi comme 1 Succès et déclenche un effet dramatique.' },
  { symbole: 'd', nom: 'Désastre', effet: 'Une catastrophe ! Compte aussi comme 1 Échec : arme enrayée, alarme déclenchée…' },
  { symbole: 'l', nom: 'Force lumineuse', effet: 'Point du côté lumineux, alimente la réserve de destin du groupe.' },
  { symbole: 'o', nom: 'Force obscure', effet: 'Point du côté obscur, alimente la réserve du MJ.' },
]

function Section({ titre, children }) {
  return (
    <section>
      <h4 className="titre-sw text-xs text-sw-blue mb-2">{titre}</h4>
      {children}
    </section>
  )
}

export default function AideDeJeu({ ouvert, onFermer }) {
  if (!ouvert) return null

  return (
    <div className="fixed inset-0 z-30 flex justify-end" onClick={onFermer}>
      <div className="absolute inset-0 bg-black/60" />
      <aside
        className="relative z-40 w-full max-w-md h-full bg-space-900 border-l border-space-600 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-space-700">
          <h3 className="titre-sw text-sw-yellow text-sm">Aide de jeu</h3>
          <button
            onClick={onFermer}
            className="rounded-lg bg-space-700 hover:bg-space-600 px-3 py-1 text-sm"
          >
            Fermer ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          <Section titre="Les 7 dés narratifs">
            <ul className="flex flex-col gap-2">
              {GUIDE_DES.map(({ type, usage }) => {
                const def = TYPES_DES[type]
                return (
                  <li key={type} className="flex items-start gap-3 text-sm">
                    <span
                      className="h-6 w-6 rounded-md border border-black/30 shrink-0 mt-0.5"
                      style={{ backgroundColor: def.couleur }}
                    />
                    <span>
                      <span className="font-semibold text-space-200">
                        {def.nom}{' '}
                        <span className="text-space-400 font-normal">({def.facettes} faces)</span>
                      </span>
                      <br />
                      <span className="text-space-300">{usage}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </Section>

          <Section titre="Le lexique des symboles">
            <p className="text-xs text-space-400 mb-3 -mt-1">
              Ce sont exactement les symboles que vous verrez sur les faces des dés.
            </p>
            <ul className="flex flex-col gap-2.5">
              {LEXIQUE.map(({ symbole, nom, effet }) => (
                <li key={symbole} className="flex items-start gap-3 text-sm">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-lg bg-space-800
                                border border-space-600 shrink-0 ${COULEURS_SYMBOLES[symbole]}`}
                  >
                    <IconeSymbole symbole={symbole} className="h-7 w-7" />
                  </span>
                  <span className="pt-0.5">
                    <span className="font-semibold text-space-200">{nom}.</span>{' '}
                    <span className="text-space-300">{effet}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section titre="Résoudre un jet en 3 règles">
            <ol className="flex flex-col gap-3 text-sm text-space-300 list-decimal list-inside">
              <li>
                <span className="font-semibold text-space-200">Succès contre Échecs.</span>{' '}
                Chaque Échec annule un Succès. S’il reste au moins 1 Succès net,
                l’action réussit — sinon elle échoue.
              </li>
              <li>
                <span className="font-semibold text-space-200">Avantages contre Menaces.</span>{' '}
                Ils s’annulent de la même façon, mais indépendamment de la réussite :
                on peut réussir avec des Menaces… ou échouer avec des Avantages !
              </li>
              <li>
                <span className="font-semibold text-space-200">Triomphes et Désastres.</span>{' '}
                Chacun ajoute 1 Succès (ou 1 Échec) au décompte, mais leur effet
                dramatique se déclenche toujours : ils ne s’annulent jamais entre eux.
              </li>
            </ol>
            <div className="mt-3 rounded-xl border border-space-600 bg-space-800/80 p-3 text-sm text-space-300">
              <span className="font-semibold text-space-200">Exemple.</span> Un jet donne
              2 Succès, 1 Échec, 1 Menace et 1 Triomphe : résultat net ={' '}
              <span className="text-space-200">2 Succès (2+1−1), 1 Menace, et l’effet
              spectaculaire du Triomphe</span>. Oskara touche sa cible (réussite), son
              blaster surchauffe légèrement (menace)… et l’ennemi lâche son arme (triomphe) !
            </div>
          </Section>
        </div>
      </aside>
    </div>
  )
}
