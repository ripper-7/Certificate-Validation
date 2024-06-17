import React, { useState, useEffect } from 'react';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';
import UserLogin from './Components/UserLogin';
import UserDashboard from './Components/UserDashboard';
import getWeb3 from './Components/getweb3'; // Import function to get web3 instance
import './App.css'; 

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
      <h1>CERTIFICATE GENERATION AND VALIDATION SYSTEM</h1>
      {!adminLoggedIn && !userLoggedIn && (
        <div class="Login">
        <div class="navHome">
          <div class='container-fluid'>
          <nav class="navHome navbar-expand-lg">
              <ul class="navbar-nav">
              <li class="nav-item1">
                <a class="nav-link active" aria-current="page" href="AdminLogin.js">ADMIN</a>
              </li>
              <li class="nav-item1">
                <a class="nav-link active" aria-current="page" href="UserDashboard.js">USER</a>
              </li>
              </ul>
          
          </nav>
          </div>
        </div>
       
          <div class="adminlogin">
          <AdminLogin onLogin={handleAdminLogin} />
          </div>
          <div class="userlogin">
          <UserLogin onLogin={handleUserLogin} />
          </div>
      
        </div>
      )}
      {adminLoggedIn && !userLoggedIn && <AdminDashboard contract={contract} />}
      {!adminLoggedIn && userLoggedIn && <UserDashboard contract={contract} />}
    </div>
  );
}

export default App;
