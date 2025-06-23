import {useState} from 'react';
import {api} from '../api';

export default function RegisterForm(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try{
            await api.post('/auth/register', {email, password});
            alert('Registered. Log in now!');
            setEmail('');
            setPassword('');
        }
        catch(err){
            const msg = err.response?.data?.error || err.message;
            alert(`Registration failed: ${msg}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style = {{marginBottom: 16}}>
            <input value ={email} onChange={e => setEmail(e.target.value)} placeholder="Email:"/>
            <input type = "password" value={password} onChange={e => setPassword(e.target.value)} placehodler ="Password"/>
            <button type = "submit">Register</button>
        </form>
    );
}