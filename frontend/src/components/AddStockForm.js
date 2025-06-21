import {useState} from 'react';
import {api} from '../api';

export default function AddStockForm({onAdded}){
    const [symbol, setSymbol] = useState('');
    const handleSubmit = async e => {
  e.preventDefault();
  if (!symbol) return alert('Please enter a symbol.');
  try {
    await api.post('/stocks', { symbol });
    setSymbol('');
    onAdded();
  } catch (err) {
    // show the server’s error message if available
    const msg = err.response?.data?.error || err.message;
    alert(`Could not add stock: ${msg}`);
  }
};


    return(
        <form onSubmit = {handleSubmit} style = {{ marginBottom: 16}}>
            <input
                value = {symbol}
                onChange = {e => setSymbol(e.target.value)}
                placeholder = "e.g. AAPL"
                style = {{padding: 8, fontSize: 16}}
            />
            <button type = "submit" style = {{marginLeft: 8, padding: '8px, 12px'}}>
                Add
            </button>
        </form>
    )
}