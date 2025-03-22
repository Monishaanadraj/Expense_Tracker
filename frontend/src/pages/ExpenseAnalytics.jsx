import { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Link } from "react-router-dom";
import style from "../styles/ExpenseAnalytics.module.css";

Chart.register(...registerables);

export default function ExpenseAnalytics() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = storedUser && storedUser.id;

  useEffect(() => {
    if (isLoggedIn) fetchExpenses();
    else setLoading(false);
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/expenses?userId=${storedUser.id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default Data for Guests (Before Login)
  const defaultCategoryData = {
    Food: 200,
    Transport: 150,
    Entertainment: 100,
    Shopping: 250,
    Bills: 300,
    Others: 100,
  };

  const defaultMonthlyData = {
    "Jan 2024": 500,
    "Feb 2024": 700,
    "Mar 2024": 600,
    "Apr 2024": 800,
    "May 2024": 750,
  };

  // Pie Chart Data (Expenses by Category)
  const getCategoryData = (data = null) => {
    const categoryTotals = data ? { ...data } : {};

    if (!data) {
      expenses.forEach((expense) => {
        const category = expense.category || "Other";
        categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount);
      });
    }

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(categoryTotals),
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#9966ff", "#ff9f40"],
        },
      ],
    };
  };

  // Line Chart Data (Monthly Expense Trends)
  const getMonthlyData = (data = null) => {
    const monthlyTotals = data ? { ...data } : {};

    if (!data) {
      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const month = date.toLocaleString("default", { month: "short", year: "numeric" });
        monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(expense.amount);
      });
    }

    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`));

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "Monthly Expenses",
          data: sortedMonths.map((month) => monthlyTotals[month]),
          borderColor: "#36a2eb",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
      ],
    };
  };

  return (
    <div className={style.analytics_container}>
      <h2>Expense Analytics</h2>

      {!isLoggedIn && (
        <div className={style.welcome_section}>
          <h3>Welcome to Expense Analytics</h3>
          <p>Log in to track your real expenses and analyze your spending.</p>
          <Link to="/login" className={style.login_button}>
            Login to View Your Analytics
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <div className={style.welcome_section}>
          <h3>Welcome to Expense Analytics</h3>
          <p>Track your real expenses and analyze your spending.</p>
          <Link to="/expenses" className={style.login_button}>
            Add Expenses
          </Link>
        </div>
      )}

      {isLoggedIn && expenses.length === 0 && (
        <div className={style.welcome_sec}>
          <h3>No Expenses Found</h3>
          <p>You haven't added any expenses yet. Start tracking now!</p>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={style.chart_container}>
          {/* Pie Chart */}
          <div className={style.chart}>
            <h3>Expenses by Category</h3>
            <Pie data={isLoggedIn && expenses.length > 0 ? getCategoryData() : getCategoryData(defaultCategoryData)} />
          </div>

          {/* Line Chart */}
          <div className={style.chart}>
            <h3>Monthly Expense Trends</h3>
            <Line data={isLoggedIn && expenses.length > 0 ? getMonthlyData() : getMonthlyData(defaultMonthlyData)} />
          </div>
        </div>
      )}
    </div>
  );
}
