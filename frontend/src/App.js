import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Expenses from "./pages/Expenses";
import FilterExpenses from "./pages/FilterExpenses";
import ExpenseAnalytics from "./pages/ExpenseAnalytics"
import Footer from "./pages/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ReportDownload from "./pages/ReportDownload";


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="app-container">
      <Navbar user={user} setUser={setUser} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/filter-expenses" element={<FilterExpenses />} />
          <Route path="/analytics" element={<ExpenseAnalytics />} />
          <Route path="/report" element={<ReportDownload />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
