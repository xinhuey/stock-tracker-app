import { api } from '../api';

export default function StockList({ stocks, onRemove }) {
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
        {stocks.map(s => (
          <tr key={s.symbol}>
            <td style={{ padding:8 }}>{s.symbol}</td>
            <td style={{ padding:8 }}>${s.price.toFixed(2)}</td>
            <td style={{ padding:8 }}>{s.change.toFixed(2)}</td>
            <td style={{ padding:8 }}>{s.changePct.toFixed(2)}%</td>
            <td style={{ padding:8 }}>
              <button onClick={async () => {
                await api.delete(`/stocks/${s.symbol}`);
                onRemove();
              }}>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

