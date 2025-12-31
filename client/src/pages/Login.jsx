// Login page: authenticates a user and stores JWT
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    // Update form state on input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit credentials to API and redirect on success
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);

            // Persist token for authenticated requests
            localStorage.setItem('token', response.data.token);

            alert('Login Successful!');
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
                    <button type="submit" className="btn-primary">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;