import {React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Login/Login.css';

function Login() {
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }else{
            navigate('/Login');
        }
    }, [isAuthenticated, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [login_err, setLoginError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5001/login', { email, password });
            if (response.data.success) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                console.log('Login successful');
                setLoginError('');
                navigate('/');
            } else {
                setLoginError('Invalid email or password');
                console.log('Invalid email or password')
            }
        } catch (error) {
            setLoginError('Invalid email or password');
            console.error('Error:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <img
                    src="https://thirstyforsoulboner.com/cdn/shop/files/Logo_Options_2_eb5ae955-48f3-48f3-a2f5-14d860ec88bd_300x300.png?v=1614321917"
                    alt="Soul Boners"
                />
            </header>
            <div className="login-container">
                <h1 className="login-header">Welcome!</h1>
                <p>Login to access admin panel.</p>
                <p className='login_err'>{login_err}</p>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="email-input"
                        id="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="password-input"
                        id="password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </div>
                <div className="form-group">
                    <button className="login-button" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
