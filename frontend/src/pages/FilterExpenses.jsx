import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../styles/FilterExpenses.module.css";

export default function FilterExpenses() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.id) {
        return;
      }
      const userId = storedUser.id;
      console.log("Fetching expenses for userId:", userId);
      const response = await axios.get(`http://localhost:5000/expenses?userId=${userId}`);
      console.log("Expenses received:", response.data);
      const uniqueCategories = [...new Set(response.data.map(exp => exp.category))];
      console.log("Categories extracted:", uniqueCategories);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
    }
  };

  const handleFilter = () => {
    if (!selectedCategory) return alert("Please select a category!");
    navigate(`/expenses?category=${selectedCategory}`);
  };

  const handleReset = () => {
    setSelectedCategory("");
    navigate("/expenses");
  };

  return (
    <div className={style.filter_container}>
      <h2>Filter Expenses by Category</h2>

      <div className={style.filter_group}>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">-- Select Category --</option>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))
          ) : (
            <option disabled>No categories found</option>
          )}
        </select>
        <button onClick={handleFilter} className={style.apply_filter_btn}>Apply Filter</button>
        <button onClick={handleReset} className={style.apply_filter_btn}>Reset</button>
      </div>
    </div>
  );
}
