import {useEffect, useState} from 'react';
import {api} from './api';
import AddStockForm from './components/AddStockForm';
import StockList from './components/StockList';
import StockChart from './components/StockChart';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

export default function App(){
    const [stocks, setStocks] = useState([]);
    const [selected, setSelected] = useState(null);
    const [history, setHistory] = useState([]);
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

    const handleLogin = () =>{
      setIsAuth(true);
      fetchStocks();
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuth(false);
      setStocks([]);
      setSelected(null);
      setHistory([]);
    };

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

    const fetchHistory = async (symbol) =>{
      try{
        const resp = await api.get(`/stocks/${symbol}/history`);
        setHistory(resp.data);

      }
      catch(err){
        console.error('Failed to load history', err);
        setHistory([]);
      }
    };

    const handleSelect = (symbol) =>{
      if(selected === symbol){
        setSelected(symbol);
        setHistory([symbol]);
      }
      else{
        setSelected(symbol);
        fetchHistory(symbol);
      }
      
    };

    

    useEffect(() =>{
        //Handle authentication 
        if (!isAuth) return;
        fetchStocks();
        // auto refreshes every 60s
        const id = setInterval(fetchStocks, 60_000);
        return () => clearInterval(id);
    }, [isAuth]);

    if (!isAuth){
      return(
        <div style = {{maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif'}}>
          <h2>Login</h2>
          <LoginForm onLogin={handleLogin}/>
          <h3>Register</h3>
          <RegisterForm />
        </div>
      );
    }
    return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>My Stock Tracker</h2>
      <AddStockForm onAdded={fetchStocks} />
      <StockList stocks={stocks} onRemove={fetchStocks} onSelect={handleSelect}/>
      {selected && history.length > 0 && (
        <div style={{marginTop: 20}}>
          <h3>{selected} last {history.length} days</h3>
          <StockChart data={history}/>
        </div>
      )}
    </div>
  );
}