import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import style from "../styles/Navbar.module.css"; 

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    setUser(null); 
    navigate("/login"); 
  };
  return (
    <div className={style.navbar}>
      <h2>Expensio</h2>
      <nav className={style.nav_links}>
        <Link to="/">Home</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/analytics">Expenses Analytics</Link>
        <Link to="/report">Generate Report</Link>
        {!user ? (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <div className={style.user_section}>
            <span className={style.user_name}>User, {user.name}</span>
            <button className={style.logout_btn} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
