/**
 * The guides in Spanish, for Latin America.
 *
 * These are not the English guides run through a translator. The list comes
 * from what people type in Spanish (Google autocomplete for Colombia, Mexico
 * and Ecuador, in the research file dated 2026-10-10): cómo retirar de Deriv,
 * si Deriv es confiable, índices sintéticos, bot de trading. Each was written
 * in Spanish for that question. Where one says the same thing as an English
 * guide, `en` names it, and the two pages point at each other with hreflang.
 *
 * The rules of the English guides hold here: nothing promises a result, a
 * statement about Deriv is what Deriv's own pages said on the date in
 * `REVISADO`, and what FXNOD does is described as it is. FXNOD's own screens
 * are in English, and the guides say so where a reader will meet them.
 *
 * Register: neutral Latin American Spanish, "tú". Product and contract names
 * the reader will see on screen (stop loss, Rise/Fall, dBot) stay as they
 * appear there.
 */
import type { GuideBlock, GuideCta, LocalGuide } from "../guides";

const DATE = "2026-10-10";
const REVISADO = "10 de octubre de 2026";

const AVISO_RIESGO: GuideBlock = {
  type: "note",
  title: "Aviso de riesgo",
  text: "Las opciones y los multiplicadores son productos de alto riesgo. Puedes perder toda tu inversión en cualquier operación, y un bot puede perderla más rápido que tú a mano. Nada de lo que dice esta página es asesoría financiera. Prueba todo primero en una cuenta demo de Deriv.",
};

const FUENTE: GuideBlock = {
  type: "note",
  title: "De dónde sale esto",
  text: `FXNOD es un producto independiente y no está afiliado a Deriv. Lo que esta página dice sobre Deriv se revisó en el sitio de Deriv el ${REVISADO}. Deriv puede cambiar sus condiciones, límites y plataformas en cualquier momento, y lo que aplica a tu caso depende de tu país y de la empresa de Deriv con la que esté tu cuenta. Confirma en deriv.com todo lo que sea importante antes de actuar.`,
};

export const CTA_ES: GuideCta = {
  title: "Pruébalo en una cuenta demo",
  text: "Crea una cuenta en FXNOD, conecta tu cuenta demo de Deriv y usa todas las herramientas con fondos virtuales. Sin suscripción ni costo de registro. La aplicación está en inglés por ahora.",
};

const CTA_BOT: GuideCta = {
  title: "Un bot que respeta tus límites",
  text: "Los bots de FXNOD funcionan en sus servidores y no arrancan sin un stop loss, así que tus límites siguen activos aunque apagues el teléfono. Pruébalo primero en tu cuenta demo de Deriv. La aplicación está en inglés por ahora.",
};

const T_DERIV = "Sobre Deriv";
const T_BOTS = "Trading automático";

export const ES_GUIDES: LocalGuide[] = [
  {
    slug: "que-es-deriv",
    title: "¿Qué es Deriv y cómo funciona?",
    description:
      "Deriv es un bróker en línea con opciones, multiplicadores y CFD, y con sus propios índices sintéticos. Qué ofrece, quién lo regula y cómo empezar en demo.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Deriv es un bróker en línea donde se opera con opciones, multiplicadores y CFD sobre divisas, índices, materias primas y sus propios índices sintéticos, que son mercados simulados abiertos todos los días. Es un grupo de empresas con varias entidades reguladas fuera de América Latina. Abrir la cuenta es gratis e incluye una cuenta demo con fondos virtuales.",
    body: [
      { type: "h2", text: "Qué se puede operar" },
      {
        type: "table",
        head: ["Producto", "Qué es", "Dónde, según Deriv"],
        rows: [
          ["Opciones", "Pagas una inversión fija; lo máximo que puedes perder es esa inversión", "Deriv Trader y Deriv Bot"],
          ["Multiplicadores", "La posición sigue al precio con un multiplicador y la pérdida se limita a la inversión", "Deriv Trader y la app de Deriv"],
          ["CFD", "Posiciones con apalancamiento sobre el movimiento del precio", "Deriv MT5 y Deriv cTrader"],
        ],
      },
      { type: "h2", text: "Los índices sintéticos" },
      {
        type: "p",
        text: "Son productos propios de Deriv. Deriv dice que sus precios los genera un generador de números aleatorios criptográficamente seguro, que no les afectan las noticias y que están disponibles las 24 horas, incluidos fines de semana y festivos. No representan ningún activo real y solo se pueden operar en Deriv.",
      },
      { type: "h2", text: "Quién está detrás" },
      {
        type: "p",
        text: "El sitio de Deriv nombra a Jean-Yves Sireau como fundador y a Rakshit Choudhary como director ejecutivo, y dice que lleva más de 25 años atendiendo a traders. La sociedad matriz, Deriv.com Limited, está registrada en Guernsey. Las cuentas de trading están en entidades separadas, reguladas en Labuan (Malasia), Islas Vírgenes Británicas, Vanuatu, Mauricio e Islas Caimán, según la página de regulación de Deriv.",
      },
      { type: "h2", text: "Cómo empezar" },
      {
        type: "steps",
        items: [
          { title: "Abre la cuenta en el sitio de Deriv", text: "Escribe tú la dirección deriv.com. Debes ser mayor de 18 años." },
          { title: "Usa la cuenta demo", text: "Viene con fondos virtuales. No hace falta depositar para aprender." },
          { title: "Elige un mercado y un contrato sencillo", text: "Por ejemplo Rise/Fall: si el precio termina más arriba o más abajo." },
          { title: "Verifica tu identidad pronto", text: "Deriv dice que el acceso completo la requiere. Hazlo antes de necesitar un retiro." },
          { title: "Deposita poco y prueba un retiro", text: "Antes de poner más dinero." },
        ],
      },
      { type: "h2", text: "Lo que conviene saber antes" },
      {
        type: "list",
        items: [
          "Sus productos son de alto riesgo. Una opción perdida cuesta toda la inversión.",
          "La protección que tienes depende de la entidad de Deriv con la que esté tu cuenta y de su regulador.",
          "Los productos disponibles cambian según el país.",
          "Muchas estafas usan el nombre de Deriv: sitios clonados, falsos agentes de soporte y bots con ganancias garantizadas.",
        ],
      },
      { type: "h2", text: "Deriv y FXNOD" },
      {
        type: "p",
        text: "FXNOD es una terminal independiente que funciona sobre tu propia cuenta de Deriv. Inicias sesión en la página de Deriv, tu saldo se queda en Deriv, y desde FXNOD puedes operar a mano o usar un bot. No forma parte de Deriv.",
      },
      FUENTE,
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Deriv es un bróker?",
        a: "Sí. Es un grupo de empresas que ofrece opciones, multiplicadores y CFD, con varias entidades reguladas en distintas jurisdicciones.",
      },
      {
        q: "¿Abrir una cuenta en Deriv cuesta?",
        a: "Deriv dice que crear la cuenta es gratis y que solo necesitas fondos cuando vayas a operar en real.",
      },
      {
        q: "¿Deriv tiene cuenta demo?",
        a: "Sí. Cada cuenta incluye una demo con fondos virtuales, sin depósito.",
      },
      {
        q: "¿FXNOD es de Deriv?",
        a: "No. FXNOD es un producto independiente que se conecta a tu cuenta de Deriv mediante la API de Deriv.",
      },
    ],
    related: ["deriv-es-confiable", "como-operar-en-deriv"],
  },

  {
    slug: "deriv-es-confiable",
    title: "¿Deriv es confiable? Lo que puedes verificar tú mismo",
    description:
      "Deriv es un grupo de bróker establecido con entidades reguladas en el extranjero. Qué protege eso, qué no, y cómo comprobarlo antes de depositar.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Deriv es un grupo de bróker real y con trayectoria: dice llevar más de 25 años y nombra entidades reguladas en Labuan, Islas Vírgenes Británicas, Vanuatu, Mauricio e Islas Caimán. Confiable no quiere decir de bajo riesgo. Sus productos son de alto riesgo, la protección varía según la entidad, y el mayor peligro son quienes se hacen pasar por Deriv.",
    body: [
      { type: "h2", text: "Lo que puedes comprobar" },
      {
        type: "steps",
        items: [
          { title: "Busca tu entidad", text: "Tu cuenta y sus términos indican con qué empresa de Deriv contratas." },
          { title: "Consulta el registro del regulador", text: "Entra al sitio del regulador por tu cuenta, no desde un enlace que te envíen, y busca la empresa por su nombre." },
          { title: "Revisa la dirección", text: "El sitio de Deriv es deriv.com. Léela letra por letra antes de iniciar sesión." },
          { title: "Prueba un retiro pequeño", text: "Deposita poco y retíralo antes de poner más." },
        ],
      },
      { type: "h2", text: "Qué significa esa regulación" },
      {
        type: "list",
        items: [
          "Significa que una empresa con nombre tiene licencia y responde ante un regulador.",
          "No es lo mismo que la supervisión de un regulador de tu país. La página de regulación de Deriv no nombra a ningún regulador de América Latina.",
          "No hace más segura ninguna operación. Un producto de alto riesgo sigue siéndolo.",
        ],
      },
      { type: "h2", text: "¿Es legal en mi país?" },
      {
        type: "p",
        text: "Esta guía no da una respuesta legal. Los términos de Deriv dicen que solo presta servicios a residentes de ciertos países, que la lista puede cambiar y que es tu responsabilidad conocer las restricciones del lugar donde vives. Algunos reguladores han tomado medidas: en Brasil, la CVM ordenó en junio de 2023 suspender toda oferta de Deriv.com a residentes brasileños. Revisa los comunicados del regulador financiero de tu país.",
      },
      { type: "h2", text: "Reclamos" },
      {
        type: "p",
        text: "Los términos de Deriv indican un correo de reclamos y prometen una respuesta final en 15 días hábiles. Deriv también dice estar registrada en la Financial Commission, un organismo de resolución de disputas que no es un regulador estatal.",
      },
      { type: "h2", text: "El peligro real: los impostores" },
      {
        type: "table",
        head: ["Lo que ves", "Lo que es"],
        rows: [
          ["Un sitio o una app casi iguales a Deriv", "Una copia para robar tu usuario y contraseña"],
          ["Soporte que te escribe primero por redes o WhatsApp", "Nadie de Deriv necesita tu contraseña ni tus códigos"],
          ["Alguien que ofrece operar tu cuenta", "Le estarías entregando tu dinero"],
          ["Un bot con ganancias garantizadas", "Nadie puede garantizar un resultado"],
          ["Un cobro para liberar tu retiro", "Una estafa: no existe ese cobro"],
        ],
      },
      { type: "h2", text: "Herramientas de terceros" },
      {
        type: "p",
        text: "Herramientas independientes como FXNOD se conectan a tu cuenta mediante la API de Deriv. Una confiable te envía a la página de inicio de sesión de Deriv, nunca pide tu contraseña de Deriv y deja tu saldo en Deriv. Estar conectada a Deriv no es un aval de Deriv.",
      },
      FUENTE,
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Deriv está regulado?",
        a: "Deriv nombra varias entidades y sus reguladores, entre ellos los de Labuan, Islas Vírgenes Británicas, Vanuatu, Mauricio e Islas Caimán. Cuál aplica depende de tu cuenta.",
      },
      {
        q: "¿Deriv es una estafa?",
        a: "Deriv es un grupo establecido con entidades con licencia. Muchas estafas usan su nombre, y mucha gente pierde dinero operando sus productos. Ninguna de las dos cosas convierte a Deriv en una estafa.",
      },
      {
        q: "¿Mi dinero está seguro en Deriv?",
        a: "Depende de la entidad con la que estés y de las reglas de su regulador. Ningún bróker te protege de las pérdidas al operar.",
      },
    ],
    related: ["que-es-deriv", "como-retirar-de-deriv"],
    en: "is-deriv-legit",
  },

  {
    slug: "como-operar-en-deriv",
    title: "Cómo operar en Deriv paso a paso para principiantes",
    description:
      "Empieza a operar en Deriv con orden: cuenta demo, un mercado, un contrato sencillo, límites definidos y, solo después, un depósito pequeño.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Para empezar a operar en Deriv, abre una cuenta gratis, pasa a la cuenta demo con fondos virtuales, elige un solo mercado y un contrato sencillo como Rise/Fall, y haz operaciones pequeñas hasta entender cómo se liquida cada una. Decide cuánto estás dispuesto a perder antes de depositar, y empieza con la inversión mínima.",
    body: [
      { type: "h2", text: "Los pasos, en orden" },
      {
        type: "steps",
        items: [
          { title: "Crea la cuenta", text: "En el sitio de Deriv. Debes ser mayor de 18 años." },
          { title: "Quédate en la cuenta demo", text: "Todo lo que sigue se puede hacer sin depositar." },
          { title: "Elige un mercado", text: "Muchos empiezan con un índice de volatilidad porque opera a toda hora. Uno de número bajo se mueve menos." },
          { title: "Elige un contrato", text: "Rise/Fall hace una sola pregunta: ¿el precio terminará más arriba o más abajo?" },
          { title: "Lee el pago antes de comprar", text: "El formulario muestra cuánto paga el contrato. Si pierdes, una opción cuesta toda la inversión." },
          { title: "Haz veinte operaciones pequeñas y anótalas", text: "Estás aprendiendo cómo se comporta el contrato, no intentando ganar." },
          { title: "Fija tus límites y deposita poco", text: "Decide lo máximo que perderás en un día. Solo entonces pon dinero que puedas permitirte perder." },
        ],
      },
      { type: "h2", text: "¿Opciones, MT5 o bot?" },
      {
        type: "table",
        head: ["Si quieres", "Usa", "Dificultad"],
        rows: [
          ["Operar a mano con riesgo fijo", "Deriv Trader (opciones)", "Baja"],
          ["Automatizar una regla sencilla", "Un constructor de bots, en demo", "Media"],
          ["Operar CFD con gráficos avanzados", "Deriv MT5 o cTrader", "Alta: hay que entender margen y apalancamiento"],
        ],
      },
      {
        type: "p",
        text: "Empieza por las opciones en demo. En los CFD hay apalancamiento, y la propia advertencia de Deriv es que conllevan un alto riesgo de perder dinero rápidamente.",
      },
      { type: "h2", text: "La cuenta que importa" },
      {
        type: "p",
        text: "En un contrato de dos resultados parecidos, el pago es menor que el doble de la inversión. Si inviertes 10 y el contrato devuelve 19,50, necesitas acertar más del 51,3 % de las veces solo para no perder: 10 dividido entre 19,50. Haz esa división con el pago que veas antes de cada operación.",
      },
      { type: "h2", text: "Errores de principiante" },
      {
        type: "list",
        items: [
          "Depositar el primer día.",
          "Subir la inversión después de perder.",
          "Copiar un bot o una señal sin conocer sus reglas.",
          "Tomar una primera semana ganadora como prueba de habilidad.",
        ],
      },
      { type: "h2", text: "Con FXNOD" },
      {
        type: "p",
        text: "FXNOD es una terminal aparte que trabaja sobre tu propia cuenta de Deriv. Te conectas iniciando sesión en la página de Deriv y luego puedes operar a mano en dTrader o usar un bot, primero en la cuenta demo. La aplicación está en inglés por ahora.",
      },
      FUENTE,
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Cuál es el contrato más fácil en Deriv?",
        a: "Rise/Fall es el más sencillo de entender. Aun así, un contrato perdido cuesta toda la inversión.",
      },
      {
        q: "¿Se puede operar en Deriv desde el celular?",
        a: "Sí. Deriv dice que su app es gratuita en iOS y Android. FXNOD funciona en el navegador del teléfono, sin instalar nada.",
      },
      {
        q: "¿Necesito mucho dinero para empezar?",
        a: "No para aprender: la cuenta demo es gratis. Para operar en real, usa una cantidad que puedas perder por completo y la inversión mínima del contrato.",
      },
    ],
    related: ["que-son-los-indices-sinteticos", "deposito-minimo-en-deriv"],
    en: "how-to-trade-on-deriv-for-beginners",
  },

  {
    slug: "como-retirar-de-deriv",
    title: "Cómo retirar de Deriv: pasos, tiempos y por qué se demora",
    description:
      "Para retirar de Deriv necesitas la cuenta verificada, usar el mismo método del depósito y confirmar por correo. Pasos, tiempos y causas de demora.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Para retirar de Deriv, verifica tu cuenta, entra al cajero, elige el método de pago, indica el monto y confirma la solicitud desde el correo que te envía Deriv. Los términos de Deriv piden retirar por el mismo método con el que depositaste. Los métodos disponibles en tu país son los que muestra tu propio cajero.",
    body: [
      { type: "h2", text: "Paso a paso" },
      {
        type: "steps",
        items: [
          { title: "Verifica la cuenta antes", text: "Identidad y domicilio. Una cuenta sin verificar es la causa más común de un retiro detenido." },
          { title: "Abre el cajero en el sitio de Deriv", text: "Elige retirar." },
          { title: "Confirma el correo de verificación", text: "Deriv envía un enlace para confirmar la solicitud." },
          { title: "Elige el método y el monto", text: "La pantalla muestra el mínimo y el máximo de ese método." },
          { title: "Revisa tu cuenta bancaria o billetera", text: "Comprueba tú mismo que el dinero llegó." },
        ],
      },
      { type: "h2", text: "A qué banco o billetera" },
      {
        type: "p",
        text: "En español se busca cómo retirar de Deriv a un banco concreto, a una billetera digital o a un exchange de criptomonedas. Esta guía no confirma cuáles ofrece Deriv para tu cuenta, porque depende de tu país y cambia sin aviso. La única lista válida es la de tu cajero. Si un método no aparece ahí, no está disponible para ti.",
      },
      { type: "h2", text: "Las vías habituales" },
      {
        type: "table",
        head: ["Vía", "Cómo funciona", "A tener en cuenta"],
        rows: [
          ["Tarjeta o billetera electrónica", "Vuelve al mismo medio con el que depositaste", "Deriv indica un día hábil para tarjetas; luego cuenta el tiempo de tu banco"],
          ["Deriv P2P", "Vendes tu saldo a otro usuario verificado, con depósito en garantía", "Libera solo cuando el dinero esté de verdad en tu cuenta"],
          ["Agente de pagos", "Un tercero independiente te paga en moneda local", "Deriv dice que no está afiliada a ningún agente y que tratas con ellos bajo tu propio riesgo"],
          ["Criptomonedas", "Envío a tu billetera en la red indicada", "Las comisiones de red corren por tu cuenta"],
        ],
      },
      { type: "h2", text: "Por qué se demora" },
      {
        type: "list",
        items: [
          "La cuenta no está verificada.",
          "La cuenta de destino no está a tu nombre.",
          "La solicitud se hizo fuera del horario hábil. Los términos de Deriv dicen que puede tardar más.",
          "Tu banco tarda varios días en acreditar.",
          "No confirmaste el correo de verificación.",
        ],
      },
      { type: "h2", text: "La moneda" },
      {
        type: "p",
        text: "Las cuentas de Deriv se llevan en dólares, euros, libras, dólares australianos o criptomonedas, según su personal. No hay cuenta en pesos ni en soles. El retiro se convierte a tu moneda al tipo de cambio del método que uses, así que compara el monto final que recibirás, no solo la tasa.",
      },
      { type: "h2", text: "Si no llega" },
      {
        type: "p",
        text: "Revisa el estado en el cajero y anota la referencia. Escribe al chat en vivo de Deriv desde su propio sitio. No pagues a nadie para acelerar o liberar un retiro: ese cobro no existe. FXNOD no interviene en los retiros de Deriv ni puede verlos.",
      },
      FUENTE,
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Cuánto tarda un retiro de Deriv?",
        a: "Depende del método. Deriv indica desde instantáneo hasta un día hábil por su parte, y tu banco o proveedor puede sumar más.",
      },
      {
        q: "¿Puedo retirar por un método distinto al del depósito?",
        a: "Los términos de Deriv piden usar el mismo método. Si necesitas otro, consúltalo en el chat en vivo de Deriv.",
      },
      {
        q: "¿Cuál es el retiro mínimo en Deriv?",
        a: "Depende del método. Tu cajero muestra el mínimo al seleccionarlo.",
      },
      {
        q: "¿Deriv cobra por retirar?",
        a: "El centro de ayuda de Deriv dice que el método de pago puede cobrar una comisión, y que en criptomonedas hay comisiones de red.",
      },
    ],
    related: ["deposito-minimo-en-deriv", "deriv-es-confiable"],
  },

  {
    slug: "deposito-minimo-en-deriv",
    title: "¿Cuál es el depósito mínimo en Deriv?",
    description:
      "El centro de ayuda de Deriv indica 5 dólares como depósito más bajo. El mínimo real depende del método de pago. Cómo ver el tuyo y cuánto conviene.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      `El centro de ayuda de Deriv dice que el depósito más bajo es de 5 dólares. El mínimo real depende del método de pago y aparece al seleccionarlo. El ${REVISADO}, la página de pagos de Deriv mostraba tarjetas y Neteller desde 10 dólares. Los métodos disponibles cambian según el país.`,
    body: [
      { type: "h2", text: "Cómo ver tu mínimo" },
      {
        type: "steps",
        items: [
          { title: "Inicia sesión en Deriv", text: "En su propio sitio o app." },
          { title: "Abre la pantalla de depósito", text: "Elige la moneda o billetera que quieres fondear." },
          { title: "Selecciona un método", text: "Verás el mínimo y el máximo antes de confirmar." },
        ],
      },
      { type: "h2", text: "Lo que mostraba Deriv" },
      {
        type: "table",
        head: ["Método", "Rango de depósito", "Tiempo"],
        rows: [
          ["Visa y Mastercard", "10 a 10.000 USD", "Instantáneo"],
          ["Neteller", "10 a 10.000 USD", "Instantáneo"],
          ["Deriv P2P", "Hasta 10.000 USD al día", "Hasta 1 hora"],
        ],
      },
      {
        type: "p",
        text: "Esa página muestra solo algunos métodos a la vez. La lista completa para tu país está en el cajero de tu cuenta, que es la referencia válida.",
      },
      { type: "h2", text: "Depósito mínimo no es riesgo mínimo" },
      {
        type: "p",
        text: "Un depósito pequeño limita lo que puedes perder en total, y también alcanza para pocas operaciones. Con 5 dólares y una inversión de 1, cinco pérdidas seguidas acaban con la cuenta, y cinco seguidas es algo normal. Si el depósito es pequeño, la inversión por operación debe serlo todavía más.",
      },
      {
        type: "table",
        head: ["Inversión por operación", "Depósito", "Pérdidas seguidas que lo agotan"],
        rows: [
          ["1", "10", "10"],
          ["0,35", "10", "28"],
          ["0,50", "50", "100"],
        ],
      },
      { type: "h2", text: "Comisiones y tipo de cambio" },
      {
        type: "p",
        text: "El centro de ayuda de Deriv dice que no cobra comisión por depositar. Tu banco o tu tarjeta sí pueden cobrar, y habrá una conversión de tu moneda a la de la cuenta. En montos pequeños esa conversión pesa más que cualquier costo de operar.",
      },
      { type: "h2", text: "Sin depositar" },
      {
        type: "p",
        text: "No necesitas depositar para aprender. La cuenta demo de Deriv usa fondos virtuales, y FXNOD funciona con ella: puedes operar a mano o probar un bot sin poner dinero.",
      },
      FUENTE,
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Puedo depositar 1 dólar en Deriv?",
        a: "El centro de ayuda de Deriv indica 5 dólares como depósito más bajo. Tu cajero muestra el mínimo de tu método.",
      },
      {
        q: "¿Deriv acepta mi moneda local?",
        a: "Las cuentas no se llevan en moneda local. Pagas con un método que la convierte a la moneda de la cuenta.",
      },
      {
        q: "¿Hay que depositar para usar FXNOD?",
        a: "No. FXNOD no recibe depósitos para operar. Usa el saldo de tu cuenta de Deriv, y en la cuenta demo ese saldo es virtual.",
      },
    ],
    related: ["como-retirar-de-deriv", "como-operar-en-deriv"],
    en: "what-is-the-minimum-deposit-on-deriv",
  },

  {
    slug: "que-son-los-indices-sinteticos",
    title: "¿Qué son los índices sintéticos y cómo se operan?",
    description:
      "Los índices sintéticos son mercados simulados cuyo precio sale de un generador aleatorio, no de compradores y vendedores. Familias, riesgos y cómo empezar.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Los índices sintéticos son mercados simulados creados por un bróker. Su precio lo produce un generador de números aleatorios diseñado para comportarse de cierta manera, por ejemplo con una volatilidad fija, y no lo fijan compradores y vendedores. Los de Deriv operan las 24 horas todos los días y, según Deriv, no les afectan las noticias.",
    body: [
      { type: "h2", text: "En qué se diferencian de un mercado real" },
      {
        type: "table",
        head: ["", "Mercado real", "Índice sintético"],
        rows: [
          ["De dónde sale el precio", "De operaciones entre compradores y vendedores", "De un generador de números aleatorios"],
          ["Libro de órdenes", "Sí", "No"],
          ["Reacciona a las noticias", "Sí", "No, según Deriv"],
          ["Horario", "El del mercado", "Todos los días, a toda hora"],
          ["Dónde se opera", "En muchos brókeres", "Solo en el bróker que lo creó"],
        ],
      },
      { type: "h2", text: "Las familias que describe Deriv" },
      {
        type: "table",
        head: ["Familia", "Para qué está diseñada"],
        rows: [
          ["Volatility", "Mantener una volatilidad constante, del 10 % al 250 %, con un tick cada dos segundos o cada segundo"],
          ["Crash y Boom", "Moverse de forma pareja, con una caída o una subida brusca cada cierto número de ticks en promedio"],
          ["Step", "Subir o bajar una cantidad fija en cada tick"],
          ["Jump", "Dar un salto cada 20 minutos en promedio, hacia arriba o hacia abajo"],
          ["Range Break", "Moverse entre dos límites y luego romper para formar un rango nuevo"],
        ],
      },
      { type: "h2", text: "Qué significa que sean aleatorios" },
      {
        type: "list",
        items: [
          "Deriv dice que no hay libro de órdenes y que los patrones históricos en estos índices son coincidencia.",
          "El tamaño de los movimientos está diseñado. La dirección del próximo movimiento no se puede prever.",
          "Los indicadores y las figuras se dibujan bien y no dicen nada sobre el siguiente tick.",
          "El resultado depende del pago, de la inversión y de tus límites, no de adivinar.",
        ],
      },
      { type: "h2", text: "El número del nombre" },
      {
        type: "p",
        text: "En Volatility 75, el 75 es el nivel de volatilidad para el que se construyó el índice: se mueve más por tick que Volatility 10. En Boom 1000 o Crash 500, el número es la cantidad promedio de ticks entre una subida o caída brusca y la siguiente. Promedio es la palabra clave: la próxima puede llegar en cualquier tick.",
      },
      { type: "h2", text: "¿Están manipulados?" },
      {
        type: "p",
        text: "Deriv afirma que salen de un generador aleatorio. Nadie desde afuera puede verificarlo, y FXNOD tampoco. Lo que sí se ve es el costo: un contrato de dos resultados iguales que paga menos del doble pierde un poco en promedio en cada operación. No hace falta manipulación para perder de forma constante.",
      },
      { type: "h2", text: "Otros brókeres" },
      {
        type: "p",
        text: "En español se buscan índices sintéticos junto al nombre de otros brókeres. Cada uno ofrece sus propios mercados simulados, con reglas y nombres distintos. No son los mismos productos, y lo que esta guía dice vale para los de Deriv.",
      },
      FUENTE,
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Los índices sintéticos son reales?",
        a: "Son productos reales con los que puedes ganar o perder dinero. No representan ningún activo: el precio lo genera un algoritmo.",
      },
      {
        q: "¿Se pueden predecir los índices sintéticos?",
        a: "La dirección, no. Deriv los describe como generados al azar y dice que los patrones históricos son coincidencia.",
      },
      {
        q: "¿Cuál es el mejor índice sintético para empezar?",
        a: "Uno de volatilidad baja, con el tick normal de dos segundos, y en cuenta demo. Se mueve menos y más despacio. Ninguno es más fácil de acertar.",
      },
      {
        q: "¿Se operan los fines de semana?",
        a: "Sí. Deriv los describe como disponibles todos los días, incluidos fines de semana y festivos.",
      },
    ],
    related: ["como-operar-en-deriv", "que-es-un-bot-de-trading"],
    en: "what-are-synthetic-indices",
  },

  {
    slug: "que-es-un-bot-de-trading",
    title: "¿Qué es un bot de trading y cómo funciona?",
    description:
      "Un bot de trading es un programa que opera siguiendo reglas que tú defines. Qué decide, dónde funciona, qué puede hacer por ti y qué no.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Un bot de trading es un programa que opera por ti siguiendo reglas definidas de antemano: qué comprar, cuándo entrar, cuánto invertir y cuándo detenerse. Vigila el mercado y ejecuta cada operación que cumple esas reglas. Quita la duda y el cansancio. No quita el riesgo, y no predice el precio.",
    body: [
      { type: "h2", text: "Las cuatro decisiones de cualquier bot" },
      {
        type: "table",
        head: ["Decisión", "Qué significa", "Ejemplo"],
        rows: [
          ["Qué operar", "El mercado y el contrato", "Rise/Fall en un índice de volatilidad, a cinco ticks"],
          ["Cuándo entrar", "La señal que dispara la operación", "Después de tres ticks en la misma dirección"],
          ["Cuánto invertir", "El monto de cada operación y cómo cambia", "El mismo monto siempre"],
          ["Cuándo parar", "Los límites que terminan la sesión", "Parar al perder 20 o al ganar 10"],
        ],
      },
      {
        type: "p",
        text: "Quien empieza se fija casi solo en la segunda fila. Quien tiene experiencia se fija en la tercera y la cuarta, porque son las que deciden cuánto dura la cuenta.",
      },
      { type: "h2", text: "Dónde funciona el bot" },
      {
        type: "p",
        text: "Algunos bots funcionan dentro de la pestaña del navegador. Si cierras la pestaña, se cae la conexión o el equipo se suspende, el bot se detiene, a veces con una operación abierta y sin stop loss vigilándola. Otros funcionan en un servidor y siguen trabajando con tu equipo apagado. Los de FXNOD son del segundo tipo: un bot iniciado en dBot o en Auto Hub corre en los servidores de FXNOD, y sus límites se revisan ahí antes de cada operación.",
      },
      { type: "h2", text: "Lo que hace bien y lo que no" },
      {
        type: "list",
        items: [
          "Bien: seguir una regla exactamente, cada vez, a cualquier hora, sin miedo ni codicia.",
          "Bien: la velocidad. Los contratos de pocos ticks no se pueden operar a mano con constancia.",
          "Mal: darse cuenta de que la regla dejó de funcionar. Aplica igual una regla perdedora que una ganadora.",
          "Mal: crear una ventaja. Si la estrategia no la tiene, automatizarla solo hace que pierda más rápido.",
        ],
      },
      { type: "h2", text: "Bot gratis, bot con inteligencia artificial, bot de Telegram" },
      {
        type: "p",
        text: "Son búsquedas muy comunes. La mayoría de los bots que se ofrecen como inteligencia artificial son reglas fijas con otro nombre, a menudo con una inversión que crece después de cada pérdida. El precio no dice nada sobre la calidad. Lo que importa es que puedas leer las reglas, fijar la inversión y el stop loss, y probarlo en demo.",
      },
      { type: "h2", text: "Para quién sirve" },
      {
        type: "p",
        text: "Para quien puede describir su estrategia como reglas sin decisiones a criterio, y está dispuesto a probarlas en demo antes de poner dinero. Si todavía no puedes decir exactamente cuándo entrarías y saldrías, opera primero a mano en demo.",
      },
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Los bots de trading funcionan?",
        a: "Ejecutan sus reglas de forma fiable. Que ganen dinero depende por completo de las reglas, y la mayoría de las estrategias no tienen ventaja.",
      },
      {
        q: "¿Un bot de trading puede perder dinero?",
        a: "Sí, incluso todo el saldo de la cuenta, y más rápido que una persona.",
      },
      {
        q: "¿Hay que saber programar?",
        a: "No. Hay constructores sin código. En dBot de FXNOD se arma respondiendo preguntas.",
      },
      {
        q: "¿Es legal usar un bot de trading?",
        a: "En general sí en tu propia cuenta, donde el producto sea legal para ti y el bróker lo permita. Revisa las reglas de tu país.",
      },
    ],
    related: ["bot-de-trading-para-deriv", "como-probar-un-bot-de-trading"],
    en: "what-is-automated-trading",
    cta: CTA_BOT,
  },

  {
    slug: "bot-de-trading-para-deriv",
    title: "Bot de trading para Deriv: opciones y cómo elegir",
    description:
      "Hay dos formas de usar un bot en Deriv: Deriv Bot, con bloques y en tu navegador, o una herramienta externa por la API. Diferencias y cómo elegir.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "En Deriv puedes usar un bot de dos maneras: con Deriv Bot, la herramienta de Deriv donde armas la estrategia con bloques visuales y que funciona en tu navegador, o con una herramienta independiente que se conecta a tu cuenta por la API de Deriv. Elige una cuyas reglas puedas leer, que exija un stop loss y que puedas probar en demo.",
    body: [
      { type: "h2", text: "Deriv Bot, según Deriv" },
      {
        type: "list",
        items: [
          "Se arma con bloques visuales, sin programar.",
          "Trae estrategias predefinidas que Deriv nombra: Martingale, D'Alembert y Oscar's Grind.",
          "Guarda y carga las estrategias como archivos XML.",
          "Funciona en tu navegador y se pausa si lo cierras.",
          "Se puede probar con una cuenta demo gratuita.",
        ],
      },
      { type: "h2", text: "Deriv Bot y dBot de FXNOD" },
      {
        type: "table",
        head: ["", "Deriv Bot", "dBot de FXNOD"],
        rows: [
          ["Quién lo hace", "Deriv", "FXNOD, un producto independiente"],
          ["Cómo se arma", "Con bloques visuales", "Respondiendo preguntas"],
          ["Dónde funciona", "En tu navegador", "En los servidores de FXNOD"],
          ["Si cierras la página", "El bot se pausa", "El bot y sus límites siguen"],
          ["Archivos de estrategia", "XML", "Se guarda en tu cuenta de FXNOD; no usa XML"],
          ["Stop loss", "Disponible como herramienta", "Obligatorio para arrancar"],
          ["Idioma", "El sitio de Deriv ofrece español", "Inglés por ahora"],
        ],
      },
      { type: "h2", text: "Cómo elegir, en cinco preguntas" },
      {
        type: "steps",
        items: [
          { title: "¿Puedo leer todas las reglas?", text: "Si la lógica es secreta, no puedes evaluar el riesgo." },
          { title: "¿Quién controla la inversión?", text: "Debes poder fijarla, y ver cómo cambia después de ganar o perder." },
          { title: "¿Cómo se conecta?", text: "Por la página de inicio de sesión de Deriv. Nunca con tu contraseña." },
          { title: "¿Dónde funciona?", text: "Si depende de una pestaña abierta, tus límites también." },
          { title: "¿Puedo probarlo gratis en demo?", text: "Si solo funciona en cuenta real, te están empujando." },
        ],
      },
      { type: "h2", text: "Los archivos XML que circulan" },
      {
        type: "p",
        text: "En grupos de Telegram y en videos se comparten archivos XML para Deriv Bot con nombres como bot que nunca pierde. Casi todos esconden lo mismo: una inversión que se multiplica después de cada pérdida. Ganan muchas veces seguidas y luego pierden una cantidad grande de golpe. Antes de usar uno, cárgalo en demo, busca dónde cambia la inversión y mira la inversión más alta a la que llega.",
      },
      { type: "h2", text: "Un bot no cambia las probabilidades" },
      {
        type: "p",
        text: "Ningún bot, gratis o de pago, cambia las probabilidades del contrato que compra. En un índice aleatorio el bot decide cuándo y cuánto, y el pago decide el resultado promedio. Un bot con inversión fija y stop loss es una forma de operar con disciplina, no una forma de ganarle al mercado.",
      },
      FUENTE,
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Deriv Bot es gratis?",
        a: "La página de Deriv no indica ningún cobro por usarlo y dice que se puede probar en una cuenta demo gratuita. Operar en real pone en riesgo tu inversión.",
      },
      {
        q: "¿Cuál es el mejor bot para Deriv?",
        a: "El que entiendes y probaste en tu propia cuenta demo, con inversión fija y stop loss. El nombre importa menos que eso.",
      },
      {
        q: "¿dBot de FXNOD es lo mismo que Deriv Bot?",
        a: "No. dBot es un constructor de bots hecho por FXNOD que opera en tu cuenta de Deriv. Son productos distintos.",
      },
      {
        q: "¿El bot necesita mi contraseña de Deriv?",
        a: "No, y nunca debes dársela. Una herramienta legítima te envía a la página de Deriv y recibe un permiso que puedes revocar.",
      },
    ],
    related: ["bots-de-trading-gratis", "conectar-deriv-con-fxnod"],
    en: "what-is-deriv-bot",
    cta: CTA_BOT,
  },

  {
    slug: "bots-de-trading-gratis",
    title: "Bots de trading gratis: qué recibes y qué revisar",
    description:
      "Los bots gratis abundan. Por qué se regalan, las seis cosas que revisar antes de usar uno y opciones gratuitas que sí muestran sus reglas.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Hay muchos bots de trading gratis, y que sean gratis no es el problema. El problema es que la mayoría son una martingala con otro nombre, compartida por alguien que gana tanto si tú ganas como si pierdes. Un bot gratis vale la pena cuando puedes leer sus reglas, fijar la inversión y el stop loss, y probarlo en demo.",
    body: [
      { type: "h2", text: "Por qué se regalan" },
      {
        type: "table",
        head: ["Quién lo comparte", "Qué gana"],
        rows: [
          ["Afiliados", "Comisión por las operaciones de quien se registra con su enlace"],
          ["Grupos de señales y bots", "Miembros para un nivel de pago"],
          ["Canales de video", "Vistas"],
          ["Plataformas", "Usuarios para sus herramientas"],
          ["Aficionados", "Nada; comparten un experimento"],
        ],
      },
      {
        type: "p",
        text: "Nada de eso depende de que el bot sea rentable. Hazte la misma pregunta con FXNOD: sus bots se usan sin suscripción y quiere que uses sus herramientas, así que júzgalos también con la lista de abajo.",
      },
      { type: "h2", text: "Seis cosas que revisar" },
      {
        type: "steps",
        items: [
          { title: "¿Puedo leer cada regla?", text: "Si la lógica está oculta, detente." },
          { title: "¿Qué pasa con la inversión después de perder?", text: "Si crece, calcula la inversión más alta a la que puede llegar." },
          { title: "¿Hay un stop loss que yo fijo?", text: "¿Y funciona con mi equipo apagado?" },
          { title: "¿Funciona en demo?", text: "Un bot que solo sirve en real te está empujando." },
          { title: "¿Cómo se conecta?", text: "Por la página del bróker, nunca con tu contraseña." },
          { title: "¿Qué me piden a cambio?", text: "Registrarte con un enlace, depositar o pagar después también son costos." },
        ],
      },
      { type: "h2", text: "Cómo se anuncian y qué suelen ser" },
      {
        type: "table",
        head: ["El anuncio", "Lo que suele haber dentro"],
        rows: [
          ["99 % de aciertos", "Un contrato de alta probabilidad con multiplicador de inversión tras cada pérdida"],
          ["Nunca pierde", "Una martingala que no se topó con su racha en el video"],
          ["Para cuentas pequeñas", "Una inversión base baja sobre la misma escalera"],
          ["Con inteligencia artificial", "Reglas fijas con una etiqueta nueva"],
        ],
      },
      { type: "h2", text: "Opciones gratuitas que muestran sus reglas" },
      {
        type: "list",
        items: [
          "Las estrategias rápidas de Deriv Bot, que Deriv nombra y documenta.",
          "Un bot que armas tú mismo a partir de una plantilla sencilla.",
          "Auto Hub de FXNOD, donde las reglas de cada bot están escritas y la inversión es la misma en cada operación.",
          "Las plantillas de dBot de FXNOD, que puedes modificar y probar en demo.",
        ],
      },
      { type: "h2", text: "¿Y un bot de pago?" },
      {
        type: "p",
        text: "El precio no prueba nada. Muchos bots que se venden son los mismos archivos gratuitos. Antes de pagar, pide las reglas y una prueba en demo. Quien se niega a ambas cosas ya respondió.",
      },
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Cuál es el mejor bot de trading gratis?",
        a: "Uno cuyas reglas puedes leer, con inversión fija y un stop loss que tú fijas, probado en tu propia demo.",
      },
      {
        q: "¿Los bots de FXNOD son gratis?",
        a: "dBot y Auto Hub no tienen suscripción ni costo de registro. Operar en real pone en riesgo tu inversión.",
      },
      {
        q: "¿Por qué alguien regalaría un bot rentable?",
        a: "Normalmente cobra de otra forma, con comisiones de afiliado o membresías. Ese ingreso no depende de que el bot gane.",
      },
    ],
    related: ["bot-de-trading-para-deriv", "estrategia-martingala"],
    en: "free-deriv-bots",
    cta: CTA_BOT,
  },

  {
    slug: "estrategia-martingala",
    title: "Estrategia martingala en trading: cómo funciona y por qué falla",
    description:
      "La martingala duplica la inversión tras cada pérdida para recuperar todo con un acierto. La escalera completa, la probabilidad de ruina y sus límites.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "La martingala multiplica la inversión después de cada pérdida, normalmente por dos, para que el siguiente acierto recupere todas las pérdidas anteriores más una unidad de ganancia. Gana cantidades pequeñas muy seguido y pierde una cantidad muy grande de vez en cuando. No cambia el resultado promedio de las operaciones: solo esconde las pérdidas hasta que llega una racha larga.",
    body: [
      { type: "h2", text: "La escalera" },
      {
        type: "table",
        head: ["Pérdida número", "Inversión", "Total perdido", "Ganancia si esta operación acierta"],
        rows: [
          ["1", "1", "1", "1"],
          ["2", "2", "3", "1"],
          ["3", "4", "7", "1"],
          ["5", "16", "31", "1"],
          ["7", "64", "127", "1"],
          ["10", "512", "1.023", "1"],
        ],
      },
      {
        type: "p",
        text: "Cada fila arriesga más para ganar la misma unidad. En el séptimo escalón inviertes 64 para ganar 1.",
      },
      { type: "h2", text: "Con un pago menor al doble es peor" },
      {
        type: "p",
        text: "La tabla supone que acertar paga toda la inversión. Las opciones pagan menos. Si un acierto paga el 95 %, duplicar recupera cada vez menos: tras cinco pérdidas, acertar con 32 paga 30,40 contra 31 perdidos. Para recuperar todo haría falta un multiplicador mayor que dos, lo que hace la escalera aún más empinada.",
      },
      { type: "h2", text: "Cada cuánto se rompe" },
      {
        type: "table",
        head: ["Escalones permitidos", "Probabilidad de perderlos todos (operaciones al 50 %)", "Pérdida cuando ocurre"],
        rows: [
          ["3", "12,5 %, 1 de cada 8", "7"],
          ["5", "3,1 %, 1 de cada 32", "31"],
          ["7", "0,78 %, 1 de cada 128", "127"],
          ["10", "0,098 %, 1 de cada 1.024", "1.023"],
        ],
      },
      {
        type: "p",
        text: "Mira cualquier fila: ganas 1 más o menos esa cantidad de veces y luego pierdes casi lo mismo de un solo golpe. Con dinero parejo eso da cero, y con un contrato que paga menos del doble da pérdida.",
      },
      { type: "h2", text: "Por qué parece tan buena al principio" },
      {
        type: "p",
        text: "Durante horas o días el saldo sube en línea recta. Una prueba corta muestra un 100 % de aciertos. Nada de eso mide el riesgo, porque el riesgo es lo que todavía no pasó. Un bot que opera cada pocos segundos completa cientos de secuencias por hora, así que una racha de 1 entre 1.024 es cuestión de horas.",
      },
      { type: "h2", text: "Si la usas de todos modos" },
      {
        type: "list",
        items: [
          "Limita los escalones y da por perdida la escalera completa alguna vez.",
          "Pon un tope a la inversión más alta.",
          "Empieza con una inversión tan pequeña que el último escalón sea asumible.",
          "Nunca reinicies con una base mayor después de que la escalera se rompa.",
        ],
      },
      { type: "h2", text: "En dBot de FXNOD" },
      {
        type: "p",
        text: "dBot marca la martingala como de alto riesgo y muestra las inversiones de una racha perdedora antes de arrancar. Tú eliges el multiplicador y los escalones. Una inversión escalada nunca supera el monto que fijes como máximo ni el stop loss de la sesión. Los bots de Auto Hub no usan martingala.",
      },
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿La martingala funciona en trading?",
        a: "Funciona hasta que llega una racha más larga que tu escalera, y entonces pierde todo lo ganado y más. No convierte una apuesta perdedora en ganadora.",
      },
      {
        q: "¿Cuántas pérdidas seguidas debo prever?",
        a: "Más de las que parecen probables. Con operaciones al 50 %, siete seguidas ocurren cerca de una vez cada 128 secuencias.",
      },
      {
        q: "¿Cuál es el mejor multiplicador de martingala?",
        a: "Ninguno es seguro. Uno más alto recupera antes y llega antes al límite. Uno menor que dos no recupera del todo.",
      },
    ],
    related: ["bots-de-trading-gratis", "como-probar-un-bot-de-trading"],
    en: "martingale-strategy-explained",
    cta: {
      title: "Mira las inversiones antes de empezar",
      text: "dBot muestra las inversiones de una racha perdedora antes de que el bot arranque, no arranca sin stop loss y limita la inversión más alta. Prueba cualquier configuración en tu cuenta demo de Deriv. La aplicación está en inglés por ahora.",
    },
  },

  {
    slug: "como-probar-un-bot-de-trading",
    title: "Cómo probar un bot de trading antes de usar dinero real",
    description:
      "Prueba un bot en demo con un saldo realista, al menos 100 operaciones, y anota cuatro números antes de arriesgar dinero real. El método completo.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Prueba el bot en una cuenta demo antes de usar dinero real. Usa la misma inversión y los mismos límites que piensas usar en real, haz al menos 100 operaciones en varias sesiones, y anota el porcentaje de aciertos, la ganancia y la pérdida promedio, la racha perdedora más larga y la mayor caída del saldo. Pasa a real solo si aceptarías esos números con tu dinero.",
    body: [
      { type: "h2", text: "Prepara la prueba para que pueda fallar" },
      {
        type: "p",
        text: "La cuenta demo suele traer miles en saldo. Probar una inversión de 1 contra 10.000 no dice nada, porque ninguna racha duele. Decide cuánto depositarías de verdad, trátalo como tu saldo, y termina la prueba cuando la demo haya perdido esa cantidad.",
      },
      { type: "h2", text: "El plan" },
      {
        type: "steps",
        items: [
          { title: "Escribe lo que esperas", text: "Antes de la primera operación, anota el porcentaje de aciertos y el resultado que crees que dará." },
          { title: "No cambies nada durante la prueba", text: "Una sola configuración por prueba." },
          { title: "Haz al menos 100 operaciones", text: "Varios cientos si la estrategia acierta muy seguido o muy pocas veces." },
          { title: "Repártelas en varias sesiones", text: "A distintas horas y en distintos días. Una buena hora es una anécdota." },
          { title: "Anota los cuatro números", text: "Desde el historial, no de memoria." },
        ],
      },
      { type: "h2", text: "Los cuatro números" },
      {
        type: "table",
        head: ["Número", "Cómo se saca", "Qué dice"],
        rows: [
          ["Porcentaje de aciertos", "Aciertos entre operaciones totales", "Solo sirve junto a la fila siguiente"],
          ["Ganancia y pérdida promedio", "Total ganado entre aciertos; total perdido entre fallos", "Si las ganancias alcanzan para pagar las pérdidas"],
          ["Racha perdedora más larga", "Se cuenta en la lista de operaciones", "Lo que tu forma de invertir tiene que aguantar"],
          ["Caída máxima", "La mayor baja desde un pico del saldo hasta el mínimo siguiente", "La pérdida que tendrás que soportar"],
        ],
      },
      { type: "h2", text: "Haz la cuenta" },
      {
        type: "p",
        text: "Resultado esperado por operación: porcentaje de aciertos por ganancia promedio, menos porcentaje de fallos por pérdida promedio. Con 55 % de aciertos, ganancia promedio de 0,90 y pérdida promedio de 1,00: 0,55 por 0,90 menos 0,45 por 1,00, es decir 0,495 menos 0,45, unos 0,045 por operación. Si sale negativo después de unos cientos de operaciones, más operaciones no lo arreglan.",
      },
      { type: "h2", text: "Lo que la demo no te dice" },
      {
        type: "list",
        items: [
          "Cómo te vas a comportar cuando el dinero sea tuyo.",
          "Nada sobre el futuro. Una prueba describe el periodo que cubrió.",
          "Si una estrategia de recuperación es segura. Una martingala que aguantó 500 operaciones todavía no se topó con su racha.",
        ],
      },
      { type: "h2", text: "El paso a real" },
      {
        type: "p",
        text: "Empieza con la inversión mínima y los mismos límites, y compara las primeras cien operaciones en real con los números de la demo. Si difieren mucho, detente y averigua por qué antes de subir nada. En FXNOD un bot sigue las mismas reglas en demo y en real, y se queda en la cuenta en la que lo iniciaste.",
      },
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Cuánto tiempo debo probar un bot?",
        a: "Cuenta operaciones, no días. Cien es el piso, y varios cientos es mejor.",
      },
      {
        q: "¿La demo es igual a la cuenta real?",
        a: "El bot sigue las mismas reglas en ambas. Lo que cambia eres tú, y que el saldo real suele ser mucho menor.",
      },
      {
        q: "¿Por qué gana en demo y pierde en real?",
        a: "Casi siempre porque la prueba fue muy corta, o porque la inversión estaba pensada para un saldo demo mucho mayor que el real.",
      },
    ],
    related: ["que-es-un-bot-de-trading", "estrategia-martingala"],
    en: "how-to-test-a-trading-bot",
    cta: {
      title: "Prueba tus reglas antes de ponerles dinero",
      text: "En dBot conviertes una regla en un bot respondiendo preguntas, lo corres en tu cuenta demo de Deriv y lees el resultado operación por operación. La aplicación está en inglés por ahora.",
    },
  },

  {
    slug: "conectar-deriv-con-fxnod",
    title: "Cómo conectar tu cuenta de Deriv con FXNOD (demo o real)",
    description:
      "Conecta tu cuenta de Deriv con FXNOD en un minuto: inicias sesión en la página de Deriv, eliges demo o real, y FXNOD nunca ve tu contraseña.",
    tag: "Primeros pasos",
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Abre Connected Accounts en FXNOD y pulsa Connect Deriv. Inicias sesión en la propia página de Deriv y apruebas el acceso; al volver a FXNOD aparecen todas las cuentas de ese usuario de Deriv. Elige la cuenta demo para practicar con fondos virtuales, o una real para operar con tu dinero. FXNOD nunca ve tu contraseña de Deriv.",
    body: [
      { type: "h2", text: "Antes de empezar" },
      {
        type: "list",
        items: [
          "Una cuenta de Deriv. FXNOD no la abre por ti. Cada usuario de Deriv incluye una cuenta demo con fondos virtuales.",
          "Una cuenta de FXNOD. Te registras con tu correo y lo confirmas con el código que FXNOD te envía.",
          "Ten presente que las pantallas de FXNOD están en inglés por ahora. Esta guía usa los nombres tal como aparecen.",
        ],
      },
      { type: "h2", text: "Conectar en cuatro pasos" },
      {
        type: "steps",
        items: [
          { title: "Abre Connected Accounts", text: "Inicia sesión en FXNOD y abre esa sección." },
          { title: "Pulsa Connect Deriv", text: "FXNOD te lleva a la página de inicio de sesión de Deriv. Antes de escribir nada, comprueba que la dirección termine en deriv.com." },
          { title: "Aprueba el acceso", text: "Deriv muestra lo que FXNOD solicita. Apruébalo y Deriv te devuelve a FXNOD." },
          { title: "Elige la cuenta", text: "Aparecen todas las cuentas de ese usuario, demo y reales. Selecciona la que quieres operar. Puedes cambiarla cuando quieras." },
        ],
      },
      { type: "h2", text: "Demo o real" },
      {
        type: "p",
        text: "Una sola aprobación cubre todas las cuentas del mismo usuario de Deriv, así que pasar de demo a real se hace dentro de FXNOD. La cuenta demo aparece marcada como fondos virtuales. Al elegir una real, FXNOD te pide confirmarlo, porque desde ese momento las órdenes manuales usan dinero real.",
      },
      {
        type: "p",
        text: "Cambiar de cuenta no mueve un bot que ya está en marcha. El bot sigue operando la cuenta en la que lo iniciaste hasta que se detiene. Así, un bot iniciado en demo nunca termina en dinero real por accidente.",
      },
      { type: "h2", text: "Los bots piden una aprobación más" },
      {
        type: "p",
        text: "La primera vez que usas un bot en una cuenta real, Deriv te pide permitir la conexión de trading automático de FXNOD. Es un permiso aparte del de operar a mano, y lo das igual: en la página de Deriv, no en la de FXNOD.",
      },
      { type: "h2", text: "Desconectar" },
      {
        type: "p",
        text: "Puedes desconectar un usuario de Deriv desde Connected Accounts cuando quieras. FXNOD deja de operar sus cuentas y detiene los bots de ese usuario. También puedes quitar a FXNOD de la lista de aplicaciones conectadas en los ajustes de tu cuenta de Deriv, lo que corta el acceso desde el lado de Deriv.",
      },
      {
        type: "note",
        title: "Qué guarda FXNOD",
        text: "FXNOD nunca recibe tu contraseña de Deriv. Lo que guarda es el permiso que Deriv emitió cuando aprobaste el acceso, y lo guarda cifrado. Tu saldo de trading se queda en tu cuenta de Deriv todo el tiempo.",
      },
      AVISO_RIESGO,
    ],
    faq: [
      {
        q: "¿Es seguro conectar mi cuenta de Deriv con FXNOD?",
        a: "Inicias sesión en la página de Deriv, así que FXNOD nunca ve tu contraseña. Recibe un permiso que guarda cifrado y que puedes retirar cuando quieras. Conectar una cuenta no reduce el riesgo de las operaciones.",
      },
      {
        q: "¿Puedo usar FXNOD solo con la cuenta demo de Deriv?",
        a: "Sí. Selecciona la demo después de conectar y todo se hace con los fondos virtuales de Deriv.",
      },
      {
        q: "¿FXNOD guarda mi dinero?",
        a: "No. El dinero con el que operas se queda en tu cuenta de Deriv. FXNOD envía tus órdenes a Deriv y te muestra el resultado.",
      },
      {
        q: "¿FXNOD está en español?",
        a: "Las guías sí. La aplicación está en inglés por ahora.",
      },
    ],
    related: ["bot-de-trading-para-deriv", "como-operar-en-deriv"],
    en: "connect-deriv-account",
  },
];
