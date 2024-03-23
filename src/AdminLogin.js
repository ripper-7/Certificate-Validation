import React, { useState } from 'react';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Authenticate admin and call onLogin if successful
    if (password === 'password') {
      onLogin();
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;
