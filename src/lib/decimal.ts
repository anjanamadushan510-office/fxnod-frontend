/**
 * Exact arithmetic on the API's decimal strings.
 *
 * The API sends money as strings precisely so it never passes through a float.
 * Parsing them to numbers just to add them undoes that: "0.1" + "0.2" becomes
 * 0.30000000000000004, and a column of P&L figures drifts by a cent. Values are
 * scaled to integers of SCALE decimal places and summed as BigInt instead.
 */

const SCALE = 8;
const FACTOR = BigInt(10) ** BigInt(SCALE);
const DECIMAL = /^([+-])?(\d+)(?:\.(\d+))?$/;

/** Parses a decimal string into scaled units, or null if it is not a decimal. */
function toUnits(raw: string): bigint | null {
  const match = DECIMAL.exec(raw.trim());
  if (!match) return null;
  const [, sign, whole, fraction = ""] = match;
  // Beyond SCALE places the digits are truncated. The engine rounds to 8 places
  // before persisting, so nothing it sends is affected.
  const padded = (fraction + "0".repeat(SCALE)).slice(0, SCALE);
  const units = BigInt(whole) * FACTOR + BigInt(padded);
  return sign === "-" ? -units : units;
}

function fromUnits(units: bigint): string {
  const negative = units < BigInt(0);
  const abs = negative ? -units : units;
  const whole = abs / FACTOR;
  const fraction = (abs % FACTOR).toString().padStart(SCALE, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

/** Sums decimal strings exactly. Anything that is not a decimal is skipped. */
export function sumDecimals(values: readonly string[]): string {
  let total = BigInt(0);
  for (const value of values) {
    const units = toUnits(value);
    if (units !== null) total += units;
  }
  return fromUnits(total);
}

/** -1, 0 or 1 for a decimal string; 0 when it does not parse. */
export function decimalSign(value: string): -1 | 0 | 1 {
  const units = toUnits(value);
  if (units === null || units === BigInt(0)) return 0;
  return units < BigInt(0) ? -1 : 1;
}

/**
 * Formats a decimal string as signed money to two places, rounding half away
 * from zero: "-29.105" → "-$29.11", "4" → "$4.00".
 */
export function formatMoney(value: string, currencySymbol = "$"): string {
  const units = toUnits(value);
  if (units === null) return `${currencySymbol}—`;
  const negative = units < BigInt(0);
  const abs = negative ? -units : units;
  const centFactor = BigInt(10) ** BigInt(SCALE - 2);
  const cents = (abs + centFactor / BigInt(2)) / centFactor;
  const whole = (cents / BigInt(100)).toLocaleString("en-US");
  const fraction = (cents % BigInt(100)).toString().padStart(2, "0");
  return `${negative && cents > BigInt(0) ? "-" : ""}${currencySymbol}${whole}.${fraction}`;
}
