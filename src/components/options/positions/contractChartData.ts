import type { ContractDetail } from "./contractDetail";

/** Keep repaint work bounded even when a multiplier expires years from now. */
export function contractChartData(detail: ContractDetail): { time: number; value?: number }[] {
  const observed = new Map<number, number>();
  for (const tick of detail.ticks) {
    if (Number.isFinite(tick.time) && Number.isFinite(tick.value)) observed.set(tick.time, tick.value);
  }
  const data: { time: number; value?: number }[] = [...observed].sort(([a], [b]) => a - b)
    .map(([time, value]) => ({ time, value }));
  const last = data.at(-1)?.time;
  if (last == null || detail.ticks.some((tick) => tick.kind === "exit")) return data;
  const progress = detail.duration.match(/(\d+)\/(\d+)\s+ticks?/i);
  const tickSpace = progress ? Number(progress[2]) - Number(progress[1]) : 1;
  const timeSpace = detail.expiryTime ? detail.expiryTime - last : 0;
  const forward = Math.max(1, Math.min(60, Math.max(tickSpace, timeSpace)));
  for (let offset = 1; offset <= forward; offset++) data.push({ time: last + offset });
  return data;
}
