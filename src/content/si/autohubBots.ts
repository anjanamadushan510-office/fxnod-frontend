/**
 * The Auto Hub bot guides in Sinhala: one per bot and the overview.
 *
 * The facts (contract, plans, multipliers, the stakes of a losing run) come
 * from the same catalogue the English guides read, so the two languages
 * cannot disagree on a number. Only the words are written here. Trading
 * words and everything that appears on FXNOD's screens stay in English, as
 * in the other Sinhala guides.
 *
 * Titles and slugs carry "sinhala" in Latin letters, which is how the
 * phrase is typed into a search box in Sri Lanka (see ./guides.ts).
 */
import { losingRun, money } from "../autohubBots";
import {
  AUTOHUB_BOT_COUNT,
  FIXED_PLAN_BOTS,
  OWN_AMOUNT_BOTS,
  botGuideSlug,
  escalates,
  stakeStyle,
  type BotPlan,
  type DigitFamily,
  type FixedPlanBot,
} from "../autohubCatalogue";
import { sumDecimals } from "@/lib/decimal";
import type { GuideBlock, GuideCta, LocalGuide } from "../guides";
import { RISK } from "./guides";

const DATE = "2026-10-12";
const TAG = "Auto Hub bots";
const IMAGE = "/assets/login-slide-3.jpg";
const OVERVIEW = "auto-hub-bots-sinhala";
const OVERVIEW_EN = "auto-hub-ready-made-bots";

/** "nine_lives" -> "nine-lives-bot-sinhala". */
function slugOf(id: string): string {
  return `${botGuideSlug(id)}-sinhala`;
}

const CTA: GuideCta = {
  title: "Deriv demo account එකේ bot එකක් start කරන්න",
  text: "හැම Auto Hub bot එකක්ම දුවන්නේ FXNOD servers වල, සහ stop loss එකක් නැතුව start වෙන්නේ නැහැ. ඔබේ Deriv demo account එක connect කරලා, bot එකක් තෝරලා, virtual funds වලින් සම්පූර්ණ session එකක් බලන්න. App එක දැනට English වලින්.",
};

const FAMILY: Record<DigitFamily, string> = {
  matches_differs: "Matches / Differs",
  even_odd: "Even / Odd",
  over_under: "Over / Under",
};

const LAST_DIGIT =
  "Contract එක තීරණය වෙන්නේ tick එකක මිලේ අන්තිම digit එකෙන්, ඒ කියන්නේ අන්තිම දශම ඉලක්කමෙන්: 1234.56 කියන tick එක ඉවර වෙන්නේ 6 න්.";

const NOT_A_PROMISE =
  "Entry rule එකෙන් තීරණය වෙන්නේ bot එක trade කරන්නේ කවදද සහ කොච්චර ඉක්මනින්ද කියන එක විතරයි. ඒකෙන් කිසිම trade එකක් දිනන්න තියෙන ඉඩ වැඩි වෙන්නේ නැහැ.";

const SUGGESTED_MARKETS =
  "Volatility 100 (1s), Volatility 100, Volatility 75 (1s), Volatility 75, Volatility 50 (1s) සහ Volatility 50";

/** The words of one fixed-plan bot. The numbers are the catalogue's. */
interface BotWords {
  tagline: string;
  /** Completes "Trade එකක් දිනන්නේ ...". */
  wins: string;
  pace: string;
  rule: string;
  detail: string[];
  example: string;
}

const DIFFERS_WINS = "ඊළඟ tick එක bot එක bet කරපු digit එක හැර වෙන ඕනෑම digit එකකින් ඉවර වුණොත්";

const WORDS: Record<string, BotWords> = {
  nine_lives: {
    tagline: "එක දිගට දෙපාරක් ආපු digit එක තුන්වෙනි පාරට එන්නේ නැහැ කියලා bet කරනවා.",
    wins: DIFFERS_WINS,
    pace: "එකම digit එක එක දිගට දෙපාරක් ආවට පස්සේ",
    rule: "Nine Lives බලන් ඉන්නේ ticks දෙකක් එක දිගට එකම digit එකෙන් ඉවර වෙනකන්. ඊට පස්සේ ඊළඟ tick එක වෙන digit එකකින් ඉවර වෙයි කියලා bet කරනවා.",
    detail: [
      "Nine Lives තමන්ගේ market එකේ හැම tick එකකම අන්තිම digit එක කියවනවා. ළඟ ළඟ ticks වෙනස් digits වලින් ඉවර වෙනකන් ඒක මුකුත් කරන්නේ නැහැ. Ticks දෙකක් එක දිගට එකම digit එකෙන් ඉවර වුණාම, ඒ digit එකට tick එකක Differs එකක් buy කරනවා. ඊළඟ tick එක අනිත් digits නවයෙන් එකකින් ඉවර වුණොත් trade එක දිනනවා; ඒ digit එකම තුන්වෙනි පාරටත් ආවොත් පරදිනවා.",
      "Trade එක close වුණාට පස්සේ bot එක අලුත්ම ticks දෙක ආයෙත් බලනවා. ඒ දෙක තාමත් එකම digit එකෙන් ඉවර වෙනවා නම් එවෙලෙම ආයෙත් ඇතුල් වෙනවා; නැත්නම් ඊළඟ ජෝඩුව එනකන් බලන් ඉන්නවා.",
    ],
    example:
      "අන්තිම digits එන්නේ 3, 8, 8 විදිහට. Bot එක Differs 8 buy කරනවා. ඊළඟ tick එක 1 න් ඉවර වුණොත් trade එක දිනනවා; 8 න් ඉවර වුණොත් පරදිනවා.",
  },
  needle: {
    tagline: "අඩුවෙන්ම දැකපු digit එකට bet කරනවා.",
    wins: "ඊළඟ tick එක bot එක තෝරපු digit එකෙන් ඉවර වුණොත්",
    pace: "Ticks 3කට සැරයක්, අන්තිම ticks 50 ක අඩුවෙන්ම ආපු digit එකට",
    rule: "Needle අන්තිම ticks 50 ක අන්තිම digits ගණන් කරලා, අඩුවෙන්ම ආපු digit එක තෝරලා, ඊළඟ tick එක ඒ digit එකෙන් ඉවර වෙයි කියලා bet කරනවා.",
    detail: [
      "Needle අන්තිම ticks 50 න් කීයක් 0 සිට 9 දක්වා එක් එක් digit එකෙන් ඉවර වුණාද කියලා ගණන් තියාගන්නවා. හැම entry එකකදීම අඩුම ගණන තියෙන digit එක තෝරලා ඒකට tick එකක Matches එකක් buy කරනවා. Digits දෙකකට එකම අඩුම ගණන තියෙනවා නම් පොඩි digit එක ගන්නවා, ඒ නිසා එකම ticks වලට හැමදාම එකම තේරීම ලැබෙනවා.",
      "ගණන් කරන්න ඒකට market එකේ අන්තිම ticks 50 ඕන. හැම result එකකට පස්සේම ticks දෙකක් යන්න අරිනවා, ඒ නිසා entries තියෙන්නේ ticks තුනක පරතරයෙන්. ගණන හැම entry එකකදීම අලුතෙන් ගන්න නිසා digit එක trade එකෙන් trade එකට වෙනස් වෙන්න පුළුවන්.",
    ],
    example:
      "අන්තිම ticks 50 න් දෙකක් විතරක් 6 න් ඉවර වෙලා, අනිත් හැම digit එකක්ම තුනක් හෝ ඊට වැඩියෙන් ඇවිත්. Bot එක Matches 6 buy කරනවා. Trade එක දිනන්නේ ඊළඟ tick එක 6 න් ඉවර වුණොත් විතරයි.",
  },
  steady_nine: {
    tagline: "හැම tick එකකම digit එක වෙනස් වෙයි කියලා bet කරනවා.",
    wins: DIFFERS_WINS,
    pace: "හැම tick එකකම, දැන් ආපු digit එකට විරුද්ධව",
    rule: "Steady Nine හැම tick එකකම trade කරනවා: අලුත්ම tick එකේ අන්තිම digit එක අරන්, ඊළඟ tick එක වෙන digit එකකින් ඉවර වෙයි කියලා bet කරනවා.",
    detail: [
      "Steady Nine pattern එකක් එනකන් බලන් ඉන්නේ නැහැ. අලුත්ම tick එකේ අන්තිම digit එක කියවලා ඒ digit එකට tick එකක Differs එකක් buy කරනවා. එකම digit එක එක දිගට දෙපාරක් ආවොත් විතරයි trade එක පරදින්නේ.",
      "Contract එක close වුණ ගමන් දැන් ආපු tick එකෙන් ඒකම ආයෙත් කරනවා, ඒ නිසා bot එක විරුද්ධව bet කරන digit එක හැම trade එකකදීම වෙනස් වෙනවා.",
    ],
    example:
      "Tick එකක් 4 න් ඉවර වෙනවා, ඒ නිසා bot එක Differs 4 buy කරනවා. ඊළඟ tick එක 9 න් ඉවර වෙලා trade එක දිනනවා. ඊට පස්සේ bot එක Differs 9 buy කරනවා.",
  },
  even_keel: {
    tagline: "Even, tick එකෙන් tick එකට.",
    wins: "ඊළඟ tick එක 0, 2, 4, 6 හෝ 8 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම",
    rule: "Even Keel කිසිම entry කොන්දේසියක් නැතුව හැම tick එකකම Even buy කරනවා.",
    detail: [
      "Even Keel ට බලන් ඉන්න signal එකක් නැහැ. Tick එකක Even එකක් buy කරලා, ඒ contract එක close වුණාම ඊළඟ tick එකේ ඊළඟ එක buy කරනවා.",
      "අනිත් Even / Odd bots වලින් මේක වෙනස් වෙන්නේ වේගයෙන් සහ stake plan එකෙන්: market එකේ ticks එන වේගයටම trade කරනවා, සහ පැරදුණාම stake එක ගුණ කරනවා.",
    ],
    example:
      "Bot එක Even buy කරනවා. ඊළඟ tick එක 6 න් ඉවර වෙලා trade එක දිනනවා. ආයෙත් Even buy කරනවා; ඊළඟ tick එක 3 න් ඉවර වෙලා ඒ trade එක පරදිනවා.",
  },
  level_pair: {
    tagline: "Even, හෙමින් වේගයකින්.",
    wins: "ඊළඟ tick එක 0, 2, 4, 6 හෝ 8 න් ඉවර වුණොත්",
    pace: "Ticks 3කට සැරයක්",
    rule: "Level Pair ticks තුනකට සැරයක් Even buy කරනවා.",
    detail: [
      "Level Pair tick එකක Even එකක් buy කරලා, result එක එනකන් ඉඳලා, ආයෙත් buy කරන්න කලින් ticks දෙකක් යන්න අරිනවා. ඒ නිසා entries තියෙන්නේ ticks තුනක පරතරයෙන්.",
      "දැකපු digits ගැන ඒකට කිසිම කොන්දේසියක් නැහැ. පරතරයෙන් වෙන්නේ session එක හෙමින් යන එක විතරයි: තත්පරයකට tick එකක් එන market එකක ඒක විනාඩියකට උපරිම trades විස්සක් විතර දානවා.",
    ],
    example:
      "Bot එක Even buy කරලා ඊළඟ tick එක 2 න් ඉවර වෙනවා: දිනුමක්. තව ticks දෙකක් ඇවිත් ඒවා ගණන් ගන්නේ නැහැ. තුන්වෙනි එකේදී ආයෙත් Even buy කරනවා.",
  },
  odd_jobs: {
    tagline: "Even දෙකකට පස්සේ Odd.",
    wins: "ඊළඟ tick එක 1, 3, 5, 7 හෝ 9 න් ඉවර වුණොත්",
    pace: "එක දිගට even digits දෙකක් ආවට පස්සේ",
    rule: "Odd Jobs බලන් ඉන්නේ ticks දෙකක් එක දිගට even digit එකකින් ඉවර වෙනකන්. ඊට පස්සේ Odd buy කරනවා.",
    detail: [
      "Odd Jobs හැම tick එකකම අන්තිම digit එක කියවනවා. ඒක ඇතුල් වෙන්නේ අලුත්ම ticks දෙකම even digit එකකින් (0, 2, 4, 6 හෝ 8) ඉවර වුණොත් විතරයි, එතකොට tick එකක Odd එකක් buy කරනවා.",
      "කොන්දේසිය හැම tick එකකම ආයෙත් බලනවා. Trade එකක් close වුණාට පස්සේ, අලුත්ම ticks දෙකම even වුණ ගමන් bot එක ආයෙත් ඇතුල් වෙනවා. ඒක ඊළඟ tick එකම වෙන්නත් පුළුවන්, ticks ගොඩකට පස්සේ වෙන්නත් පුළුවන්.",
    ],
    example:
      "අන්තිම digits එන්නේ 5, 6, 2 විදිහට. අලුත්ම දෙක even නිසා bot එක Odd buy කරනවා. 5, 6, 3 ආවා නම් ඇතුල් වෙන්නේ නැහැ.",
  },
  odd_hours: {
    tagline: "Odd, ticks පහකට සැරයක්.",
    wins: "ඊළඟ tick එක 1, 3, 5, 7 හෝ 9 න් ඉවර වුණොත්",
    pace: "Ticks 5කට සැරයක්",
    rule: "Odd Hours ticks පහකට සැරයක් Odd buy කරනවා.",
    detail: [
      "Odd Hours tick එකක Odd එකක් buy කරලා, result එක එනකන් ඉඳලා, ආයෙත් buy කරන්න කලින් ticks හතරක් යන්න අරිනවා. Entries තියෙන්නේ ticks පහක පරතරයෙන්.",
      "Even / Odd bots අතරින් හෙමින්ම යන්නේ මේක. Digits වල කිසිම pattern එකක් කියවන්නේ නැහැ; පරතරය තමයි ඒකේ සම්පූර්ණ entry rule එක.",
    ],
    example:
      "Bot එක Odd buy කරලා ඊළඟ tick එක 7 න් ඉවර වෙනවා: දිනුමක්. තව ticks හතරක් යනවා. පස්වෙනි එකේදී ආයෙත් Odd buy කරනවා.",
  },
  high_five: {
    tagline: "Over 4: උඩ digits පහ.",
    wins: "ඊළඟ tick එක 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම",
    rule: "High Five කිසිම entry කොන්දේසියක් නැතුව හැම tick එකකම Over 4 buy කරනවා.",
    detail: [
      "High Five tick එකක Over 4 එකක් buy කරලා, ඒ contract එක close වුණාම ඊළඟ tick එකේ ඊළඟ එක buy කරනවා. Digits දහයෙන් භාගයක් දිනනවා, භාගයක් පරදිනවා.",
      "මේක Low Five එකේ කැඩපත් රූපය. Low Five එකම වේගයෙන්, එකම plans වලින් Under 5 buy කරනවා.",
    ],
    example:
      "Bot එක Over 4 buy කරනවා. ඊළඟ tick එක 7 න් ඉවර වෙලා trade එක දිනනවා. ආයෙත් Over 4 buy කරනවා; ඊළඟ tick එක 4 න් ඉවර වෙනවා. 4 කියන්නේ 4 ට වැඩි නැති නිසා ඒ trade එක පරදිනවා.",
  },
  top_four: {
    tagline: "පහළ digits දෙකකට පස්සේ Over 5.",
    wins: "ඊළඟ tick එක 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "එක දිගට 5 හෝ ඊට අඩු digits දෙකක් ආවට පස්සේ",
    rule: "Top Four බලන් ඉන්නේ ticks දෙකක් එක දිගට 5 හෝ ඊට අඩු digit එකකින් ඉවර වෙනකන්. ඊට පස්සේ Over 5 buy කරනවා.",
    detail: [
      "Top Four හැම tick එකකම අන්තිම digit එක කියවනවා. ඒක ඇතුල් වෙන්නේ අලුත්ම ticks දෙකම 0 සිට 5 දක්වා digit එකකින් ඉවර වුණොත් විතරයි. එතකොට tick එකක Over 5 එකක් buy කරනවා, ඒක දිනන්නේ 6, 7, 8 හෝ 9 ආවොත්.",
      "කොන්දේසිය හැම tick එකකම ආයෙත් බලනවා. පැරදුණ trade එකක් ඉවර වෙලා තියෙන්නෙත් 5 හෝ ඊට අඩු digit එකකින් නිසා, පැරදුණාට පස්සේ bot එකේ කොන්දේසිය බොහෝ විට ඊළඟ tick එකේදීම ආයෙත් සම්පූර්ණ වෙනවා.",
    ],
    example:
      "අන්තිම digits එන්නේ 8, 3, 5 විදිහට. අලුත්ම දෙක 5 හෝ ඊට අඩු නිසා bot එක Over 5 buy කරනවා. 3, 8 ආවා නම් තවත් බලන් ඉන්නවා.",
  },
  upper_six: {
    tagline: "Over 3: digits දහයෙන් හයක්.",
    wins: "ඊළඟ tick එක 4, 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම; පැරදුණාම ticks 5ක් නවතිනවා",
    rule: "Upper Six හැම tick එකකම Over 3 buy කරනවා, සහ trade එකක් පැරදුණාම ticks පහක් නවතිනවා.",
    detail: [
      "Upper Six tick එකක Over 3 එකක් buy කරනවා. Trade එකක් දිනුවාම ඊළඟ tick එකේදීම ඊළඟ එක buy කරනවා.",
      "Trade එකක් පැරදුණාම ආයෙත් ඇතුල් වෙන්න කලින් ticks පහක් යන්න අරිනවා. නැවතීමෙන් වෙනස් වෙන්නේ පාඩුවකට පස්සේ session එක යන වේගය විතරයි; ඊළඟ stake එක තීරණය කරන්නේ plan එක, නැවතීම නෙවෙයි.",
    ],
    example:
      "Bot එක Over 3 buy කරලා ඊළඟ tick එක 2 න් ඉවර වෙනවා: පාඩුවක්. Trade එකක් නැතුව ticks පහක් යනවා. ඊට පස්සේ ගුණ වුණ stake එකෙන් ආයෙත් Over 3 buy කරනවා.",
  },
  triple_top: {
    tagline: "Over 6: උඩම digits තුන.",
    wins: "ඊළඟ tick එක 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "Ticks 4කට සැරයක්",
    rule: "Triple Top ticks හතරකට සැරයක් Over 6 buy කරනවා.",
    detail: [
      "Triple Top tick එකක Over 6 එකක් buy කරනවා, ඒක දිනන්නේ digits දහයෙන් තුනකට. Result එක එනකන් ඉඳලා, ticks තුනක් යන්න ඇරලා, ආයෙත් buy කරනවා. ඒ නිසා entries තියෙන්නේ ticks හතරක පරතරයෙන්.",
      "Digits වල කිසිම pattern එකක් කියවන්නේ නැහැ. හැම plan එකක්ම පටන් ගන්නේ 0.35 න්, ඒ කියන්නේ digit contract එකකට Deriv ගන්න පොඩිම stake එකෙන්.",
    ],
    example:
      "Bot එක Over 6 buy කරලා ඊළඟ tick එක 6 න් ඉවර වෙනවා: පාඩුවක්, මොකද 6 කියන්නේ 6 ට වැඩි නැහැ. Ticks තුනක් යනවා. හතරවෙනි එකේදී ආයෙත් Over 6 buy කරනවා.",
  },
  twin_peaks: {
    tagline: "Over 7: 8 ක් හෝ 9 ක්.",
    wins: "ඊළඟ tick එක 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "8 ක් හෝ 9 ක් නැති ticks 5කට පස්සේ",
    rule: "Twin Peaks බලන් ඉන්නේ 8 ක් හෝ 9 ක් නැතුව ticks පහක් එක දිගට එනකන්. ඊට පස්සේ Over 7 buy කරනවා.",
    detail: [
      "Twin Peaks හැම tick එකකම අන්තිම digit එක කියවනවා. ඒක ඇතුල් වෙන්නේ අලුත්ම ticks පහම 0 සිට 7 දක්වා digit එකකින් ඉවර වුණොත් විතරයි. එතකොට tick එකක Over 7 එකක් buy කරනවා, ඒක දිනන්නේ 8 හෝ 9 ආවොත්.",
      "පැරදුණ trade එකක් ඉවර වෙන්නේ 7 හෝ ඊට අඩු digit එකකින්, ඒ නිසා bot එක බලන් ඉන්න පේළිය තව දික් වෙනවා, සහ ඊළඟ entry එක ඊළඟ tick එකේම එන්න පුළුවන්. දිනුම් trade එකක් ඉවර වෙන්නේ 8 හෝ 9 න්, ඒකෙන් බලන් ඉන්න එක මුල ඉඳන් පටන් ගන්නවා: ඊළඟ entry එකට කලින් අඩුම තරමේ තව ticks පහක් යනවා.",
    ],
    example:
      "අන්තිම digits එන්නේ 9, 2, 5, 0, 7, 3 විදිහට. අලුත්ම පහේ 8 ක් හෝ 9 ක් නැති නිසා bot එක Over 7 buy කරනවා.",
  },
  seven_wide: {
    tagline: "Over 2: digits දහයෙන් හතක්.",
    wins: "ඊළඟ tick එක 3, 4, 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම",
    rule: "Seven Wide කිසිම entry කොන්දේසියක් නැතුව හැම tick එකකම Over 2 buy කරනවා.",
    detail: [
      "Seven Wide tick එකක Over 2 එකක් buy කරලා, ඒ contract එක close වුණාම ඊළඟ tick එකේ ඊළඟ එක buy කරනවා. Digits හතක් දිනනවා; 0, 1 සහ 2 පරදිනවා.",
      "Broad Seven එකම contract එක flat stake එකකින්, මේකෙන් භාගයක වේගයෙන් buy කරනවා. පැරදුණාම stake එක ගුණ කරන version එක තමයි Seven Wide.",
    ],
    example:
      "Bot එක Over 2 buy කරනවා. ඊළඟ tick එක 3 න් ඉවර වෙලා trade එක දිනනවා. ආයෙත් Over 2 buy කරනවා; ඊළඟ tick එක 1 න් ඉවර වෙලා ඒ trade එක පරදිනවා.",
  },
  eight_wide: {
    tagline: "0 ක් හෝ 1 කට පස්සේ Over 1.",
    wins: "ඊළඟ tick එක 2, 3, 4, 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "0 හෝ 1 න් ඉවර වෙන tick එකකට පස්සේ",
    rule: "Eight Wide බලන් ඉන්නේ 0 හෝ 1 න් ඉවර වෙන tick එකක් එනකන්. ඊට පස්සේ Over 1 buy කරනවා.",
    detail: [
      "Eight Wide හැම tick එකකම අන්තිම digit එක කියවලා, ඒක 2 හෝ ඊට වැඩි නම් පැත්තකට වෙලා ඉන්නවා. Tick එකක් 0 හෝ 1 න් ඉවර වුණාම tick එකක Over 1 එකක් buy කරනවා, ඒක දිනන්නේ 2 සිට 9 දක්වා digits අටට.",
      "පැරදුණ trade එකක් ඉවර වෙලා තියෙන්නෙත් 0 හෝ 1 න් නිසා කොන්දේසිය එවෙලෙම ආයෙත් සම්පූර්ණ වෙනවා, සහ bot එක ඊළඟ tick එකේදී ඇතුල් වෙනවා. දිනුමකට පස්සේ ඊළඟ 0 හෝ 1 එනකන් බලන් ඉන්නවා.",
    ],
    example:
      "අන්තිම digits එන්නේ 4, 7, 1 විදිහට. අලුත්ම එක 1 නිසා bot එක Over 1 buy කරනවා. ඊළඟ tick එක 0 න් ඉවර වුණොත් trade එක පරදිනවා, සහ bot එක ආයෙත් ඇතුල් වෙනවා.",
  },
  broad_seven: {
    tagline: "Over 2, වෙනස් නොවෙන stake එකකින්.",
    wins: "ඊළඟ tick එක 3, 4, 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "Ticks 2කට සැරයක්",
    rule: "Broad Seven ticks දෙකකට සැරයක් Over 2 buy කරනවා.",
    detail: [
      "Broad Seven tick එකක Over 2 එකක් buy කරලා, result එක එනකන් ඉඳලා, tick එකක් යන්න ඇරලා, ආයෙත් buy කරනවා. Entries තියෙන්නේ ticks දෙකක පරතරයෙන්.",
      "Digits වල කිසිම pattern එකක් කියවන්නේ නැහැ, සහ ඒකේ stake එක කවදාවත් වෙනස් වෙන්නේ නැහැ. Seven Wide එකම contract එක trade කරන්නේ පැරදුණාම ගුණ වෙන stake එකකින්.",
    ],
    example:
      "Bot එක Over 2 buy කරලා ඊළඟ tick එක 8 න් ඉවර වෙනවා: දිනුමක්. එක tick එකක් මඟ අරිනවා. ඊට පස්සේ tick එකේ එකම stake එකෙන් ආයෙත් Over 2 buy කරනවා.",
  },
  broad_eight: {
    tagline: "Over 1, වෙනස් නොවෙන stake එකකින්.",
    wins: "ඊළඟ tick එක 2, 3, 4, 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම",
    rule: "Broad Eight හැම tick එකකම Over 1 buy කරනවා.",
    detail: [
      "Broad Eight tick එකක Over 1 එකක් buy කරලා, ඒ contract එක close වුණාම ඊළඟ tick එකේ ඊළඟ එක buy කරනවා. Digits අටක් දිනනවා; පරදින්නේ 0 සහ 1 විතරයි.",
      "ඒකට entry කොන්දේසියකුත් නැහැ, stake වෙනසකුත් නැහැ. Eight Wide එකම contract එක trade කරනවා, ඒත් ඒක මුලින් 0 ක් හෝ 1 ක් එනකන් බලන් ඉඳලා, පැරදුණාම stake එක ගුණ කරනවා.",
    ],
    example:
      "Bot එක Over 1 buy කරනවා. ඊළඟ tick එක 5 න් ඉවර වෙලා trade එක දිනනවා. එකම stake එකෙන් ආයෙත් Over 1 buy කරනවා; ඊළඟ tick එක 0 න් ඉවර වෙලා ඒ trade එක පරදිනවා.",
  },
  half_court: {
    tagline: "Over 4, වෙනස් නොවෙන stake එකකින්.",
    wins: "ඊළඟ tick එක 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "Ticks 3කට සැරයක්",
    rule: "Half Court ticks තුනකට සැරයක් Over 4 buy කරනවා.",
    detail: [
      "Half Court tick එකක Over 4 එකක් buy කරලා, result එක එනකන් ඉඳලා, ආයෙත් buy කරන්න කලින් ticks දෙකක් යන්න අරිනවා. Entries තියෙන්නේ ticks තුනක පරතරයෙන්.",
      "මේක High Five එකේ flat-stake version එක. High Five එකම contract එක හැම tick එකකම buy කරලා, පැරදුණාම stake එක ගුණ කරනවා.",
    ],
    example:
      "Bot එක Over 4 buy කරලා ඊළඟ tick එක 5 න් ඉවර වෙනවා: දිනුමක්. Ticks දෙකක් මඟ අරිනවා. තුන්වෙනි එකේදී එකම stake එකෙන් ආයෙත් Over 4 buy කරනවා.",
  },
  six_pack: {
    tagline: "Over 3, වෙනස් නොවෙන stake එකකින්.",
    wins: "ඊළඟ tick එක 4, 5, 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම; එක දිගට දෙපාරක් පැරදුණාම ticks 10ක් නවතිනවා",
    rule: "Six Pack හැම tick එකකම Over 3 buy කරනවා, සහ trades දෙකක් එක දිගට පැරදුණාම ticks දහයක් නවතිනවා.",
    detail: [
      "Six Pack tick එකක Over 3 එකක් buy කරනවා, සහ සාමාන්‍යයෙන් අන්තිම එක close වුණාට පස්සේ tick එකේදී ඊළඟ එක buy කරනවා.",
      "ඒක තමන්ගේම results මතක තියාගන්නවා. අලුත්ම trades දෙකම පැරදිලා නම්, ආයෙත් ඇතුල් වෙන්න කලින් ticks දහයක් යන්න අරිනවා. තනි පාඩුවකින් නැවතීම එන්නේ නැහැ, සහ නැවතීමට කලිනුත් පස්සෙත් stake එක එකමයි.",
    ],
    example:
      "Bot එක Over 3 buy කරලා ඊළඟ tick එක 1 න් ඉවර වෙනවා: පාඩුවක්. ආයෙත් buy කරලා ඊළඟ tick එක 3 න් ඉවර වෙනවා: දෙවෙනි පාඩුව. Trade එකක් නැතුව ticks දහයක් යනවා, ඊට පස්සේ ආයෙත් Over 3 buy කරනවා.",
  },
  top_shelf: {
    tagline: "පහළ digits තුනකට පස්සේ Over 6.",
    wins: "ඊළඟ tick එක 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "එක දිගට 6 හෝ ඊට අඩු digits තුනක් ආවට පස්සේ",
    rule: "Top Shelf බලන් ඉන්නේ ticks තුනක් එක දිගට 6 හෝ ඊට අඩු digit එකකින් ඉවර වෙනකන්. ඊට පස්සේ Over 6 buy කරනවා.",
    detail: [
      "Top Shelf හැම tick එකකම අන්තිම digit එක කියවනවා. ඒක ඇතුල් වෙන්නේ අලුත්ම ticks තුනම 0 සිට 6 දක්වා digit එකකින් ඉවර වුණොත් විතරයි. එතකොට tick එකක Over 6 එකක් buy කරනවා, ඒක දිනන්නේ 7, 8 හෝ 9 ආවොත්.",
      "පැරදුණ trade එකක් ඉවර වෙන්නේ 6 හෝ ඊට අඩු digit එකකින් නිසා පේළිය දිගටම තියෙනවා: bot එකට ඊළඟ tick එකේදීම ආයෙත් ඇතුල් වෙන්න පුළුවන්. දිනුම් trade එකක් ඉවර වෙන්නේ 7, 8 හෝ 9 න්, ඒකෙන් පේළිය කැඩෙන නිසා ඊළඟ entry එකට කලින් අඩුම තරමේ තව ticks තුනක් යනවා.",
    ],
    example: "අන්තිම digits එන්නේ 9, 4, 0, 6 විදිහට. අලුත්ම තුන 6 හෝ ඊට අඩු නිසා bot එක Over 6 buy කරනවා.",
  },
  upper_deck: {
    tagline: "Over 5, ticks පහකට සැරයක්.",
    wins: "ඊළඟ tick එක 6, 7, 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "Ticks 5කට සැරයක්",
    rule: "Upper Deck ticks පහකට සැරයක් Over 5 buy කරනවා.",
    detail: [
      "Upper Deck tick එකක Over 5 එකක් buy කරලා, result එක එනකන් ඉඳලා, ආයෙත් buy කරන්න කලින් ticks හතරක් යන්න අරිනවා. Entries තියෙන්නේ ticks පහක පරතරයෙන්.",
      "Digits වල කිසිම pattern එකක් කියවන්නේ නැහැ. Top Four එකම contract එක trade කරනවා, ඒත් ඒක මුලින් පහළ digits දෙකක් එනකන් බලන් ඉඳලා, පැරදුණාම stake එක ගුණ කරනවා.",
    ],
    example:
      "Bot එක Over 5 buy කරලා ඊළඟ tick එක 5 න් ඉවර වෙනවා: පාඩුවක්, මොකද 5 කියන්නේ 5 ට වැඩි නැහැ. Ticks හතරක් යනවා. පස්වෙනි එකේදී එකම stake එකෙන් ආයෙත් Over 5 buy කරනවා.",
  },
  summit_pair: {
    tagline: "දිග බලා සිටීමකට පස්සේ Over 7.",
    wins: "ඊළඟ tick එක 8 හෝ 9 න් ඉවර වුණොත්",
    pace: "8 ක් හෝ 9 ක් නැති ticks 8කට පස්සේ",
    rule: "Summit Pair බලන් ඉන්නේ 8 ක් හෝ 9 ක් නැතුව ticks අටක් එක දිගට එනකන්. ඊට පස්සේ Over 7 buy කරනවා.",
    detail: [
      "Summit Pair හැම tick එකකම අන්තිම digit එක කියවනවා. ඒක ඇතුල් වෙන්නේ අලුත්ම ticks අටම 0 සිට 7 දක්වා digit එකකින් ඉවර වුණොත් විතරයි. එතකොට tick එකක Over 7 එකක් buy කරනවා, ඒක දිනන්නේ 8 හෝ 9 ආවොත්.",
      "පැරදුණ trade එකකින් පේළිය තව දික් වෙන නිසා bot එකට ඊළඟ tick එකේදීම ආයෙත් ඇතුල් වෙන්න පුළුවන්. දිනුම් trade එකක් ඉවර වෙන්නේ 8 හෝ 9 න්, ඒකෙන් බලන් ඉන්න එක මුල ඉඳන් පටන් ගන්නවා: ඊළඟ entry එකට කලින් අඩුම තරමේ තව ticks අටක් යනවා. ඒකට trade නොකර ගොඩක් වෙලා ඉන්න පුළුවන්.",
    ],
    example:
      "අන්තිම digits එන්නේ 8, 1, 4, 4, 7, 0, 2, 6, 5 විදිහට. අලුත්ම අටේ 8 ක් හෝ 9 ක් නැති නිසා bot එක Over 7 buy කරනවා.",
  },
  low_five: {
    tagline: "Under 5: පහළ digits පහ.",
    wins: "ඊළඟ tick එක 0, 1, 2, 3 හෝ 4 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම",
    rule: "Low Five කිසිම entry කොන්දේසියක් නැතුව හැම tick එකකම Under 5 buy කරනවා.",
    detail: [
      "Low Five tick එකක Under 5 එකක් buy කරලා, ඒ contract එක close වුණාම ඊළඟ tick එකේ ඊළඟ එක buy කරනවා. Digits දහයෙන් භාගයක් දිනනවා, භාගයක් පරදිනවා.",
      "මේක High Five එකේ කැඩපත් රූපය. High Five එකම වේගයෙන්, එකම plans වලින් Over 4 buy කරනවා.",
    ],
    example:
      "Bot එක Under 5 buy කරනවා. ඊළඟ tick එක 2 න් ඉවර වෙලා trade එක දිනනවා. ආයෙත් Under 5 buy කරනවා; ඊළඟ tick එක 5 න් ඉවර වෙනවා. 5 කියන්නේ 5 ට අඩු නැති නිසා ඒ trade එක පරදිනවා.",
  },
  ground_four: {
    tagline: "උඩ digits දෙකකට පස්සේ Under 4.",
    wins: "ඊළඟ tick එක 0, 1, 2 හෝ 3 න් ඉවර වුණොත්",
    pace: "එක දිගට 4 හෝ ඊට වැඩි digits දෙකක් ආවට පස්සේ",
    rule: "Ground Four බලන් ඉන්නේ ticks දෙකක් එක දිගට 4 හෝ ඊට වැඩි digit එකකින් ඉවර වෙනකන්. ඊට පස්සේ Under 4 buy කරනවා.",
    detail: [
      "Ground Four හැම tick එකකම අන්තිම digit එක කියවනවා. ඒක ඇතුල් වෙන්නේ අලුත්ම ticks දෙකම 4 සිට 9 දක්වා digit එකකින් ඉවර වුණොත් විතරයි. එතකොට tick එකක Under 4 එකක් buy කරනවා, ඒක දිනන්නේ 0, 1, 2 හෝ 3 ආවොත්.",
      "කොන්දේසිය හැම tick එකකම ආයෙත් බලනවා. පැරදුණ trade එකක් ඉවර වෙලා තියෙන්නෙත් 4 හෝ ඊට වැඩි digit එකකින් නිසා, පැරදුණාට පස්සේ bot එකේ කොන්දේසිය බොහෝ විට ඊළඟ tick එකේදීම ආයෙත් සම්පූර්ණ වෙනවා. මේක Top Four එකේ කැඩපත් රූපය.",
    ],
    example:
      "අන්තිම digits එන්නේ 1, 6, 4 විදිහට. අලුත්ම දෙක 4 හෝ ඊට වැඩි නිසා bot එක Under 4 buy කරනවා. 6, 1 ආවා නම් තවත් බලන් ඉන්නවා.",
  },
  lower_six: {
    tagline: "Under 6: digits දහයෙන් හයක්.",
    wins: "ඊළඟ tick එක 0, 1, 2, 3, 4 හෝ 5 න් ඉවර වුණොත්",
    pace: "හැම tick එකකම; පැරදුණාම ticks 5ක් නවතිනවා",
    rule: "Lower Six හැම tick එකකම Under 6 buy කරනවා, සහ trade එකක් පැරදුණාම ticks පහක් නවතිනවා.",
    detail: [
      "Lower Six tick එකක Under 6 එකක් buy කරනවා. Trade එකක් දිනුවාම ඊළඟ tick එකේදීම ඊළඟ එක buy කරනවා.",
      "Trade එකක් පැරදුණාම ආයෙත් ඇතුල් වෙන්න කලින් ticks පහක් යන්න අරිනවා. නැවතීමෙන් වෙනස් වෙන්නේ පාඩුවකට පස්සේ session එක යන වේගය විතරයි; ඊළඟ stake එක තීරණය කරන්නේ plan එක, නැවතීම නෙවෙයි. මේක Upper Six එකේ කැඩපත් රූපය.",
    ],
    example:
      "Bot එක Under 6 buy කරලා ඊළඟ tick එක 8 න් ඉවර වෙනවා: පාඩුවක්. Trade එකක් නැතුව ticks පහක් යනවා. ඊට පස්සේ ගුණ වුණ stake එකෙන් ආයෙත් Under 6 buy කරනවා.",
  },
};

function words(bot: FixedPlanBot): BotWords {
  const found = WORDS[bot.id];
  if (!found) throw new Error(`no Sinhala text for Auto Hub bot ${bot.id}`);
  return found;
}

/** "20", "20 හෝ 100", "20, 100 හෝ 500". */
function orList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} හෝ ${items[items.length - 1]}`;
}

/** "14.74 න්", or "20 plan එකේ 2.41 න්, 100 සහ 500 plans වල 2.13 න්". */
function multiplierText(plans: BotPlan[]): string {
  const groups = new Map<string, string[]>();
  for (const p of plans) groups.set(p.multiplier, [...(groups.get(p.multiplier) ?? []), p.stopLoss]);
  if (groups.size === 1) return `${plans[0].multiplier} න්`;
  return Array.from(groups, ([multiplier, ids]) =>
    ids.length > 1 ? `${ids.join(" සහ ")} plans වල ${multiplier} න්` : `${ids[0]} plan එකේ ${multiplier} න්`,
  ).join(", ");
}

function payoutText(bot: FixedPlanBot): string {
  if (bot.winning >= 9) return "Digits දහයෙන් නවයක් දිනන නිසා දිනුමක් ගෙවන්නේ stake එකෙන් පොඩි කොටසක්.";
  if (bot.winning >= 6) return `Digits දහයෙන් ${bot.winning}ක් දිනන නිසා දිනුමක් ගෙවන්නේ stake එකට වඩා අඩුවෙන්.`;
  if (bot.winning === 5) return "Digits දහයෙන් පහක් දිනනවා, සහ දිනුමක් ගෙවන්නේ stake එකට වඩා ටිකක් අඩුවෙන්.";
  if (bot.winning >= 3) return `Digits දහයෙන් ${bot.winning}ක් විතරක් දිනන නිසා දිනුමක් ගෙවන්නේ stake එකට වඩා වැඩියෙන්.`;
  if (bot.winning === 2) return "Digits දහයෙන් දෙකක් විතරක් දිනන නිසා දිනුමක් stake එක වගේ කිහිප ගුණයක් ගෙවනවා.";
  return "Digits දහයෙන් එකක් විතරක් දිනන නිසා දිනුමක් stake එක වගේ කිහිප ගුණයක් ගෙවනවා.";
}

function stakeBlocks(bot: FixedPlanBot): GuideBlock[] {
  if (stakeStyle(bot) === "Flat") {
    return [
      { type: "h2", text: `${bot.name} stake එක තීරණය කරන හැටි` },
      {
        type: "p",
        text: `${bot.name} පාවිච්චි කරන්නේ flat stake එකක්. Session එකක හැම trade එකක්ම plan එකේ stake එකෙන්ම දානවා, දිනුවත් පැරදුණත්. ඒක Martingale පාවිච්චි කරන්නේ නැහැ.`,
      },
      {
        type: "p",
        text: "Trade එකක් දාන්නේ ඒකේ stake එක stop loss එකේ ඉතුරු ගානට අහුවෙනවා නම් විතරයි. අහුවෙන්නේ නැති වුණාම ඒක දාන්නේ නැතුව session එක ඉවර වෙනවා.",
      },
    ];
  }
  const first = bot.plans[0];
  const run = losingRun(first);
  return [
    { type: "h2", text: `${bot.name} stake එක තීරණය කරන හැටි` },
    {
      type: "p",
      text: `${bot.name} පාවිච්චි කරන්නේ Martingale stake එකක්. Trade එකක් පැරදුණාම ඊළඟ stake එක ${multiplierText(bot.plans)} ගුණ වෙනවා; දිනුවාම ආයෙත් මුල් stake එකට එනවා. එක දිගට එන පාඩු එකතු වෙනවා: එක දිගට දෙපාරක් පැරදුණාම stake එක කියන්නේ මුල් stake එක දෙපාරක් ගුණ කරලා, දශම ස්ථාන දෙකකට වටයපු ගාන.`,
    },
    {
      type: "p",
      text: "Stop loss එකෙන් මේ ඉණිමඟ සීමා වෙනවා. Stake එකක් දාන්නේ ඒක stop loss එකේ ඉතුරු ගානට වඩා ලොකු නැත්නම් විතරයි; අහුවෙන්නේ නැති පියවර දාන්නේ නැහැ, සහ session එක එතනින් ඉවර වෙනවා. පහළ table එකේ තියෙන්නේ ලාභයකුත් පාඩුවකුත් නැති session එකක, එක දිනුමක්වත් නැතුව දිගටම පැරදුණොත් යන stakes. දැනටමත් ලාභයේ ඉන්න session එකකට ඉඩ වැඩියි, පාඩුවේ ඉන්න එකකට ඉඩ අඩුයි.",
    },
    {
      type: "table",
      head: ["Plan", "අහුවෙන එක දිගට පාඩු ගණන", "හැම trade එකම පැරදුණොත් stakes", "එතකොට මුළු පාඩුව", "ඊළඟ පියවර, දාන්නේ නැහැ"],
      rows: bot.plans.map((p) => {
        const r = losingRun(p);
        const stakes = r.stakes.map(money);
        const shown = stakes.length > 8 ? [...stakes.slice(0, 4), "…", ...stakes.slice(-2)] : stakes;
        return [`Stop loss ${p.stopLoss}`, String(stakes.length), shown.join(", "), money(r.lost), money(r.refused)];
      }),
    },
    {
      type: "p",
      text: `පළමු පේළිය කියවන්නේ මෙහෙමයි: stop loss ${first.stopLoss} plan එකේ, එක දිගට trades ${run.stakes.length}ක් පැරදුණොත් මුළු පාඩුව ${money(run.lost)}යි. ඊළඟ stake එක ${money(run.refused)}ක් වෙන්න ඕන, ඒත් stop loss එකේ ඉතුරු වෙලා තියෙන්නේ ${money(sumDecimals([first.stopLoss, `-${run.lost}`]))}ක් විතරයි. ඒ නිසා bot එක ඒක දාන්නේ නැහැ, සහ session එක ඉවර වෙනවා.`,
    },
  ];
}

function planBlocks(bot: FixedPlanBot): GuideBlock[] {
  const ladder = stakeStyle(bot) === "Martingale";
  return [
    { type: "h2", text: `${bot.name} plans` },
    {
      type: "p",
      text: `${bot.name} එකට stake එක, stop loss එක සහ profit target එක වෙන වෙනම දෙන්නේ නැහැ. ඔබ plan එකක් තෝරනවා, සහ plan එකෙන් ඒ තුනම එකට set වෙනවා. Plans නම් කරලා තියෙන්නේ ඒවායේ stop loss එකෙන්. ගණන් තියෙන්නේ bot එක trade කරන Deriv account එකේ currency එකෙන්.`,
    },
    {
      type: "table",
      head: ladder
        ? ["Plan", "මුල් stake එක", "Profit target", "පැරදුණාම multiplier එක"]
        : ["Plan", "Trade එකකට stake එක", "Profit target"],
      rows: bot.plans.map((p) =>
        ladder
          ? [`Stop loss ${p.stopLoss}`, p.stake, p.takeProfit, p.multiplier]
          : [`Stop loss ${p.stopLoss}`, p.stake, p.takeProfit],
      ),
    },
  ];
}

function fixedPlanGuide(bot: FixedPlanBot): LocalGuide {
  const w = words(bot);
  const ladder = stakeStyle(bot) === "Martingale";
  const stops = bot.plans.map((p) => p.stopLoss);
  const planCount = bot.plans.length === 2 ? "දෙකෙන්" : "තුනෙන්";
  const stakeSentence = ladder
    ? `Trade එකක් පැරදුණාම stake එක ${multiplierText(bot.plans)} ගුණ වෙනවා, දිනුවාම ආයෙත් මුල් stake එකට එනවා.`
    : "ඒකේ stake එක හැම trade එකකම එකමයි.";
  const index = FIXED_PLAN_BOTS.indexOf(bot);
  const family = FIXED_PLAN_BOTS.filter((b) => b.family === bot.family && b !== bot);
  const sibling = family.find((b) => FIXED_PLAN_BOTS.indexOf(b) > index) ?? family[0];

  return {
    slug: slugOf(bot.id),
    title: `${bot.name} Bot Sinhala: FXNOD Deriv ${bot.bet} bot එක වැඩ කරන හැටි`,
    description: `${bot.name} bot සිංහලෙන්: FXNOD Auto Hub එකේ Deriv ${bot.bet} bot එක buy කරන contract එක, ඇතුල් වෙන rule එක, stake එක සහ plans.`,
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer: `${bot.name} කියන්නේ FXNOD Auto Hub එකේ තියෙන ready-made bot එකක්. ඒක Deriv වල tick එකක ${bot.bet} contract එක buy කරනවා, ඒ contract එක දිනන්නේ ${w.wins}. ${w.rule} ${stakeSentence} ඔබ ඒක start කරන්නේ එක market එකක, stop loss ${orList(stops)} තියෙන fixed plans ${planCount} එකක් තෝරලා. Session එක ඉවර වෙන්නේ plan එකේ profit target එකෙන් හෝ stop loss එකෙන්.`,
    body: [
      { type: "h2", text: `${bot.name} කෙටියෙන්` },
      {
        type: "table",
        head: ["", bot.name],
        rows: [
          ["Contract", `${bot.bet}, tick එකයි (Deriv ${FAMILY[bot.family]})`],
          ["Trade එකක් දිනන්නේ", w.wins],
          ["දිනන digits", `10න් ${bot.winning}`],
          ["Entry", w.pace],
          ["Stake", ladder ? `Martingale: පැරදුණාම ${multiplierText(bot.plans)} ගුණ වෙනවා` : "Flat: හැම trade එකකම එකමයි"],
          ["Plans", `Stop loss ${orList(stops)}`],
          ["Markets", "එකයි, start කරද්දී තෝරනවා"],
          ["Open trades", "එක වෙලාවකට එකයි"],
        ],
      },
      { type: "h2", text: `${bot.name} trade කරන්නේ මොකක්ද` },
      {
        type: "p",
        text: `${bot.name} trade කරන්නේ එක contract එකයි: Deriv ගේ ${FAMILY[bot.family]} වර්ගයේ ${bot.bet}, tick එකක දිගකින්. ${LAST_DIGIT} Trade එකක් දිනන්නේ ${w.wins}. ${payoutText(bot)} පැරදුණ trade එකක සම්පූර්ණ stake එකම යනවා. Payout එක තීරණය කරන්නේ Deriv, සහ හැම trade එකකම result එක run page එකේ පේනවා.`,
      },
      { type: "h2", text: `${bot.name} trade එකකට ඇතුල් වෙන්නේ කවදද` },
      ...w.detail.map((text): GuideBlock => ({ type: "p", text })),
      { type: "note", title: "උදාහරණය", text: w.example },
      {
        type: "p",
        text: `${bot.name} එක වෙලාවකට තියාගන්නේ එක trade එකයි: ඊළඟ entry එක හොයන්නේ අන්තිම contract එක close වුණාට පස්සේ. ${NOT_A_PROMISE}`,
      },
      ...stakeBlocks(bot),
      ...planBlocks(bot),
      { type: "h2", text: "Session එකක් ඉවර වෙන්නේ කවදද" },
      {
        type: "list",
        items: [
          "Profit target එකට ආවාම. Session එකේ ලාභය plan එකේ target එකට හෝ ඊට උඩට ආවාම bot එක නවතිනවා.",
          "Stop loss එකට ආවාම. Session එකේ පාඩුව plan එකේ stop loss එක පහු කරන්න පුළුවන් කිසිම stake එකක් දාන්නේ නැහැ.",
          "ඔබ නැවැත්තුවාම. Run page එකේ Stop button එකෙන් ඕනෑම වෙලාවක session එක ඉවර කරන්න පුළුවන්.",
        ],
      },
      {
        type: "p",
        text: `${bot.name} දුවන්නේ FXNOD servers වල, ඔබේ browser එකේ නෙවෙයි. Page එක close කළත්, phone එක off කළත් ඒක නවතින්නේ නැහැ, ඒකේ limits off වෙන්නෙත් නැහැ. Session එකක් ඉවර වුණාට පස්සේ ආයෙත් start කළොත් සම්පූර්ණ plan එකෙන් අලුත් session එකක් පටන් ගන්නවා.`,
      },
      { type: "h2", text: `${bot.name} start කරන හැටි` },
      {
        type: "steps",
        items: [
          {
            title: `Auto Hub එක open කරලා ${bot.name} තෝරන්න`,
            text: "Bot එකේ page එකේ මුලින්ම තියෙන්නේ How it works panel එක. ඒකේ bot එකේ rules පිළිවෙළට තියෙනවා.",
          },
          {
            title: "Market එක තෝරන්න",
            text: `${bot.name} trade කරන්නේ එක market එකක. Form එක යෝජනා කරන්නේ ${SUGGESTED_MARKETS}. මේ bot එකට Jump 100 දෙන්නේ නැහැ.`,
          },
          {
            title: "Plan එකක් තෝරන්න",
            text: "හැම plan card එකකම ඒකේ stop loss එක, take profit එක සහ මුල් stake එක පේනවා. Card එකේ කිසිම දෙයක් වෙනස් කරන්න බැහැ.",
          },
          {
            title: "Account එක බලලා start කරන්න",
            text: "Bot එක trade කරන Deriv account එක panel එකේ පේනවා. Demo account එකක button එකේ තියෙන්නේ Start on demo කියලා. Real account එකක bot එක real money trade කරන බව තහවුරු කරන box එක tick කරන්න ඕන, එතකොට button එකේ තියෙන්නේ Start with real money කියලා. පළමු වතාවේ Deriv තමන්ගේ page එකේ FXNOD ගේ automated-trading connection එකට අවසර ඉල්ලනවා.",
          },
        ],
      },
      RISK,
    ],
    faq: [
      {
        q: `${bot.name} bot එක trade කරන්නේ මොකක්ද?`,
        a: `${bot.name} buy කරන්නේ Deriv ගේ ${bot.bet} contract එක, tick එකක දිගකින්. Trade එකක් දිනන්නේ ${w.wins}. ඒ කියන්නේ අන්තිම digits දහයෙන් ${bot.winning}කට.`,
      },
      { q: `${bot.name} trade එකක් දාන්නේ කවදද?`, a: w.rule },
      {
        q: `${bot.name} Martingale පාවිච්චි කරනවද?`,
        a: ladder
          ? `ඔව්. Trade එකක් පැරදුණාම stake එක ${multiplierText(bot.plans)} ගුණ වෙනවා, දිනුවාම ආයෙත් මුල් stake එකට එනවා. Stop loss එකේ ඉතුරු ගානට අහුවෙන්නේ නැති පියවරක් දාන්නේ නැහැ, සහ session එක ඉවර වෙනවා.`
          : `නැහැ. ${bot.name} හැම trade එකක්ම එකම stake එකෙන් දානවා.`,
      },
      {
        q: `${bot.name} එකේ stake එක හෝ stop loss එක වෙනස් කරන්න පුළුවන්ද?`,
        a: `වෙන වෙනම බැහැ. Stop loss ${orList(stops)} තියෙන plans ${planCount} එකක් තෝරනවා, සහ plan එකෙන් stake එකයි profit target එකයි ඒකත් එක්කම set වෙනවා. හැම ගානක්ම ඔබම set කරන්න ඕන නම් dBot එකේ bot එකක් හදන්න.`,
      },
      {
        q: `Page එක close කළාමත් ${bot.name} දුවනවද?`,
        a: `ඔව්. ${bot.name} දුවන්නේ FXNOD servers වල. Profit target එකට හෝ stop loss එකට එනකන්, නැත්නම් ඔබ නවත්තනකන් ඒක දුවනවා.`,
      },
    ],
    related: [OVERVIEW, ...(sibling ? [slugOf(sibling.id)] : []), ladder ? "martingale-sinhala" : "deriv-bot-sinhala"],
    en: botGuideSlug(bot.id),
    cta: CTA,
  };
}

const START_FLAT = (name: string, markets: string): GuideBlock => ({
  type: "steps",
  items: [
    {
      title: `Auto Hub එක open කරලා ${name} තෝරන්න`,
      text: "Bot එකේ page එකේ මුලින්ම තියෙන්නේ How it works panel එක. ඒකේ bot එකේ rules පිළිවෙළට තියෙනවා.",
    },
    { title: "Markets තෝරන්න", text: markets },
    {
      title: "Stake එක සහ limits set කරන්න",
      text: "Stake per trade පටන් ගන්නේ 1 න්, සහ 0.35 ට වඩා අඩු කරන්න බැහැ. ඒ තමයි මේ contracts වලට Deriv ගන්න පොඩිම stake එක. Stop loss එකක් අනිවාර්යයි: ඒක නැතුව bot එක start කරන්න බැහැ. Take profit හිස්ව තියන්න පුළුවන්.",
    },
    {
      title: "Account එක බලලා start කරන්න",
      text: "Bot එක trade කරන Deriv account එක panel එකේ පේනවා. Demo account එකක button එකේ තියෙන්නේ Start on demo කියලා. Real account එකක bot එක real money trade කරන බව තහවුරු කරන box එක tick කරන්න ඕන, එතකොට button එකේ තියෙන්නේ Start with real money කියලා.",
    },
  ],
});

const FADE_MARKETS =
  "Markets 1 සිට 10 දක්වා තෝරන්න පුළුවන්. Form එක යෝජනා කරන්නේ Volatility 100 (1s), Volatility 75 (1s), Volatility 100 සහ Volatility 75. මේ bot එකට Jump 100 දෙන්නේ නැහැ.";

const DIFFERS_PARA = `${LAST_DIGIT} Differs trade එකක් එක digit එකක් නම් කරනවා, සහ ඊළඟ tick එක අනිත් digits නවයෙන් ඕනෑම එකකින් ඉවර වුණොත් දිනනවා. Digits දහයෙන් නවයක් දිනන නිසා දිනුමක් ගෙවන්නේ stake එකෙන් පොඩි කොටසක්, සහ පැරදුණ trade එකක සම්පූර්ණ stake එකම යනවා.`;

const OWN_AMOUNT_GUIDES: LocalGuide[] = [
  {
    slug: slugOf("hot_fade"),
    title: "Hot Fade Bot Sinhala: FXNOD Deriv Differs bot එක වැඩ කරන හැටි",
    description:
      "Hot Fade bot සිංහලෙන්: FXNOD Auto Hub එකේ Deriv Differs bot එක. ගොඩක් ආපු, එක දිගට තුන්පාරක් ආපු digit එකකට විරුද්ධව bet කරන හැටි.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer:
      "Hot Fade කියන්නේ FXNOD Auto Hub එකේ තියෙන ready-made bot එකක්. ඒක Deriv වල tick එකක Differs contract එක buy කරනවා. Markets දහයක් දක්වා අන්තිම digit එක බලලා, අන්තිම ticks 30 ඇතුළත එක digit එකක් අනිත් ඒවාට වඩා පැහැදිලිව වැඩියෙන් ඇවිත්, ඒ digit එකම දැන් එක දිගට තුන්පාරක් ආවාම, ඒ market එකේ ඊළඟ tick එක වෙන digit එකකින් ඉවර වෙයි කියලා bet කරනවා. Stake එක හැම trade එකකම එකමයි, සහ stake එක, stop loss එක, take profit එක ඔබම set කරනවා.",
    body: [
      { type: "h2", text: "Hot Fade කෙටියෙන්" },
      {
        type: "table",
        head: ["", "Hot Fade"],
        rows: [
          ["Contract", "Differs, tick එකයි (Deriv Matches / Differs)"],
          ["Trade එකක් දිනන්නේ", DIFFERS_WINS],
          ["දිනන digits", "10න් 9"],
          ["Entry", "එක digit එකක් අන්තිම ticks 30 ඇතුළත ගොඩක් ඇවිත්, එක දිගට තුන්පාරක් ආවාම"],
          ["Stake", "Flat: හැම trade එකකම එකමයි"],
          ["ගණන්", "ඔබේම stake එක, stop loss එක, සහ ඕන නම් take profit එක"],
          ["Markets", "1 සිට 10, එකට බලනවා"],
          ["Open trades", "හැම market එකටම එක වෙලාවකට එකයි"],
        ],
      },
      { type: "h2", text: "Hot Fade trade කරන්නේ මොකක්ද" },
      { type: "p", text: `Hot Fade trade කරන්නේ එක contract එකයි: Differs, tick එකක දිගකින්. ${DIFFERS_PARA}` },
      { type: "h2", text: "Hot Fade trade එකකට ඇතුල් වෙන්නේ කවදද" },
      {
        type: "p",
        text: "Hot Fade ඔබ තෝරපු හැම market එකකම හැම tick එකකම අන්තිම digit එක කියවනවා. එක market එකක එකම වෙලාවේ කාරණා දෙකක් සම්පූර්ණ වෙන්න ඕන. පළමුවෙනි එක: අන්තිම ticks 30 ඇතුළත එක digit එකක් අනිත් ඒවාට වඩා පැහැදිලිව වැඩියෙන් ඇවිත් තියෙන්න ඕන. දෙවෙනි එක: ඒ digit එකෙන්ම දැන් ticks තුනක් එක දිගට ඉවර වෙලා තියෙන්න ඕන. දෙකම සම්පූර්ණ වුණාම bot එක ඒ market එකේ, ඒ digit එකට tick එකක Differs එකක් buy කරනවා.",
      },
      {
        type: "note",
        title: "උදාහරණය",
        text: "Volatility 100 (1s) එකේ අන්තිම ticks 30 න් වැඩිම ගණනක් ඉවර වෙලා තියෙන්නේ 7 න්, සහ අලුත්ම ticks තුන ඉවර වෙන්නේ 7, 7, 7 විදිහට. Bot එක එතන Differs 7 buy කරනවා. ඊළඟ tick එකත් 7 න් ඉවර වුණොත් විතරයි trade එක පරදින්නේ.",
      },
      {
        type: "p",
        text: "Markets වැඩියෙන් බැලුවාම bot එකට signal එක දකින්න අවස්ථා වැඩියි, ඒත් ඒ ඔක්කොටම එක වෙලාවකට තියාගන්නේ එක trade එකයි. Result එකකට පස්සේ ඊළඟ entry එකට කලින් ටිකක් නවතිනවා, පැරදුණාම ඊට වඩා වැඩි වෙලාවක්. එකම market එකේ එකම digit එකට එක දිගට දෙපාරක් bet කරන්නේ නැහැ. Markets අඩු නම් trade නොකර විනාඩි කිහිපයක් ඉන්න පුළුවන්. ඒක සාමාන්‍ය දෙයක්: bot එක signal එක එනකන් බලන් ඉන්නවා.",
      },
      {
        type: "p",
        text: `${NOT_A_PROMISE} ගොඩක් ආපු digit එකක් දැන් නවතින්න ඕන කියලා නීතියක් නැහැ.`,
      },
      { type: "h2", text: "Stake එක සහ limits" },
      {
        type: "p",
        text: "Hot Fade පාවිච්චි කරන්නේ flat stake එකක්: හැම trade එකක්ම ඔබ set කරපු stake එකෙන්ම දානවා, දිනුවත් පැරදුණත්. Session එක ඉවර වෙන්නේ පාඩුව ඔබේ stop loss එකට ආවාම, take profit එකක් දාලා නම් ලාභය ඒකට ආවාම, නැත්නම් ඔබ Stop එබුවාම. Take profit එකකට පස්සේ ආයෙත් start කළොත් අලුත් session එකක් පටන් ගන්නවා, ඒකෙන් පාඩු වෙන්නත් පුළුවන්.",
      },
      { type: "h2", text: "Hot Fade start කරන හැටි" },
      START_FLAT("Hot Fade", FADE_MARKETS),
      RISK,
    ],
    faq: [
      {
        q: "Hot Fade bot එක trade කරන්නේ මොකක්ද?",
        a: `Hot Fade buy කරන්නේ Deriv ගේ Differs contract එක, tick එකක දිගකින්. Trade එකක් දිනන්නේ ${DIFFERS_WINS}. ඒ කියන්නේ අන්තිම digits දහයෙන් නවයකට.`,
      },
      {
        q: "Hot Fade trade එකක් දාන්නේ කවදද?",
        a: "Market එකක අන්තිම ticks 30 ඇතුළත එක digit එකක් අනිත් ඒවාට වඩා පැහැදිලිව වැඩියෙන් ඇවිත්, ඒ digit එකම එක දිගට තුන්පාරක් ආවාම. එතකොට ඊළඟ tick එක වෙන digit එකකින් ඉවර වෙයි කියලා bet කරනවා.",
      },
      { q: "Hot Fade Martingale පාවිච්චි කරනවද?", a: "නැහැ. Hot Fade හැම trade එකක්ම ඔබ set කරපු stake එකෙන් දානවා." },
      {
        q: "Hot Fade ට markets කීයක් බලන්න පුළුවන්ද?",
        a: "1 සිට 10 දක්වා. ඒ ඔක්කොම කියවලා, එක වෙලාවකට එක trade එකක් විතරක් open තියාගන්නවා.",
      },
      {
        q: "Hot Fade සහ Shadow Fade අතර වෙනස මොකක්ද?",
        a: "දෙකම ගන්නේ එකම entries. Hot Fade හැම එකක්ම buy කරනවා. Shadow Fade මුලින් ඒවා buy නොකර score කරලා, අන්තිම results ඔබ දාපු rule එකට ගැලපෙන වෙලාවට විතරක් buy කරනවා.",
      },
    ],
    related: [slugOf("shadow_fade"), OVERVIEW, "deriv-bot-sinhala"],
    en: botGuideSlug("hot_fade"),
    cta: CTA,
  },
  {
    slug: slugOf("shadow_fade"),
    title: "Shadow Fade Bot Sinhala: FXNOD shadow trade bot එක වැඩ කරන හැටි",
    description:
      "Shadow Fade bot සිංහලෙන්: Hot Fade entries buy කරන්න කලින් score කරන bot එක. Shadow trade එකක් කියන්නේ මොකක්ද, Go live below එකෙන් වෙන්නේ මොකක්ද.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer:
      "Shadow Fade කියන්නේ FXNOD Auto Hub එකේ තියෙන ready-made bot එකක්. ඒක ගන්නේ Hot Fade එකේ entries මයි, ඒ කියන්නේ ගොඩක් ඇවිත් එක දිගට තුන්පාරක් ආපු digit එකකට විරුද්ධව tick එකක Deriv Differs එකක්, ඒත් මුලින් ඒවා buy කරන්නේ නැහැ. පටන් ගන්නේ shadow trades වලින්: ඒවා ඊළඟ tick එකෙන් score කරනවා විතරයි, Deriv එකට යන්නේ නැහැ. Real trades පටන් ගන්නේ results 20 කට පස්සේ, ඒ 20 ඔබ දාපු Go live below ප්‍රතිශතයට වඩා අඩුවෙන් දිනන වෙලාවට විතරයි. ඒක මුලින් තියෙන්නේ 85 ට.",
    body: [
      { type: "h2", text: "Shadow Fade කෙටියෙන්" },
      {
        type: "table",
        head: ["", "Shadow Fade"],
        rows: [
          ["Contract", "Differs, tick එකයි (Deriv Matches / Differs)"],
          ["Entry", "Hot Fade එකේම: එක digit එකක් ගොඩක් ඇවිත්, එක දිගට තුන්පාරක් ආවාම"],
          ["Shadow trade", "Buy නොකර, ඊළඟ tick එකෙන් score කරන entry එකක්"],
          ["Real trades දාන්නේ", "අන්තිම results 20 Go live below එකට වඩා අඩුවෙන් දිනන වෙලාවට"],
          ["Setting", "Go live below: සියයට 1 සිට 99, මුලින් 85"],
          ["Stake", "Flat: හැම real trade එකකම එකමයි"],
          ["ගණන්", "ඔබේම stake එක, stop loss එක, සහ ඕන නම් take profit එක"],
          ["Markets", "1 සිට 10, එකට බලනවා"],
        ],
      },
      { type: "h2", text: "Shadow trade එකක් කියන්නේ මොකක්ද" },
      {
        type: "p",
        text: "Shadow trade එකක් කියන්නේ bot එක buy නොකර සටහන් කරගන්න entry එකක්. Deriv එකට කිසිම දෙයක් යන්නේ නැහැ, සල්ලි හෙලවෙන්නෙත් නැහැ. ඒ entry එක දිනනවද පරදිනවද කියලා තීරණය කරන්නේ ඒ market එකේ ඊළඟ tick එක, real tick එකක Differs එකක් තීරණය වෙන විදිහටමයි. Run page එකේ shadow entry එකක් ඒ විදිහට සලකුණු කරලා තියෙනවා, stake එකක් හෝ ලාභ ගානක් පෙන්නන්නේ නැහැ. Shadow results කවදාවත් ඔබේ trade history එකට, statement එකට හෝ profit and loss එකට යන්නේ නැහැ.",
      },
      { type: "h2", text: "Shadow Fade real trade කරන්නේ කවදද" },
      {
        type: "steps",
        items: [
          { title: "පටන් ගන්නේ shadow mode එකෙන්", text: "Bot එකට කියවන්න results 20ක් එකතු වෙනකන් හැම entry එකක්ම shadow trade එකක්." },
          { title: "අන්තිම results 20 කියවනවා", text: "Win rate එක ගන්නේ අලුත්ම results 20 න්, shadow සහ real දෙකම එකට." },
          {
            title: "ඔබේ ප්‍රතිශතයට වඩා අඩු නම් live යනවා",
            text: "ඒ 20 Go live below එකට වඩා අඩුවෙන් දිනන තාක් entries Deriv එකේ real trades විදිහට buy කරනවා.",
          },
          {
            title: "ඊට වඩා වැඩි වුණාම ආයෙත් shadow",
            text: "අන්තිම 20 ආයෙත් ඊට වඩා වැඩියෙන් දිනන්න ගත්තාම real trades නවතිනවා, entries score විතරක් කරනවා. හරියටම ඔබේ ප්‍රතිශතයේ නම් bot එක ඉන්න mode එකේම ඉන්නවා.",
          },
        ],
      },
      {
        type: "note",
        title: "උදාහරණය",
        text: "Go live below එක 85. අන්තිම results 20 න් 16ක් දිනලා, ඒ කියන්නේ සියයට 80. ඒක 85 ට අඩු නිසා ඊළඟ entry එක real trade එකක්. අන්තිම 20 න් 18ක් දිනලා තිබුණා නම්, ඒ කියන්නේ සියයට 90, ඊළඟ entry එක shadow trade එකක්.",
      },
      {
        type: "p",
        text: `Run page එකේ gauge එකෙන් engine එක ගණනය කරපු mode එකයි win rate එකයි පේනවා. ${NOT_A_PROMISE}`,
      },
      { type: "h2", text: "Stake එක සහ limits" },
      {
        type: "p",
        text: "Real trades දාන්නේ ඔබ set කරපු flat stake එකෙන්. ඔබේ stop loss එකයි take profit එකයි බලන්නේ real profit and loss එක විතරයි: shadow result එකකට ඒවා හොලවන්න බැහැ, ඒත් ඒක results 20 ක win rate එකට ගණන් වෙනවා. Session එක ඉවර වෙන්නේ stop loss එකෙන්, take profit එකක් දාලා නම් ඒකෙන්, නැත්නම් ඔබ Stop එබුවාම.",
      },
      { type: "h2", text: "Shadow Fade start කරන හැටි" },
      START_FLAT("Shadow Fade", `${FADE_MARKETS} ඊට පස්සේ Settings යටතේ Go live below එක set කරන්න, නැත්නම් 85 ටම තියන්න.`),
      RISK,
    ],
    faq: [
      {
        q: "Shadow trade එකක් කියන්නේ මොකක්ද?",
        a: "Bot එක buy නොකර score කරන entry එකක්. Deriv එකට කිසිම දෙයක් යන්නේ නැහැ, සල්ලි හෙලවෙන්නෙත් නැහැ. ඒක දිනනවද පරදිනවද කියලා ඊළඟ tick එක තීරණය කරනවා, සහ result එක යන්නේ bot එකේ අන්තිම win rate එකට විතරයි.",
      },
      {
        q: "Shadow Fade එකේ Go live below කියන්නේ මොකක්ද?",
        a: "අන්තිම results 20 ක win rate එක මේ ගානට වඩා අඩු වුණාම Shadow Fade තමන්ගේ entries real trades විදිහට buy කරනවා. සියයට 1 සිට 99 දක්වා set කරන්න පුළුවන්, මුලින් තියෙන්නේ 85.",
      },
      {
        q: "Shadow trades මගේ stop loss එකට ගණන් වෙනවද?",
        a: "නැහැ. Stop loss එකයි take profit එකයි බලන්නේ real profit and loss එක විතරයි. Shadow results ගණන් වෙන්නේ results 20 ක win rate එකට විතරයි.",
      },
      { q: "Shadow Fade Martingale පාවිච්චි කරනවද?", a: "නැහැ. Shadow Fade හැම real trade එකක්ම ඔබ set කරපු stake එකෙන් දානවා." },
      {
        q: "Shadow Fade real trades දාන්නේ නැත්තේ ඇයි?",
        a: "Live යන්න කලින් ඒකට results 20ක් ඕන, සහ live යන්නේ ඒ results ඔබේ Go live below ප්‍රතිශතයට වඩා අඩුවෙන් දිනන වෙලාවට විතරයි. එතකන් හැම entry එකක්ම shadow trade එකක්.",
      },
    ],
    related: [slugOf("hot_fade"), OVERVIEW, "deriv-bot-sinhala"],
    en: botGuideSlug("shadow_fade"),
    cta: CTA,
  },
  {
    slug: slugOf("matches_differs"),
    title: "Matches Differs Bot Sinhala: FXNOD Deriv digit bot එක වැඩ කරන හැටි",
    description:
      "Matches / Differs bot සිංහලෙන්: FXNOD Auto Hub එකේ එක market එකක, එක digit එකකට trade එකෙන් trade එකට යන bot එක. Settings, auto digit සහ start කරන හැටි.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer:
      "Matches / Differs bot එක කියන්නේ FXNOD Auto Hub එකේ තියෙන ready-made bot එකක්. ඒක එක market එකක Deriv ගේ tick එකක Matches හෝ Differs contract එක දිගටම buy කරනවා. ඔබ Matches ද Differs ද කියලා සහ 0 සිට 9 දක්වා digit එකක් තෝරනවා, නැත්නම් auto digit on කරලා bot එකටම අන්තිම ticks වලින් digit එක තෝරන්න දෙනවා. අන්තිම trade එක close වුණ ගමන් ඊළඟ එක දානවා, හැම වෙලාවෙම එකම stake එකෙන්, ඔබේ stop loss එකට හෝ take profit එකට එනකන් නැත්නම් ඔබ නවත්තනකන්.",
    body: [
      { type: "h2", text: "Matches / Differs කෙටියෙන්" },
      {
        type: "table",
        head: ["", "Matches / Differs"],
        rows: [
          ["Contract", "Matches හෝ Differs, tick එකයි"],
          ["Matches දිනන්නේ", "ඊළඟ tick එක ඔබේ digit එකෙන් ඉවර වුණොත් (digits 10න් 1)"],
          ["Differs දිනන්නේ", "ඊළඟ tick එක වෙන ඕනෑම digit එකකින් ඉවර වුණොත් (digits 10න් 9)"],
          ["Entry", "දිගටම: අන්තිම trade එකට පස්සේ ඊළඟ එක"],
          ["Settings", "Prediction, Digit, Auto digit"],
          ["Stake", "Flat: හැම trade එකකම එකමයි"],
          ["ගණන්", "ඔබේම stake එක, stop loss එක, සහ ඕන නම් take profit එක"],
          ["Markets", "එකයි"],
        ],
      },
      { type: "h2", text: "Bot එක trade කරන්නේ මොකක්ද" },
      {
        type: "p",
        text: `Contracts දෙකම තීරණය වෙන්නේ tick එකක මිලේ අන්තිම digit එකෙන්: 1234.56 කියන tick එක ඉවර වෙන්නේ 6 න්. Matches එක digit එකක් නම් කරනවා, සහ ඊළඟ tick එක ඒකෙන්ම ඉවර වුණොත් විතරක් දිනනවා. ඒ නිසා ඒක දිනන්නේ digits දහයෙන් එකකට, සහ stake එක වගේ කිහිප ගුණයක් ගෙවනවා. Differs එක digit එකක් නම් කරනවා, සහ ඊළඟ tick එක වෙන ඕනෑම එකකින් ඉවර වුණොත් දිනනවා. ඒ නිසා ඒක දිනන්නේ digits දහයෙන් නවයකට, සහ stake එකෙන් පොඩි කොටසක් ගෙවනවා. දෙකෙන් කොයි එක පැරදුණත් සම්පූර්ණ stake එකම යනවා.`,
      },
      { type: "h2", text: "Settings තුන" },
      {
        type: "table",
        head: ["Setting", "තේරීම්", "මුලින් තියෙන්නේ"],
        rows: [
          ["Prediction", "Differs හෝ Matches", "Differs"],
          ["Digit", "0 සිට 9", "5"],
          ["Auto digit", "On හෝ off", "Off"],
        ],
      },
      {
        type: "p",
        text: "Auto digit off නම් bot එක හැම trade එකකම ඔබ දාපු digit එකම trade කරනවා. Auto digit on නම් හැම trade එකකට කලින්ම market එකේ අන්තිම ticks කියවලා digit එක තමන්ම තෝරනවා: Matches වලට වැඩියෙන්ම ආපු digit එක, Differs වලට අඩුවෙන්ම ආපු එක.",
      },
      {
        type: "note",
        title: "උදාහරණය",
        text: "Prediction එක Differs, Digit එක 5, auto digit off. Bot එක Differs 5 buy කරනවා. ඊළඟ tick එක 2 න් ඉවර වෙන නිසා trade එක දිනනවා, සහ bot එක ආයෙත් Differs 5 buy කරනවා. 5 න් ඉවර වෙන tick එකකින් trade එක පරදිනවා.",
      },
      {
        type: "p",
        text: "Bot එක signal එකක් එනකන් බලන් ඉන්නේ නැහැ. එක වෙලාවකට එක trade එකක් තියාගෙන, ඒක close වුණ ගමන් ඊළඟ එක buy කරනවා. Digit setting එකෙන් තීරණය වෙන්නේ bot එක bet කරන්නේ මොකටද කියන එක විතරයි. ඒකෙන් කිසිම trade එකක් දිනන්න තියෙන ඉඩ වැඩි වෙන්නේ නැහැ.",
      },
      { type: "h2", text: "Stake එක සහ limits" },
      {
        type: "p",
        text: "Stake එක flat: හැම trade එකක්ම ඔබ set කරපු stake එකෙන් දානවා. Session එක ඉවර වෙන්නේ පාඩුව ඔබේ stop loss එකට ආවාම, take profit එකක් දාලා නම් ලාභය ඒකට ආවාම, නැත්නම් ඔබ Stop එබුවාම.",
      },
      { type: "h2", text: "Matches / Differs start කරන හැටි" },
      START_FLAT(
        "Matches / Differs",
        "එක market එකක් තෝරන්න. Form එක යෝජනා කරන්නේ Volatility 100. මේ bot එකට Jump 100 දෙන්නේ නැහැ. ඊට පස්සේ Settings යටතේ Prediction, Digit සහ Auto digit set කරන්න.",
      ),
      RISK,
    ],
    faq: [
      {
        q: "Matches / Differs bot එක trade කරන්නේ මොකක්ද?",
        a: "Deriv ගේ Matches හෝ Differs contract එක, tick එකක දිගකින්, එක market එකක. Matches දිනන්නේ ඊළඟ tick එක තෝරපු digit එකෙන් ඉවර වුණොත්; Differs දිනන්නේ වෙන ඕනෑම digit එකකින් ඉවර වුණොත්.",
      },
      {
        q: "Auto digit එකෙන් වෙන්නේ මොකක්ද?",
        a: "Auto digit on නම් bot එක හැම trade එකකට කලින්ම market එකේ අන්තිම ticks වලින් digit එක තෝරනවා: Matches වලට වැඩියෙන්ම ආපු digit එක, Differs වලට අඩුවෙන්ම ආපු එක.",
      },
      { q: "Matches / Differs bot එක Martingale පාවිච්චි කරනවද?", a: "නැහැ. ඒක හැම trade එකක්ම ඔබ set කරපු stake එකෙන් දානවා." },
      {
        q: "Matches / Differs bot එක කොච්චර ඉක්මනට trade කරනවද?",
        a: "දිගටම. අන්තිම trade එක close වුණ ගමන් tick එකක ඊළඟ trade එක දානවා.",
      },
    ],
    related: [OVERVIEW, slugOf("nine_lives"), "deriv-bot-sinhala"],
    en: botGuideSlug("matches_differs"),
    cta: CTA,
  },
];

const OWN_AMOUNT_PACE: Record<string, string> = {
  hot_fade: "එක digit එකක් ගොඩක් ඇවිත්, එක දිගට තුන්පාරක් ආවාම",
  shadow_fade: "Hot Fade entries, මුලින් score කරලා, ඔබේ rule එකට ගැලපෙන වෙලාවට විතරක් trade කරනවා",
  matches_differs: "හැම tick එකකම, ඔබ තෝරන digit එකට",
};

function planBotTable(family: DigitFamily): GuideBlock {
  return {
    type: "table",
    head: ["Bot", "Contract", "ඇතුල් වෙන්නේ", "Stake", "Plans (stop loss)"],
    rows: FIXED_PLAN_BOTS.filter((bot) => bot.family === family).map((bot) => [
      bot.name,
      bot.bet,
      words(bot).pace,
      stakeStyle(bot),
      bot.plans.map((p) => p.stopLoss).join(", "),
    ]),
  };
}

const LADDER_BOTS = FIXED_PLAN_BOTS.filter((bot) => bot.plans.some(escalates)).length;

const OVERVIEW_GUIDE: LocalGuide = {
  slug: OVERVIEW,
  title: `Auto Hub Bots Sinhala: FXNOD ready-made Deriv bots ${AUTOHUB_BOT_COUNT} trade කරන හැටි`,
  description: `FXNOD Auto Hub bots සිංහලෙන්: ready-made Deriv digit bots ${AUTOHUB_BOT_COUNT}. එක එකක් trade කරන contract එක, ඇතුල් වෙන rule එක, stake එක flat ද Martingale ද.`,
  tag: TAG,
  published: DATE,
  updated: DATE,
  image: IMAGE,
  answer: `Auto Hub කියන්නේ FXNOD කලින්ම හදලා තියෙන bots එකතුවක්. ඔබ මුකුත් design කරන්න ඕන නැහැ: bot එකක් තෝරලා, market එක තෝරලා, ගණන් තෝරලා start කරනවා. Bots ${AUTOHUB_BOT_COUNT}ක් තියෙනවා. ඒ ඔක්කොම trade කරන්නේ Deriv ගේ tick එකක digit contracts: Matches / Differs, Even / Odd සහ Over / Under. ${FIXED_PLAN_BOTS.length}ක් start කරන්නේ stop loss එක, stake එක සහ profit target එක එකට set කරන fixed plan එකකින්, සහ තුනකට ගණන් ඔබම දෙනවා.`,
  body: [
    { type: "h2", text: "Auto Hub ද dBot ද?" },
    {
      type: "table",
      head: ["", "dBot", "Auto Hub"],
      rows: [
        ["Strategy එක design කරන්නේ", "ඔබ", "FXNOD"],
        ["ඔබ set කරන්නේ", "Trade type එක, markets, entry rule එක, stake sizing, limits", "Market එක සහ plan එකක්, නැත්නම් market එක සහ ඔබේ ගණන්, සහ bot එක දෙන settings කිහිපය"],
        ["Stake sizing", "Same stake, gentle step, Martingale හෝ reverse Martingale", "Bot එකෙන් තීරණය වෙලා: සමහර ඒවා flat, සමහර ඒවා Martingale"],
        ["හොඳ", "ඔබේම අදහසක් test කරන්න", "Rules ලියලා තියෙන bot එකකින් ඉක්මනට පටන් ගන්න"],
      ],
    },
    { type: "h2", text: "Auto Hub bot එකක් විස්තර වෙන හැටි" },
    {
      type: "p",
      text: "හැම bot එකක්ම කාරණා හතරකින් තීරණය වෙනවා, සහ Auto Hub එකේ ඒකේ page එකේ How it works යටතේ ඒවා තියෙනවා.",
    },
    {
      type: "list",
      items: [
        "Contract එක. Tick එකක දිග තියෙන එක digit contract එකක්, උදාහරණයක් විදිහට Over 4 හෝ Differs. දිනන digits මොනවද, දිනුමක් කීයක් ගෙවනවද කියලා ඒකෙන් තීරණය වෙනවා.",
        "Entry rule එක. Bot එක buy කරන්නේ කවදද: හැම tick එකකම, ticks කිහිපයකට සැරයක්, නැත්නම් අන්තිම digits වල pattern එකකට පස්සේ.",
        "Stake plan එක. Flat නම් හැම trade එකකම එකම stake එක. Martingale නම් පැරදුණාම stake එක ගුණ වෙලා, දිනුවාම ආයෙත් මුලට එනවා.",
        "Limits. Stop loss එකක් සහ profit target එකක්. Stop loss එකක් නැතුව bot එකක් start කරන්න බැහැ.",
      ],
    },
    {
      type: "p",
      text: `${NOT_A_PROMISE} මෙතන තියෙන කිසිම bot එකකට ලාභයක් සහතික කරන්න බැහැ.`,
    },
    { type: "h2", text: "Plan එකකින් start කරන bots" },
    {
      type: "p",
      text: `Bots ${FIXED_PLAN_BOTS.length}ක් trade කරන්නේ එක market එකක, සහ start කරන්නේ plan එකක් තෝරලා. Plan එකක් නම් කරලා තියෙන්නේ ඒකේ stop loss එකෙන් (20, 100 හෝ 500), සහ ඒකත් එක්කම මුල් stake එකයි profit target එකයි set වෙනවා. ගණන් වෙන වෙනම වෙනස් කරන්න බැහැ. මේ bots වල session එකේ පාඩුව plan එකේ stop loss එක පහු කරන්න පුළුවන් කිසිම stake එකක් දාන්නේ නැහැ. ඒවායින් ${LADDER_BOTS}ක් Martingale, ඉතුරු ${FIXED_PLAN_BOTS.length - LADDER_BOTS} flat.`,
    },
    { type: "h2", text: "Matches / Differs bots" },
    planBotTable("matches_differs"),
    { type: "h2", text: "Even / Odd bots" },
    planBotTable("even_odd"),
    { type: "h2", text: "Over / Under bots" },
    planBotTable("over_under"),
    { type: "h2", text: "ඔබේම ගණන් දෙන bots" },
    {
      type: "p",
      text: "Bots තුනක් trade එකකට stake එකක්, stop loss එකක් සහ ඕන නම් take profit එකක් ඉල්ලනවා. Stake එක flat, පටන් ගන්නේ 1 න්, සහ 0.35 ට වඩා අඩු කරන්න බැහැ. ඒ තමයි මේ contracts වලට Deriv ගන්න පොඩිම stake එක.",
    },
    {
      type: "table",
      head: ["Bot", "Contract", "ඇතුල් වෙන්නේ", "Markets"],
      rows: OWN_AMOUNT_BOTS.map((bot) => [
        bot.name,
        bot.id === "matches_differs" ? "Matches හෝ Differs" : bot.bet,
        OWN_AMOUNT_PACE[bot.id],
        bot.markets === "1 to 10" ? "1 සිට 10" : bot.markets,
      ]),
    },
    { type: "h2", text: "හැම bot එකකටම guide එකක්" },
    {
      type: "links",
      items: [
        ...OWN_AMOUNT_BOTS.map((bot) => ({
          href: `/si/guides/${slugOf(bot.id)}`,
          label: `${bot.name} bot`,
          text: OWN_AMOUNT_PACE[bot.id],
        })),
        ...FIXED_PLAN_BOTS.map((bot) => ({
          href: `/si/guides/${slugOf(bot.id)}`,
          label: `${bot.name} bot`,
          text: words(bot).tagline,
        })),
      ],
    },
    { type: "h2", text: "Bot එකක් start කරන හැටි" },
    {
      type: "steps",
      items: [
        {
          title: "Auto Hub එක open කරලා bot එකක් තෝරන්න",
          text: "මුලින්ම ඒකේ How it works panel එක කියවන්න. Bot එක අනුගමනය කරන හැම rule එකක්ම එතන පිළිවෙළට තියෙනවා.",
        },
        {
          title: "Market එක තෝරන්න",
          text: "Plan bot එකක් trade කරන්නේ එක market එකක, සහ form එක යෝජනා කරන්නේ Volatility 100, 75 සහ 50 indices සහ ඒවායේ තත්පරයේ versions. Hot Fade සහ Shadow Fade වලට markets දහයක් දක්වා බලන්න පුළුවන්.",
        },
        {
          title: "Plan එකක් තෝරන්න, නැත්නම් ඔබේ ගණන් දාන්න",
          text: "Plan bot එකක plans cards විදිහට පේනවා: එකක් තෝරන්න. අනිත් bots තුන stake එකක්, stop loss එකක් සහ ඕන නම් take profit එකක් ඉල්ලනවා.",
        },
        {
          title: "මුලින්ම demo එකේ start කරන්න",
          text: "ඔබේ Deriv demo account එකේ start කරලා සම්පූර්ණ session එකක් බලන්න. Real account එකක bot එක real money trade කරන බව තහවුරු කරන box එක tick කරන්න ඕන, එතකොට button එකේ තියෙන්නේ Start with real money කියලා.",
        },
      ],
    },
    { type: "h2", text: "Run page එක කියවන හැටි" },
    {
      type: "p",
      text: "Run page එකේ හැම trade එකක්ම ඒකේ market එක, digit එක සහ result එක එක්ක තියෙනවා. ඒකේ realised profit or loss එක, stop loss එකෙන් පාවිච්චි වුණ ගාන සහ take profit එකට ආපු දුර පේනවා. Shadow Fade එකේ shadow entries සලකුණු කරලා තියෙනවා, ඒවාට සල්ලි ගානක් නැහැ. Pattern එකක් එනකන් බලන් ඉන්න bot එකක් entries නැතුව ටික වෙලාවක් ඉන්න පුළුවන්. ඒක සාමාන්‍ය දෙයක්: ඒක signal එක එනකන් බලන් ඉන්නවා.",
    },
    { type: "h2", text: "හැම bot එකකටම පොදු දේ" },
    {
      type: "list",
      items: [
        "දුවන්නේ FXNOD servers වල. Page එක close කළාට ඒක නවතින්නෙත් නැහැ, limits off වෙන්නෙත් නැහැ.",
        "එක වෙලාවකට තියාගන්නේ එක trade එකයි.",
        "Start කරපු Deriv account එකම (demo හෝ real) නවතිනකන් trade කරනවා.",
        "Auto Hub එකටයි dBot එකටයි account එකක safety limits පොදුයි: එකක පාඩුවක් දෙකටම තියෙන මුළු පාඩු සීමාවට ගණන් වෙනවා, සහ එක වෙලාවකට දුවන්න පුළුවන් bots ගණනට දෙකේම bots ගණන් වෙනවා.",
        "FXNOD app එක දැනට English වලින්. ඒ නිසා bot නම්, buttons සහ labels මේ guide එකේ තියෙන්නේ screen එකේ පේන විදිහටමයි.",
      ],
    },
    RISK,
  ],
  faq: [
    {
      q: "Auto Hub එකේ bots කීයක් තියෙනවද?",
      a: `${AUTOHUB_BOT_COUNT}යි. ${FIXED_PLAN_BOTS.length}ක් start කරන්නේ fixed plan එකකින්, සහ තුනකට (Hot Fade, Shadow Fade සහ Matches / Differs) stake එක, stop loss එක සහ take profit එක ඔබම දෙනවා.`,
    },
    {
      q: "Auto Hub bots trade කරන්නේ මොනවද?",
      a: "Deriv ගේ tick එකක digit contracts: Matches / Differs, Even / Odd සහ Over / Under. හැම bot එකක්ම ඒවායින් එකක් trade කරනවා.",
    },
    {
      q: "Auto Hub Martingale පාවිච්චි කරනවද?",
      a: "සමහර bots කරනවා. Plan bot එකක් flat (හැම trade එකකම එකම stake එක) හෝ Martingale (පැරදුණාම stake එක ගුණ වෙනවා). ඒකේ guide එකෙයි How it works panel එකෙයි ඒක කියලා තියෙනවා. ඔබේම ගණන් දෙන bots තුන හැම වෙලාවෙම flat.",
    },
    {
      q: "Auto Hub එකේ plan එකක් කියන්නේ මොකක්ද?",
      a: "Plan එකක් කියන්නේ stop loss එකක් සහ ඒකට යන මුල් stake එකයි profit target එකයි. Plan එක සම්පූර්ණයෙන්ම තෝරනවා; ඒකේ ගණන් වෙන වෙනම වෙනස් කරන්න බැහැ.",
    },
    {
      q: "Auto Hub bot එකක් trade කරන විදිහ වෙනස් කරන්න පුළුවන්ද?",
      a: "Bot එක දෙන settings වලින් විතරයි, උදාහරණයක් විදිහට Matches / Differs එකේ digit එක හෝ Shadow Fade එකේ Go live below ප්‍රතිශතය. Strategy එක වෙනස් කරන්න බැහැ. ඔබේම එකක් design කරන්න නම් dBot පාවිච්චි කරන්න.",
    },
    {
      q: "Bot එකක් කොච්චර වෙලා දුවනවද?",
      a: "Stop loss එකට හෝ profit target එකට එනකන්, නැත්නම් ඔබ නවත්තනකන්. ඒක දුවන්නේ FXNOD servers වල නිසා page එක close කළාට ඉවර වෙන්නේ නැහැ.",
    },
  ],
  related: [slugOf("nine_lives"), slugOf("high_five"), "deriv-bot-sinhala", "trading-bot-sinhala"],
  en: OVERVIEW_EN,
  cta: CTA,
};

export const SI_AUTOHUB_GUIDES: LocalGuide[] = [
  OVERVIEW_GUIDE,
  ...OWN_AMOUNT_GUIDES,
  ...FIXED_PLAN_BOTS.map(fixedPlanGuide),
];
