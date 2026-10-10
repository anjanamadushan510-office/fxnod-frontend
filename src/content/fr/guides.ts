/**
 * The guides in French, for French-speaking Africa.
 *
 * Written in French for what people there type (Google autocomplete for
 * Cameroon, Ivory Coast, Senegal and DR Congo, in the research file dated
 * 2026-10-10): comment retirer son argent sur Deriv, le broker Deriv est-il
 * fiable, dépôt minimum, indices synthétiques, robot de trading. They are
 * not the English guides translated. Where one says the same as an English
 * guide, `en` names it and the pages point at each other with hreflang.
 *
 * French is also read in France, Belgium and Canada, where the products
 * differ: Deriv's own terms say options are not offered to clients residing
 * in the EU. The guides say that availability depends on the country, and do
 * not describe what a French resident may trade.
 *
 * Same rules as everywhere: nothing promises a result, a statement about
 * Deriv is what Deriv's pages said on the date in `VERIFIE`, and FXNOD's
 * screens are in English, which the guides say.
 *
 * Register: "vous". Names the reader will see on screen (stop loss,
 * Rise/Fall, dBot) stay as they appear there.
 */
import type { GuideBlock, GuideCta, LocalGuide } from "../guides";

const DATE = "2026-10-10";
const VERIFIE = "10 octobre 2026";

const AVERTISSEMENT: GuideBlock = {
  type: "note",
  title: "Avertissement sur les risques",
  text: "Les options et les multiplicateurs sont des produits à haut risque. Vous pouvez perdre toute votre mise sur n'importe quelle opération, et un robot peut la perdre plus vite que vous à la main. Rien sur cette page n'est un conseil financier. Essayez tout d'abord sur un compte démo Deriv.",
};

const SOURCE: GuideBlock = {
  type: "note",
  title: "D'où vient cette information",
  text: `FXNOD est un produit indépendant et n'est pas affilié à Deriv. Ce que cette page dit de Deriv a été vérifié sur le site de Deriv le ${VERIFIE}. Deriv peut modifier ses conditions, ses limites et ses plateformes à tout moment, et ce qui s'applique à vous dépend de votre pays et de la société Deriv auprès de laquelle votre compte est ouvert. Confirmez sur deriv.com tout ce qui compte avant d'agir.`,
};

export const CTA_FR: GuideCta = {
  title: "Essayez sur un compte démo",
  text: "Créez un compte FXNOD, connectez votre compte démo Deriv et utilisez tous les outils avec des fonds virtuels. Sans abonnement ni frais d'inscription. L'application est en anglais pour le moment.",
};

const CTA_ROBOT: GuideCta = {
  title: "Un robot qui respecte vos limites",
  text: "Les robots de FXNOD tournent sur ses serveurs et ne démarrent pas sans stop loss : vos limites restent actives même si votre téléphone s'éteint ou si le réseau coupe. Essayez d'abord sur votre compte démo Deriv. L'application est en anglais pour le moment.",
};

const T_DERIV = "À propos de Deriv";
const T_ROBOTS = "Trading automatique";

export const FR_GUIDES: LocalGuide[] = [
  {
    slug: "qu-est-ce-que-deriv",
    title: "Qu'est-ce que Deriv et comment ça marche ?",
    description:
      "Deriv est un courtier en ligne : options, multiplicateurs, CFD et ses propres indices synthétiques. Ce qu'il propose, qui le régule et comment débuter.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Deriv est un courtier en ligne où l'on négocie des options, des multiplicateurs et des CFD sur les devises, les indices, les matières premières et ses propres indices synthétiques, des marchés simulés ouverts tous les jours. C'est un groupe de sociétés dont plusieurs entités sont régulées hors d'Afrique. L'ouverture du compte est gratuite et comprend un compte démo avec des fonds virtuels.",
    body: [
      { type: "h2", text: "Ce que l'on peut négocier" },
      {
        type: "table",
        head: ["Produit", "Ce que c'est", "Où, selon Deriv"],
        rows: [
          ["Options", "Vous payez une mise fixe ; vous ne pouvez pas perdre plus que cette mise", "Deriv Trader et Deriv Bot"],
          ["Multiplicateurs", "La position suit le prix avec un multiplicateur, et la perte est limitée à la mise", "Deriv Trader et l'application Deriv"],
          ["CFD", "Des positions avec effet de levier sur le mouvement du prix", "Deriv MT5 et Deriv cTrader"],
        ],
      },
      {
        type: "p",
        text: "Les produits proposés dépendent de votre pays. Les conditions de Deriv indiquent par exemple que les options ne sont pas offertes aux clients résidant dans l'Union européenne.",
      },
      { type: "h2", text: "Les indices synthétiques" },
      {
        type: "p",
        text: "Ce sont des produits propres à Deriv. Deriv dit que leurs prix sont produits par un générateur de nombres aléatoires cryptographiquement sûr, que l'actualité ne les influence pas et qu'ils sont disponibles 24 heures sur 24, week-ends et jours fériés compris. Ils ne représentent aucun actif réel et ne se négocient que chez Deriv.",
      },
      { type: "h2", text: "Qui est derrière" },
      {
        type: "p",
        text: "Le site de Deriv présente Jean-Yves Sireau comme fondateur et Rakshit Choudhary comme directeur général, et dit servir des traders depuis plus de 25 ans. La société mère, Deriv.com Limited, est enregistrée à Guernesey. Les comptes sont ouverts auprès d'entités distinctes, régulées à Labuan (Malaisie), aux Îles Vierges britanniques, au Vanuatu, à Maurice et aux Îles Caïmans, selon la page de régulation de Deriv.",
      },
      { type: "h2", text: "Comment débuter" },
      {
        type: "steps",
        items: [
          { title: "Ouvrez le compte sur le site de Deriv", text: "Tapez vous-même l'adresse deriv.com. Vous devez avoir 18 ans ou plus." },
          { title: "Utilisez le compte démo", text: "Il contient des fonds virtuels. Aucun dépôt n'est nécessaire pour apprendre." },
          { title: "Choisissez un marché et un contrat simple", text: "Par exemple Rise/Fall : le prix finira-t-il plus haut ou plus bas ?" },
          { title: "Faites vérifier votre identité tôt", text: "Deriv dit que l'accès complet l'exige. Faites-le avant d'avoir besoin d'un retrait." },
          { title: "Déposez peu et testez un retrait", text: "Avant de mettre davantage." },
        ],
      },
      { type: "h2", text: "Ce qu'il faut savoir avant" },
      {
        type: "list",
        items: [
          "Ses produits sont à haut risque. Une option perdue coûte toute la mise.",
          "La protection dont vous bénéficiez dépend de l'entité Deriv de votre compte et de son régulateur.",
          "Beaucoup d'arnaques utilisent le nom de Deriv : sites copiés, faux agents du support et robots aux gains garantis.",
        ],
      },
      { type: "h2", text: "Deriv et FXNOD" },
      {
        type: "p",
        text: "FXNOD est un terminal indépendant qui fonctionne avec votre propre compte Deriv. Vous vous connectez sur la page de Deriv, votre solde reste chez Deriv, et vous pouvez trader à la main ou lancer un robot depuis FXNOD. FXNOD ne fait pas partie de Deriv.",
      },
      SOURCE,
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Deriv est-il un broker ?",
        a: "Oui. C'est un groupe de sociétés qui propose des options, des multiplicateurs et des CFD, avec plusieurs entités régulées dans différentes juridictions.",
      },
      {
        q: "L'ouverture d'un compte Deriv est-elle payante ?",
        a: "Deriv dit que la création du compte est gratuite et que des fonds ne sont nécessaires que pour trader en réel.",
      },
      {
        q: "Deriv propose-t-il un compte démo ?",
        a: "Oui. Chaque compte comprend un compte démo avec des fonds virtuels, sans dépôt.",
      },
      {
        q: "FXNOD appartient-il à Deriv ?",
        a: "Non. FXNOD est un produit indépendant qui se connecte à votre compte Deriv par l'API de Deriv.",
      },
    ],
    related: ["deriv-est-il-fiable", "comment-trader-sur-deriv"],
  },

  {
    slug: "deriv-est-il-fiable",
    title: "Le broker Deriv est-il fiable ? Ce que vous pouvez vérifier",
    description:
      "Deriv est un groupe de courtage établi, avec des entités régulées à l'étranger. Ce que cela protège, ce que cela ne protège pas, et comment vérifier.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Deriv est un groupe de courtage réel et ancien : il dit exister depuis plus de 25 ans et nomme des entités régulées à Labuan, aux Îles Vierges britanniques, au Vanuatu, à Maurice et aux Îles Caïmans. Fiable ne veut pas dire sans risque. Ses produits sont à haut risque, la protection varie selon l'entité, et le plus grand danger vient de ceux qui se font passer pour Deriv.",
    body: [
      { type: "h2", text: "Ce que vous pouvez vérifier vous-même" },
      {
        type: "steps",
        items: [
          { title: "Trouvez votre entité", text: "Votre compte et ses conditions indiquent avec quelle société Deriv vous contractez." },
          { title: "Consultez le registre du régulateur", text: "Allez sur le site du régulateur par votre propre recherche, pas par un lien reçu, et cherchez la société par son nom." },
          { title: "Vérifiez l'adresse", text: "Le site de Deriv est deriv.com. Lisez-la lettre par lettre avant de vous connecter." },
          { title: "Testez un petit retrait", text: "Déposez peu et retirez-le avant de mettre davantage." },
        ],
      },
      { type: "h2", text: "Ce que signifie cette régulation" },
      {
        type: "list",
        items: [
          "Elle signifie qu'une société nommée détient une licence et répond à un régulateur.",
          "Ce n'est pas la surveillance d'un régulateur de votre région. La page de régulation de Deriv ne nomme ni l'AMF-UMOA, ni la COSUMAF, ni un autre régulateur africain francophone.",
          "Elle ne rend aucune opération plus sûre. Un produit à haut risque le reste.",
        ],
      },
      { type: "h2", text: "Est-ce légal dans mon pays ?" },
      {
        type: "p",
        text: "Ce guide ne donne pas d'avis juridique. Les conditions de Deriv disent qu'il ne fournit ses services qu'aux résidents de certains pays, que la liste peut changer et qu'il vous revient de connaître les restrictions là où vous vivez. Certains régulateurs ont pris des mesures : au Brésil, la CVM a ordonné en juin 2023 la suspension de toute offre de Deriv.com aux résidents brésiliens. Consultez les communiqués du régulateur de votre pays.",
      },
      { type: "h2", text: "Réclamations" },
      {
        type: "p",
        text: "Les conditions de Deriv indiquent une adresse e-mail pour les réclamations et promettent une réponse définitive sous 15 jours ouvrables. Deriv dit aussi être enregistré auprès de la Financial Commission, un organisme de règlement des litiges qui n'est pas un régulateur public.",
      },
      { type: "h2", text: "Le vrai danger : les imposteurs" },
      {
        type: "table",
        head: ["Ce que vous voyez", "Ce que c'est"],
        rows: [
          ["Un site ou une application presque identiques à Deriv", "Une copie destinée à voler vos identifiants"],
          ["Un support qui vous écrit en premier sur WhatsApp ou Telegram", "Personne chez Deriv n'a besoin de votre mot de passe ni de vos codes"],
          ["Quelqu'un qui propose de gérer votre compte", "Vous lui confieriez votre argent"],
          ["Un robot aux gains garantis", "Personne ne peut garantir un résultat"],
          ["Des frais pour débloquer un retrait", "Une arnaque : ces frais n'existent pas"],
        ],
      },
      { type: "h2", text: "Les outils tiers" },
      {
        type: "p",
        text: "Des outils indépendants comme FXNOD se connectent à votre compte par l'API de Deriv. Un outil sérieux vous envoie sur la page de connexion de Deriv, ne demande jamais votre mot de passe Deriv et laisse votre solde chez Deriv. Être connecté à Deriv n'est pas une recommandation de Deriv.",
      },
      SOURCE,
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Deriv est-il régulé ?",
        a: "Deriv nomme plusieurs entités et leurs régulateurs, dont ceux de Labuan, des Îles Vierges britanniques, du Vanuatu, de Maurice et des Îles Caïmans. Celui qui s'applique dépend de votre compte.",
      },
      {
        q: "Deriv est-il une arnaque ?",
        a: "Deriv est un groupe établi dont des entités sont licenciées. Beaucoup d'arnaques utilisent son nom, et beaucoup de gens perdent de l'argent sur ses produits. Ni l'un ni l'autre ne fait de Deriv une arnaque.",
      },
      {
        q: "Mon argent est-il en sécurité chez Deriv ?",
        a: "Cela dépend de l'entité de votre compte et des règles de son régulateur. Aucun broker ne vous protège des pertes de trading.",
      },
    ],
    related: ["qu-est-ce-que-deriv", "comment-retirer-son-argent-sur-deriv"],
    en: "is-deriv-legit",
  },

  {
    slug: "comment-trader-sur-deriv",
    title: "Comment trader sur Deriv : le guide du débutant",
    description:
      "Débutez sur Deriv dans le bon ordre : compte démo, un seul marché, un contrat simple, des limites fixées, puis seulement un petit dépôt.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Pour débuter sur Deriv, ouvrez un compte gratuit, passez sur le compte démo et ses fonds virtuels, choisissez un seul marché et un contrat simple comme Rise/Fall, et faites de petites opérations jusqu'à comprendre comment chacune se règle. Fixez la perte que vous acceptez avant tout dépôt, et commencez avec la mise minimale.",
    body: [
      { type: "h2", text: "Les étapes, dans l'ordre" },
      {
        type: "steps",
        items: [
          { title: "Créez le compte", text: "Sur le site de Deriv. Vous devez avoir 18 ans ou plus." },
          { title: "Restez sur le compte démo", text: "Tout ce qui suit se fait sans dépôt." },
          { title: "Choisissez un marché", text: "Beaucoup commencent par un indice de volatilité, ouvert à toute heure. Un indice au numéro bas bouge moins." },
          { title: "Choisissez un contrat", text: "Rise/Fall pose une seule question : le prix finira-t-il plus haut ou plus bas ?" },
          { title: "Lisez le paiement avant d'acheter", text: "Le formulaire affiche ce que le contrat rapporte. En cas de perte, une option coûte toute la mise." },
          { title: "Faites vingt petites opérations et notez-les", text: "Vous apprenez comment le contrat se comporte, vous ne cherchez pas à gagner." },
          { title: "Fixez vos limites et déposez peu", text: "Décidez de la perte maximale d'une journée. Alors seulement, déposez de l'argent que vous pouvez vous permettre de perdre." },
        ],
      },
      { type: "h2", text: "Options, MT5 ou robot ?" },
      {
        type: "table",
        head: ["Si vous voulez", "Utilisez", "Difficulté"],
        rows: [
          ["Trader à la main avec un risque fixe", "Deriv Trader (options)", "Faible"],
          ["Automatiser une règle simple", "Un constructeur de robots, en démo", "Moyenne"],
          ["Trader le forex ou les CFD avec des graphiques avancés", "Deriv MT5 ou cTrader", "Élevée : il faut comprendre la marge et l'effet de levier"],
        ],
      },
      {
        type: "p",
        text: "Commencez par les options en démo. Les CFD comportent un effet de levier, et Deriv avertit lui-même qu'ils présentent un risque élevé de perdre de l'argent rapidement.",
      },
      { type: "h2", text: "Le calcul qui compte" },
      {
        type: "p",
        text: "Sur un contrat à deux issues à peu près égales, le paiement est inférieur au double de la mise. Si vous misez 10 et que le contrat rend 19,50, il faut gagner plus de 51,3 % des fois simplement pour ne pas perdre : 10 divisé par 19,50. Faites cette division avec le paiement affiché avant chaque opération.",
      },
      { type: "h2", text: "Les erreurs du débutant" },
      {
        type: "list",
        items: [
          "Déposer dès le premier jour.",
          "Augmenter la mise après une perte.",
          "Copier un robot ou un signal sans en connaître les règles.",
          "Prendre une première semaine gagnante pour une preuve de compétence.",
        ],
      },
      { type: "h2", text: "Avec FXNOD" },
      {
        type: "p",
        text: "FXNOD est un terminal distinct qui travaille sur votre propre compte Deriv. Vous vous connectez sur la page de Deriv, puis vous pouvez trader à la main dans dTrader ou lancer un robot, d'abord sur le compte démo. Il s'ouvre dans le navigateur du téléphone, sans rien installer. L'application est en anglais pour le moment.",
      },
      SOURCE,
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Quel est le contrat le plus simple sur Deriv ?",
        a: "Rise/Fall est le plus facile à comprendre. Un contrat perdu coûte tout de même toute la mise.",
      },
      {
        q: "Peut-on trader sur Deriv avec un téléphone ?",
        a: "Oui. Deriv dit que son application est gratuite sur iOS et Android, selon votre pays. FXNOD fonctionne dans le navigateur du téléphone.",
      },
      {
        q: "Faut-il beaucoup d'argent pour commencer ?",
        a: "Non pour apprendre : le compte démo est gratuit. En réel, utilisez une somme que vous pouvez perdre entièrement et la mise minimale du contrat.",
      },
    ],
    related: ["indices-synthetiques", "depot-minimum-deriv"],
    en: "how-to-trade-on-deriv-for-beginners",
  },

  {
    slug: "comment-retirer-son-argent-sur-deriv",
    title: "Comment retirer son argent sur Deriv : étapes et délais",
    description:
      "Pour retirer sur Deriv : compte vérifié, même moyen que le dépôt, confirmation par e-mail. Les étapes, les délais et les raisons d'un retard.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Pour retirer votre argent de Deriv, faites vérifier votre compte, ouvrez la caisse, choisissez le moyen de paiement, indiquez le montant et confirmez la demande depuis l'e-mail envoyé par Deriv. Les conditions de Deriv demandent de retirer par le moyen utilisé pour le dépôt. Les moyens disponibles dans votre pays sont ceux qu'affiche votre propre caisse.",
    body: [
      { type: "h2", text: "Étape par étape" },
      {
        type: "steps",
        items: [
          { title: "Faites vérifier le compte avant", text: "Identité et adresse. Un compte non vérifié est la première cause d'un retrait bloqué." },
          { title: "Ouvrez la caisse sur le site de Deriv", text: "Choisissez le retrait." },
          { title: "Confirmez l'e-mail de vérification", text: "Deriv envoie un lien pour confirmer la demande." },
          { title: "Choisissez le moyen et le montant", text: "L'écran affiche le minimum et le maximum de ce moyen." },
          { title: "Vérifiez votre compte mobile ou bancaire", text: "Constatez vous-même que l'argent est arrivé." },
        ],
      },
      { type: "h2", text: "Ce que Deriv affichait pour le mobile money" },
      {
        type: "table",
        head: ["Service", "Retrait", "Délai indiqué"],
        rows: [
          ["Orange Money", "5 à 750 USD", "Instantané"],
          ["MTN", "5 à 750 USD", "Instantané"],
          ["Moov", "5 à 750 USD", "Instantané"],
          ["Airtel", "5 à 750 USD", "Instantané"],
        ],
      },
      {
        type: "p",
        text: `Ce sont les chiffres de la page des moyens de paiement de Deriv le ${VERIFIE}. Chaque service n'est proposé que dans certains pays. Si l'un d'eux n'apparaît pas dans votre caisse, il n'est pas disponible pour votre compte.`,
      },
      { type: "h2", text: "Les autres voies" },
      {
        type: "table",
        head: ["Voie", "Fonctionnement", "À retenir"],
        rows: [
          ["Carte ou portefeuille électronique", "Retour vers le moyen utilisé pour déposer", "Deriv indique un jour ouvrable pour les cartes ; s'y ajoute le délai de votre banque"],
          ["Deriv P2P", "Vous vendez votre solde à un autre utilisateur vérifié, avec un séquestre", "Ne libérez que lorsque l'argent est réellement sur votre compte"],
          ["Agent de paiement", "Un tiers indépendant vous paie en monnaie locale", "Deriv dit n'être affilié à aucun agent et que vous traitez avec eux à vos risques"],
          ["Cryptomonnaies", "Envoi vers votre portefeuille sur le réseau indiqué", "Les frais de réseau sont à votre charge"],
        ],
      },
      { type: "h2", text: "Pourquoi un retrait tarde" },
      {
        type: "list",
        items: [
          "Le compte n'est pas vérifié.",
          "Le numéro ou le compte de destination n'est pas à votre nom.",
          "La demande a été faite hors des heures ouvrables. Les conditions de Deriv disent qu'elle peut alors prendre plus de temps.",
          "L'e-mail de vérification n'a pas été confirmé.",
          "Votre banque met plusieurs jours à créditer.",
        ],
      },
      { type: "h2", text: "La devise et le taux" },
      {
        type: "p",
        text: "Les comptes Deriv sont tenus en dollars, euros, livres, dollars australiens ou cryptomonnaies, selon son personnel. Il n'y a pas de compte en francs CFA. Le retrait est converti au taux du moyen utilisé : comparez le montant final que vous recevrez, pas seulement le taux.",
      },
      { type: "h2", text: "S'il n'arrive pas" },
      {
        type: "p",
        text: "Regardez le statut dans la caisse et notez la référence. Écrivez au chat en direct de Deriv depuis son propre site. Ne payez personne pour accélérer ou débloquer un retrait : ces frais n'existent pas. FXNOD n'intervient pas dans les retraits de Deriv et ne peut pas les voir.",
      },
      SOURCE,
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Combien de temps prend un retrait Deriv ?",
        a: "Cela dépend du moyen. Deriv indique de l'instantané à un jour ouvrable de son côté, et votre banque ou votre opérateur peut en ajouter.",
      },
      {
        q: "Peut-on retirer sur Orange Money ?",
        a: `La page de paiement de Deriv listait Orange Money le ${VERIFIE}. Votre caisse indique s'il est proposé à votre compte.`,
      },
      {
        q: "Peut-on retirer par un autre moyen que celui du dépôt ?",
        a: "Les conditions de Deriv demandent d'utiliser le même moyen. Pour un autre, posez la question au chat en direct de Deriv.",
      },
      {
        q: "Deriv facture-t-il les retraits ?",
        a: "Le centre d'aide de Deriv dit que le moyen de paiement peut facturer des frais, et que les cryptomonnaies supportent des frais de réseau.",
      },
    ],
    related: ["depot-minimum-deriv", "deriv-est-il-fiable"],
  },

  {
    slug: "depot-minimum-deriv",
    title: "Dépôt minimum sur Deriv : combien faut-il pour commencer ?",
    description:
      "Le centre d'aide de Deriv indique 5 dollars comme dépôt le plus bas. Le minimum réel dépend du moyen de paiement. Comment recharger et combien prévoir.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      `Le centre d'aide de Deriv indique que le dépôt le plus bas est de 5 dollars. Le minimum réel dépend du moyen de paiement et s'affiche quand vous le sélectionnez. Le ${VERIFIE}, la page de paiement de Deriv listait plusieurs services de mobile money à partir de 5 dollars et les cartes à partir de 10. Les moyens proposés varient selon le pays.`,
    body: [
      { type: "h2", text: "Comment recharger son compte" },
      {
        type: "steps",
        items: [
          { title: "Connectez-vous à Deriv", text: "Sur son propre site ou son application." },
          { title: "Ouvrez la caisse et choisissez le dépôt", text: "Sélectionnez la devise ou le portefeuille à alimenter." },
          { title: "Choisissez un moyen de paiement", text: "Le minimum et le maximum s'affichent avant la confirmation." },
          { title: "Validez le paiement", text: "Deriv dit que les dépôts par carte et portefeuille sont en général instantanés une fois le paiement confirmé." },
        ],
      },
      { type: "h2", text: "Ce que Deriv affichait" },
      {
        type: "table",
        head: ["Moyen", "Dépôt", "Délai"],
        rows: [
          ["Orange Money", "6 à 150 USD", "Instantané"],
          ["MTN, Moov, Airtel", "5 à 150 USD", "Instantané"],
          ["Visa et Mastercard", "10 à 10 000 USD", "Instantané"],
          ["Deriv P2P", "Jusqu'à 10 000 USD par jour", "Jusqu'à 1 heure"],
        ],
      },
      {
        type: "p",
        text: "Cette page ne montre qu'une partie des moyens à la fois, et chacun n'existe que dans certains pays. La liste valable pour vous est celle de votre caisse.",
      },
      { type: "h2", text: "Dépôt minimum ne veut pas dire risque minimum" },
      {
        type: "p",
        text: "Un petit dépôt limite ce que vous pouvez perdre au total. Il ne permet aussi que peu d'opérations. Avec 5 dollars et une mise de 1, cinq pertes de suite vident le compte, et cinq de suite est un événement ordinaire. Si le dépôt est petit, la mise doit l'être encore plus.",
      },
      {
        type: "table",
        head: ["Mise par opération", "Dépôt", "Pertes de suite qui l'épuisent"],
        rows: [
          ["1", "10", "10"],
          ["0,35", "10", "28"],
          ["0,50", "50", "100"],
        ],
      },
      { type: "h2", text: "Frais et taux de change" },
      {
        type: "p",
        text: "Le centre d'aide de Deriv dit ne facturer aucun frais de dépôt. Votre opérateur ou votre banque peut en prélever, et votre monnaie est convertie dans la devise du compte. Sur de petits montants, cette conversion pèse plus que tout coût de trading.",
      },
      { type: "h2", text: "Numéros et applications à éviter" },
      {
        type: "list",
        items: [
          "Un numéro de paiement reçu par message. Les coordonnées viennent uniquement de votre caisse.",
          "Une application ou un fichier APK présenté comme l'application de dépôt de Deriv.",
          "Un agent trouvé dans un groupe plutôt que dans votre caisse.",
        ],
      },
      { type: "h2", text: "Sans dépôt" },
      {
        type: "p",
        text: "Vous n'avez pas besoin de déposer pour apprendre. Le compte démo de Deriv utilise des fonds virtuels, et FXNOD fonctionne avec lui : vous pouvez trader à la main ou tester un robot sans mettre d'argent.",
      },
      SOURCE,
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Peut-on déposer 1 dollar sur Deriv ?",
        a: "Le centre d'aide de Deriv indique 5 dollars comme dépôt le plus bas. Votre caisse affiche le minimum de votre moyen de paiement.",
      },
      {
        q: "Peut-on déposer en francs CFA ?",
        a: "Les comptes ne sont pas tenus en francs CFA. Vous payez par un moyen qui convertit vers la devise du compte.",
      },
      {
        q: "Faut-il déposer pour utiliser FXNOD ?",
        a: "Non. FXNOD ne reçoit pas de dépôts pour le trading. Il utilise le solde de votre compte Deriv, virtuel sur le compte démo.",
      },
    ],
    related: ["comment-retirer-son-argent-sur-deriv", "comment-trader-sur-deriv"],
    en: "what-is-the-minimum-deposit-on-deriv",
  },

  {
    slug: "indices-synthetiques",
    title: "Indices synthétiques : définition et fonctionnement",
    description:
      "Les indices synthétiques sont des marchés simulés dont le prix vient d'un générateur aléatoire, pas d'acheteurs et de vendeurs. Familles et risques.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Les indices synthétiques sont des marchés simulés créés par un courtier. Leur prix est produit par un générateur de nombres aléatoires conçu pour se comporter d'une certaine façon, par exemple avec une volatilité fixe, et non par des acheteurs et des vendeurs. Ceux de Deriv sont ouverts 24 heures sur 24, tous les jours, et selon Deriv l'actualité ne les influence pas.",
    body: [
      { type: "h2", text: "La différence avec un marché réel" },
      {
        type: "table",
        head: ["", "Marché réel", "Indice synthétique"],
        rows: [
          ["Origine du prix", "Des échanges entre acheteurs et vendeurs", "Un générateur de nombres aléatoires"],
          ["Carnet d'ordres", "Oui", "Non"],
          ["Réagit à l'actualité", "Oui", "Non, selon Deriv"],
          ["Horaires", "Ceux du marché", "Tous les jours, à toute heure"],
          ["Où le négocier", "Chez de nombreux courtiers", "Uniquement chez le courtier qui l'a créé"],
        ],
      },
      { type: "h2", text: "Les familles décrites par Deriv" },
      {
        type: "table",
        head: ["Famille", "Conçue pour"],
        rows: [
          ["Volatility", "Garder une volatilité constante, de 10 % à 250 %, avec un tick toutes les deux secondes ou chaque seconde"],
          ["Crash et Boom", "Évoluer régulièrement, avec une chute ou une hausse brutale en moyenne tous les N ticks"],
          ["Step", "Monter ou descendre d'un montant fixe à chaque tick"],
          ["Jump", "Faire un saut toutes les 20 minutes en moyenne, vers le haut ou vers le bas"],
          ["Range Break", "Rester entre deux bornes, puis en sortir pour former une nouvelle fourchette"],
        ],
      },
      { type: "h2", text: "Ce que veut dire aléatoire" },
      {
        type: "list",
        items: [
          "Deriv dit qu'il n'y a pas de carnet d'ordres et que les figures passées sur ces indices relèvent de la coïncidence.",
          "L'ampleur des mouvements est conçue. Le sens du prochain mouvement est imprévisible.",
          "Les indicateurs et les figures graphiques se tracent correctement et ne disent rien du prochain tick.",
          "Le résultat dépend du paiement, de la mise et de vos limites, pas d'une prévision.",
        ],
      },
      { type: "h2", text: "Le nombre dans le nom" },
      {
        type: "p",
        text: "Dans Volatility 75, le 75 est le niveau de volatilité pour lequel l'indice est construit : il bouge davantage par tick que Volatility 10. Dans Boom 1000 ou Crash 500, le nombre est le nombre moyen de ticks entre deux mouvements brusques. Moyen est le mot important : le prochain peut survenir à n'importe quel tick.",
      },
      { type: "h2", text: "Sont-ils manipulés ?" },
      {
        type: "p",
        text: "Deriv affirme qu'ils proviennent d'un générateur aléatoire. Personne ne peut le vérifier de l'extérieur, et FXNOD non plus. Ce qui se voit, c'est le coût : un contrat à deux issues égales qui paie moins du double perd un peu en moyenne à chaque opération. Il n'y a pas besoin de manipulation pour perdre régulièrement.",
      },
      { type: "h2", text: "Cours, PDF et formations" },
      {
        type: "p",
        text: "On cherche beaucoup des PDF et des formations sur le trading des indices synthétiques. Méfiez-vous de tout document qui promet une stratégie gagnante : sur une série aléatoire, aucune méthode ne prédit le sens du prix. Ce qui s'apprend réellement, c'est le calcul du paiement, la taille de la mise et les limites.",
      },
      SOURCE,
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Les indices synthétiques sont-ils réels ?",
        a: "Ce sont de vrais produits sur lesquels vous pouvez gagner ou perdre de l'argent. Ils ne représentent aucun actif : le prix est produit par un algorithme.",
      },
      {
        q: "Peut-on prévoir les indices synthétiques ?",
        a: "Pas leur sens. Deriv les décrit comme générés aléatoirement et dit que les figures passées sont des coïncidences.",
      },
      {
        q: "Quel indice synthétique choisir pour débuter ?",
        a: "Un indice de volatilité basse, au tick normal de deux secondes, sur le compte démo. Il bouge moins et moins vite. Aucun n'est plus facile à deviner.",
      },
      {
        q: "Peut-on les trader le week-end ?",
        a: "Oui. Deriv les décrit comme disponibles tous les jours, week-ends et jours fériés compris.",
      },
    ],
    related: ["comment-trader-sur-deriv", "robot-de-trading"],
    en: "what-are-synthetic-indices",
  },

  {
    slug: "robot-de-trading",
    title: "Robot de trading : qu'est-ce que c'est et comment ça marche ?",
    description:
      "Un robot de trading est un programme qui passe des ordres selon des règles que vous fixez. Ce qu'il décide, où il tourne, ce qu'il peut et ne peut pas faire.",
    tag: T_ROBOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Un robot de trading est un programme qui trade à votre place selon des règles fixées à l'avance : quoi acheter, quand entrer, combien miser et quand s'arrêter. Il surveille le marché et exécute chaque opération qui respecte ces règles. Il supprime l'hésitation et la fatigue. Il ne supprime pas le risque, et il ne prédit pas le prix.",
    body: [
      { type: "h2", text: "Les quatre décisions de tout robot" },
      {
        type: "table",
        head: ["Décision", "Ce que cela veut dire", "Exemple"],
        rows: [
          ["Quoi trader", "Le marché et le contrat", "Rise/Fall sur un indice de volatilité, sur cinq ticks"],
          ["Quand entrer", "Le signal qui déclenche l'opération", "Après trois ticks dans le même sens"],
          ["Combien miser", "Le montant de chaque opération et son évolution", "Toujours la même mise"],
          ["Quand s'arrêter", "Les limites qui terminent la session", "Arrêt à 20 de perte ou 10 de gain"],
        ],
      },
      {
        type: "p",
        text: "Les débutants regardent presque uniquement la deuxième ligne. Les traders expérimentés regardent la troisième et la quatrième, car ce sont elles qui décident de la durée de vie du compte.",
      },
      { type: "h2", text: "Où tourne le robot" },
      {
        type: "p",
        text: "Certains robots tournent dans l'onglet de votre navigateur. Fermez l'onglet, perdez le réseau ou laissez l'appareil se mettre en veille, et le robot s'arrête, parfois avec une opération ouverte et sans stop loss. D'autres tournent sur un serveur et continuent quand votre appareil est éteint. Ceux de FXNOD sont du second type : un robot lancé dans dBot ou dans Auto Hub tourne sur les serveurs de FXNOD, où ses limites sont vérifiées avant chaque opération.",
      },
      { type: "h2", text: "Ce qu'il fait bien, et ce qu'il ne fait pas" },
      {
        type: "list",
        items: [
          "Bien : appliquer une règle exactement, à chaque fois, à toute heure, sans peur ni avidité.",
          "Bien : la vitesse. Les contrats de quelques ticks ne se tradent pas régulièrement à la main.",
          "Mal : s'apercevoir que la règle ne fonctionne plus. Il applique une règle perdante aussi fidèlement qu'une gagnante.",
          "Mal : créer un avantage. Si la stratégie n'en a pas, l'automatiser ne fait que perdre plus vite.",
        ],
      },
      { type: "h2", text: "Robot gratuit, robot IA, robot rentable" },
      {
        type: "p",
        text: "Ce sont les recherches les plus fréquentes. La plupart des robots vendus comme intelligence artificielle sont des règles fixes sous un autre nom, souvent avec une mise qui grossit après chaque perte. Aucun robot n'est rentable par nature : il rapporte ce que rapporte sa stratégie. Ce qui compte, c'est de pouvoir lire les règles, fixer la mise et le stop loss, et l'essayer en démo.",
      },
      { type: "h2", text: "À qui cela convient" },
      {
        type: "p",
        text: "À celui qui peut décrire sa stratégie par des règles sans appréciation personnelle, et qui accepte de les tester en démo avant d'y mettre de l'argent. Si vous ne savez pas encore dire exactement quand vous entreriez et sortiriez, tradez d'abord à la main en démo.",
      },
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Les robots de trading fonctionnent-ils ?",
        a: "Ils exécutent leurs règles de façon fiable. Qu'ils gagnent de l'argent dépend entièrement des règles, et la plupart des stratégies n'ont pas d'avantage.",
      },
      {
        q: "Un robot de trading peut-il perdre de l'argent ?",
        a: "Oui, y compris tout le solde du compte, et plus vite qu'une personne.",
      },
      {
        q: "Faut-il savoir programmer ?",
        a: "Non. Il existe des constructeurs sans code. Dans dBot de FXNOD, on le construit en répondant à des questions.",
      },
      {
        q: "Un robot de trading est-il légal ?",
        a: "En général oui sur votre propre compte, là où le produit est légal pour vous et où le courtier l'autorise. Vérifiez les règles de votre pays.",
      },
    ],
    related: ["robot-de-trading-pour-deriv", "tester-un-robot-de-trading"],
    en: "what-is-automated-trading",
    cta: CTA_ROBOT,
  },

  {
    slug: "robot-de-trading-pour-deriv",
    title: "Robot de trading pour Deriv : les options et comment choisir",
    description:
      "Deux façons d'utiliser un robot sur Deriv : Deriv Bot, par blocs dans votre navigateur, ou un outil externe par l'API. Les différences et les critères.",
    tag: T_ROBOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Sur Deriv, vous pouvez utiliser un robot de deux façons : avec Deriv Bot, l'outil de Deriv où l'on assemble la stratégie avec des blocs visuels et qui tourne dans votre navigateur, ou avec un outil indépendant connecté à votre compte par l'API de Deriv. Choisissez-en un dont vous pouvez lire les règles, qui exige un stop loss et que vous pouvez essayer en démo.",
    body: [
      { type: "h2", text: "Deriv Bot, selon Deriv" },
      {
        type: "list",
        items: [
          "Il se construit avec des blocs visuels, sans programmation.",
          "Il propose des stratégies prédéfinies que Deriv nomme : Martingale, D'Alembert et Oscar's Grind.",
          "Il enregistre et charge les stratégies sous forme de fichiers XML.",
          "Il tourne dans votre navigateur et se met en pause si vous le fermez.",
          "Il peut être testé sur un compte démo gratuit.",
        ],
      },
      { type: "h2", text: "Deriv Bot et dBot de FXNOD" },
      {
        type: "table",
        head: ["", "Deriv Bot", "dBot de FXNOD"],
        rows: [
          ["Éditeur", "Deriv", "FXNOD, un produit indépendant"],
          ["Construction", "Par blocs visuels", "En répondant à des questions"],
          ["Où il tourne", "Dans votre navigateur", "Sur les serveurs de FXNOD"],
          ["Si vous fermez la page", "Le robot se met en pause", "Le robot et ses limites continuent"],
          ["Fichiers de stratégie", "XML", "Enregistré dans votre compte FXNOD ; pas de XML"],
          ["Stop loss", "Disponible comme outil", "Obligatoire pour démarrer"],
          ["Langue", "Le site de Deriv existe en français", "Anglais pour le moment"],
        ],
      },
      { type: "h2", text: "Choisir en cinq questions" },
      {
        type: "steps",
        items: [
          { title: "Puis-je lire toutes les règles ?", text: "Si la logique est secrète, vous ne pouvez pas évaluer le risque." },
          { title: "Qui contrôle la mise ?", text: "Vous devez pouvoir la fixer et voir comment elle change après un gain ou une perte." },
          { title: "Comment se connecte-t-il ?", text: "Par la page de connexion de Deriv. Jamais avec votre mot de passe." },
          { title: "Où tourne-t-il ?", text: "S'il dépend d'un onglet ouvert, vos limites aussi." },
          { title: "Puis-je l'essayer gratuitement en démo ?", text: "S'il ne marche qu'en réel, on vous pousse." },
        ],
      },
      { type: "h2", text: "Et les robots MT5 ?" },
      {
        type: "p",
        text: "Un robot MT5, appelé expert advisor, est un programme qui tourne dans le terminal MetaTrader 5 et trade des CFD avec effet de levier. Il ne fonctionne que tant que le terminal est allumé, d'où l'usage d'un serveur loué. C'est un autre produit que les options : les pertes y suivent le prix, sans se limiter à une mise. FXNOD ne se connecte pas à MT5.",
      },
      { type: "h2", text: "Les fichiers XML qui circulent" },
      {
        type: "p",
        text: "Dans les groupes Telegram et WhatsApp circulent des fichiers XML pour Deriv Bot présentés comme des robots qui ne perdent jamais. Presque tous cachent la même chose : une mise multipliée après chaque perte. Ils gagnent de nombreuses fois de suite, puis perdent une grosse somme d'un coup. Avant d'en utiliser un, chargez-le en démo, repérez où la mise change et regardez la mise la plus haute atteinte.",
      },
      { type: "h2", text: "Un robot ne change pas les probabilités" },
      {
        type: "p",
        text: "Aucun robot, gratuit ou payant, ne change les probabilités du contrat qu'il achète. Sur un indice aléatoire, le robot décide quand et combien, et le paiement décide du résultat moyen. Un robot à mise fixe avec stop loss est une façon de trader avec discipline, pas une façon de battre le marché.",
      },
      SOURCE,
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Deriv Bot est-il gratuit ?",
        a: "La page de Deriv n'indique aucun frais d'utilisation et dit qu'on peut le tester sur un compte démo gratuit. Trader en réel met votre mise en risque.",
      },
      {
        q: "Quel est le meilleur robot pour Deriv ?",
        a: "Celui que vous comprenez et que vous avez testé sur votre propre compte démo, à mise fixe et avec stop loss.",
      },
      {
        q: "dBot de FXNOD est-il la même chose que Deriv Bot ?",
        a: "Non. dBot est un constructeur de robots créé par FXNOD qui trade sur votre compte Deriv. Ce sont deux produits distincts.",
      },
      {
        q: "Le robot a-t-il besoin de mon mot de passe Deriv ?",
        a: "Non, et vous ne devez jamais le donner. Un outil sérieux vous envoie sur la page de Deriv et reçoit une autorisation que vous pouvez retirer.",
      },
    ],
    related: ["robots-de-trading-gratuits", "connecter-deriv-a-fxnod"],
    en: "what-is-deriv-bot",
    cta: CTA_ROBOT,
  },

  {
    slug: "robots-de-trading-gratuits",
    title: "Robots de trading gratuits : ce que vous obtenez, quoi vérifier",
    description:
      "Les robots gratuits sont partout. Pourquoi on les offre, les six points à vérifier avant d'en utiliser un, et des options gratuites aux règles visibles.",
    tag: T_ROBOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Les robots de trading gratuits sont nombreux, et la gratuité n'est pas le problème. Le problème est que la plupart sont une martingale sous un autre nom, partagée par quelqu'un qui est payé que vous gagniez ou perdiez. Un robot gratuit vaut la peine quand vous pouvez lire ses règles, fixer la mise et le stop loss, et l'essayer en démo.",
    body: [
      { type: "h2", text: "Pourquoi on les offre" },
      {
        type: "table",
        head: ["Qui le partage", "Ce qu'il y gagne"],
        rows: [
          ["Les affiliés", "Une commission sur les opérations de ceux qui s'inscrivent par leur lien"],
          ["Les groupes de signaux et de robots", "Des membres pour une offre payante"],
          ["Les chaînes vidéo", "Des vues"],
          ["Les plateformes", "Des utilisateurs pour leurs outils"],
          ["Les passionnés", "Rien ; ils partagent une expérience"],
        ],
      },
      {
        type: "p",
        text: "Rien de cela ne dépend de la rentabilité du robot. Posez-vous la même question pour FXNOD : ses robots s'utilisent sans abonnement et il souhaite que vous utilisiez ses outils. Jugez-les donc aussi avec la liste ci-dessous.",
      },
      { type: "h2", text: "Six points à vérifier" },
      {
        type: "steps",
        items: [
          { title: "Puis-je lire chaque règle ?", text: "Si la logique est cachée, arrêtez-vous là." },
          { title: "Que devient la mise après une perte ?", text: "Si elle augmente, calculez la mise la plus haute qu'elle peut atteindre." },
          { title: "Y a-t-il un stop loss que je fixe ?", text: "Et fonctionne-t-il quand mon appareil est éteint ?" },
          { title: "Marche-t-il en démo ?", text: "Un robot qui ne marche qu'en réel vous pousse." },
          { title: "Comment se connecte-t-il ?", text: "Par la page du courtier, jamais avec votre mot de passe." },
          { title: "Que me demande-t-on en échange ?", text: "S'inscrire par un lien, déposer ou payer plus tard sont aussi des coûts." },
        ],
      },
      { type: "h2", text: "L'annonce et ce qu'il y a dedans" },
      {
        type: "table",
        head: ["L'annonce", "Ce qu'on y trouve en général"],
        rows: [
          ["99 % de réussite", "Un contrat très probable avec un multiplicateur de mise après chaque perte"],
          ["Ne perd jamais", "Une martingale qui n'a pas rencontré sa série dans la vidéo"],
          ["Pour petits comptes", "Une mise de base faible sur la même échelle"],
          ["Avec intelligence artificielle", "Des règles fixes sous une nouvelle étiquette"],
          ["Robot MT5 gratuit et rentable", "Souvent une grille ou une martingale, sans historique réel vérifiable"],
        ],
      },
      { type: "h2", text: "Des options gratuites aux règles visibles" },
      {
        type: "list",
        items: [
          "Les stratégies rapides de Deriv Bot, que Deriv nomme et documente.",
          "Un robot que vous construisez vous-même à partir d'un modèle simple.",
          "Auto Hub de FXNOD, où les règles de chaque robot sont écrites et la mise est la même à chaque opération.",
          "Les modèles de dBot de FXNOD, que vous pouvez modifier et lancer en démo.",
        ],
      },
      { type: "h2", text: "Et un robot payant ?" },
      {
        type: "p",
        text: "Le prix ne prouve rien. Beaucoup de robots vendus sont les mêmes fichiers gratuits. Avant de payer, demandez les règles et un essai en démo. Celui qui refuse les deux a déjà répondu.",
      },
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Quel est le meilleur robot de trading gratuit ?",
        a: "Un robot dont vous pouvez lire les règles, à mise fixe, avec un stop loss que vous fixez, testé sur votre propre compte démo.",
      },
      {
        q: "Les robots de FXNOD sont-ils gratuits ?",
        a: "dBot et Auto Hub n'ont ni abonnement ni frais d'inscription. Trader en réel met votre mise en risque.",
      },
      {
        q: "Pourquoi offrir un robot rentable ?",
        a: "En général, celui qui l'offre est payé autrement, par des commissions d'affiliation ou des abonnements. Ce revenu ne dépend pas des gains du robot.",
      },
    ],
    related: ["robot-de-trading-pour-deriv", "strategie-martingale"],
    en: "free-deriv-bots",
    cta: CTA_ROBOT,
  },

  {
    slug: "strategie-martingale",
    title: "Stratégie martingale en trading : principe et limites",
    description:
      "La martingale double la mise après chaque perte pour tout récupérer en un gain. L'échelle complète, la probabilité de ruine et ce qui la limite.",
    tag: T_ROBOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "La martingale multiplie la mise après chaque perte, en général par deux, pour que le gain suivant récupère toutes les pertes précédentes plus une unité de profit. Elle gagne de petites sommes très souvent et perd une très grosse somme de temps en temps. Elle ne change pas le résultat moyen des opérations : elle cache les pertes jusqu'à ce qu'une longue série arrive.",
    body: [
      { type: "h2", text: "L'échelle" },
      {
        type: "table",
        head: ["Perte numéro", "Mise", "Total perdu", "Profit si cette opération gagne"],
        rows: [
          ["1", "1", "1", "1"],
          ["2", "2", "3", "1"],
          ["3", "4", "7", "1"],
          ["5", "16", "31", "1"],
          ["7", "64", "127", "1"],
          ["10", "512", "1 023", "1"],
        ],
      },
      {
        type: "p",
        text: "Chaque ligne risque davantage pour gagner la même unité. Au septième échelon, vous misez 64 pour gagner 1.",
      },
      { type: "h2", text: "Avec un paiement inférieur au double, c'est pire" },
      {
        type: "p",
        text: "Le tableau suppose qu'un gain rapporte toute la mise. Les options rapportent moins. Si un gain rapporte 95 %, doubler récupère de moins en moins : après cinq pertes, gagner avec 32 rapporte 30,40 pour 31 perdus. Pour tout récupérer, il faudrait un multiplicateur supérieur à deux, ce qui rend l'échelle encore plus raide.",
      },
      { type: "h2", text: "À quelle fréquence elle casse" },
      {
        type: "table",
        head: ["Échelons autorisés", "Probabilité de tous les perdre (opérations à 50 %)", "Perte quand cela arrive"],
        rows: [
          ["3", "12,5 %, 1 fois sur 8", "7"],
          ["5", "3,1 %, 1 fois sur 32", "31"],
          ["7", "0,78 %, 1 fois sur 128", "127"],
          ["10", "0,098 %, 1 fois sur 1 024", "1 023"],
        ],
      },
      {
        type: "p",
        text: "Regardez n'importe quelle ligne : vous gagnez 1 environ ce nombre de fois, puis vous perdez à peu près le même total d'un seul coup. À cote égale, cela fait zéro, et avec un contrat qui paie moins du double, cela fait une perte.",
      },
      { type: "h2", text: "Pourquoi elle semble si bonne au début" },
      {
        type: "p",
        text: "Pendant des heures ou des jours, le solde monte en ligne droite. Un test court affiche 100 % de réussite. Rien de cela ne mesure le risque, puisque le risque est ce qui n'est pas encore arrivé. Un robot qui trade toutes les quelques secondes termine des centaines de séquences par heure : une série à 1 sur 1 024 est alors une question d'heures.",
      },
      { type: "h2", text: "Si vous l'utilisez quand même" },
      {
        type: "list",
        items: [
          "Limitez les échelons et considérez que l'échelle entière sera perdue un jour.",
          "Plafonnez la mise la plus haute.",
          "Partez d'une mise si petite que le dernier échelon reste supportable.",
          "Ne redémarrez jamais avec une base plus forte après la casse.",
        ],
      },
      { type: "h2", text: "Dans dBot de FXNOD" },
      {
        type: "p",
        text: "dBot signale la martingale comme à haut risque et affiche les mises d'une série perdante avant le démarrage. Vous choisissez le multiplicateur et le nombre d'échelons. Une mise augmentée ne dépasse jamais le plafond que vous fixez ni le stop loss de la session. Les robots d'Auto Hub n'utilisent pas la martingale.",
      },
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "La martingale fonctionne-t-elle en trading ?",
        a: "Elle fonctionne jusqu'à ce qu'arrive une série plus longue que votre échelle, puis elle perd tout ce qu'elle a gagné et davantage.",
      },
      {
        q: "Combien de pertes de suite faut-il prévoir ?",
        a: "Plus qu'il ne semble probable. Avec des opérations à 50 %, sept de suite arrivent environ une fois toutes les 128 séquences.",
      },
      {
        q: "Quel est le meilleur multiplicateur de martingale ?",
        a: "Aucun n'est sûr. Un multiplicateur élevé récupère plus vite et atteint plus vite la limite. Inférieur à deux, il ne récupère pas tout.",
      },
    ],
    related: ["robots-de-trading-gratuits", "tester-un-robot-de-trading"],
    en: "martingale-strategy-explained",
    cta: {
      title: "Voyez les mises avant de commencer",
      text: "dBot affiche les mises d'une série perdante avant que le robot démarre, ne démarre pas sans stop loss et plafonne la mise la plus haute. Essayez n'importe quel réglage sur votre compte démo Deriv. L'application est en anglais pour le moment.",
    },
  },

  {
    slug: "tester-un-robot-de-trading",
    title: "Comment tester un robot de trading avant l'argent réel",
    description:
      "Testez un robot en démo avec un solde réaliste, au moins 100 opérations, et notez quatre chiffres avant de risquer de l'argent réel. La méthode.",
    tag: T_ROBOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Testez le robot sur un compte démo avant l'argent réel. Utilisez la mise et les limites prévues pour le réel, faites au moins 100 opérations sur plusieurs sessions, et notez le taux de réussite, le gain et la perte moyens, la plus longue série perdante et la plus forte baisse du solde. Ne passez en réel que si vous accepteriez ces chiffres avec votre argent.",
    body: [
      { type: "h2", text: "Préparez le test pour qu'il puisse échouer" },
      {
        type: "p",
        text: "Le compte démo arrive souvent avec des milliers en solde. Tester une mise de 1 contre 10 000 ne dit rien, car aucune série ne fait mal. Décidez de la somme que vous déposeriez vraiment, traitez-la comme votre solde, et arrêtez le test quand la démo a perdu cette somme.",
      },
      { type: "h2", text: "Le plan" },
      {
        type: "steps",
        items: [
          { title: "Écrivez ce que vous attendez", text: "Avant la première opération, notez le taux de réussite et le résultat que vous prévoyez." },
          { title: "Ne changez rien pendant le test", text: "Un seul réglage par test." },
          { title: "Faites au moins 100 opérations", text: "Plusieurs centaines si la stratégie gagne très souvent ou très rarement." },
          { title: "Répartissez-les sur plusieurs sessions", text: "À des heures et des jours différents. Une bonne heure est une anecdote." },
          { title: "Notez les quatre chiffres", text: "Depuis l'historique, pas de mémoire." },
        ],
      },
      { type: "h2", text: "Les quatre chiffres" },
      {
        type: "table",
        head: ["Chiffre", "Comment l'obtenir", "Ce qu'il dit"],
        rows: [
          ["Taux de réussite", "Gains divisés par le nombre d'opérations", "N'a de sens qu'avec la ligne suivante"],
          ["Gain moyen et perte moyenne", "Total gagné sur les gains ; total perdu sur les pertes", "Si les gains suffisent à payer les pertes"],
          ["Plus longue série perdante", "À compter dans la liste des opérations", "Ce que votre gestion de mise doit supporter"],
          ["Baisse maximale", "La plus forte chute d'un sommet du solde au creux suivant", "La perte qu'il faudra endurer"],
        ],
      },
      { type: "h2", text: "Faites le calcul" },
      {
        type: "p",
        text: "Résultat attendu par opération : taux de réussite fois gain moyen, moins taux d'échec fois perte moyenne. Avec 55 % de réussite, un gain moyen de 0,90 et une perte moyenne de 1,00 : 0,55 fois 0,90 moins 0,45 fois 1,00, soit 0,495 moins 0,45, environ 0,045 par opération. Si le résultat est négatif après quelques centaines d'opérations, d'autres opérations ne l'arrangeront pas.",
      },
      { type: "h2", text: "Ce que la démo ne dit pas" },
      {
        type: "list",
        items: [
          "Comment vous vous comporterez quand l'argent sera le vôtre.",
          "Rien sur l'avenir. Un test décrit la période qu'il a couverte.",
          "Si une stratégie de récupération est sûre. Une martingale qui a tenu 500 opérations n'a simplement pas encore rencontré sa série.",
        ],
      },
      { type: "h2", text: "Le passage au réel" },
      {
        type: "p",
        text: "Commencez avec la mise minimale et les mêmes limites, et comparez les cent premières opérations réelles aux chiffres de la démo. S'ils diffèrent nettement, arrêtez et cherchez pourquoi avant d'augmenter quoi que ce soit. Dans FXNOD, un robot suit les mêmes règles en démo et en réel, et reste sur le compte où vous l'avez lancé.",
      },
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Combien de temps faut-il tester un robot ?",
        a: "Comptez les opérations, pas les jours. Cent est un plancher, plusieurs centaines valent mieux.",
      },
      {
        q: "La démo est-elle identique au compte réel ?",
        a: "Le robot suit les mêmes règles sur les deux. Ce qui change, c'est vous, et le solde réel est en général bien plus petit.",
      },
      {
        q: "Pourquoi gagne-t-il en démo et perd-il en réel ?",
        a: "Le plus souvent parce que le test était trop court, ou que la mise était pensée pour un solde démo bien plus grand que le solde réel.",
      },
    ],
    related: ["robot-de-trading", "strategie-martingale"],
    en: "how-to-test-a-trading-bot",
    cta: {
      title: "Testez vos règles avant de les financer",
      text: "Dans dBot, vous transformez une règle en robot en répondant à des questions, vous le lancez sur votre compte démo Deriv et vous lisez le résultat opération par opération. L'application est en anglais pour le moment.",
    },
  },

  {
    slug: "connecter-deriv-a-fxnod",
    title: "Comment connecter votre compte Deriv à FXNOD (démo ou réel)",
    description:
      "Connectez votre compte Deriv à FXNOD en une minute : connexion sur la page de Deriv, choix démo ou réel, et FXNOD ne voit jamais votre mot de passe.",
    tag: "Premiers pas",
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Ouvrez Connected Accounts dans FXNOD et appuyez sur Connect Deriv. Vous vous connectez sur la page de Deriv et approuvez l'accès ; de retour dans FXNOD, tous les comptes de cet identifiant Deriv sont listés. Choisissez le compte démo pour vous entraîner avec des fonds virtuels, ou un compte réel pour trader votre argent. FXNOD ne voit jamais votre mot de passe Deriv.",
    body: [
      { type: "h2", text: "Avant de commencer" },
      {
        type: "list",
        items: [
          "Un compte Deriv. FXNOD ne l'ouvre pas pour vous. Chaque identifiant Deriv comprend un compte démo avec des fonds virtuels.",
          "Un compte FXNOD. Vous vous inscrivez avec votre e-mail et le confirmez avec le code envoyé par FXNOD.",
          "Les écrans de FXNOD sont en anglais pour le moment. Ce guide reprend les noms tels qu'ils s'affichent.",
        ],
      },
      { type: "h2", text: "La connexion en quatre étapes" },
      {
        type: "steps",
        items: [
          { title: "Ouvrez Connected Accounts", text: "Connectez-vous à FXNOD et ouvrez cette section." },
          { title: "Appuyez sur Connect Deriv", text: "FXNOD vous envoie sur la page de connexion de Deriv. Avant de taper quoi que ce soit, vérifiez que l'adresse se termine par deriv.com." },
          { title: "Approuvez l'accès", text: "Deriv affiche ce que FXNOD demande. Approuvez, et Deriv vous renvoie vers FXNOD." },
          { title: "Choisissez le compte", text: "Tous les comptes de cet identifiant apparaissent, démo et réels. Sélectionnez celui à trader. Vous pouvez en changer à tout moment." },
        ],
      },
      { type: "h2", text: "Démo ou réel" },
      {
        type: "p",
        text: "Une seule approbation couvre tous les comptes du même identifiant Deriv : passer de démo à réel se fait donc dans FXNOD. Le compte démo est signalé comme fonds virtuels. Quand vous sélectionnez un compte réel, FXNOD vous demande de confirmer, car à partir de là les ordres manuels utilisent de l'argent réel.",
      },
      {
        type: "p",
        text: "Changer de compte ne déplace pas un robot déjà lancé. Il continue de trader le compte sur lequel il a démarré jusqu'à son arrêt. Un robot lancé en démo ne se retrouve donc jamais sur de l'argent réel par accident.",
      },
      { type: "h2", text: "Les robots demandent une approbation de plus" },
      {
        type: "p",
        text: "La première fois que vous lancez un robot sur un compte réel, Deriv vous demande d'autoriser la connexion de trading automatique de FXNOD. C'est une autorisation distincte de celle du trading manuel, et elle se donne de la même façon : sur la page de Deriv, pas sur celle de FXNOD.",
      },
      { type: "h2", text: "Se déconnecter" },
      {
        type: "p",
        text: "Vous pouvez déconnecter un identifiant Deriv depuis Connected Accounts à tout moment. FXNOD cesse de trader ses comptes et arrête les robots de cet identifiant. Vous pouvez aussi retirer FXNOD de la liste des applications connectées dans les paramètres de votre compte Deriv, ce qui coupe l'accès du côté de Deriv.",
      },
      {
        type: "note",
        title: "Ce que FXNOD conserve",
        text: "FXNOD ne reçoit jamais votre mot de passe Deriv. Il conserve l'autorisation délivrée par Deriv quand vous avez approuvé l'accès, et il la conserve chiffrée. Votre solde de trading reste sur votre compte Deriv en permanence.",
      },
      AVERTISSEMENT,
    ],
    faq: [
      {
        q: "Est-il sûr de connecter mon compte Deriv à FXNOD ?",
        a: "Vous vous connectez sur la page de Deriv : FXNOD ne voit donc jamais votre mot de passe. Il reçoit une autorisation, conservée chiffrée, que vous pouvez retirer à tout moment. Connecter un compte ne réduit pas le risque des opérations.",
      },
      {
        q: "Puis-je utiliser FXNOD avec le seul compte démo Deriv ?",
        a: "Oui. Sélectionnez le compte démo après la connexion et tout se fait avec les fonds virtuels de Deriv.",
      },
      {
        q: "FXNOD détient-il mon argent ?",
        a: "Non. L'argent que vous tradez reste sur votre compte Deriv. FXNOD envoie vos ordres à Deriv et vous montre le résultat.",
      },
      {
        q: "FXNOD est-il en français ?",
        a: "Les guides, oui. L'application est en anglais pour le moment.",
      },
    ],
    related: ["robot-de-trading-pour-deriv", "comment-trader-sur-deriv"],
    en: "connect-deriv-account",
  },
];
