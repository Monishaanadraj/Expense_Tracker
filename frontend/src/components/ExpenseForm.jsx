import { useState, useEffect } from "react";
import axios from "axios";
import style from "../styles/ExpenseForm.module.css";

export default function ExpenseForm({ onExpenseAdded, editingExpense, setEditingExpense }) {
  
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

 
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      alert("Title is required!");
      return false;
    }
    if (!amount.trim() || isNaN(amount) || Number(amount) <= 0) {
      alert("Enter a valid amount!");
      return false;
    }
    if (!category.trim()) {
      alert("Category is required!");
      return false;
    }
    if (!date) {
      alert("Date is required!");
      return false;
    }
    return true;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser.id) {
    alert("User not logged in!");
    return;
  }

    // Trim input values before validation
    const trimmedTitle = title.trim();
    const trimmedAmount = amount.trim();
    const trimmedCategory = category.trim();
    const trimmedDate = date.trim();
  
    // Validate before submitting
    if (!trimmedTitle) {
      alert("Title is required!");
      return;
    }
    if (!trimmedAmount || isNaN(trimmedAmount) || Number(trimmedAmount) <= 0) {
      alert("Enter a valid amount!");
      return;
    }
    if (!trimmedCategory) {
      alert("Category is required!");
      return;
    }
    if (!trimmedDate) {
      alert("Date is required!");
      return;
    }
  
    try {
      if (editingExpense) {
      
        await axios.put(`http://localhost:5000/expenses/${editingExpense.id}`, {
          title: trimmedTitle,
          amount: trimmedAmount,
          category: trimmedCategory,
          date: trimmedDate,
          userId: storedUser.id, 
        });
        alert("Expense updated successfully!");
        setEditingExpense(null); // Reset form after update
      } else {
        // Add new expense
        await axios.post("http://localhost:5000/expenses", {
          title: trimmedTitle,
          amount: trimmedAmount,
          category: trimmedCategory,
          date: trimmedDate,
          userId: storedUser.id, 
        });
        alert("Expense Added!");
      }
  
      // Refresh list and reset form
      onExpenseAdded();
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className={style.expense_form }>
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <div className={style.input_group}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <button type="submit" className={style.submit_btn}>{editingExpense ? "Update Expense" : "Add Expense"}</button>

      {editingExpense && (
        <button type="button" className={style.cancel_btn} onClick={() => setEditingExpense(null)}>
          Cancel Edit
        </button>
      )}
    </form>
  );
}
