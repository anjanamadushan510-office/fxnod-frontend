/**
 * The guides in Sinhala, for Sri Lanka.
 *
 * People in Sri Lanka hardly type Sinhala script into a search box. The
 * research file dated 2026-10-10 shows them typing Latin letters with the
 * word "sinhala": deriv trading sinhala, deriv account sinhala, forex
 * trading sinhala, binary trading sinhala. So each title and slug carries
 * that phrase as typed, and the body is in Sinhala.
 *
 * Trading words are left in English (stake, payout, stop loss, demo account)
 * because that is how they are said and how they appear on screen.
 *
 * The Central Bank of Sri Lanka issued a public notice in October 2019 on
 * unauthorised foreign exchange trading by residents. Anjana's decision
 * (2026-10-10) was to publish these guides regardless and remove them if a
 * problem arises. The guides that touch on legality mention the notice and
 * send the reader to the Central Bank's own site; they give no ruling.
 *
 * Same rules as every other language: nothing promises a result, a statement
 * about Deriv is what Deriv's pages said on the date in `CHECKED`, and
 * FXNOD's screens are in English, which the guides say.
 */
import type { GuideBlock, GuideCta, LocalGuide } from "../guides";

const DATE = "2026-10-10";
const CHECKED = "2026 ඔක්තෝබර් 10";

const RISK: GuideBlock = {
  type: "note",
  title: "අවදානම් දැනුම්දීම",
  text: "Options සහ multipliers කියන්නේ ඉහළ අවදානමක් තියෙන products. ඕනෑම trade එකකදී ඔබේ සම්පූර්ණ stake එකම නැති වෙන්න පුළුවන්, සහ bot එකකට ඒක ඔබ අතින් කරනවාට වඩා ඉක්මනින් නැති කරන්න පුළුවන්. මේ පිටුවේ තියෙන කිසිම දෙයක් මූල්‍ය උපදෙසක් නෙවෙයි. හැම දෙයක්ම මුලින්ම Deriv demo account එකක අත්හදා බලන්න.",
};

const SOURCE: GuideBlock = {
  type: "note",
  title: "මේ තොරතුරු කොහෙන්ද",
  text: `FXNOD කියන්නේ ස්වාධීන product එකක්, Deriv එකට සම්බන්ධ නැහැ. මේ පිටුවේ Deriv ගැන කියන දේවල් ${CHECKED} දින Deriv ගේම website එකෙන් පරීක්ෂා කළා. Deriv ට එයාලගේ කොන්දේසි, සීමා සහ platforms ඕනෑම වෙලාවක වෙනස් කරන්න පුළුවන්, සහ ඔබට අදාළ වෙන දේ ඔබේ රට සහ ඔබේ account එක තියෙන Deriv සමාගම අනුව වෙනස් වෙනවා. වැදගත් දෙයක් කරන්න කලින් deriv.com එකෙන් තහවුරු කරගන්න.`,
};

export const CTA_SI: GuideCta = {
  title: "Demo account එකකින් අත්හදා බලන්න",
  text: "FXNOD account එකක් හදලා, ඔබේ Deriv demo account එක connect කරලා, හැම tool එකක්ම virtual funds වලින් පාවිච්චි කරන්න. Subscription එකක් හෝ sign-up fee එකක් නැහැ. App එක දැනට English වලින්.",
};

const CTA_BOT: GuideCta = {
  title: "ඔබේ limits රකින bot එකක්",
  text: "FXNOD bots දුවන්නේ FXNOD servers වල, සහ stop loss එකක් නැතුව start වෙන්නේ නැහැ. ඒ නිසා phone එක off වුණත්, network එක නැති වුණත් ඔබේ limits වැඩ කරනවා. මුලින්ම Deriv demo account එකේ අත්හදා බලන්න. App එක දැනට English වලින්.",
};

const T_DERIV = "Deriv ගැන";
const T_LEARN = "Trading මූලික දේ";
const T_BOTS = "Automated trading";

export const SI_GUIDES: LocalGuide[] = [
  {
    slug: "deriv-trading-sinhala",
    title: "Deriv Trading Sinhala: Deriv වල trade කරන හැටි මුල සිට",
    description:
      "Deriv trading සිංහලෙන්: demo account එකෙන් පටන් අරන්, එක market එකක්, සරල contract එකක්, limits, ඊට පස්සේ විතරක් පොඩි deposit එකක්.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Deriv වල trade කරන්න පටන් ගන්න නම්: නොමිලේ account එකක් හදන්න, virtual funds තියෙන demo account එකට මාරු වෙන්න, එක market එකක් සහ Rise/Fall වගේ සරල contract එකක් තෝරගන්න, සහ හැම trade එකක්ම settle වෙන හැටි තේරෙනකන් පොඩි trades දාන්න. Deposit කරන්න කලින් නැති වෙන්න ඉඩ දෙන උපරිම ගාන තීරණය කරන්න.",
    body: [
      { type: "h2", text: "Deriv කියන්නේ මොකක්ද" },
      {
        type: "p",
        text: "Deriv කියන්නේ online broker කෙනෙක්. Options, multipliers සහ CFDs trade කරන්න පුළුවන්, forex, indices, commodities සහ Deriv ගේම synthetic indices මත. Synthetic indices කියන්නේ සෑම දිනකම, පැය 24ම විවෘත simulated markets. Deriv කියන්නේ සමාගම් සමූහයක්, සහ එයාලගේ regulation page එක Labuan, British Virgin Islands, Vanuatu, Mauritius සහ Cayman Islands වල regulators නම් කරනවා. ශ්‍රී ලංකාවේ regulator කෙනෙක් එතන නැහැ.",
      },
      { type: "h2", text: "පියවරෙන් පියවර" },
      {
        type: "steps",
        items: [
          { title: "Account එක හදන්න", text: "Deriv ගේම site එකේ. deriv.com කියලා ඔබම type කරන්න. වයස 18 හෝ ඊට වැඩි වෙන්න ඕන." },
          { title: "Demo account එකේ ඉන්න", text: "ඒකේ virtual funds තියෙනවා. ඊළඟ පියවර ඔක්කොම deposit එකක් නැතුව කරන්න පුළුවන්." },
          { title: "එක market එකක් තෝරන්න", text: "ගොඩක් අය volatility index එකකින් පටන් ගන්නවා, මොකද ඒක හැම වෙලාවෙම විවෘතයි. අංකය අඩු index එකක් අඩුවෙන් හෙලවෙනවා." },
          { title: "එක contract එකක් තෝරන්න", text: "Rise/Fall අහන්නේ එක ප්‍රශ්නයයි: මිල ඉහළින් ඉවර වෙයිද, පහළින් ඉවර වෙයිද?" },
          { title: "Buy කරන්න කලින් payout එක කියවන්න", text: "Order form එකේ contract එක ගෙවන ගාන පෙන්නනවා. පැරදුණොත් option එකක සම්පූර්ණ stake එකම යනවා." },
          { title: "පොඩි trades 20ක් දාලා ලියාගන්න", text: "මේ වෙලාවේ ඉගෙන ගන්නේ contract එක හැසිරෙන හැටි. දිනන්න හදන්න එපා." },
          { title: "Limits තීරණය කරලා පොඩි ගානක් deposit කරන්න", text: "දවසකට නැති වෙන්න ඉඩ දෙන උපරිම ගාන කලින් තීරණය කරන්න. නැති වුණාට කමක් නැති සල්ලි විතරක් දාන්න." },
        ],
      },
      { type: "h2", text: "වැදගත්ම ගණන" },
      {
        type: "p",
        text: "ප්‍රතිඵල දෙකක් සමාන විදිහට තියෙන contract එකක payout එක stake එක මෙන් දෙගුණයට වඩා අඩුයි. Stake එක 10ක් දාලා contract එක 19.50ක් ආපහු දෙනවා නම්, පාඩු නොවී ඉන්නවත් trades වලින් 51.3% කට වඩා දිනන්න ඕන: 10 බෙදීම 19.50. හැම trade එකකටම කලින් පේන payout එකෙන් මේ බෙදීම කරන්න.",
      },
      { type: "h2", text: "ලංකාවේ ඉන්න කෙනෙක් දැනගන්න ඕන දේ" },
      {
        type: "list",
        items: [
          "Deriv accounts තියෙන්නේ US dollars, euros, pounds, Australian dollars හෝ crypto වලින්. රුපියල් account එකක් නැහැ.",
          "ඔබේ account එකට තියෙන deposit සහ withdrawal ක්‍රම පේන්නේ ඔබේම Deriv cashier එකේ.",
          "ශ්‍රී ලංකා මහ බැංකුව 2019 දී අනවසර foreign exchange trading ගැන මහජන නිවේදනයක් නිකුත් කරලා තියෙනවා. මේ guide එක නීතිමය තීරණයක් දෙන්නේ නැහැ. ඔබේ තත්ත්වය ගැන මහ බැංකුවේ website එක බලන්න.",
          "Trading ලාභ වලට බදු අදාළ වෙන්න පුළුවන්. Statements තියාගන්න.",
        ],
      },
      { type: "h2", text: "අලුත් අය කරන වැරදි" },
      {
        type: "list",
        items: [
          "පළමු දවසෙම deposit කිරීම.",
          "පැරදුණාට පස්සේ stake එක වැඩි කිරීම.",
          "Rules දන්නේ නැතුව bot එකක් හෝ signal එකක් copy කිරීම.",
          "දිනපු පළමු සතිය දක්ෂතාවයක් කියලා හිතීම.",
        ],
      },
      { type: "h2", text: "FXNOD එක්ක" },
      {
        type: "p",
        text: "FXNOD කියන්නේ ඔබේම Deriv account එක මත වැඩ කරන වෙනම terminal එකක්. Deriv ගේ page එකේ sign in වෙලා connect වෙනවා, ඊට පස්සේ dTrader එකේ අතින් trade කරන්න හෝ bot එකක් දුවන්න පුළුවන්, මුලින්ම demo account එකේ. Phone browser එකේම open වෙනවා, install කරන්න දෙයක් නැහැ. App එක දැනට English වලින්.",
      },
      SOURCE,
      RISK,
    ],
    faq: [
      {
        q: "Deriv වල ලේසිම contract එක මොකක්ද?",
        a: "Rise/Fall තමයි තේරුම් ගන්න ලේසිම එක. ඒත් පැරදුණු contract එකක සම්පූර්ණ stake එකම යනවා.",
      },
      {
        q: "Deriv phone එකෙන් trade කරන්න පුළුවන්ද?",
        a: "ඔව්. Deriv කියන්නේ එයාලගේ app එක iOS සහ Android වල නොමිලේ කියලා. FXNOD phone browser එකේම වැඩ කරනවා.",
      },
      {
        q: "පටන් ගන්න ලොකු මුදලක් ඕනද?",
        a: "ඉගෙන ගන්න නම් එපා: demo account එක නොමිලේ. Real වලට යනකොට සම්පූර්ණයෙන්ම නැති වුණාට කමක් නැති ගානක් සහ contract එකේ minimum stake එක පාවිච්චි කරන්න.",
      },
    ],
    related: ["deriv-account-sinhala", "deriv-deposit-withdrawal-sinhala"],
    en: "how-to-trade-on-deriv-for-beginners",
  },

  {
    slug: "deriv-account-sinhala",
    title: "Deriv Account Sinhala: account එකක් හදන හැටි සහ verify කරන හැටි",
    description:
      "Deriv account එකක් සිංහලෙන්: register වෙන හැටි, demo සහ real account, verification වලට ඕන documents, සහ account එක ආරක්ෂා කරගන්න හැටි.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Deriv account එකක් හදන්න Deriv ගේම site එකට ගිහින් email එකෙන් register වෙන්න. Account එක හදන එක නොමිලේ, සහ ඒකත් එක්කම virtual funds තියෙන demo account එකක් ලැබෙනවා. Real trading සහ withdrawals වලට identity සහ address verify කරන්න වෙනවා. එක් කෙනෙකුට තියාගන්න පුළුවන් එක account එකයි.",
    body: [
      { type: "h2", text: "Account එක හදන හැටි" },
      {
        type: "steps",
        items: [
          { title: "deriv.com කියලා ඔබම type කරන්න", text: "Message එකකින් හෝ group එකකින් ආපු link එකක් පාවිච්චි කරන්න එපා. Fake sites ගොඩක් තියෙනවා." },
          { title: "Email එකෙන් register වෙන්න", text: "ඔබට විතරක් access තියෙන email එකක් පාවිච්චි කරන්න. Account එක recover කරන්නෙත් ඒකෙන්." },
          { title: "පදිංචි රට තෝරන්න", text: "ඇත්ත රට දාන්න. Verification එකේදී documents වලින් ඒක තහවුරු වෙනවා." },
          { title: "Account currency එක තෝරන්න", text: "Deriv ගේ payment methods ගොඩක් USD වලින් තියෙන නිසා ගොඩක් අය USD තෝරනවා. පළමු deposit එකට කලින් වෙනස් කරන්න පුළුවන්." },
          { title: "Demo account එකෙන් පටන් ගන්න", text: "Deposit එකක් නැතුව හැම දෙයක්ම අත්හදා බලන්න පුළුවන්." },
        ],
      },
      { type: "h2", text: "Demo සහ Real" },
      {
        type: "table",
        head: ["", "Demo account", "Real account"],
        rows: [
          ["සල්ලි", "Virtual funds", "ඔබේ deposit එක"],
          ["වියදම", "නොමිලේ", "හදන්න නොමිලේ; trade කරනකොට stake එක අවදානමේ"],
          ["ලාභ", "ඇත්ත නෙවෙයි, withdraw කරන්න බැහැ", "ඔබේ, withdraw කරන්න පුළුවන්"],
          ["Verification", "පුහුණු වෙන්න ඕන නැහැ", "සම්පූර්ණ access එකට ඕන"],
        ],
      },
      { type: "h2", text: "Verification" },
      {
        type: "p",
        text: "Deriv ගේ help centre එක කියන විදිහට identity එකට ජාතික හැඳුනුම්පත, රියදුරු බලපත්‍රය හෝ වලංගු passport එකක් සහ ඔබේ photo එකක් ඕන. Address එකට location access දීලා verify කරන්න පුළුවන්, නැත්නම් utility bill එකක්, bank statement එකක් හෝ රජයේ ලිපියක් upload කරන්න. Deriv staff කියන්නේ documents හරි නම් වැඩ කරන දින 1 සිට 3ක් යනවා කියලා.",
      },
      { type: "h2", text: "Upload reject වෙන්නේ ඇයි" },
      {
        type: "list",
        items: [
          "Photo එක කැපිලා, බොඳ වෙලා හෝ glare එකක් තියෙනවා. කොන් හතරම සහ අකුරු පැහැදිලිව පේන්න ඕන.",
          "Document එක කල් ඉකුත් වෙලා.",
          "නම හෝ උපන් දිනය Deriv profile එකේ තියෙන එකට හරියටම ගැළපෙන්නේ නැහැ.",
          "Address document එක පරණ වැඩියි, හෝ ඔබේ නමට නෙවෙයි.",
        ],
      },
      { type: "h2", text: "එක account එකයි" },
      {
        type: "p",
        text: "Deriv ගේ terms වල කියන්නේ එක් කෙනෙකුට Deriv group එකේ එක account එකක් විතරක් තියාගන්න පුළුවන් කියලා. වෙන email එකකින් දෙවෙනි account එකක් හැදුවොත් ඒක duplicate එකක් ලෙස close කරන්න Deriv ට පුළුවන්. ඒ එක account එක ඇතුළේ demo account එක, wallets සහ MT5 වගේ platform accounts තියාගන්න පුළුවන්.",
      },
      { type: "h2", text: "Account එක ආරක්ෂා කරගන්න" },
      {
        type: "list",
        items: [
          "වෙන කොහෙවත් පාවිච්චි නොකරන password එකක්.",
          "Password එක හෝ codes කාටවත් දෙන්න එපා. Deriv support එකට ඒවා ඕන නැහැ.",
          "ඔබ වෙනුවෙන් trade කරලා දෙන්නම් කියන කෙනෙකුට login එක දෙන්න එපා.",
          "Verify කරලා දෙන්නම් කියන කෙනෙකුට හැඳුනුම්පත් photos යවන්න එපා.",
        ],
      },
      { type: "h2", text: "Account එක FXNOD එකට connect කිරීම" },
      {
        type: "p",
        text: "FXNOD එකට connect වෙනකොට sign in වෙන්නේ Deriv ගේම page එකේ. ඒ නිසා FXNOD ට ඔබේ Deriv password එක පේන්නේ නැහැ. ඒ login එක යටතේ තියෙන demo සහ real accounts ඔක්කොම FXNOD එකේ list වෙනවා, සහ ඔබ trade කරන්න ඕන එක තෝරනවා.",
      },
      SOURCE,
      RISK,
    ],
    faq: [
      {
        q: "Deriv account එකක් හදන්න සල්ලි යනවද?",
        a: "නැහැ. Deriv කියන්නේ account එක හදන එක නොමිලේ කියලා, සහ සල්ලි ඕන වෙන්නේ real trade කරනකොට විතරයි.",
      },
      {
        q: "Verify නොකර trade කරන්න පුළුවන්ද?",
        a: "Demo account එකේ පුළුවන්. Deriv කියන්නේ සම්පූර්ණ access එකට verification ඕන කියලා. Withdraw කරන්න කලින් verify කරන්න වෙයි කියලා හිතන්න.",
      },
      {
        q: "Deriv accounts දෙකක් තියාගන්න පුළුවන්ද?",
        a: "Deriv ගේ terms අනුව එක් කෙනෙකුට එක account එකයි. Demo සහ real දෙකම ඒ එක login එක යටතේ තියෙනවා.",
      },
    ],
    related: ["deriv-trading-sinhala", "fxnod-deriv-connect-sinhala"],
  },

  {
    slug: "deriv-deposit-withdrawal-sinhala",
    title: "Deriv Deposit Sinhala: deposit සහ withdraw කරන හැටි",
    description:
      "Deriv deposit සහ withdrawal සිංහලෙන්: cashier එක, payment agents, P2P, crypto, ගතවෙන කාලය, සහ withdrawal එකක් පරක්කු වෙන හේතු.",
    tag: T_DERIV,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Deriv එකට deposit කරන්න හෝ withdraw කරන්න ඔබේ Deriv account එකේ cashier එකට යන්න. ඔබේ රටට තියෙන ක්‍රම පේන්නේ එතන විතරයි. Deriv ගේ help centre එක කියන විදිහට අඩුම deposit එක USD 5යි. Deriv ගේ terms අනුව withdraw කරන්න ඕන deposit කරපු ක්‍රමයෙන්මයි, සහ account එක verify වෙලා තියෙන්න ඕන.",
    body: [
      { type: "h2", text: "Deposit කරන හැටි" },
      {
        type: "steps",
        items: [
          { title: "Deriv ගේම site එකට sign in වෙන්න", text: "Cashier එක open කරලා deposit තෝරන්න." },
          { title: "Payment method එකක් තෝරන්න", text: "Minimum සහ maximum එතනම පෙන්නනවා. එතන නැති ක්‍රමයක් ඔබේ account එකට නැහැ." },
          { title: "ගෙවීම confirm කරන්න", text: "Deriv කියන්නේ card සහ e-wallet deposits සාමාන්‍යයෙන් එසැණින් එනවා කියලා." },
          { title: "Balance එක සහ statement එක බලන්න", text: "සල්ලි ආවද කියලා ඔබම තහවුරු කරගන්න." },
        ],
      },
      { type: "h2", text: "තියෙන මාර්ග" },
      {
        type: "table",
        head: ["මාර්ගය", "වැඩ කරන හැටි", "දැනගන්න ඕන දේ"],
        rows: [
          ["Card හෝ e-wallet", "Cashier එකෙන් කෙලින්ම", "ලංකාවේ card එකක් international ගෙවීම් වලට වැඩ කරනවද කියන එක ඔබේ bank එක අනුව"],
          ["Deriv P2P", "Verify වුණු වෙන user කෙනෙක් එක්ක, Deriv escrow එකක් එක්ක", "ඔබේ account එකට තියෙනවද කියලා P2P කොටසෙන් බලන්න"],
          ["Payment agent", "ස්වාධීන තුන්වෙනි පාර්ශවයක් රුපියල් වලින් ගනුදෙනු කරනවා", "Deriv කියන්නේ agents ලා එයාලට සම්බන්ධ නැහැ, ගනුදෙනුව ඔබේම අවදානමට කියලා"],
          ["Crypto", "Cashier එකේ පෙන්නන address එකට, පෙන්නන network එකෙන්ම", "වැරදි network එකකින් යැව්වොත් සල්ලි නැති වෙන්න පුළුවන්"],
        ],
      },
      { type: "h2", text: "Payment agents ගැන" },
      {
        type: "p",
        text: "ලංකාවෙන් \"Deriv payment agent Sri Lanka\" කියලා ගොඩක් search කරනවා. විශ්වාස කරන්න පුළුවන් list එක තියෙන්නේ ඔබේම cashier එකේ payment agents කොටසේ විතරයි. Facebook group එකකින්, WhatsApp එකකින් හෝ Telegram එකකින් හම්බුණු agent කෙනෙක් නෙවෙයි. Agent ලා එයාලගේම rate එකක් සහ commission එකක් තියාගන්නවා, ඒ නිසා සල්ලි යවන්න කලින් අතට ලැබෙන අවසාන ගාන අහගන්න. පළමු වතාවේ පොඩි ගානකින් අත්හදා බලන්න.",
      },
      { type: "h2", text: "Withdraw කරන හැටි" },
      {
        type: "steps",
        items: [
          { title: "Account එක verify කරලා තියන්න", text: "Verify නොවුණු account එකක් තමයි withdrawal එකක් හිරවෙන ප්‍රධානම හේතුව." },
          { title: "Cashier එකෙන් withdrawal ඉල්ලන්න", text: "Deriv එවන email එකේ link එකෙන් confirm කරන්න." },
          { title: "ක්‍රමය සහ ගාන තෝරන්න", text: "Deposit කරපු ක්‍රමයම පාවිච්චි කරන්න." },
          { title: "සල්ලි ආවද කියලා ඔබම බලන්න", text: "Screenshot එකක් හෝ SMS එකක් විශ්වාස කරන්න එපා. Bank account එක බලන්න." },
        ],
      },
      { type: "h2", text: "පරක්කු වෙන හේතු" },
      {
        type: "list",
        items: [
          "Account එක verify වෙලා නැහැ.",
          "සල්ලි යන account එක ඔබේ නමට නෙවෙයි.",
          "Email එකේ verification link එක confirm කරලා නැහැ.",
          "Request එක දැම්මේ වැඩ කරන වෙලාවෙන් පිට. Deriv ගේ terms කියන්නේ එතකොට වැඩි කාලයක් යන්න පුළුවන් කියලා.",
          "ඔබේ bank එකට credit කරන්න දින කිහිපයක් යනවා.",
        ],
      },
      { type: "h2", text: "රුපියල් සහ rate එක" },
      {
        type: "p",
        text: "Deriv account එකක් රුපියල් වලින් තියෙන්නේ නැහැ. ඔබේ රුපියල් account currency එකට convert වෙනවා, සහ ආපහු ගන්නකොට නැවත convert වෙනවා. එක \"Deriv dollar rate\" එකක් නැහැ: ඒක තීරණය වෙන්නේ ඔබ පාවිච්චි කරන ක්‍රමය, P2P advertiser හෝ agent අනුව. Rate එක නෙවෙයි, අතට ලැබෙන අවසාන ගාන සසඳන්න.",
      },
      { type: "h2", text: "මතක තියාගන්න" },
      {
        type: "list",
        items: [
          "Withdrawal එකක් release කරන්න ගාස්තුවක් ඉල්ලන කෙනෙක් වංචාකාරයෙක්.",
          "Message එකකින් ආපු account number එකකට සල්ලි දාන්න එපා.",
          "FXNOD ඔබේ deposits ගන්නෙත් නැහැ, withdrawals ගෙවන්නෙත් නැහැ. ඒවා කරන්නේ Deriv එකේ.",
        ],
      },
      SOURCE,
      RISK,
    ],
    faq: [
      {
        q: "Deriv minimum deposit එක කීයද?",
        a: "Deriv ගේ help centre එක කියන්නේ අඩුම deposit එක USD 5 කියලා. ඔබේ ක්‍රමයට තියෙන minimum එක cashier එකේ පෙන්නනවා.",
      },
      {
        q: "Deriv withdrawal එකකට කොච්චර කල් යනවද?",
        a: "ක්‍රමය අනුව. Deriv ගේ පැත්තෙන් එසැණින් සිට වැඩ කරන දිනයක් දක්වා කියලා තියෙනවා, ඊට පස්සේ ඔබේ bank එකේ කාලය එකතු වෙනවා.",
      },
      {
        q: "Deriv එකට රුපියල් වලින් deposit කරන්න පුළුවන්ද?",
        a: "රුපියල් account එකක් නැහැ. රුපියල් convert කරන ක්‍රමයකින්, උදාහරණයක් ලෙස P2P හෝ agent කෙනෙක් හරහා, ගෙවන්න වෙනවා.",
      },
    ],
    related: ["deriv-account-sinhala", "deriv-trading-sinhala"],
  },

  {
    slug: "forex-trading-sinhala",
    title: "Forex Trading Sinhala: forex trading යනු කුමක්ද?",
    description:
      "Forex trading සිංහලෙන්: forex කියන්නේ මොකක්ද, currency pair, pip, lot, leverage, spread, සහ පටන් ගන්න කලින් දැනගන්න ඕන අවදානම.",
    tag: T_LEARN,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Forex trading කියන්නේ එක රටක මුදලක් තවත් රටක මුදලකට හුවමාරු කරන මිලේ වෙනස්වීම් වලින් ලාභ ගන්න උත්සාහ කිරීම. Currencies trade වෙන්නේ EUR/USD වගේ pairs වලින්. Market එක සඳුදා සිට සිකුරාදා දක්වා පැය 24ම විවෘතයි. Leverage නිසා පොඩි මිල වෙනසකින් ලොකු ලාභයක් හෝ ලොකු පාඩුවක් වෙන්න පුළුවන්.",
    body: [
      { type: "h2", text: "මූලික වචන" },
      {
        type: "table",
        head: ["වචනය", "තේරුම"],
        rows: [
          ["Currency pair", "මුදල් දෙකක්. EUR/USD කියන්නේ euro එකක් dollars කීයද කියන එක"],
          ["Pip", "මිල වෙනස් වීමේ සම්මත ඒකකය. ගොඩක් pairs වල හතරවෙනි දශම ස්ථානය"],
          ["Lot", "Position එකේ ප්‍රමාණය. Standard lot එක ඒකක 100,000යි, mini 10,000යි, micro 1,000යි"],
          ["Spread", "Buy මිල සහ sell මිල අතර වෙනස. හැම trade එකකටම ගෙවන වියදම"],
          ["Leverage", "පොඩි deposit එකකින් ලොකු position එකක් පාලනය කිරීම"],
          ["Margin", "Position එක open කරලා තියන්න වෙන් කරන deposit එක"],
          ["Stop loss", "පාඩුව එක්තරා ගානකට ආවම trade එක close කරන order එක"],
        ],
      },
      { type: "h2", text: "මිල ඉහළ පහළ යන්නේ ඇයි" },
      {
        type: "list",
        items: [
          "පොලී අනුපාත: වැඩි පොලියක් දෙන මුදලකට සල්ලි ගලාගෙන එනවා.",
          "ආර්ථික දත්ත: උද්ධමනය, රැකියා, වර්ධනය.",
          "දේශපාලනය සහ හදිසි සිදුවීම්.",
          "වැදගත්ම දේ: market එක හෙලවෙන්නේ බලාපොරොත්තු වුණු දේ සහ ඇත්තටම වුණු දේ අතර වෙනසට.",
        ],
      },
      { type: "h2", text: "Leverage ගැන ඇත්ත" },
      {
        type: "table",
        head: ["Leverage", "Deposit එක", "Position එක", "1% ක් විරුද්ධව ගියොත්"],
        rows: [
          ["1:1", "1,000", "1,000", "10ක් නැති වෙනවා"],
          ["1:10", "1,000", "10,000", "100ක් නැති වෙනවා"],
          ["1:100", "1,000", "100,000", "1,000ම නැති වෙනවා"],
        ],
      },
      {
        type: "p",
        text: "Leverage එකෙන් trade එකක් දිනන්න තියෙන ඉඩ වෙනස් වෙන්නේ නැහැ. වෙනස් වෙන්නේ පොඩි මිල වෙනසක් ඔබට කොච්චර බලපානවද කියන එකයි. Broker දෙන උපරිම leverage එක පාවිච්චි කරන්න ඕන දෙයක් නෙවෙයි.",
      },
      { type: "h2", text: "Position size එක හදන හැටි" },
      {
        type: "p",
        text: "එක trade එකකට account එකෙන් 1% කට වඩා අවදානමට දාන්න එපා. Account එක 1,000යි නම් ඒ 10යි. Chart එකෙන් stop loss එක pips 20ක් දුරින් නම්, සහ mini lot එකක pip එකක වටිනාකම 1ක් විතර නම්: 10 බෙදීම (20 ගුණ 1) = mini lots 0.5. Stop එක chart එකෙන් තීරණය වෙනවා, size එක ඔබ තීරණය කරනවා.",
      },
      { type: "h2", text: "PDF, course සහ signals" },
      {
        type: "p",
        text: "\"Forex trading sinhala pdf\" සහ \"forex course sinhala\" ගොඩක් search කරනවා. නොමිලේ ඉගෙන ගන්න ඕන තරම් දේවල් තියෙනවා: demo account එකක්, trading journal එකක්, සහ මේ වගේ guides. සහතික ලාභ පොරොන්දු වෙන course එකක්, signal group එකක් හෝ \"account එක manage කරලා දෙන්නම්\" කියන කෙනෙක් ගැන පරිස්සම් වෙන්න.",
      },
      { type: "h2", text: "ලංකාවේ නීතිය ගැන" },
      {
        type: "p",
        text: "ශ්‍රී ලංකා මහ බැංකුව 2019 ඔක්තෝබර් වලදී අනවසර foreign exchange trading ගැන මහජන නිවේදනයක් නිකුත් කළා. ඒකේ කියන්නේ ලංකාවේ පදිංචි අය forex trading ගනුදෙනු කිරීම සහ ඒ සඳහා රටින් පිටට මුදල් යැවීම ගැනයි. මේ guide එක නීතිමය උපදෙසක් දෙන්නේ නැහැ. පටන් ගන්න කලින් මහ බැංකුවේ website එකේ නිවේදන කියවන්න.",
      },
      { type: "h2", text: "Forex සහ synthetic indices" },
      {
        type: "p",
        text: "Forex කියන්නේ ඇත්ත මුදල් වල ඇත්ත market එකක්. Synthetic indices කියන්නේ algorithm එකකින් හදන simulated markets, ඒවාට news බලපාන්නේ නැහැ සහ සති අන්තයේත් විවෘතයි. FXNOD tools trade කරන්නේ ඔබේ Deriv account එකේ options සහ multipliers. Forex CFDs trade කරන්නේ නැහැ.",
      },
      RISK,
    ],
    faq: [
      {
        q: "Forex trading එකෙන් සල්ලි හොයන්න පුළුවන්ද?",
        a: "සුළු පිරිසකට පුළුවන්. Regulated markets වල brokers ලා ප්‍රසිද්ධ කරන සංඛ්‍යා අනුව retail accounts වලින් බහුතරයක් පාඩු ලබනවා.",
      },
      {
        q: "Forex පටන් ගන්න කීයක් ඕනද?",
        a: "ඉගෙන ගන්න නම් කිසිවක් එපා: demo account එක නොමිලේ. Real වලට micro lots එක්ක 1% rule එක වැඩ කරන්න සිය ගණනක් ඕන.",
      },
      {
        q: "Forex ඉගෙන ගන්න කොච්චර කල් යනවද?",
        a: "Platform එක දවස් කිහිපයකින් ඉගෙන ගන්න පුළුවන්. Deposit එක නැති නොකර trade කරන්න ඉගෙන ගන්න මාස ගණනක් යනවා.",
      },
    ],
    related: ["trading-sinhala", "binary-trading-sinhala"],
  },

  {
    slug: "trading-sinhala",
    title: "Trading Sinhala: trading ඉගෙන ගන්නේ කොහොමද?",
    description:
      "Trading සිංහලෙන් මුල සිට: trading කියන්නේ මොකක්ද, ඉගෙන ගන්න ඕන පිළිවෙල, candlestick chart එකක් කියවන හැටි, risk, සහ journal එකක්.",
    tag: T_LEARN,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Trading කියන්නේ මිල වෙනස්වීම් වලින් ලාභ ගන්න බලාපොරොත්තුවෙන් මූල්‍ය වත්කම් හෝ contracts මිලදී ගැනීම සහ විකිණීම. ඉගෙන ගන්න ඕන පිළිවෙල: මුලින්ම මිලදී ගන්නේ මොකක්ද කියලා තේරුම් ගන්න, ඊළඟට risk management, ඊට පස්සේ demo account එකක පුහුණුව, එක market එකක් සහ එක ක්‍රමයක්, සහ හැම trade එකක්ම ලියන journal එකක්.",
    body: [
      { type: "h2", text: "පිළිවෙල වැදගත් ඇයි" },
      {
        type: "p",
        text: "ගොඩක් අය පටන් ගන්නේ strategy එකෙන්: මොන indicator එකද, මොන pattern එකද, මොන bot එකද. ඒක තමයි අන්තිමට ඉගෙන ගන්න ඕන දේ. Risk තේරෙන කෙනෙකුට සාමාන්‍ය strategy එකක් එක්ක දියුණු වෙනකන් ඉන්න පුළුවන්. හොඳ strategy එකක් තියෙන, risk control එකක් නැති කෙනා පළමු නරක සතියේම account එක නැති කරගන්නවා.",
      },
      { type: "h2", text: "ඉගෙන ගැනීමේ සැලැස්ම" },
      {
        type: "steps",
        items: [
          { title: "Instrument එක ඉගෙන ගන්න", text: "Contract එක දිනන්නේ මොකෙන්ද, ගෙවන්නේ කීයද, උපරිම පාඩුව කීයද, settle වෙන්නේ කවදාද. මේ හතරට උත්තර දෙන්න බැරි නම් තවම trade කරන්න සූදානම් නැහැ." },
          { title: "Risk ගණන් ඉගෙන ගන්න", text: "Stake size, stop loss, risk-to-reward, break-even win rate, drawdown." },
          { title: "Demo account එකක් open කරන්න", text: "Virtual funds වලින්, ඒත් ඇත්තටම පාවිච්චි කරන balance එකක් සහ stake එකක් එක්ක." },
          { title: "Chart එකක් කියවන්න ඉගෙන ගන්න", text: "Candlesticks, trend, support සහ resistance." },
          { title: "එක market එකක් සහ එක ක්‍රමයක් තෝරන්න", text: "ගැඹුරෙන් ඉගෙන ගන්න එක විවිධත්වයට වඩා වටිනවා." },
          { title: "හැම trade එකක්ම journal එකේ ලියන්න", text: "ඇතුල් වුණේ ඇයි, මොකද වුණේ, plan එක අනුව ගියාද." },
          { title: "පොඩියට real වලට යන්න", text: "Demo trades සිය ගණනකට පස්සේ, minimum stake එකෙන්." },
        ],
      },
      { type: "h2", text: "Candlestick එකක් කියවන හැටි" },
      {
        type: "table",
        head: ["කොටස", "පෙන්නන දේ"],
        rows: [
          ["Body", "ඒ කාලයේ open මිල සහ close මිල අතර පරාසය"],
          ["උඩ wick එක", "මිල කොච්චර ඉහළට ගිහින් ආපහු ආවද"],
          ["යට wick එක", "මිල කොච්චර පහළට ගිහින් ආපහු ආවද"],
          ["පාට", "කොළ: close එක open එකට වඩා ඉහළින්. රතු: පහළින්"],
        ],
      },
      { type: "h2", text: "වැදගත්ම ගණන් දෙක" },
      {
        type: "p",
        text: "Break-even win rate = risk බෙදීම (risk + reward). 10ක් අවදානමට දාලා 20ක් දිනන්න හදනවා නම් (1:2), පාඩු නොවී ඉන්න trades වලින් 33.3% ක් දිනන්න ඕන. Expected value = win rate ගුණ සාමාන්‍ය ලාභය, අඩු කිරීම loss rate ගුණ සාමාන්‍ය පාඩුව. මේක ධන නම් විතරයි strategy එකක් දිගු කාලීනව ලාභ දෙන්නේ. 90% ක් දිනන strategy එකක් වුණත්, එක පාඩුවක් ලාභ දහයකට වඩා ලොකු නම් පාඩුයි.",
      },
      { type: "h2", text: "ඇත්තටම බලාපොරොත්තු වෙන්න ඕන දේ" },
      {
        type: "list",
        items: [
          "කෙටි කාලීනව trade කරන බහුතරයක් පාඩු ලබනවා.",
          "මුලින් ලැබෙන ජයග්‍රහණ ගොඩක් වෙලාවට වාසනාව, සහ ඒවා මුල් පාඩු වලට වඩා භයානකයි.",
          "දියුණුව මුලින්ම පේන්නේ පොඩි, ස්ථාවර පාඩු සහ හොඳ විනය ලෙස. ලාභය එන්නේ ඊට පස්සේ.",
          "ඒකට මාස ගණනක් යනවා, දවස් ගණනක් නෙවෙයි.",
        ],
      },
      { type: "h2", text: "නොසලකා හරින්න ඕන දේ" },
      {
        type: "list",
        items: [
          "සහතික ලාභ පොරොන්දු වෙන signals, courses හෝ bots.",
          "ලාභ පෙන්නන screenshots.",
          "Win rate එකෙන් විතරක් විස්තර කරන strategies.",
          "Account එක manage කරලා දෙන්නම් කියන අය.",
        ],
      },
      RISK,
    ],
    faq: [
      {
        q: "Trading තනියම ඉගෙන ගන්න පුළුවන්ද?",
        a: "ඔව්. Demo account එකක්, journal එකක් සහ අවංක review එකක් මූලික දේ ඉගෙන ගන්න ඇති.",
      },
      {
        q: "Trading කියන්නේ සූදුවක්ද?",
        a: "කරන විදිහ අනුව. Test කරපු ධන expected value එකක් සහ පාලනය කරපු risk එකක් නැතුව කරනවා නම්, ප්‍රතිඵල සූදුවකින් වෙනස් නැහැ.",
      },
      {
        q: "අලුත් කෙනෙක් bot එකක් පාවිච්චි කරන්න ඕනද?",
        a: "ඒ contract එකම demo එකේ අතින් trade කරලා බැලුවට පස්සේ විතරයි. ඊට පස්සේ flat stake එකක් සහ stop loss එකක් එක්ක, demo එකේ.",
      },
    ],
    related: ["forex-trading-sinhala", "trading-bot-sinhala"],
    en: "how-to-start-learning-trading",
  },

  {
    slug: "binary-trading-sinhala",
    title: "Binary Trading Sinhala: binary options වැඩ කරන හැටි",
    description:
      "Binary trading සිංහලෙන්: fixed-payout option එකක් කියන්නේ මොකක්ද, Rise/Fall සහ digit contracts, payout ගණන, සහ 90% ක් දිනලත් පාඩු වෙන හැටි.",
    tag: T_LEARN,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Binary option එකක් කියන්නේ ප්‍රතිඵල දෙකක් විතරක් තියෙන contract එකක්: ඔබේ පුරෝකථනය හරි නම් කලින් කියපු payout එක ලැබෙනවා, වැරදි නම් stake එක නැති වෙනවා. උපරිම පාඩුව stake එකයි. Payout එක දෙගුණයට වඩා අඩු නිසා, trades වලින් භාගයකට වඩා ටිකක් වැඩියෙන් දිනන්නේ නැත්නම් සාමාන්‍යයෙන් පාඩුයි.",
    body: [
      { type: "h2", text: "ප්‍රධාන contract වර්ග" },
      {
        type: "table",
        head: ["Contract එක", "ඔබ පුරෝකථනය කරන දේ"],
        rows: [
          ["Rise/Fall", "මිල පටන් ගත්ත තැනට වඩා ඉහළින් ඉවර වෙයිද, පහළින් ඉවර වෙයිද"],
          ["Higher/Lower", "ඔබ තෝරන ඉලක්ක මිලකට ඉහළින්ද පහළින්ද ඉවර වෙන්නේ"],
          ["Touch/No Touch", "කාලය ඉවර වෙන්න කලින් මිල ඉලක්කයට වදීද"],
          ["Matches/Differs", "අවසාන මිලේ අන්තිම ඉලක්කම ඔබ තෝරපු එකද, වෙන එකක්ද"],
          ["Even/Odd", "අන්තිම ඉලක්කම ඉරට්ටේද ඔත්තේද"],
          ["Over/Under", "අන්තිම ඉලක්කම ඔබ තෝරන ඉලක්කමට වඩා ලොකුද පොඩිද"],
        ],
      },
      { type: "h2", text: "Payout එකෙන් break-even එකට" },
      {
        type: "table",
        head: ["Stake 10කට ලැබෙන මුළු ගාන", "ලාභය", "පාඩු නොවී ඉන්න ඕන win rate එක"],
        rows: [
          ["11.00", "1.00", "90.9%"],
          ["15.00", "5.00", "66.7%"],
          ["19.50", "9.50", "51.3%"],
          ["30.00", "20.00", "33.3%"],
        ],
      },
      {
        type: "p",
        text: "Break-even win rate = stake බෙදීම payout. මේ ගාන contract එක ඇත්තටම දිනන්න තියෙන ඉඩ එක්ක සසඳන්න. ඒ දෙක අතර වෙනස තමයි contract එකේ වියදම.",
      },
      { type: "h2", text: "90% ක් දිනලත් පාඩු වෙන හැටි" },
      {
        type: "p",
        text: "Differs contract එකක් ඉලක්කම් දහයෙන් නවයකටම දිනනවා, ඒ නිසා අහම්බෙන්ම 90% ක් විතර දිනනවා. ඒත් හැම ජයග්‍රහණයක්ම stake එකෙන් 10% ක් විතර ගෙවනවා නම්: trades සියයකින් ජයග්‍රහණ 90ක් 0.10 ගානේ = 9ක්, පාඩු 10ක් 1 ගානේ = 10ක්. ශුද්ධ පාඩුව 1යි. වැඩියෙන් දිනන එක ආරක්ෂිත වීමක් නෙවෙයි.",
      },
      { type: "h2", text: "Synthetic indices වල digits" },
      {
        type: "p",
        text: "Deriv ගේ synthetic indices හදන්නේ random number generator එකකින් කියලා Deriv කියනවා. හැම tick එකකම අන්තිම ඉලක්කමට ඉලක්කම් දහයටම සමාන ඉඩක් තියෙනවා නම්, කලින් ආපු ඉලක්කම් වලින් ඊළඟ එක ගැන කිසිවක් කියවෙන්නේ නැහැ. \"මේ ඉලක්කම දැන් එන්න ඕන\" කියන එක gambler's fallacy එකයි.",
      },
      { type: "h2", text: "ඉක්මන් contracts වල අවදානම" },
      {
        type: "list",
        items: [
          "Tick කිහිපයකින් settle වෙන contracts තත්පර ගණනකින් ඉවරයි, ඒ නිසා පැයකට trades සිය ගණනක් දාන්න පුළුවන්.",
          "හැම trade එකකටම සාමාන්‍යයෙන් පොඩි වියදමක් තියෙනවා. Trades වැඩි වෙනකොට ඒ වියදමත් වැඩි වෙනවා.",
          "පැරදුණාට පස්සේ stake එක දෙගුණ කරන එක (Martingale) පොඩි පාඩු ගොඩක් එක ලොකු පාඩුවක් කරනවා.",
        ],
      },
      { type: "h2", text: "ලංකාවේ නීතිය සහ regulation" },
      {
        type: "p",
        text: "සමහර රටවල retail ගනුදෙනුකරුවන්ට binary options තහනම් කරලා හෝ සීමා කරලා තියෙනවා. ශ්‍රී ලංකා මහ බැංකුව 2019 දී අනවසර foreign exchange trading ගැන මහජන නිවේදනයක් නිකුත් කළා. මේ guide එක නීතිමය තීරණයක් දෙන්නේ නැහැ. ඔබේ තත්ත්වය ගැන මහ බැංකුවේ website එක බලන්න.",
      },
      { type: "h2", text: "FXNOD එකේ" },
      {
        type: "p",
        text: "මේ contract වර්ග ඔක්කොම FXNOD dTrader එකේ තියෙනවා, සහ Buy කරන්න කලින් Deriv quote කරන payout එක පෙන්නනවා. dBot එකේ bot එකකට මේවා buy කරන්න පුළුවන්. හැම එකක්ම Deriv demo account එකේ අත්හදා බලන්න පුළුවන්.",
      },
      SOURCE,
      RISK,
    ],
    faq: [
      {
        q: "Binary trading එකෙන් දිනන්න ලේසිම contract එක මොකක්ද?",
        a: "දිනන්න ලේසි contract එකක් නැහැ. වැඩියෙන් දිනන ඒවා අඩුවෙන් ගෙවනවා, අඩුවෙන් දිනන ඒවා වැඩියෙන් ගෙවනවා.",
      },
      {
        q: "Binary option එකක උපරිම පාඩුව කීයද?",
        a: "ඒ contract එකට දාපු stake එක. ඒත් trades ගොඩකින් සම්පූර්ණ balance එකම නැති වෙන්න පුළුවන්.",
      },
      {
        q: "Binary trading strategy එකක් තියෙනවද?",
        a: "Random index එකක දිශාව පුරෝකථනය කරන strategy එකක් නැහැ. ඔබට පාලනය කරන්න පුළුවන් stake එක, contract එක සහ limits විතරයි.",
      },
    ],
    related: ["trading-sinhala", "martingale-sinhala"],
  },

  {
    slug: "trading-bot-sinhala",
    title: "Trading Bot Sinhala: trading bot එකක් කියන්නේ මොකක්ද?",
    description:
      "Trading bot සිංහලෙන්: bot එකක් කියන්නේ මොකක්ද, ගන්න තීරණ හතර, දුවන තැන, කරන්න පුළුවන් දේ සහ බැරි දේ, සහ තෝරන හැටි.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Trading bot එකක් කියන්නේ ඔබ කලින් දෙන rules අනුව ඔබ වෙනුවෙන් trade කරන program එකක්: මොනවද buy කරන්නේ, කවදද ඇතුල් වෙන්නේ, කීයක් stake කරන්නේ, කවදද නවත්වන්නේ. ඒක market එක බලාගෙන ඉඳලා ඒ rules වලට ගැළපෙන හැම trade එකක්ම දානවා. පැකිලීම සහ මහන්සිය අයින් කරනවා. අවදානම අයින් කරන්නේ නැහැ, සහ මිල පුරෝකථනය කරන්නේ නැහැ.",
    body: [
      { type: "h2", text: "හැම bot එකක්ම ගන්න තීරණ හතර" },
      {
        type: "table",
        head: ["තීරණය", "තේරුම", "උදාහරණය"],
        rows: [
          ["මොනවද trade කරන්නේ", "Market එක සහ contract එක", "Volatility index එකක Rise/Fall, ticks පහක්"],
          ["කවදද ඇතුල් වෙන්නේ", "Trade එක පටන් ගන්න signal එක", "එකම දිශාවට ticks තුනකට පස්සේ"],
          ["කීයක් stake කරන්නේ", "හැම trade එකකම ගාන සහ ඒක වෙනස් වෙන හැටි", "හැමදාම එකම stake එක"],
          ["කවදද නවත්වන්නේ", "Session එක ඉවර කරන limits", "20ක් පාඩු වුණාම හෝ 10ක් ලාභ වුණාම"],
        ],
      },
      {
        type: "p",
        text: "අලුත් අය බලන්නේ දෙවෙනි පේළිය විතරයි. අත්දැකීම් තියෙන අය බලන්නේ තුන්වෙනි සහ හතරවෙනි පේළි, මොකද account එක කොච්චර කල් තියෙනවද කියලා තීරණය කරන්නේ ඒ දෙකයි.",
      },
      { type: "h2", text: "Bot එක දුවන්නේ කොහෙද" },
      {
        type: "p",
        text: "සමහර bots දුවන්නේ ඔබේ browser tab එක ඇතුළේ. Tab එක close කළොත්, network එක ගියොත් හෝ phone එක sleep වුණොත් bot එක නවතිනවා, සමහර වෙලාවට trade එකක් open වෙලා තියෙද්දී, stop loss එකක් නැතුව. තවත් bots දුවන්නේ server එකක, ඒ නිසා ඔබේ device එක off වුණත් වැඩ කරනවා. FXNOD bots දෙවෙනි වර්ගයේ: dBot හෝ Auto Hub එකෙන් start කරන bot එකක් FXNOD servers වල දුවනවා, සහ limits හැම trade එකකටම කලින් එතන check වෙනවා.",
      },
      { type: "h2", text: "Bot එකකට හොඳට කරන්න පුළුවන් දේ සහ බැරි දේ" },
      {
        type: "list",
        items: [
          "පුළුවන්: rule එකක් හැමදාම, හැම වෙලාවෙම, බයක් හෝ කෑදරකමක් නැතුව හරියටම අනුගමනය කිරීම.",
          "පුළුවන්: වේගය. Ticks කිහිපයක contracts අතින් ස්ථාවරව trade කරන්න බැහැ.",
          "බැහැ: rule එක වැඩ කරන එක නැවතිලා කියලා දැනගැනීම. පාඩු ලබන rule එකත් ඒ විදිහටම අනුගමනය කරනවා.",
          "බැහැ: edge එකක් හැදීම. Strategy එකට වාසියක් නැත්නම්, automate කළාම ඉක්මනින් පාඩු වෙනවා විතරයි.",
        ],
      },
      { type: "h2", text: "Bot එකක් තෝරන හැටි" },
      {
        type: "steps",
        items: [
          { title: "Rules ඔක්කොම කියවන්න පුළුවන්ද?", text: "Logic එක රහසක් නම් අවදානම තක්සේරු කරන්න බැහැ." },
          { title: "Stake එක පාලනය කරන්නේ කවුද?", text: "ඔබට ඒක set කරන්නත්, දිනුවම සහ පැරදුණාම ඒක වෙනස් වෙන හැටි බලන්නත් පුළුවන් වෙන්න ඕන." },
          { title: "Connect වෙන්නේ කොහොමද?", text: "Broker ගේම login page එකෙන්. ඔබේ password එකෙන් කවදාවත් නෙවෙයි." },
          { title: "Demo එකේ නොමිලේ අත්හදා බලන්න පුළුවන්ද?", text: "Real account එකේ විතරක් වැඩ කරන bot එකක් ඔබව තල්ලු කරනවා." },
        ],
      },
      { type: "h2", text: "\"නොපැරදෙන bot\" සහ \"AI bot\"" },
      {
        type: "p",
        text: "නොපැරදෙන bot එකක් නැහැ. එහෙම පෙන්නන ඒවා සාමාන්‍යයෙන් Martingale: පොඩි ලාභ ගොඩක් දිනලා, ඊට පස්සේ එක වතාවකින් ලොකු ගානක් නැති කරනවා. AI කියලා විකුණන bots වලින් බහුතරයක් වෙන නමකින් එන fixed rules. මිල කියන්නේ ගුණාත්මකභාවය ගැන සාක්ෂියක් නෙවෙයි.",
      },
      RISK,
    ],
    faq: [
      {
        q: "Trading bots වැඩ කරනවද?",
        a: "එයාලගේ rules විශ්වාසදායකව ක්‍රියාත්මක කරනවා. සල්ලි හොයනවද කියන එක සම්පූර්ණයෙන්ම rules මත රඳා පවතිනවා.",
      },
      {
        q: "Bot එකකට සල්ලි නැති කරන්න පුළුවන්ද?",
        a: "ඔව්, account එකේ සම්පූර්ණ balance එකම, සහ මනුස්සයෙකුට වඩා ඉක්මනින්.",
      },
      {
        q: "Code කරන්න දැනගන්න ඕනද?",
        a: "නැහැ. Code නැති builders තියෙනවා. FXNOD dBot එකේ bot එකක් හදන්නේ ප්‍රශ්න වලට උත්තර දීලා.",
      },
    ],
    related: ["deriv-bot-sinhala", "martingale-sinhala"],
    en: "what-is-automated-trading",
    cta: CTA_BOT,
  },

  {
    slug: "deriv-bot-sinhala",
    title: "Deriv Bot Sinhala: Deriv වලට bot එකක් පාවිච්චි කරන හැටි",
    description:
      "Deriv bot සිංහලෙන්: Deriv Bot එකයි FXNOD dBot එකයි අතර වෙනස, XML files වල අවදානම, සහ bot එකක් තෝරන්න ප්‍රශ්න පහක්.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Deriv වල bot එකක් පාවිච්චි කරන්න ක්‍රම දෙකක් තියෙනවා: Deriv ගේම tool එක වන Deriv Bot, එතන strategy එක visual blocks වලින් හදනවා සහ ඒක ඔබේ browser එකේ දුවනවා, හෝ Deriv API එකෙන් ඔබේ account එකට connect වෙන ස්වාධීන tool එකක්. Rules කියවන්න පුළුවන්, stop loss එකක් අනිවාර්ය, demo එකේ අත්හදා බලන්න පුළුවන් එකක් තෝරන්න.",
    body: [
      { type: "h2", text: "Deriv Bot, Deriv කියන විදිහට" },
      {
        type: "list",
        items: [
          "Visual blocks වලින් හදනවා, coding ඕන නැහැ.",
          "Deriv නම් කරන preset strategies තියෙනවා: Martingale, D'Alembert සහ Oscar's Grind.",
          "Strategies XML files ලෙස save සහ load කරනවා.",
          "ඔබේ browser එකේ දුවනවා, සහ browser එක close කළොත් pause වෙනවා.",
          "නොමිලේ demo account එකකින් test කරන්න පුළුවන්.",
        ],
      },
      { type: "h2", text: "Deriv Bot සහ FXNOD dBot" },
      {
        type: "table",
        head: ["", "Deriv Bot", "FXNOD dBot"],
        rows: [
          ["හදන්නේ", "Deriv", "FXNOD, ස්වාධීන product එකක්"],
          ["හදන විදිහ", "Visual blocks", "ප්‍රශ්න වලට උත්තර දීලා"],
          ["දුවන තැන", "ඔබේ browser එක", "FXNOD servers"],
          ["Page එක close කළොත්", "Bot එක pause වෙනවා", "Bot එකයි limits ටිකයි දිගටම වැඩ"],
          ["Strategy files", "XML", "ඔබේ FXNOD account එකේ save වෙනවා; XML නැහැ"],
          ["Stop loss", "Tool එකක් ලෙස තියෙනවා", "Start කරන්න අනිවාර්යයි"],
        ],
      },
      { type: "h2", text: "Group වල බෙදාහරින XML files" },
      {
        type: "p",
        text: "Telegram සහ WhatsApp groups වල \"නොපැරදෙන bot\" කියලා Deriv Bot XML files බෙදාහරිනවා. ඒවායින් බහුතරයක හැංගිලා තියෙන්නේ එකම දෙයක්: හැම පාඩුවකටම පස්සේ ගුණ වෙන stake එකක්. ඒවා එක දිගට ගොඩක් වතාවක් දිනලා, ඊට පස්සේ එක පාරටම ලොකු ගානක් නැති කරනවා. එකක් පාවිච්චි කරන්න කලින් demo එකේ load කරලා, stake එක වෙනස් වෙන තැන හොයලා, ඒක යන උපරිම stake එක බලන්න.",
      },
      { type: "h2", text: "Bot එකක් තෝරන්න ප්‍රශ්න පහක්" },
      {
        type: "steps",
        items: [
          { title: "Rules ඔක්කොම කියවන්න පුළුවන්ද?", text: "බැරි නම් අවදානම දන්නේ නැහැ." },
          { title: "Stake එක මම set කරනවද?", text: "සහ පාඩුවකට පස්සේ ඒකට මොකද වෙන්නේ?" },
          { title: "Connect වෙන්නේ Deriv ගේ page එකෙන්ද?", text: "Password එක ඉල්ලන tool එකක් පාවිච්චි කරන්න එපා." },
          { title: "දුවන්නේ කොහෙද?", text: "Tab එකක් මත රඳා පවතිනවා නම්, ඔබේ limits ටිකත් එහෙමයි." },
          { title: "Demo එකේ නොමිලේ අත්හදා බලන්න පුළුවන්ද?", text: "බැරි නම් අත්හරින්න." },
        ],
      },
      { type: "h2", text: "Bot එකකින් probabilities වෙනස් වෙන්නේ නැහැ" },
      {
        type: "p",
        text: "නොමිලේ වුණත් ගෙවලා ගත්තත්, bot එකකින් ඒක buy කරන contract එකේ probabilities වෙනස් වෙන්නේ නැහැ. Random index එකක bot එක තීරණය කරන්නේ කවදද සහ කීයද කියන එක, සාමාන්‍ය ප්‍රතිඵලය තීරණය කරන්නේ payout එක. Flat stake එකක් සහ stop loss එකක් තියෙන bot එකක් කියන්නේ විනයක් ඇතුව trade කරන ක්‍රමයක්, market එක පරාජය කරන ක්‍රමයක් නෙවෙයි.",
      },
      SOURCE,
      RISK,
    ],
    faq: [
      {
        q: "Deriv Bot නොමිලේද?",
        a: "Deriv ගේ page එකේ ඒක පාවිච්චි කරන්න ගාස්තුවක් දාලා නැහැ, සහ නොමිලේ demo account එකකින් test කරන්න පුළුවන් කියනවා. Real trade කරනකොට stake එක අවදානමේ.",
      },
      {
        q: "Deriv වලට හොඳම bot එක මොකක්ද?",
        a: "ඔබට තේරෙන, ඔබේම demo account එකේ test කරපු, flat stake එකක් සහ stop loss එකක් තියෙන එක.",
      },
      {
        q: "FXNOD dBot කියන්නේ Deriv Bot එකමද?",
        a: "නැහැ. dBot කියන්නේ FXNOD හදපු, ඔබේ Deriv account එකේ trade කරන වෙනම bot builder එකක්.",
      },
      {
        q: "Bot එකට මගේ Deriv password එක ඕනද?",
        a: "නැහැ, සහ කවදාවත් දෙන්න එපා. හරි tool එකක් ඔබව Deriv ගේ page එකට යවලා, ඔබට ආපහු ගන්න පුළුවන් permission එකක් ලබාගන්නවා.",
      },
    ],
    related: ["trading-bot-sinhala", "fxnod-deriv-connect-sinhala"],
    en: "what-is-deriv-bot",
    cta: CTA_BOT,
  },

  {
    slug: "martingale-sinhala",
    title: "Martingale Strategy Sinhala: වැඩ කරන හැටි සහ අසාර්ථක වෙන හේතුව",
    description:
      "Martingale strategy සිංහලෙන්: පාඩුවකට පස්සේ stake එක දෙගුණ කිරීම. සම්පූර්ණ ladder එක, කැඩෙන වාර ගණන, සහ සීමා.",
    tag: T_BOTS,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Martingale කියන්නේ හැම පාඩුවකටම පස්සේ stake එක ගුණ කිරීම, සාමාන්‍යයෙන් දෙකෙන්, ඊළඟ ජයග්‍රහණයෙන් කලින් පාඩු ඔක්කොම සහ ඒකක එකක ලාභයක් ආපහු ගන්න. ඒක පොඩි ගණන් ගොඩක් වතාවක් දිනලා, කලාතුරකින් ලොකු ගානක් නැති කරනවා. Trades වල සාමාන්‍ය ප්‍රතිඵලය වෙනස් කරන්නේ නැහැ: දිග streak එකක් එනකන් පාඩු හංගනවා විතරයි.",
    body: [
      { type: "h2", text: "Ladder එක" },
      {
        type: "table",
        head: ["පාඩු අංකය", "Stake එක", "මුළු පාඩුව", "මේ trade එක දිනුවොත් ලාභය"],
        rows: [
          ["1", "1", "1", "1"],
          ["2", "2", "3", "1"],
          ["3", "4", "7", "1"],
          ["5", "16", "31", "1"],
          ["7", "64", "127", "1"],
          ["10", "512", "1,023", "1"],
        ],
      },
      {
        type: "p",
        text: "හැම පේළියකම එකම ඒකකය දිනන්න වැඩියෙන් අවදානමට දානවා. හත්වෙනි පියවරේදී 1ක් දිනන්න 64ක් stake කරනවා.",
      },
      { type: "h2", text: "Payout එක දෙගුණයට අඩු නම් තවත් නරකයි" },
      {
        type: "p",
        text: "උඩ වගුව උපකල්පනය කරන්නේ ජයග්‍රහණයක් සම්පූර්ණ stake එකම ගෙවනවා කියලා. Options ගෙවන්නේ ඊට අඩුවෙන්. ජයග්‍රහණයක් 95% ක් ගෙවනවා නම්, දෙගුණ කිරීමෙන් ආපහු ලැබෙන ගාන ටිකෙන් ටික අඩු වෙනවා: පාඩු පහකට පස්සේ 32කින් දිනුවම ලැබෙන්නේ 30.40යි, පාඩුව 31යි.",
      },
      { type: "h2", text: "කොච්චර වතාවක් කැඩෙනවද" },
      {
        type: "table",
        head: ["ඉඩ දෙන පියවර", "ඔක්කොම පැරදෙන සම්භාවිතාව (50% trades)", "එහෙම වුණාම පාඩුව"],
        rows: [
          ["3", "12.5%, 8න් 1ක්", "7"],
          ["5", "3.1%, 32න් 1ක්", "31"],
          ["7", "0.78%, 128න් 1ක්", "127"],
          ["10", "0.098%, 1,024න් 1ක්", "1,023"],
        ],
      },
      {
        type: "p",
        text: "ඕනෑම පේළියක් බලන්න: ඒ වතාව ගණනක් විතර 1 ගානේ දිනලා, ඊට පස්සේ ඒ මුළු ගානම විතර එක පාරින් නැති කරනවා. සමාන payout එකකදී ඒක බිංදුවයි, දෙගුණයට අඩුවෙන් ගෙවන contract එකකදී පාඩුවක්.",
      },
      { type: "h2", text: "මුලදී ඒක හොඳට පේන්නේ ඇයි" },
      {
        type: "p",
        text: "පැය ගණනක් හෝ දවස් ගණනක් balance එක කෙලින් ඉරක් වගේ ඉහළට යනවා. කෙටි test එකක 100% ක් දිනනවා. ඒ කිසිවකින් අවදානම මැනෙන්නේ නැහැ, මොකද අවදානම කියන්නේ තවම නොවුණු දේ. තත්පර කිහිපයකට වරක් trade කරන bot එකක් පැයකට sequences සිය ගණනක් ඉවර කරන නිසා, 1,024න් 1ක streak එකක් පැය කිහිපයක කාරණයක්.",
      },
      { type: "h2", text: "කොහොමත් පාවිච්චි කරනවා නම්" },
      {
        type: "list",
        items: [
          "පියවර ගණන සීමා කරලා, සම්පූර්ණ ladder එකම කවදාහරි නැති වෙනවා කියලා හිතන්න.",
          "උපරිම stake එකට සීමාවක් දාන්න.",
          "අන්තිම පියවරත් දරාගන්න පුළුවන් තරම් පොඩි stake එකකින් පටන් ගන්න.",
          "Ladder එක කැඩුණාට පස්සේ වැඩි base එකකින් නැවත පටන් ගන්න එපා.",
        ],
      },
      { type: "h2", text: "FXNOD dBot එකේ" },
      {
        type: "p",
        text: "dBot එක Martingale high risk ලෙස label කරනවා, සහ bot එක start වෙන්න කලින් losing streak එකක stakes පෙන්නනවා. Multiplier එකයි පියවර ගණනයි ඔබ තෝරනවා. වැඩි වුණු stake එකක් ඔබ දාන උපරිම ගානවත්, session එකේ stop loss එකවත් කවදාවත් පහු කරන්නේ නැහැ. Auto Hub bots Martingale පාවිච්චි කරන්නේ නැහැ.",
      },
      RISK,
    ],
    faq: [
      {
        q: "Martingale trading වල වැඩ කරනවද?",
        a: "ඔබේ ladder එකට වඩා දිග streak එකක් එනකන් වැඩ කරනවා. ඊට පස්සේ හොයපු ඔක්කොමත් ඊට වැඩියෙනුත් නැති කරනවා.",
      },
      {
        q: "එක දිගට පාඩු කීයකට සූදානම් වෙන්න ඕනද?",
        a: "හිතෙනවාට වඩා වැඩියෙන්. 50% trades වල එක දිගට හතක් sequences 128කට වරක් විතර වෙනවා.",
      },
      {
        q: "හොඳම Martingale multiplier එක මොකක්ද?",
        a: "ආරක්ෂිත එකක් නැහැ. වැඩි එකක් ඉක්මනින් recover කරලා ඉක්මනින් සීමාවට යනවා. දෙකට අඩු එකක් සම්පූර්ණයෙන් recover කරන්නේ නැහැ.",
      },
    ],
    related: ["binary-trading-sinhala", "trading-bot-sinhala"],
    en: "martingale-strategy-explained",
    cta: {
      title: "පටන් ගන්න කලින් stakes ටික බලන්න",
      text: "dBot එක bot එක start වෙන්න කලින් losing streak එකක stakes පෙන්නනවා, stop loss එකක් නැතුව start වෙන්නේ නැහැ, සහ උපරිම stake එකට සීමාවක් දානවා. ඕනෑම setting එකක් ඔබේ Deriv demo account එකේ අත්හදා බලන්න. App එක දැනට English වලින්.",
    },
  },

  {
    slug: "fxnod-deriv-connect-sinhala",
    title: "FXNOD Sinhala: Deriv account එක FXNOD එකට connect කරන හැටි",
    description:
      "ඔබේ Deriv account එක FXNOD එකට විනාඩියකින් connect කරන්න: Deriv ගේ page එකේ sign in, demo හෝ real තෝරන්න, FXNOD ට password එක පේන්නේ නැහැ.",
    tag: "පටන් ගැනීම",
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "FXNOD එකේ Connected Accounts open කරලා Connect Deriv ඔබන්න. ඔබ sign in වෙන්නේ Deriv ගේම page එකේ, සහ access එක approve කරනවා. FXNOD එකට ආපහු ආවම ඒ Deriv login එක යටතේ තියෙන accounts ඔක්කොම list වෙනවා. Virtual funds වලින් පුහුණු වෙන්න demo account එක තෝරන්න, නැත්නම් ඔබේ සල්ලි වලින් trade කරන්න real account එකක්. FXNOD ට ඔබේ Deriv password එක කවදාවත් පේන්නේ නැහැ.",
    body: [
      { type: "h2", text: "පටන් ගන්න කලින්" },
      {
        type: "list",
        items: [
          "Deriv account එකක්. FXNOD ඒක ඔබ වෙනුවෙන් හදන්නේ නැහැ. හැම Deriv login එකකම virtual funds තියෙන demo account එකක් තියෙනවා.",
          "FXNOD account එකක්. Email එකෙන් sign up වෙලා, FXNOD එවන code එකෙන් confirm කරන්න.",
          "FXNOD screens දැනට English වලින්. මේ guide එකේ buttons වල නම් screen එකේ තියෙන විදිහටම දීලා තියෙනවා.",
        ],
      },
      { type: "h2", text: "පියවර හතරකින් connect වෙන්න" },
      {
        type: "steps",
        items: [
          { title: "Connected Accounts open කරන්න", text: "FXNOD එකට sign in වෙලා ඒ කොටස open කරන්න." },
          { title: "Connect Deriv ඔබන්න", text: "FXNOD ඔබව Deriv ගේ login page එකට යවනවා. මොකුත් type කරන්න කලින් address එක deriv.com එකෙන් ඉවර වෙනවද බලන්න." },
          { title: "Access එක approve කරන්න", text: "Deriv පෙන්නනවා FXNOD ඉල්ලන දේ. Approve කළාම Deriv ඔබව FXNOD එකට ආපහු යවනවා." },
          { title: "Trade කරන account එක තෝරන්න", text: "ඒ login එකේ demo සහ real accounts ඔක්කොම පේනවා. ඕන එක තෝරන්න. ඕනෑම වෙලාවක වෙනස් කරන්න පුළුවන්." },
        ],
      },
      { type: "h2", text: "Demo ද real ද" },
      {
        type: "p",
        text: "එක approval එකකින් එකම Deriv login එකේ accounts ඔක්කොම ආවරණය වෙනවා, ඒ නිසා demo එකෙන් real එකට මාරු වෙන්නේ FXNOD ඇතුළේමයි. Demo account එක virtual funds ලෙස label කරලා තියෙනවා. Real account එකක් තෝරනකොට FXNOD ඔබෙන් confirm කරන්න කියනවා, මොකද එතැන් සිට manual orders වලට ඇත්ත සල්ලි යනවා.",
      },
      {
        type: "p",
        text: "Account එක මාරු කළාට දැනටමත් දුවන bot එකක් මාරු වෙන්නේ නැහැ. Bot එකක් නවතිනකන් ඒක start කරපු account එකේම trade කරනවා. ඒ නිසා demo එකේ start කරපු bot එකක් අත්වැරදීමකින් real සල්ලි වලට යන්නේ නැහැ.",
      },
      { type: "h2", text: "Bots වලට තව එක approval එකක්" },
      {
        type: "p",
        text: "Real account එකක පළමු වතාවට bot එකක් දුවනකොට, Deriv ඔබෙන් FXNOD ගේ automated-trading connection එකට ඉඩ දෙන්න කියනවා. ඒක manual trading වලට දීපු permission එකෙන් වෙනම එකක්, සහ දෙන්නේ ඒ විදිහටම: Deriv ගේ page එකේ, FXNOD එකේ නෙවෙයි.",
      },
      { type: "h2", text: "Disconnect කිරීම" },
      {
        type: "p",
        text: "ඕනෑම වෙලාවක Connected Accounts එකෙන් Deriv login එකක් disconnect කරන්න පුළුවන්. FXNOD ඒ accounts trade කරන එක නවත්වලා, ඒ login එකේ දුවන bots නවත්වනවා. ඔබේ Deriv account settings වල connected apps list එකෙන් FXNOD අයින් කරන්නත් පුළුවන්, එතකොට Deriv ගේ පැත්තෙන්ම access එක කැපෙනවා.",
      },
      {
        type: "note",
        title: "FXNOD තියාගන්න දේ",
        text: "FXNOD ට ඔබේ Deriv password එක කවදාවත් ලැබෙන්නේ නැහැ. ඒක තියාගන්නේ ඔබ access එක approve කළාම Deriv දුන්න permission එක, සහ ඒක encrypt කරලා තියාගන්නවා. ඔබේ trading balance එක හැම වෙලාවෙම තියෙන්නේ ඔබේ Deriv account එකේ.",
      },
      RISK,
    ],
    faq: [
      {
        q: "Deriv account එක FXNOD එකට connect කරන එක ආරක්ෂිතද?",
        a: "ඔබ sign in වෙන්නේ Deriv ගේ page එකේ, ඒ නිසා FXNOD ට password එක පේන්නේ නැහැ. ලැබෙන permission එක encrypt කරලා තියාගන්නවා, සහ ඔබට ඕනෑම වෙලාවක ආපහු ගන්න පුළුවන්. Account එකක් connect කළාට trades වල අවදානම අඩු වෙන්නේ නැහැ.",
      },
      {
        q: "Deriv demo account එකෙන් විතරක් FXNOD පාවිච්චි කරන්න පුළුවන්ද?",
        a: "ඔව්. Connect වුණාට පස්සේ demo account එක තෝරන්න. හැම trade එකක්ම Deriv ගේ virtual funds වලින් යනවා.",
      },
      {
        q: "FXNOD මගේ සල්ලි තියාගන්නවද?",
        a: "නැහැ. ඔබ trade කරන සල්ලි තියෙන්නේ ඔබේ Deriv account එකේ. FXNOD ඔබේ orders Deriv එකට යවලා ප්‍රතිඵලය පෙන්නනවා.",
      },
      {
        q: "FXNOD සිංහලෙන් තියෙනවද?",
        a: "Guides සිංහලෙන් තියෙනවා. App එක දැනට English වලින්.",
      },
    ],
    related: ["deriv-bot-sinhala", "deriv-trading-sinhala"],
    en: "connect-deriv-account",
  },
];
