import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome to TaskFlow</h1>
      <p className="subtitle">Your personal task manager, simplified.</p>
      <div className="button-group">
        <button onClick={() => navigate('/Login')} className="landing-button">Login</button>
        <button onClick={() => navigate('/Register')} className="landing-button secondary">Register</button>
      </div>
    </div>
  );
}

export default LandingPage;