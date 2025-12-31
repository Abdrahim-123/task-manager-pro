// Register page: creates a new user account
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';


function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    // Update form state on input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit registration to API and redirect on success
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/auth/register`, formData);
            alert('Registration Successful!');
            navigate('/'); // Go to login
        } catch (err) {
            console.error(err);
            alert('Error: ' + (err.response?.data?.message || 'Something went wrong'));
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <br />
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
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;