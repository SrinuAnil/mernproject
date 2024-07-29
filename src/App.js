import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/frontend/LoginPage'; // Ensure the path is correct
import Navbar from './components/frontend/Navbar';
import EmployeeList from './components/frontend/EmployeeList';
import Dashboard from './components/frontend/Dashboard';
import CreateEmployee from './components/frontend/CreateEmployee';
import EditEmployee from './components/frontend/EditEmployee';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (username, employeesData) => {
    setIsAuthenticated(true);
    setUserName(username)
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {!isAuthenticated ? (
          <div className="App">
            <header className="App-header">
              <Login onLogin={handleLogin} />
            </header>
          </div>
        ) : (
          <>
            <Navbar username={userName} onLogout={handleLogout} />
            <Routes>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/employee-list" element={<EmployeeList />}/>
              <Route path='/login' element={<Login onLogin={handleLogin} />} />
              <Route path="/create-employee" element={<CreateEmployee />} />
              <Route path='/edit-employee/:id' element={<EditEmployee />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
