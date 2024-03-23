import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import UserLogin from './UserLogin';
import UserDashboard from './UserDashboard';
import getWeb3 from './getweb3'; // Import function to get web3 instance

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [contract, setContract] = useState(null);

  // Function to handle admin login
  const handleAdminLogin = () => {
    setAdminLoggedIn(true);
  };

  // Function to handle user login
  const handleUserLogin = () => {
    setUserLoggedIn(true);
  };

  // Function to initialize web3 and contract instance
  const initializeWeb3 = async () => {
    try {
      const web3 = await getWeb3();
      // Initialize contract instance
      const contractInstance = {}/* Initialize contract instance using web3 */;
      setContract(contractInstance);
    } catch (error) {
      console.error('Error initializing web3:', error);
    }
  };

  // Initialize web3 and contract on component mount
  useEffect(() => {
    initializeWeb3();
  }, []);

  return (
    <div>
      <h1>Certificate Validation System</h1>
      {!adminLoggedIn && !userLoggedIn && (
        <div>
          <AdminLogin onLogin={handleAdminLogin} />
          <UserLogin onLogin={handleUserLogin} />
        </div>
      )}
      {adminLoggedIn && !userLoggedIn && <AdminDashboard contract={contract} />}
      {!adminLoggedIn && userLoggedIn && <UserDashboard contract={contract} />}
    </div>
  );
}

export default App;
