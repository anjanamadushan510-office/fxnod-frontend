const fs = require('fs');
const file = 'src/components/options/chart/LiveChart.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = '        const zigzagData = results.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));\n        if (zigzagData.length > 0) zigzag.setData(zigzagData as any);\n      }\n    }';

const replacement = `        const zigzagData = results.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        if (zigzagData.length > 0) zigzag.setData(zigzagData as any);
      } else if (ind.type === 'bollinger') {
        let upper = seriesRef.current.get(\`\${ind.id}-upper\`) as ISeriesApi<'Line'>;
        let middle = seriesRef.current.get(\`\${ind.id}-middle\`) as ISeriesApi<'Line'>;
        let lower = seriesRef.current.get(\`\${ind.id}-lower\`) as ISeriesApi<'Line'>;
        if (!upper || !middle || !lower) {
          upper = chart.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, priceScaleId: 'right' });
          middle = chart.addSeries(LineSeries, { color: '#FF6D00', lineWidth: 1, priceScaleId: 'right' });
          lower = chart.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, priceScaleId: 'right' });
          seriesRef.current.set(\`\${ind.id}-upper\`, upper);
          seriesRef.current.set(\`\${ind.id}-middle\`, middle);
          seriesRef.current.set(\`\${ind.id}-lower\`, lower);
        }
        const p = ind.params.period || 20;
        const dev = ind.params.stdDev || 2;
        const results = calculateBollingerBands(valueArray, p, dev);
        const upperData = results.upper.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const middleData = results.middle.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const lowerData = results.lower.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        if (upperData.length > 0) upper.setData(upperData as any);
        if (middleData.length > 0) middle.setData(middleData as any);
        if (lowerData.length > 0) lower.setData(lowerData as any);
      } else if (ind.type === 'donchian') {
        let upper = seriesRef.current.get(\`\${ind.id}-upper\`) as ISeriesApi<'Line'>;
        let middle = seriesRef.current.get(\`\${ind.id}-middle\`) as ISeriesApi<'Line'>;
        let lower = seriesRef.current.get(\`\${ind.id}-lower\`) as ISeriesApi<'Line'>;
        if (!upper || !middle || !lower) {
          upper = chart.addSeries(LineSeries, { color: '#00A79E', lineWidth: 1, priceScaleId: 'right' });
          middle = chart.addSeries(LineSeries, { color: '#999999', lineWidth: 1, lineStyle: 2, priceScaleId: 'right' });
          lower = chart.addSeries(LineSeries, { color: '#00A79E', lineWidth: 1, priceScaleId: 'right' });
          seriesRef.current.set(\`\${ind.id}-upper\`, upper);
          seriesRef.current.set(\`\${ind.id}-middle\`, middle);
          seriesRef.current.set(\`\${ind.id}-lower\`, lower);
        }
        const p = ind.params.period || 20;
        const results = calculateDonchianChannel(highArray, lowArray, p);
        const upperData = results.upper.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const middleData = results.middle.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const lowerData = results.lower.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        if (upperData.length > 0) upper.setData(upperData as any);
        if (middleData.length > 0) middle.setData(middleData as any);
        if (lowerData.length > 0) lower.setData(lowerData as any);
      }
    }`;

if (content.includes('bollinger')) {
    console.log('Already updated');
} else {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Success');
}
