const fs = require('fs');

// 1. Update IndicatorsModal.tsx
let modal = fs.readFileSync('src/components/options/chart/IndicatorsModal.tsx', 'utf8');
modal = modal.replace(
  '{ id: "wma", name: "WMA (Weighted Moving Average)", category: "Moving averages", disabled: true, Icon: IconGenericMA },',
  '{ id: "wma", name: "WMA (Weighted Moving Average)", category: "Moving averages", Icon: IconGenericMA },'
);
fs.writeFileSync('src/components/options/chart/IndicatorsModal.tsx', modal);

// 2. Update useChartIndicators.ts
let store = fs.readFileSync('src/stores/useChartIndicators.ts', 'utf8');
if (!store.includes('"wma"')) {
  store = store.replace(
    'export type IndicatorType = "SMA" | "EMA" | "MACD" | "RSI" | "awesome_oscillator" | "roc" | "stochastic" | "wpr" | "cci" | "aroon" | "adx" | "ichimoku" | "parabolic_sar" | "zigzag" | "bollinger" | "donchian";',
    'export type IndicatorType = "SMA" | "EMA" | "MACD" | "RSI" | "awesome_oscillator" | "roc" | "stochastic" | "wpr" | "cci" | "aroon" | "adx" | "ichimoku" | "parabolic_sar" | "zigzag" | "bollinger" | "donchian" | "wma";'
  );
  store = store.replace(
    '  EMA: { period: 50 },',
    '  EMA: { period: 50 },\n  wma: { period: 50 },'
  );
  fs.writeFileSync('src/stores/useChartIndicators.ts', store);
}

// 3. Update indicators.ts
let ind = fs.readFileSync('src/lib/indicators.ts', 'utf8');
if (!ind.includes('calculateWMA')) {
  ind += `
export function calculateWMA(data: number[], period: number): number[] {
  const result: number[] = new Array(data.length).fill(NaN);
  if (data.length < period) return result;
  
  const denominator = (period * (period + 1)) / 2;
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      const weight = period - j;
      sum += data[i - j] * weight;
    }
    result[i] = sum / denominator;
  }
  return result;
}
`;
  fs.writeFileSync('src/lib/indicators.ts', ind);
}

// 4. Update LiveChart.tsx
let liveChart = fs.readFileSync('src/components/options/chart/LiveChart.tsx', 'utf8');
if (!liveChart.includes('calculateWMA')) {
  liveChart = liveChart.replace(
    'calculateBollingerBands, calculateDonchianChannel',
    'calculateBollingerBands, calculateDonchianChannel, calculateWMA'
  );
  
  liveChart = liveChart.replace(
    'if (ind.type === "SMA" || ind.type === "EMA" || ind.type === "RSI") {',
    'if (ind.type === "SMA" || ind.type === "EMA" || ind.type === "wma" || ind.type === "RSI") {'
  );
  
  liveChart = liveChart.replace(
    'color: isRsi ? "#9c27b0" : (ind.type === "SMA" ? "#ff9800" : "#2196f3"),',
    'color: isRsi ? "#9c27b0" : (ind.type === "SMA" ? "#ff9800" : (ind.type === "EMA" ? "#2196f3" : "#00A79E")),'
  );

  liveChart = liveChart.replace(
    '        if (ind.type === "EMA") results = calculateEMA(valueArray, p);\n        if (ind.type === "RSI") results = calculateRSI(valueArray, p);',
    '        if (ind.type === "EMA") results = calculateEMA(valueArray, p);\n        if (ind.type === "wma") results = calculateWMA(valueArray, p);\n        if (ind.type === "RSI") results = calculateRSI(valueArray, p);'
  );
  
  fs.writeFileSync('src/components/options/chart/LiveChart.tsx', liveChart);
}

console.log('All files updated successfully.');
