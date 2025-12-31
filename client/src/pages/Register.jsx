import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
    });
  const navigate = useNavigate(); // Used to redirect user after success

  // 1. Update State when user types
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  // 2. Send data to Backend when button is clicked
    const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page from refreshing
    try {
      // ---------------------------------------------------------
      // YOUR TURN: Write the axios code here!
      // The URL is: 'http://localhost:5000/api/auth/register'
      // The data to send is: formData
      // ---------------------------------------------------------
        
    
        const response = await axios.post('http://localhost:5000/api/auth/register', formData); // <--- CHECK THIS LINE

        alert('Registration Successful!');
        navigate('/'); // Redirect to Login page
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
            <button type="submit" className="btn-primary">Register</button>
            </form>
        </div>
    </div>
    );
}

export default Register;