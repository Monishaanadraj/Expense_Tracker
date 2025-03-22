import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import style from "../styles/Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [Expenses, setExpenses] = useState(0);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      console.log("Logged-in user:", storedUser); 
      setUser(storedUser);
      fetchExpenses(storedUser.id); 
    } else {
      console.warn("No user found in localStorage"); 
      setLoading(false);
    }

  }, []);

  const fetchExpenses = async (userId) => {
    try {
      console.log("Fetching expenses for userId:", userId); 
      const response = await axios.get(`http://localhost:5000/expenses?userId=${userId}`);
      console.log("Expenses fetched:", response.data); 
  
      setExpenses(response.data);
  
      
      const total = response.data.reduce((sum, exp) => sum + Number(exp.amount), 0);
      setTotalExpenses(total);
  
      
      const categoryTotals = response.data.reduce((acc, exp) => {
        const category = exp.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + Number(exp.amount);
        return acc;
      }, {});
  
      setCategories(categoryTotals);
      console.log("Category-wise expenses:", categoryTotals); 
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };
  


  
  const pieChartData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
        hoverBackgroundColor: ["#ff4d6a", "#1e90ff", "#ffbb33", "#2cb2af", "#7a5dfd"],
      },
    ],
  };

  
  if (!user) {
    return (
      <div className={style.welcome_container}>
        <h1>Welcome to <span>Expensio</span></h1>
        <p>Track, Manage & Control Your Expenses Effortlessly</p>
        <p>Please <Link to="/login">log in</Link> to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className={style.dashboard_container}>
      <h1>Welcome, {user.name}!</h1>
      <p>Track your real expenses and analyze your spending.</p>

      {/* Total Expenses Section */}
      <div className={style.top_section}>
        <div className={style.total_expenses}>
          <h2>Total Expenses</h2>
          <p>₹{loading ? "Loading..." : totalExpenses}</p>
        </div>

        {/* Add Expense Button */}
        <Link to="/expenses">
          <button className={style.add_expense_btn}>➕ Add Expense</button>
        </Link>
      </div>

      {/* Expenses & Analytics Section */}
      <div className={style.analytics}>
        {/* Expense Categories */}
        <div className={style.category_breakdown}>
          <h2>Spending by Category</h2>
          {Object.keys(categories).length > 0 ? (
            <table className={style.category_table}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categories).map(([category, amount]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>₹{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No expense data available</p>
          )}
        </div>

        {/* Pie Chart Analytics */}
        <div className={style.chart_container}>
          <h2>Expense Analytics</h2>
          {Object.keys(categories).length > 0 ? (
            <Pie data={pieChartData} />
          ) : (
            <p>No expense data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
