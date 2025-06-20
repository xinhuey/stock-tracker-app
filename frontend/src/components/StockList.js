import { api } from '../api';

export default function StockList({ stocks, onRemove, onSelect }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Symbol','Price','Change','% Change','Actions'].map(h => (
            <th key={h} style={{ textAlign:'left', borderBottom:'1px solid #ccc', padding:'8px' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {stocks.map(s => {
          // defensively coerce or placeholder
          const price = Number.isFinite(s.price) 
            ? s.price.toFixed(2) 
            : '—';
          const change = Number.isFinite(s.change)
            ? s.change.toFixed(2)
            : '—';
          const changePct = Number.isFinite(s.changePct)
            ? s.changePct.toFixed(2) + '%'
            : '—';

          return (
            <tr key={s.symbol} onClick={() => onSelect && onSelect(s.symbol)} style={{cursor: onSelect ? 'pointer' : 'default'}}>
              <td style={{ padding:8 }}>{s.symbol}</td>
              <td style={{ padding:8 }}>{price !== '—' ? `$${price}` : 'N/A'}</td>
              <td style={{ padding:8 }}>{change}</td>
              <td style={{ padding:8 }}>{changePct}</td>
              <td style={{ padding:8 }}>
                <button onClick={async () => {
                  await api.delete(`/stocks/${s.symbol}`);
                  onRemove();
                }}>
                  Remove
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

