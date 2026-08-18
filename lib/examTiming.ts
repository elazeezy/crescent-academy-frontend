// Server-authoritative exam timing: the client's clock/timer is display-only.
// A disconnect is inferred from a gap between heartbeat pings. Credited time
// is capped so idle/closed-tab time can't be farmed for extra thinking time.

export const HEARTBEAT_INTERVAL_SECONDS = 15;
// A gap longer than this is treated as a disconnect worth crediting back.
export const DISCONNECT_THRESHOLD_SECONDS = 30;
// Total time creditable across the whole attempt, in seconds.
export const MAX_CREDITED_SECONDS_PER_ATTEMPT = 10 * 60;

export interface CreditResult {
  creditedSeconds: number;
  newDeadline: Date;
}

export function creditDisconnectGap(
  gapSeconds: number,
  currentDeadline: Date,
  alreadyCreditedSeconds: number
): CreditResult {
  if (gapSeconds < DISCONNECT_THRESHOLD_SECONDS) {
    return { creditedSeconds: 0, newDeadline: currentDeadline };
  }
  const remainingBudget = Math.max(0, MAX_CREDITED_SECONDS_PER_ATTEMPT - alreadyCreditedSeconds);
  const creditedSeconds = Math.min(gapSeconds, remainingBudget);
  const newDeadline = new Date(currentDeadline.getTime() + creditedSeconds * 1000);
  return { creditedSeconds, newDeadline };
}
