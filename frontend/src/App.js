import {useEffect, useState} from 'react';
import {api} from './api';
import AddStockForm from './components/AddStockForm';
import StockList from './components/StockList';

export default function App(){
    const [stocks, setStocks] = useState([]);
    const fetchStocks = async () =>{
      try{
        const resp = await api.get('/stocks');
        setStocks(resp.data);
      }
      catch(err){
        const msg = err.response?.data?.error || err.message;
        alert(`Could not load stocks`)
      }
        

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