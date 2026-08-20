/**
 * Mathematical calculations for Chart Indicators.
 * These are simple pure functions designed to work incrementally
 * or over historical data arrays to feed lightweight-charts.
 */

// Simple Moving Average (SMA)
export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(NaN);
  if (data.length < period) return result;

  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  result[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    sum = sum - data[i - period] + data[i];
    result[i] = sum / period;
  }
  return result;
}

// Exponential Moving Average (EMA)
export function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(NaN);
  if (data.length < period) return result;

  const multiplier = 2 / (period + 1);

  // Initial SMA for the first EMA value
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i];
  }
  let prevEMA = sum / period;
  result[period - 1] = prevEMA;

  for (let i = period; i < data.length; i++) {
    const currentEMA = (data[i] - prevEMA) * multiplier + prevEMA;
    result[i] = currentEMA;
    prevEMA = currentEMA;
  }
  
  return result;
}

// Relative Strength Index (RSI)
export function calculateRSI(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(NaN);
  if (data.length <= period) return result;

  let gainSum = 0;
  let lossSum = 0;

  // Initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1];
    if (diff >= 0) gainSum += diff;
    else lossSum += Math.abs(diff);
  }

  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    if (avgLoss === 0) {
      result[i] = 100;
    } else {
      rs = avgGain / avgLoss;
      result[i] = 100 - 100 / (1 + rs);
    }
  }

  return result;
}

export interface MACDResult {
  macd: number[];
  signal: number[];
  histogram: number[];
}

// Moving Average Convergence Divergence (MACD)
export function calculateMACD(data: number[], fastPeriod: number, slowPeriod: number, signalPeriod: number): MACDResult {
  const fastEma = calculateEMA(data, fastPeriod);
  const slowEma = calculateEMA(data, slowPeriod);

  const macdLine: number[] = new Array(data.length).fill(NaN);
  const validMacdValues: number[] = [];
  const validMacdIndices: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (!isNaN(fastEma[i]) && !isNaN(slowEma[i])) {
      const val = fastEma[i] - slowEma[i];
      macdLine[i] = val;
      validMacdValues.push(val);
      validMacdIndices.push(i);
    }
  }

  // Calculate signal line which is EMA of MACD line
  const signalEma = calculateEMA(validMacdValues, signalPeriod);
  const signalLine: number[] = new Array(data.length).fill(NaN);
  const histogram: number[] = new Array(data.length).fill(NaN);

  for (let i = 0; i < validMacdValues.length; i++) {
    const originalIndex = validMacdIndices[i];
    if (!isNaN(signalEma[i])) {
      signalLine[originalIndex] = signalEma[i];
      histogram[originalIndex] = macdLine[originalIndex] - signalLine[originalIndex];
    }
  }

  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram,
  };
}

// Rate of Change (ROC)
export function calculateROC(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(NaN);
  for (let i = period; i < data.length; i++) {
    const pastPrice = data[i - period];
    if (pastPrice !== 0) {
      result[i] = ((data[i] - pastPrice) / pastPrice) * 100;
    }
  }
  return result;
}

// Awesome Oscillator (AO)
export function calculateAwesomeOscillator(high: number[], low: number[]): number[] {
  const result: number[] = new Array(high.length).fill(NaN);
  const medianPrices: number[] = new Array(high.length).fill(0);
  for (let i = 0; i < high.length; i++) {
    medianPrices[i] = (high[i] + low[i]) / 2;
  }
  
  const sma5 = calculateSMA(medianPrices, 5);
  const sma34 = calculateSMA(medianPrices, 34);

  for (let i = 0; i < high.length; i++) {
    if (!isNaN(sma5[i]) && !isNaN(sma34[i])) {
      result[i] = sma5[i] - sma34[i];
    }
  }
  return result;
}

// William's Percent Range (%R)
export function calculateWilliamsR(high: number[], low: number[], close: number[], period: number): number[] {
  const result: number[] = new Array(close.length).fill(NaN);
  for (let i = period - 1; i < close.length; i++) {
    let highestHigh = high[i - period + 1];
    let lowestLow = low[i - period + 1];
    
    for (let j = 1; j < period; j++) {
      const idx = i - period + 1 + j;
      if (high[idx] > highestHigh) highestHigh = high[idx];
      if (low[idx] < lowestLow) lowestLow = low[idx];
    }

    if (highestHigh !== lowestLow) {
      result[i] = ((highestHigh - close[i]) / (highestHigh - lowestLow)) * -100;
    } else {
      result[i] = -50;
    }
  }
  return result;
}

// Stochastic Oscillator (%K and %D)
export interface StochasticResult {
  k: number[];
  d: number[];
}

export function calculateStochastic(high: number[], low: number[], close: number[], periodK: number, periodD: number): StochasticResult {
  const kLine: number[] = new Array(close.length).fill(NaN);
  for (let i = periodK - 1; i < close.length; i++) {
    let highestHigh = high[i - periodK + 1];
    let lowestLow = low[i - periodK + 1];
    
    for (let j = 1; j < periodK; j++) {
      const idx = i - periodK + 1 + j;
      if (high[idx] > highestHigh) highestHigh = high[idx];
      if (low[idx] < lowestLow) lowestLow = low[idx];
    }

    if (highestHigh !== lowestLow) {
      kLine[i] = ((close[i] - lowestLow) / (highestHigh - lowestLow)) * 100;
    } else {
      kLine[i] = 50;
    }
  }

  // extract valid values to pass to SMA
  const validKValues: number[] = [];
  const validKIndices: number[] = [];
  for (let i = 0; i < kLine.length; i++) {
    if (!isNaN(kLine[i])) {
      validKValues.push(kLine[i]);
      validKIndices.push(i);
    }
  }

  const dLineEma = calculateSMA(validKValues, periodD);
  const dLine: number[] = new Array(close.length).fill(NaN);
  for (let i = 0; i < validKValues.length; i++) {
    const originalIndex = validKIndices[i];
    if (!isNaN(dLineEma[i])) {
      dLine[originalIndex] = dLineEma[i];
    }
  }

  return { k: kLine, d: dLine };
}

// Commodity Channel Index (CCI)
export function calculateCCI(high: number[], low: number[], close: number[], period: number): number[] {
  const result: number[] = new Array(close.length).fill(NaN);
  const tp: number[] = new Array(close.length).fill(0);
  
  for (let i = 0; i < close.length; i++) {
    tp[i] = (high[i] + low[i] + close[i]) / 3;
  }

  const smaTp = calculateSMA(tp, period);

  for (let i = period - 1; i < close.length; i++) {
    if (isNaN(smaTp[i])) continue;
    
    let sumDev = 0;
    for (let j = 0; j < period; j++) {
      sumDev += Math.abs(tp[i - j] - smaTp[i]);
    }
    const meanDev = sumDev / period;
    
    if (meanDev !== 0) {
      result[i] = (tp[i] - smaTp[i]) / (0.015 * meanDev);
    } else {
      result[i] = 0;
    }
  }

  return result;
}

// =====================================
// Trend Indicators
// =====================================

export interface AroonResult {
  up: number[];
  down: number[];
}

export function calculateAroon(high: number[], low: number[], period: number): AroonResult {
  const up: number[] = new Array(high.length).fill(NaN);
  const down: number[] = new Array(high.length).fill(NaN);

  for (let i = period; i < high.length; i++) {
    let highestHigh = high[i - period];
    let highestIndex = i - period;
    let lowestLow = low[i - period];
    let lowestIndex = i - period;

    for (let j = 0; j <= period; j++) {
      const idx = i - period + j;
      if (high[idx] >= highestHigh) {
        highestHigh = high[idx];
        highestIndex = idx;
      }
      if (low[idx] <= lowestLow) {
        lowestLow = low[idx];
        lowestIndex = idx;
      }
    }

    up[i] = ((period - (i - highestIndex)) / period) * 100;
    down[i] = ((period - (i - lowestIndex)) / period) * 100;
  }
  return { up, down };
}

export interface ADXResult {
  adx: number[];
  plusDI: number[];
  minusDI: number[];
}

// Wilder's Smoothing (RMA) used in ADX
function calculateRMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(NaN);
  if (data.length < period) return result;

  let sum = 0;
  for (let i = 0; i < period; i++) sum += data[i];
  result[period - 1] = sum / period;

  for (let i = period; i < data.length; i++) {
    result[i] = (result[i - 1] * (period - 1) + data[i]) / period;
  }
  return result;
}

export function calculateADX(high: number[], low: number[], close: number[], period: number): ADXResult {
  const tr: number[] = new Array(high.length).fill(0);
  const plusDM: number[] = new Array(high.length).fill(0);
  const minusDM: number[] = new Array(high.length).fill(0);

  for (let i = 1; i < high.length; i++) {
    const upMove = high[i] - high[i - 1];
    const downMove = low[i - 1] - low[i];

    plusDM[i] = (upMove > downMove && upMove > 0) ? upMove : 0;
    minusDM[i] = (downMove > upMove && downMove > 0) ? downMove : 0;

    const tr1 = high[i] - low[i];
    const tr2 = Math.abs(high[i] - close[i - 1]);
    const tr3 = Math.abs(low[i] - close[i - 1]);
    tr[i] = Math.max(tr1, tr2, tr3);
  }

  const smoothTR = calculateRMA(tr, period);
  const smoothPlusDM = calculateRMA(plusDM, period);
  const smoothMinusDM = calculateRMA(minusDM, period);

  const plusDI: number[] = new Array(high.length).fill(NaN);
  const minusDI: number[] = new Array(high.length).fill(NaN);
  const dx: number[] = new Array(high.length).fill(0);

  for (let i = period; i < high.length; i++) {
    if (smoothTR[i] > 0) {
      plusDI[i] = (smoothPlusDM[i] / smoothTR[i]) * 100;
      minusDI[i] = (smoothMinusDM[i] / smoothTR[i]) * 100;
    } else {
      plusDI[i] = 0;
      minusDI[i] = 0;
    }
    const sumDI = plusDI[i] + minusDI[i];
    dx[i] = sumDI === 0 ? 0 : (Math.abs(plusDI[i] - minusDI[i]) / sumDI) * 100;
  }

  const adx = calculateRMA(dx, period);

  return { adx, plusDI, minusDI };
}

export interface IchimokuResult {
  tenkan: number[];
  kijun: number[];
  senkouA: number[];
  senkouB: number[];
  chikou: number[];
}

function getDonchianMiddle(high: number[], low: number[], index: number, period: number): number {
  if (index < period - 1) return NaN;
  let hh = high[index];
  let ll = low[index];
  for (let i = 1; i < period; i++) {
    hh = Math.max(hh, high[index - i]);
    ll = Math.min(ll, low[index - i]);
  }
  return (hh + ll) / 2;
}

export function calculateIchimoku(high: number[], low: number[], close: number[], tenkanPeriod = 9, kijunPeriod = 26, senkouBPeriod = 52): IchimokuResult {
  const len = close.length;
  const tenkan: number[] = new Array(len).fill(NaN);
  const kijun: number[] = new Array(len).fill(NaN);
  // We don't pad the arrays with future data here. 
  // senkouA and senkouB represent their values WITHOUT shifting logic applied in the array index.
  // The shifting logic will be applied when mounting to lightweight-charts (or shifting the array).
  const senkouA: number[] = new Array(len).fill(NaN);
  const senkouB: number[] = new Array(len).fill(NaN);
  const chikou: number[] = new Array(len).fill(NaN);

  for (let i = 0; i < len; i++) {
    tenkan[i] = getDonchianMiddle(high, low, i, tenkanPeriod);
    kijun[i] = getDonchianMiddle(high, low, i, kijunPeriod);
    
    if (!isNaN(tenkan[i]) && !isNaN(kijun[i])) {
      senkouA[i] = (tenkan[i] + kijun[i]) / 2;
    }
    senkouB[i] = getDonchianMiddle(high, low, i, senkouBPeriod);
    chikou[i] = close[i];
  }

  return { tenkan, kijun, senkouA, senkouB, chikou };
}

export function calculateParabolicSAR(high: number[], low: number[], step = 0.02, maxStep = 0.2): number[] {
  const len = high.length;
  const sar: number[] = new Array(len).fill(NaN);
  if (len < 2) return sar;

  let isLong = true;
  let af = step;
  let ep = high[0];
  let curSAR = low[0];
  
  sar[0] = curSAR;

  for (let i = 1; i < len; i++) {
    const prevSAR = curSAR;
    let nextSAR = prevSAR + af * (ep - prevSAR);

    if (isLong) {
      if (low[i] < nextSAR) {
        // Trend reversal
        isLong = false;
        nextSAR = Math.max(ep, high[i]);
        ep = low[i];
        af = step;
      } else {
        if (high[i] > ep) {
          ep = high[i];
          af = Math.min(af + step, maxStep);
        }
        if (i >= 2) nextSAR = Math.min(nextSAR, low[i - 1], low[i - 2]);
        else if (i >= 1) nextSAR = Math.min(nextSAR, low[i - 1]);
      }
    } else {
      if (high[i] > nextSAR) {
        // Trend reversal
        isLong = true;
        nextSAR = Math.min(ep, low[i]);
        ep = high[i];
        af = step;
      } else {
        if (low[i] < ep) {
          ep = low[i];
          af = Math.min(af + step, maxStep);
        }
        if (i >= 2) nextSAR = Math.max(nextSAR, high[i - 1], high[i - 2]);
        else if (i >= 1) nextSAR = Math.max(nextSAR, high[i - 1]);
      }
    }

    curSAR = nextSAR;
    sar[i] = curSAR;
  }
  return sar;
}

export function calculateZigZag(high: number[], low: number[], deviation = 5): number[] {
  const len = high.length;
  const zigzag: number[] = new Array(len).fill(NaN);
  if (len === 0) return zigzag;

  const devPct = deviation / 100;
  let lastPeak = high[0];
  let lastTrough = low[0];
  let isUpTrend = true;
  let lastPivotIdx = 0;
  
  for (let i = 1; i < len; i++) {
    if (isUpTrend) {
      if (high[i] > lastPeak) {
        lastPeak = high[i];
        lastPivotIdx = i;
      } else if (low[i] < lastPeak * (1 - devPct)) {
        zigzag[lastPivotIdx] = lastPeak; // confirm peak
        isUpTrend = false;
        lastTrough = low[i];
        lastPivotIdx = i;
      }
    } else {
      if (low[i] < lastTrough) {
        lastTrough = low[i];
        lastPivotIdx = i;
      } else if (high[i] > lastTrough * (1 + devPct)) {
        zigzag[lastPivotIdx] = lastTrough; // confirm trough
        isUpTrend = true;
        lastPeak = high[i];
        lastPivotIdx = i;
      }
    }
  }
  
  if (isUpTrend) {
    zigzag[lastPivotIdx] = lastPeak;
  } else {
    zigzag[lastPivotIdx] = lastTrough;
  }

  return zigzag;
}
