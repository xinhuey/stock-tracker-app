import {useEffect, useState} from 'react';
import {api} from './api';
import AddStockForm from './components/AddStockForm';
import StockList from './components/StockList';

export default function App(){
    const [stocks, setStocks] = useState([]);
    const fetchStocks = async () =>{
        const resp = await api.get('/stocks');
        setStocks(resp.data);

    };

    useEffect(() =>{
        fetchStocks();
        // auto refreshes every 60s
        const id = setInterval(fetchStocks, 60_000);
        return () => clearInterval(id);
    }, []);

    return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>My Stock Tracker</h2>
      <AddStockForm onAdded={fetchStocks} />
      <StockList stocks={stocks} onRemove={fetchStocks} />
    </div>
  );
}