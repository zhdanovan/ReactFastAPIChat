import React, { useState } from 'react';

const Auth: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isRegister ? '/register' : '/login';
    const response = await fetch(`http://localhost:8000${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      onLogin(data.access_token);
    } else {
      alert(data.detail || 'Error');
    }
  };

return (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
    <button type="button" onClick={() => setIsRegister(!isRegister)}>
      {isRegister ? 'Switch to Login' : 'Switch to Register'}
    </button>
  </form>
);
}

export default Auth;