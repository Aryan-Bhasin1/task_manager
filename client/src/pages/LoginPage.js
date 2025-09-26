import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

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
  <div style={{
    maxWidth: '360px',
    margin: '100px auto',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    textAlign: 'center'
  }}>
    <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '20px' }}>Login</h2>

    <input
      placeholder="Username"
      onChange={e => setUsername(e.target.value)}
      onKeyDown={handleKeyDown}
      style={{
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    />

    <input
      placeholder="Password"
      type="password"
      onChange={e => setPassword(e.target.value)}
      onKeyDown={handleKeyDown}
      style={{
        width: '100%',
        padding: '12px',
        marginBottom: '20px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    />

    <button
      onClick={login}
      style={{
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        backgroundColor: '#0078d4',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.2s ease'
      }}
      onMouseOver={e => e.target.style.backgroundColor = '#005fa3'}
      onMouseOut={e => e.target.style.backgroundColor = '#0078d4'}
    >
      Login
    </button>

    <p style={{ fontSize: '14px', color: '#666', marginTop: '16px' }}>
      Don’t have an account? <Link to="/register" style={{ color: '#0078d4', textDecoration: 'underline' }}>Register here</Link>
    </p>
  </div>
);
}

export default LoginPage;