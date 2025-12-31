import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
    email: '',
    password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Send the request to: http://localhost:5000/api/auth/login
        const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      // 2. The server sent back a token! Let's save it.
      // The token is inside: response.data.token
        localStorage.setItem('token', response.data.token); 

        alert('Login Successful!');
    
      // 3. Redirect to Dashboard
        navigate('/dashboard'); 
    
    } catch (err) {
        console.error(err);
        alert('Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
    };
    
    return (
    <div className="container">
        <div className="card">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                onChange={handleChange} 
                required 
            />
            <br />
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
            />
            <br />
            <button type="submit" className="btn-primary">Login</button>
            </form>
        </div>
    </div>
    );
}

export default Login;