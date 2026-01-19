const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("login.db");

app.use(cors());
app.use(express.json());

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Home route
app.get("/", (req, res) => {
  res.send("Server running");
});

// Login route (store securely)
app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.json({ status: false, message: "Invalid input" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const stmt = db.prepare(
    "INSERT INTO login (name, password) VALUES (?, ?)"
  );

  stmt.run(name, hashedPassword);

  res.json({
    status: true,
    message: "Login data saved securely",
  });
});

// Admin route (NO passwords)
app.get("/admin", (req, res) => {
  const stmt = db.prepare("SELECT id, name FROM login");
  const data = stmt.all();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
