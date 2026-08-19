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
