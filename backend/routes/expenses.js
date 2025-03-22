// Import dependencies
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all expenses
router.get("/", (req, res) => {
  db.query("SELECT * FROM expenses", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ADD a new expense
router.post("/", (req, res) => {
  const { title, amount, category, date } = req.body;
  if (!title || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO expenses (title, amount, category, date) VALUES (?, ?, ?, ?)";
  db.query(query, [title, amount, category, date], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Expense added!", id: result.insertId });
  });
});

// Export router
module.exports = router;
