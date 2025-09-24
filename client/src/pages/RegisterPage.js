import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  // Local state for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // React Router hook for navigation
  const navigate = useNavigate();

  // ================================
  // REGISTER FUNCTION
  // ================================
  // 1. Validate inputs
  // 2. Send POST request to backend
  // 3. If success → alert user + redirect to login page
  // 4. If fail → show error alert
  const register = async () => {
    if (!username || !password) {
      alert('Please fill in both fields');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      alert('Account created! You can now log in.');
      navigate('/'); // redirect to login page
    } catch (err) {
      alert('Registration failed. Try a different username.');
    }
  };

  // ================================
  // RENDER
  // ================================
  // Simple registration form with:
  // - Username input
  // - Password input
  // - Register button
  // - Link to Login page
  return (
    <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px' }}>
      <h2>Register</h2>
      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={register}>Register</button>
      <p>Already have an account? <Link to="/">Login here</Link></p>
    </div>
  );
}

export default RegisterPage;