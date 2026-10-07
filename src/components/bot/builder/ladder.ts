import { compareDecimals, compoundDecimal, sumDecimals } from "@/lib/decimal";

/**
 * What a martingale bot stakes through one unbroken losing streak, and what
 * ends it.
 *
 * This is a picture for the builder, drawn from the same rules the engine
 * applies (internal/risk in trading-engine-deriv). It decides nothing: the
 * engine sizes every stake itself and is the copy that counts. The picture
 * starts from a session that is level; a bot that is already up has more room
 * before its loss cap, and one that is down has less.
 */

/** Why the streak ends. */
export type LadderEnd =
  /** The losses so far have reached the loss cap. */
  | "loss_cap"
  /** The next stake is above the most one trade may be, so it is not placed. */
  | "stake_limit"
  /** The bot is out of steps. */
  | "steps";

export interface LadderPreview {
  /** Every stake the streak places, the starting stake first. */
  stakes: string[];
  /** What the streak has lost by the time it ends. */
  lost: string;
  end: LadderEnd;
  /** The loss cap in effect, after the platform limit. */
  lossCap: string;
  /** For "stake_limit": the stake that is not placed. */
  refused?: string;
  /** For "stake_limit": the ceiling it was above. */
  ceiling?: string;
  /** For "stake_limit": whether that ceiling is the user's own, not the loss cap. */
  ceilingIsOwn?: boolean;
}

export interface LadderInput {
  stake: string;
  multiplier: string;
  steps: string;
  lossCap: string;
  /** The user's "never stake more than", or empty. */
  maxStake: string;
  /** Platform limits, as the engine reports them. Absent until they load. */
  platformMaxStake?: string;
  platformMaxLoss?: string;
  platformMaxSteps?: number;
}

// The engine allows no ladder longer than a session has trades. This bounds
// the walk below when the limits have not loaded yet.
const FALLBACK_MAX_STEPS = 200;

const isPositive = (value: string) => compareDecimals(value, "0") === 1;

function lower(a: string, b: string | undefined): string {
  return b !== undefined && compareDecimals(b, a) === -1 ? b : a;
}

export function martingaleLadder(input: LadderInput): LadderPreview | null {
  const multiplier = input.multiplier.trim();
  const requestedSteps = Number.parseInt(input.steps, 10);
  if (
    !isPositive(input.stake) ||
    !isPositive(input.lossCap) ||
    compareDecimals(multiplier, "1") !== 1 ||
    !(requestedSteps > 0)
  ) {
    return null;
  }

  // The engine reduces a starting stake, a loss cap and a step count that are
  // over the platform's limits, so the picture starts from the reduced ones.
  const start = lower(input.stake.trim(), input.platformMaxStake);
  const lossCap = lower(input.lossCap.trim(), input.platformMaxLoss);
  const steps = Math.min(requestedSteps, input.platformMaxSteps || FALLBACK_MAX_STEPS);

  // No stake above the loss cap, and none below the starting stake. The
  // user's own ceiling replaces it when it is the lower of the two.
  let ceiling = compareDecimals(lossCap, start) === -1 ? start : lossCap;
  let ceilingIsOwn = false;
  const own = input.maxStake.trim();
  if (isPositive(own) && compareDecimals(own, start) !== -1 && compareDecimals(own, ceiling) === -1) {
    ceiling = own;
    ceilingIsOwn = true;
  }

  const stakes = [start];
  for (let step = 1; ; step++) {
    const lost = sumDecimals(stakes);
    if (compareDecimals(lost, lossCap) !== -1) {
      return { stakes, lost, end: "loss_cap", lossCap };
    }
    if (step > steps) {
      return { stakes, lost, end: "steps", lossCap };
    }
    const next = compoundDecimal(start, multiplier, step);
    if (next === null) return null;
    if (compareDecimals(next, ceiling) === 1) {
      return { stakes, lost, end: "stake_limit", lossCap, refused: next, ceiling, ceilingIsOwn };
    }
    stakes.push(next);
  }
}
