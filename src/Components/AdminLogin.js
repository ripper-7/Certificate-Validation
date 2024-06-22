import React, { useState, useEffect } from 'react';
import '../App.css';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window.ethereum !== 'undefined') {
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        try {
          // Check if MetaMask is already authorized
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          handleAccountsChanged(accounts);
        } catch (error) {
          console.error('Error checking MetaMask accounts:', error);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    };

    checkMetaMask();

    return () => {
      // Clean up listeners if necessary
      window.ethereum.removeAllListeners('accountsChanged');
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setMetaMaskConnected(false);
      // Clear any sensitive session data here
      console.log('MetaMask disconnected');
    } else {
      console.log('MetaMask connected:', accounts[0]);
      setMetaMaskConnected(true);
    }
  };

  const handleConnectAndLogin = async () => {
    try {
      // Request access to user's MetaMask accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected with MetaMask:', accounts[0]);
      setMetaMaskConnected(true);

      // After connecting to MetaMask, proceed with admin login
      handleLogin();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      // Handle error condition, such as user denial or network issues
    }
  };

  const handleLogin = () => {
    // Authenticate admin and call onLogin if successful
    if (password === 'admin') {
      onLogin();
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div className='container'>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button id="connect-login-button" onClick={handleConnectAndLogin}>
        {metaMaskConnected ? 'Login' : 'Connect to MetaMask'}
      </button>
    </div>
  );
}

export default AdminLogin;
