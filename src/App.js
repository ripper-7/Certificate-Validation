import React, { useEffect } from 'react';
import RootLayout from './Components/RootLayout';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AdminDashboard from './Components/AdminDashboard';
import UserDashboard from './Components/UserDashboard';
import Home from './Components/Home'
import './App.css'; 
import './index.css';

function App() {
  const router= createBrowserRouter([
    {
      path:"/",
      element:<RootLayout />,
      children:[
        {
          path:"/",
          element:<Home />
        },
        {   
          path:"/user",
          element:<UserDashboard />
        },
        {
          path:"/admin",
          element:<AdminDashboard />
        }
      ]
    }
  ])
        
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>  
  );
}

export default App;
