import {useState} from 'react';
import {api} from '../api';

export default function LoginForm({onLogin}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e =>{
        e.preventDefault();
        try{
            const resp = await api.post('/auth/login', {email, password});
            localStorage.setItem('token', resp.data.token);
            onLogin();
        }
        catch(err){
            const msg = err.response?.data?.error || err.message;
            alert(`Login failed: ${msg}`);
        }
    };

    return(
        <form onSubmit ={handleSubmit} style={{marginBottom: 16}}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type = "password" value ={password} onChange={e => setPassword(e.target.value)} placeholder = "Password"/>
            <button type = "sumit">Login</button>
        </form>
    );
}