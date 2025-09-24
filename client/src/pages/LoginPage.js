import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  // Local state for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // React Router hook for navigation
  const navigate = useNavigate();

  // ================================
  // LOGIN FUNCTION
  // ================================
  // 1. Validate inputs
  // 2. Send POST request to backend
  // 3. Save JWT token in localStorage
  // 4. Redirect to dashboard if successful
  const login = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token); // store token for auth
      navigate('/dashboard'); // redirect after login
    } catch (err) {
      alert('Login failed. Check your credentials.');
    }
  };

  // ================================
  // ENTER KEY HANDLER
  // ================================
  // Allows user to press Enter instead of clicking the button
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  // ================================
  // RENDER
  // ================================
  // Simple login form with:
  // - Username input
  // - Password input
  // - Login button
  // - Link to Register page
  return (
    <div style={{ maxWidth: '300px', margin: 'auto', padding: '20px' }}>
      <h2>Login</h2>
      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={login}>Login</button>
      <p>Don’t have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default LoginPage;