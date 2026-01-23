import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// --------------------
// Admin Login
// --------------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Debug (safe to remove later)
  console.log("ADMIN LOGIN ATTEMPT:", username, password);

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

export default router;
