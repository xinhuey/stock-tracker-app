import React from 'react';

export default function StockChart({data}){
    if (!data || data.length === 0){
        return <div>No data</div>;
    }

    const width = 300;
    const height = 120;
    const padding = 20;
    const values = data.map(d => d.close);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const points = data.map((d, i) =>{
        const x = padding + (i / (data.length - 1)) * (width - padding * 2);
        const y = padding + (1 - (d.close - min) / (max - min)) * (height - padding * 2);
        return `${x}, ${y}`;
    }).join(' ');

    const grid = [];
    const stepsX = Math.min(data.length, 4);
    for(let i = 1; i <= stepsX; i++){
        const x = padding + i * (width - 2 * padding) / stepsX;
        grid.push(<line key={`vx${i}`} x1={x} y1={padding} x2={x} y2={height - padding} stroke="#eee" />);

    }

    for (let i = 1; i <= 4; i++) {
    const y = padding + i * (height - 2 * padding) / 4;
    grid.push(<line key={`hy${i}`} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#eee" />);
    }

    const startDate = data[0].date;
    const endDate = data[data.length - 1].date;

    return (
    <svg width={width} height={height} style={{ border: '1px solid #ccc', background: '#fff' }}>
      {grid}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#000" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#000" />
      <polyline points={points} fill="none" stroke="blue" strokeWidth="2" />
      <text x={padding} y={height - padding + 15} fontSize="10" textAnchor="start">{startDate}</text>
      <text x={width - padding} y={height - padding + 15} fontSize="10" textAnchor="end">{endDate}</text>
      <text x={padding - 5} y={padding} fontSize="10" textAnchor="end">{max.toFixed(2)}</text>
      <text x={padding - 5} y={height - padding} fontSize="10" textAnchor="end">{min.toFixed(2)}</text>
    </svg>
  );
}