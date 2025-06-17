import {useState} from 'react';
import {api} from '../api';

export default function AddStockForm({onAdded}){
    const [symbol, setSymbol] = useState('');
    const handleSubmit = async e =>{
        e.preventDefault();
        if(!symbol) return; 
        await api.post('/stocks', { symbol });
        setSymbol('');
        onAdded();
    };

    return(
        <form onSubmit = {handleSubmit} style = {{ marginBottom: 16}}>
            <input
                value = {symbol}
                onChange = {e => setSymbol(e.target.value)}
                placeholder = "e.h. AAPL"
                style = {{padding: 8, fontSize: 16}}
            />
            <button type = "submit" style = {{marginLeft: 8, padding: '8px, 12px'}}>
                Add
            </button>
        </form>
    )
}