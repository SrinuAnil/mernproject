import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const logo = 'https://media.licdn.com/dms/image/C560BAQE0YLKt7EeMZw/company-logo_200_200/0/1630645895449/dealsdray_logo?e=2147483647&v=beta&t=-Sm5muQhICvan844Gdv7cqg7IXnidLdfYP9uQt8HBAo';

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <div className="nav-links-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/home" className="nav-links">
              Home
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-user-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <div className="user-name">
              {username}
            </div>
          </li>
          <li className="nav-item">
            <Link to="/employee-list" className="nav-links">
              Employee List
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={handleLogout} className="nav-links">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
