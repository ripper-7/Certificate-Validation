import React, { useState } from 'react';
import './App.css';
function UserLogin({ onLogin }) {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Authenticate user and call onLogin if successful
    if (password == 'user') {
      onLogin();
    } else {
      alert('Invalid login');
    }
  };

  return (
    <div className='container'>
      <h2>User Login</h2>
      <input type="text" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default UserLogin;
