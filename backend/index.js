const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Signup Route 
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(insertQuery, [name, email, password], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "User registered successfully" });
  });
});

// Login Route 
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,  
        name: user.name,
        email: user.email
      }
    });
  });
});


// Fetch Expenses for a Specific User
app.get("/expenses", (req, res) => {
  const { userId } = req.query; 

  console.log("Received userId:", userId); 

  if (!userId) {
    return res.status(400).json({ error: "User ID required" });
  }

  const query = "SELECT * FROM expenses WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});


// Add an Expense
app.post("/expenses", (req, res) => {
  const { title, amount, category, date, userId } = req.body;

  if (!userId || !title || !amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO expenses (title, amount, category, date, user_id) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [title, amount, category, date, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to add expense" });

    res.status(201).json({ message: "Expense added successfully" });
  });
});

// Update an Expense
app.put("/expenses/:id", (req, res) => {
  const { title, amount, category, date } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE expenses SET title=?, amount=?, category=?, date=? WHERE id=?",
    [title, amount, category, date, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Expense updated successfully" });
    }
  );
});

// Delete an Expense
app.delete("/expenses/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM expenses WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  });
});

app.get("/expenses", async (req, res) => {
  const { userId, range } = req.query;
  let query = "SELECT * FROM expenses WHERE user_id = ?";
  let values = [userId];

  if (range === "monthly") {
      query += " AND DATE_FORMAT(date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')";
  } else if (range === "quarterly") {
      query += " AND QUARTER(date) = QUARTER(CURDATE()) AND YEAR(date) = YEAR(CURDATE())";
  } else if (range === "yearly") {
      query += " AND YEAR(date) = YEAR(CURDATE())";
  }

  try {
      const [rows] = await con.promise().query(query, values);
      console.log(`Filtered ${range} expenses:`, rows);
      res.json(rows);
  } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



// Start server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
