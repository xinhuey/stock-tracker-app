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

    return (
    <svg width={width} height={height}>
      <polyline
        points={points}
        fill="none"
        stroke="blue"
        strokeWidth="2"
      />
    </svg>
  );
}