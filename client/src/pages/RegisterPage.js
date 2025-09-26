import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';


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
      await axios.post('https://taskflow-backend-h3uu.onrender.com/api/auth/register', { username, password });
      alert('Account created! You can now log in.');
      navigate('/login'); // redirect to login page
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      register();
    }
  };
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
    <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '20px' }}>Register</h2>

    <input
      placeholder="Username"
      onKeyDown={handleKeyDown}
      onChange={e => setUsername(e.target.value)}
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
      onKeyDown={handleKeyDown}
      onChange={e => setPassword(e.target.value)}
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
      onClick={register}
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
      Register
    </button>

    <p style={{ fontSize: '14px', color: '#666', marginTop: '16px' }}>
      Already have an account? <Link to="/login" style={{ color: '#0078d4', textDecoration: 'underline' }}>Login here</Link>
    </p>
  </div>
);
}

export default RegisterPage;