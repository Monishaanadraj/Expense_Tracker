import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ExpenseForm from "../components/ExpenseForm";
import style from "../styles/Expenses.module.css";
import FilterExpenses from "./FilterExpenses";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get("category") || "";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.id) {
      alert("Please log in to view your expenses.");
      navigate("/login"); // Redirect to login page
      return;
    }

    fetchExpenses(storedUser.id);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, categoryFilter]);

  useEffect(() => {
    calculateTotalExpense();
  }, [expenses]);

  // Fetch Expenses
  const fetchExpenses = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/expenses?userId=${userId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error.response?.data || error.message);
    }
  };

  // Calculate Total Expenses
  const calculateTotalExpense = () => {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    setTotalExpense(total);
  };

  // Apply Filters
  const applyFilters = () => {
    let filtered = [...expenses];

    if (categoryFilter) {
      filtered = filtered.filter(exp => exp.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    setFilteredExpenses(filtered);
  };

  // Delete Expense
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`http://localhost:5000/expenses/${id}`);
        fetchExpenses(JSON.parse(localStorage.getItem("user")).id); // Fetch updated data
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  // Edit Expense
  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  return (
    <div className={style.expenses_container}>
      <h2 className={style.heading}>Expenses</h2>

      {/* Display Total Expenses */}
      <div className={style.total_expenses}>
        <h3>Total Expenses: ₹{totalExpense}</h3>
      </div>
      
      <div className={style.expense_wrapper}>
        <div className={style.expense_form_container}>
          {/* Expense Form */}
          <ExpenseForm onExpenseAdded={() => fetchExpenses(JSON.parse(localStorage.getItem("user")).id)} editingExpense={editingExpense} setEditingExpense={setEditingExpense} />
        </div>

        <div className={style.filter_expense_container}>
          {/* Filter Expenses */}
          <FilterExpenses />
        </div>
      </div>

      {/* Expenses Table */}
      <table className={style.expenses_table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount (₹)</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.title}</td>
                <td>₹{exp.amount}</td>
                <td>{exp.category}</td>
                <td>{exp.date.split("T")[0]}</td>
                <td>
                  <button className={style.edit_btn} onClick={() => handleEdit(exp)}>✏️ Edit</button>
                  <button className={style.delete_btn} onClick={() => handleDelete(exp.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No expenses found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
