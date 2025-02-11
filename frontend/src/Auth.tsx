import React, { useState } from 'react';

const Auth: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegisteR] = useState(false);

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
}
  //TODO 
